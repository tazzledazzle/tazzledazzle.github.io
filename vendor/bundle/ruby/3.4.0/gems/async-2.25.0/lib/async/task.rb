# frozen_string_literal: true

# Released under the MIT License.
# Copyright, 2017-2025, by Samuel Williams.
# Copyright, 2017, by Kent Gruber.
# Copyright, 2017, by Devin Christensen.
# Copyright, 2020, by Patrik Wenger.
# Copyright, 2023, by Math Ieu.
# Copyright, 2025, by Shigeru Nakajima.

require "fiber"
require "console"

require_relative "node"
require_relative "condition"

Fiber.attr_accessor :async_task

module Async
	# Raised when a task is explicitly stopped.
	class Stop < Exception
		# Used to defer stopping the current task until later.
		class Later
			# Create a new stop later operation.
			#
			# @parameter task [Task] The task to stop later.
			def initialize(task)
				@task = task
			end
			
			# @returns [Boolean] Whether the task is alive.
			def alive?
				true
			end
			
			# Transfer control to the operation - this will stop the task.
			def transfer
				@task.stop
			end
		end
	end
	
	# Raised if a timeout occurs on a specific Fiber. Handled gracefully by `Task`.
	# @public Since *Async v1*.
	class TimeoutError < StandardError
		# Create a new timeout error.
		#
		# @parameter message [String] The error message.
		def initialize(message = "execution expired")
			super
		end
	end
	
	# @public Since *Async v1*.
	class Task < Node
		# Raised when a child task is created within a task that has finished execution.
		class FinishedError < RuntimeError
			# Create a new finished error.
			#
			# @parameter message [String] The error message.
			def initialize(message = "Cannot create child task within a task that has finished execution!")
				super
			end
		end
		
		# @deprecated With no replacement.
		def self.yield
			Fiber.scheduler.transfer
		end
		
		# Run the given block of code in a task, asynchronously, in the given scheduler.
		def self.run(scheduler, *arguments, **options, &block)
			self.new(scheduler, **options, &block).tap do |task|
				task.run(*arguments)
			end
		end
		
		# Create a new task.
		# @parameter reactor [Reactor] the reactor this task will run within.
		# @parameter parent [Task] the parent task.
		def initialize(parent = Task.current?, finished: nil, **options, &block)
			super(parent, **options)
			
			# These instance variables are critical to the state of the task.
			# In the initialized state, the @block should be set, but the @fiber should be nil.
			# In the running state, the @fiber should be set.
			# In a finished state, the @block should be nil, and the @fiber should be nil.
			@block = block
			@fiber = nil
			
			@status = :initialized
			@result = nil
			@finished = finished
			
			@defer_stop = nil
		end
		
		# @returns [Scheduler] The scheduler for this task.
		def reactor
			self.root
		end
		
		# @returns [Array(Thread::Backtrace::Location) | Nil] The backtrace of the task, if available.
		def backtrace(*arguments)
			@fiber&.backtrace(*arguments)
		end
		
		# Annotate the task with a description.
		#
		# This will internally try to annotate the fiber if it is running, otherwise it will annotate the task itself.
		#
		# @parameter annotation [String] The description to annotate the task with.
		def annotate(annotation, &block)
			if @fiber
				@fiber.annotate(annotation, &block)
			else
				super
			end
		end
		
		# @returns [Object] The annotation of the task.
		def annotation
			if @fiber
				@fiber.annotation
			else
				super
			end
		end
		
		# @returns [String] A description of the task and it's current status.
		def to_s
			"\#<#{self.description} (#{@status})>"
		end
		
		# @deprecated Prefer {Kernel#sleep} except when compatibility with `stable-v1` is required.
		def sleep(duration = nil)
			super
		end
		
		# Execute the given block of code, raising the specified exception if it exceeds the given duration during a non-blocking operation.
		def with_timeout(duration, exception = TimeoutError, message = "execution expired", &block)
			Fiber.scheduler.with_timeout(duration, exception, message, &block)
		end
		
		# Yield back to the reactor and allow other fibers to execute.
		def yield
			Fiber.scheduler.yield
		end
		
		# @attribute [Fiber] The fiber which is being used for the execution of this task.
		attr :fiber
		
		# @returns [Boolean] Whether the internal fiber is alive, i.e. it is actively executing.
		def alive?
			@fiber&.alive?
		end
		
		# Whether we can remove this node from the reactor graph.
		# @returns [Boolean]
		def finished?
			# If the block is nil and the fiber is nil, it means the task has finished execution. This becomes true after `finish!` is called.
			super && @block.nil? && @fiber.nil?
		end
		
		# @returns [Boolean] Whether the task is running.
		def running?
			@status == :running
		end
		
		# @returns [Boolean] Whether the task failed with an exception.
		def failed?
			@status == :failed
		end
		
		# @returns [Boolean] Whether the task has been stopped.
		def stopped?
			@status == :stopped
		end
		
		# @returns [Boolean] Whether the task has completed execution and generated a result.
		def completed?
			@status == :completed
		end
		
		# Alias for {#completed?}.
		def complete?
			self.completed?
		end
		
		# @attribute [Symbol] The status of the execution of the task, one of `:initialized`, `:running`, `:complete`, `:stopped` or `:failed`.
		attr :status
		
		# Begin the execution of the task.
		#
		# @raises [RuntimeError] If the task is already running.
		def run(*arguments)
			if @status == :initialized
				@status = :running
				
				schedule do
					@block.call(self, *arguments)
				rescue => error
					# I'm not completely happy with this overhead, but the alternative is to not log anything which makes debugging extremely difficult. Maybe we can introduce a debug wrapper which adds extra logging.
					if @finished.nil?
						warn(self, "Task may have ended with unhandled exception.", exception: error)
					end
					
					raise
				end
			else
				raise RuntimeError, "Task already running!"
			end
		end
		
		# Run an asynchronous task as a child of the current task.
		#
		# @public Since *Async v1*.
		# @asynchronous May context switch immediately to the new task.
		#
		# @yields {|task| ...} in the context of the new task.
		# @raises [FinishedError] If the task has already finished.
		# @returns [Task] The child task.
		def async(*arguments, **options, &block)
			raise FinishedError if self.finished?
			
			task = Task.new(self, **options, &block)
			
			# When calling an async block, we deterministically execute it until the first blocking operation. We don't *have* to do this - we could schedule it for later execution, but it's useful to:
			#
			# - Fail at the point of the method call where possible.
			# - Execute determinstically where possible.
			# - Avoid scheduler overhead if no blocking operation is performed.
			#
			# There are different strategies (greedy vs non-greedy). We are currently using a greedy strategy.
			task.run(*arguments)
			
			return task
		end
		
		# Retrieve the current result of the task. Will cause the caller to wait until result is available. If the task resulted in an unhandled error (derived from `StandardError`), this will be raised. If the task was stopped, this will return `nil`.
		#
		# Conceptually speaking, waiting on a task should return a result, and if it throws an exception, this is certainly an exceptional case that should represent a failure in your program, not an expected outcome. In other words, you should not design your programs to expect exceptions from `#wait` as a normal flow control, and prefer to catch known exceptions within the task itself and return a result that captures the intention of the failure, e.g. a `TimeoutError` might simply return `nil` or `false` to indicate that the operation did not generate a valid result (as a timeout was an expected outcome of the internal operation in this case).
		#
		# @raises [RuntimeError] If the task's fiber is the current fiber.
		# @returns [Object] The final expression/result of the task's block.
		def wait
			raise "Cannot wait on own fiber!" if Fiber.current.equal?(@fiber)
			
			# `finish!` will set both of these to nil before signaling the condition:
			if @block || @fiber
				@finished ||= Condition.new
				@finished.wait
			end
			
			if @status == :failed
				raise @result
			else
				return @result
			end
		end
		
		# Access the result of the task without waiting. May be nil if the task is not completed. Does not raise exceptions.
		attr :result
		
		# Stop the task and all of its children.
		#
		# If `later` is false, it means that `stop` has been invoked directly. When `later` is true, it means that `stop` is invoked by `stop_children` or some other indirect mechanism. In that case, if we encounter the "current" fiber, we can't stop it right away, as it's currently performing `#stop`. Stopping it immediately would interrupt the current stop traversal, so we need to schedule the stop to occur later.
		#
		# @parameter later [Boolean] Whether to stop the task later, or immediately.
		def stop(later = false)
			if self.stopped?
				# If the task is already stopped, a `stop` state transition re-enters the same state which is a no-op. However, we will also attempt to stop any running children too. This can happen if the children did not stop correctly the first time around. Doing this should probably be considered a bug, but it's better to be safe than sorry.
				return stopped!
			end
			
			# If the fiber is alive, we need to stop it:
			if @fiber&.alive?
				# As the task is now exiting, we want to ensure the event loop continues to execute until the task finishes.
				self.transient = false
				
				# If we are deferring stop...
				if @defer_stop == false
					# Don't stop now... but update the state so we know we need to stop later.
					@defer_stop = true
					return false
				end
				
				if self.current?
					# If the fiber is current, and later is `true`, we need to schedule the fiber to be stopped later, as it's currently invoking `stop`:
					if later
						# If the fiber is the current fiber and we want to stop it later, schedule it:
						Fiber.scheduler.push(Stop::Later.new(self))
					else
						# Otherwise, raise the exception directly:
						raise Stop, "Stopping current task!"
					end
				else
					# If the fiber is not curent, we can raise the exception directly:
					begin
						# There is a chance that this will stop the fiber that originally called stop. If that happens, the exception handling in `#stopped` will rescue the exception and re-raise it later.
						Fiber.scheduler.raise(@fiber, Stop)
					rescue FiberError
						# In some cases, this can cause a FiberError (it might be resumed already), so we schedule it to be stopped later:
						Fiber.scheduler.push(Stop::Later.new(self))
					end
				end
			else
				# We are not running, but children might be, so transition directly into stopped state:
				stop!
			end
		end
		
		# Defer the handling of stop. During the execution of the given block, if a stop is requested, it will be deferred until the block exits. This is useful for ensuring graceful shutdown of servers and other long-running tasks. You should wrap the response handling code in a defer_stop block to ensure that the task is stopped when the response is complete but not before.
		#
		# You can nest calls to defer_stop, but the stop will only be deferred until the outermost block exits.
		#
		# If stop is invoked a second time, it will be immediately executed.
		#
		# @yields {} The block of code to execute.
		# @public Since *Async v1*.
		def defer_stop
			# Tri-state variable for controlling stop:
			# - nil: defer_stop has not been called.
			# - false: defer_stop has been called and we are not stopping.
			# - true: defer_stop has been called and we will stop when exiting the block.
			if @defer_stop.nil?
				begin
					# If we are not deferring stop already, we can defer it now:
					@defer_stop = false
					
					yield
				rescue Stop
					# If we are exiting due to a stop, we shouldn't try to invoke stop again:
					@defer_stop = nil
					raise
				ensure
					defer_stop = @defer_stop
					
					# We need to ensure the state is reset before we exit the block:
					@defer_stop = nil
					
					# If we were asked to stop, we should do so now:
					if defer_stop
						raise Stop, "Stopping current task (was deferred)!"
					end
				end
			else
				# If we are deferring stop already, entering it again is a no-op.
				yield
			end
		end
		
		# @returns [Boolean] Whether stop has been deferred.
		def stop_deferred?
			@defer_stop
		end
		
		# Lookup the {Task} for the current fiber. Raise `RuntimeError` if none is available.
		# @returns [Task]
		# @raises[RuntimeError] If task was not {set!} for the current fiber.
		def self.current
			Fiber.current.async_task or raise RuntimeError, "No async task available!"
		end
		
		# Check if there is a task defined for the current fiber.
		# @returns [Interface(:async) | Nil]
		def self.current?
			Fiber.current.async_task
		end
		
		# @returns [Boolean] Whether this task is the currently executing task.
		def current?
			Fiber.current.equal?(@fiber)
		end
		
		private
		
		def warn(...)
			Console.warn(...)
		end
		
		# Finish the current task, moving any children to the parent.
		def finish!
			# Don't hold references to the fiber or block after the task has finished:
			@fiber = nil
			@block = nil # If some how we went directly from initialized to finished.
			
			# Attempt to remove this node from the task tree.
			consume
			
			# If this task was being used as a future, signal completion here:
			if @finished
				@finished.signal(self)
				@finished = nil
			end
		end
		
		# State transition into the completed state.
		def completed!(result)
			@result = result
			@status = :completed
		end
		
		# State transition into the failed state.
		def failed!(exception = false)
			@result = exception
			@status = :failed
		end
		
		def stopped!
			# Console.info(self, status:) {"Task #{self} was stopped with #{@children&.size.inspect} children!"}
			@status = :stopped
			
			stopped = false
			
			begin
				# We are not running, but children might be so we should stop them:
				stop_children(true)
			rescue Stop
				stopped = true
				# If we are stopping children, and one of them tries to stop the current task, we should ignore it. We will be stopped later.
				retry
			end
			
			if stopped
				raise Stop, "Stopping current task!"
			end
		end
		
		def stop!
			stopped!
			
			finish!
		end
		
		def schedule(&block)
			@fiber = Fiber.new(annotation: self.annotation) do
				begin
					completed!(yield)
				rescue Stop
					stopped!
				rescue StandardError => error
					failed!(error)
				rescue Exception => exception
					failed!(exception)
					
					# This is a critical failure, we should stop the reactor:
					raise
				ensure
					# Console.info(self) {"Task ensure $! = #{$!} with #{@children&.size.inspect} children!"}
					finish!
				end
			end
			
			@fiber.async_task = self
			
			self.root.resume(@fiber)
		end
	end
end
