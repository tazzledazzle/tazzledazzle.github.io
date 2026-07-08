---
title: "Custom OpenTelemetry Interceptors for Temporal SDK"
pubDate: "2026-07-08"
tags: []
tier: "archived"
permalink: "/2026/07/08/custom-opentelemetry-interceptors/"
hide_frontmatter: false
---



# Custom OpenTelemetry Interceptors for Temporal SDK 1.25.2 in Kotlin

*Or: what to do when `io.temporal:temporal-opentelemetry` just... isn't there.*

## The wall

I was wiring up distributed tracing for a Temporal-based workflow system, expecting the usual five-minute integration: drop in `io.temporal:temporal-opentelemetry`, register the interceptor, done. Instead I got a dependency resolution failure. That artifact simply isn't published for Temporal Java SDK `1.25.2`. Older versions have it. Some newer snapshots have it. The version I was pinned to did not.

If you've hit this, you already know the two bad options: downgrade/upgrade the SDK to chase an artifact that may drag in other breaking changes, or build the interceptor chain yourself. I went with the second option, and this post is the writeup I wish existed before I started — the interfaces, the gotchas, and the one detail that cost me an afternoon: **`ActivityExecutionContext` has to be captured inside `init()`, not lazily grabbed from whatever thread ends up running your wrapped call.**

## Why the official module matters (and what it actually does)

The Temporal Java SDK exposes an interceptor layer for exactly this purpose — cross-cutting concerns like tracing, metrics, and logging without touching business logic. The chain has three main attachment points:

- `WorkerInterceptor` — the root interface a `Worker` accepts; it hands you factories for the inbound interceptors below.
- `WorkflowInboundCallsInterceptor` — wraps workflow execution: `execute()`, signal handlers, query handlers, update handlers.
- `ActivityInboundCallsInterceptor` — wraps activity execution: `execute()`.

The official OTel module implements all three, propagating span context through workflow history (so a span survives replay correctly) and through activity task queues. Reimplementing full context propagation across workflow replay boundaries is genuinely hard — that's the part I'd still reach for the official module for the moment it publishes for your SDK version. But for **activity-level tracing**, which is where most of my latency and error signal actually lives, a custom interceptor is entirely tractable and safe to hand-roll.

So that's the scope I settled on: full custom activity tracing, plus a lighter workflow-level span for top-level workflow execution (not signals/queries/updates — I didn't need that granularity yet).

## The architecture

```
Worker.Factory
  └── WorkerOptions.setInterceptors(OtelWorkerInterceptor)
        └── WorkerInterceptor
              ├── interceptActivity(next) -> OtelActivityInboundCallsInterceptor(next)
              └── interceptWorkflow(next) -> OtelWorkflowInboundCallsInterceptor(next)
```

Both inbound interceptors extend the SDK's `*Base` classes, which give you no-op defaults for every method so you only override what you care about. This matters — the interfaces have more methods than you'd guess (signal, query, update, execute, and in newer SDKs, nexus operation hooks), and implementing all of them by hand is how you end up with a half-broken interceptor that silently drops queries.

## Step 1: dependencies

You don't need the missing artifact at all. Everything below builds on packages already present in `temporal-sdk` plus the standard OTel API:

```kotlin
// build.gradle.kts
dependencies {
    implementation("io.temporal:temporal-sdk:1.25.2")
    implementation("io.opentelemetry:opentelemetry-api:1.38.0")
    implementation("io.opentelemetry:opentelemetry-context:1.38.0")
    implementation("io.opentelemetry:opentelemetry-sdk:1.38.0")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.38.0")
}
```

No `temporal-opentelemetry` anywhere in the graph.

## Step 2: the activity interceptor

This is the piece that matters most, so I'll build it up in stages rather than dump the final file.

### 2a. The naive version (and why it's wrong)

The first instinct is to wrap `execute()` and start/stop a span around it:

```kotlin
class NaiveOtelActivityInterceptor(
    next: ActivityInboundCallsInterceptor,
    private val tracer: Tracer,
) : ActivityInboundCallsInterceptorBase(next) {

    override fun execute(input: ActivityInput): ActivityOutput {
        val span = tracer.spanBuilder(input.activityType).startSpan()
        return span.makeCurrent().use {
            try {
                next.execute(input)
            } finally {
                span.end()
            }
        }
    }
}
```

This compiles, runs, and produces spans that look plausible in your tracing backend — right up until you try to do anything with `ActivityExecutionContext` inside the activity itself, like heartbeating with span-linked metadata, or you try to add span attributes based on activity execution state (attempt number, task token, etc.) from a helper that isn't literally inline in `execute()`.

### 2b. The detail that actually bit me: `init()` vs. wrapper-thread capture

The `ActivityInboundCallsInterceptor` interface has a separate lifecycle method, `init(ActivityExecutionContext context)`, called once per interceptor instance before `execute()` is ever invoked. I initially ignored it and tried to pull the execution context off the current thread inside my wrapping logic, on the assumption that "current thread at wrap time" and "current thread at activity execution time" were the same thing.

They are not, reliably. Temporal's activity worker can hand off execution across its own thread pool machinery depending on how the activity is dispatched (sync vs. the various async/heartbeat-aware paths), and `Activity.getExecutionContext()` is a `ThreadLocal`-backed lookup tied to *the thread actually running the activity body*, not the thread your interceptor happened to be constructed or invoked on. If you grab the context in the wrong place, you either get a stale/wrong context or an `IllegalStateException` because there's no activity context bound to that thread at all.

The fix is to store it in `init()`, which the SDK guarantees is called on the correct thread with the correct context already bound, and stash it as instance state on the interceptor (each activity invocation gets its own interceptor instance, so this is safe — it is not shared mutable state across concurrent activities):

```kotlin
class OtelActivityInboundCallsInterceptor(
    next: ActivityInboundCallsInterceptor,
    private val tracer: Tracer,
    private val propagator: TextMapPropagator,
) : ActivityInboundCallsInterceptorBase(next) {

    private lateinit var executionContext: ActivityExecutionContext

    override fun init(context: ActivityExecutionContext) {
        // Capture here — guaranteed correct thread, guaranteed bound context.
        // Do NOT try to fetch this lazily inside execute() or from a
        // wrapper/dispatcher thread; ThreadLocal binding is not guaranteed
        // to line up with where init() was called.
        this.executionContext = context
        super.init(context)
    }

    override fun execute(input: ActivityInput): ActivityOutput {
        val info = executionContext.info
        val extractedContext = extractParentContext(input.header, propagator)

        val span = tracer.spanBuilder("Activity:${info.activityType}")
            .setParent(extractedContext)
            .setSpanKind(SpanKind.INTERNAL)
            .setAttribute("temporal.workflow_id", info.workflowId)
            .setAttribute("temporal.run_id", info.runId)
            .setAttribute("temporal.activity_id", info.activityId)
            .setAttribute("temporal.activity_type", info.activityType)
            .setAttribute("temporal.attempt", info.attempt.toLong())
            .setAttribute("temporal.task_queue", info.activityTaskQueue)
            .startSpan()

        return span.makeCurrent().use { scope ->
            try {
                val output = next.execute(input)
                span.setStatus(StatusCode.OK)
                output
            } catch (e: Throwable) {
                span.recordException(e)
                span.setStatus(StatusCode.ERROR, e.message ?: e::class.java.simpleName)
                throw e
            } finally {
                span.end()
            }
        }
    }
}
```

A couple of things worth calling out in that snippet:

- `info.attempt` matters a lot for retried activities — without it, retries look like unrelated single-shot spans in your tracing UI instead of a coherent retry sequence. Setting it as a numeric attribute lets you build a "attempts per activity type" dashboard almost for free.
- I catch `Throwable`, not `Exception`. Temporal activities can throw `Error` subtypes on cancellation paths, and I want those visible in tracing too, not silently swallowed by a narrower catch.
- `span.makeCurrent()` inside a `.use { }` block is the idiomatic Kotlin equivalent of try-with-resources; `Scope` implements `AutoCloseable`.

### 2c. Context propagation across the activity boundary

Spans need a parent to be useful. Since there's no official propagation wired up, I pushed the trace context into the workflow's activity `Header` on the caller side (in the workflow interceptor, covered next) and extracted it here:

```kotlin
private fun extractParentContext(
    header: Header,
    propagator: TextMapPropagator,
): Context {
    val carrier = header.values.mapValues { (_, payload) ->
        // Temporal headers are Payloads; the OTel module's own trick is
        // to store the propagated fields as plain string values.
        String(payload.data.toByteArray(), Charsets.UTF_8)
    }
    return propagator.extract(Context.root(), carrier, MapTextMapGetter)
}

private object MapTextMapGetter : TextMapGetter<Map<String, String>> {
    override fun keys(carrier: Map<String, String>) = carrier.keys
    override fun get(carrier: Map<String, String>?, key: String) = carrier?.get(key)
}
```

## Step 3: the workflow interceptor

For workflow-level spans I kept scope deliberately narrow — just wrap top-level `execute()`, and inject the current OTel context into the header for every outgoing activity. I did **not** try to make this replay-safe for arbitrary signal/query/update tracing; that's exactly the part where I'd defer to the official module once it's available for this SDK line. A workflow-level span that's regenerated identically on every replay (because it derives only from deterministic workflow state, not wall-clock time) is fine; anything fancier risks non-determinism errors.

```kotlin
class OtelWorkflowInboundCallsInterceptor(
    next: WorkflowInboundCallsInterceptor,
    private val tracer: Tracer,
    private val propagator: TextMapPropagator,
) : WorkflowInboundCallsInterceptorBase(next) {

    override fun execute(input: WorkflowInput): WorkflowOutput {
        val info = Workflow.getInfo()
        val span = tracer.spanBuilder("Workflow:${info.workflowType}")
            .setSpanKind(SpanKind.INTERNAL)
            .setAttribute("temporal.workflow_id", info.workflowId)
            .setAttribute("temporal.run_id", info.runId)
            .setAttribute("temporal.task_queue", info.taskQueue)
            .startSpan()

        return span.makeCurrent().use {
            try {
                next.execute(input)
            } catch (e: Throwable) {
                span.recordException(e)
                span.setStatus(StatusCode.ERROR, e.message ?: e::class.java.simpleName)
                throw e
            } finally {
                span.end()
            }
        }
    }
}
```

To actually get context onto outgoing activities, I inject it at the point activities are invoked — via a small helper used by workflow implementations rather than another interceptor layer (deliberately; `WorkflowOutboundCallsInterceptor` exists and can do this centrally, but I found the explicit call site clearer to reason about for a first pass):

```kotlin
fun injectTraceHeader(propagator: TextMapPropagator): Map<String, Payload> {
    val carrier = mutableMapOf<String, String>()
    propagator.inject(Context.current(), carrier, MapTextMapSetter)
    return carrier.mapValues { (_, v) ->
        DefaultDataConverter.STANDARD_INSTANCE.toPayload(v).get()
    }
}

private object MapTextMapSetter : TextMapSetter<MutableMap<String, String>> {
    override fun set(carrier: MutableMap<String, String>?, key: String, value: String) {
        carrier?.put(key, value)
    }
}
```

## Step 4: the `WorkerInterceptor`

This is the glue — the entry point the `Worker` actually calls:

```kotlin
class OtelWorkerInterceptor(
    private val tracer: Tracer,
    private val propagator: TextMapPropagator = GlobalOpenTelemetry.getPropagators().textMapPropagator,
) : WorkerInterceptor {

    override fun interceptActivity(
        next: ActivityInboundCallsInterceptor
    ): ActivityInboundCallsInterceptor =
        OtelActivityInboundCallsInterceptor(next, tracer, propagator)

    override fun interceptWorkflow(
        next: WorkflowInboundCallsInterceptor
    ): WorkflowInboundCallsInterceptor =
        OtelWorkflowInboundCallsInterceptor(next, tracer, propagator)
}
```

And registering it:

```kotlin
val tracer = GlobalOpenTelemetry.getTracer("com.example.temporal-worker")

val workerOptions = WorkerOptions.newBuilder()
    .setInterceptors(OtelWorkerInterceptor(tracer))
    .build()

val worker = factory.newWorker("my-task-queue", workerOptions)
```

Note this is set on `WorkerOptions`, not `WorkerFactoryOptions` — worker-level interceptors, not factory-level. I mixed these up once and spent ten minutes confused about why my spans weren't showing up; the interceptor was registered but never invoked because I'd wired it into the wrong options builder.

## Step 5: verifying it actually works

Don't trust that spans "look right" in a UI — write a test that asserts propagation held. Temporal's `TestWorkflowEnvironment` is the right tool here:

```kotlin
class OtelInterceptorTest {

    private val spanExporter = InMemorySpanExporter.create()
    private val tracerProvider = SdkTracerProvider.builder()
        .addSpanProcessor(SimpleSpanProcessor.create(spanExporter))
        .build()
    private val otel = OpenTelemetrySdk.builder()
        .setTracerProvider(tracerProvider)
        .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
        .build()

    @Test
    fun `activity span is a child of workflow span`() {
        val testEnv = TestWorkflowEnvironment.newInstance()
        val worker = testEnv.newWorker(
            "test-queue",
            WorkerOptions.newBuilder()
                .setInterceptors(OtelWorkerInterceptor(otel.getTracer("test")))
                .build(),
        )
        worker.registerWorkflowImplementationTypes(MyWorkflowImpl::class.java)
        worker.registerActivitiesImplementations(MyActivitiesImpl())
        testEnv.start()

        val client = testEnv.workflowClient
        val stub = client.newWorkflowStub(
            MyWorkflow::class.java,
            WorkflowOptions.newBuilder().setTaskQueue("test-queue").build(),
        )
        stub.execute("input")

        val spans = spanExporter.finishedSpanItems
        val workflowSpan = spans.single { it.name.startsWith("Workflow:") }
        val activitySpan = spans.single { it.name.startsWith("Activity:") }

        assertEquals(workflowSpan.traceId, activitySpan.traceId)
        assertEquals(workflowSpan.spanId, activitySpan.parentSpanId)

        testEnv.close()
    }
}
```

If that assertion on `parentSpanId` passes, your header propagation is genuinely working end-to-end through the Temporal task queue boundary — not just producing two spans that happen to share a trace ID by coincidence of global context.

## What I'd still improve

- **Signal/query/update tracing** — currently unimplemented on purpose. Doing this correctly without breaking replay determinism needs more care than a blog-post-sized example, and it's exactly the kind of thing I'd rather pull from the official module the moment it's published for `1.25.2`, rather than maintain myself indefinitely.
- **Baggage propagation** — I'm only propagating trace context, not OTel baggage. Easy to extend (same header mechanism, different propagator), just wasn't needed yet.
- **Metrics** — this post is tracing-only. A `MetricsInterceptor` sibling using the same `WorkerInterceptor` entry point is a natural follow-up.

## Takeaways

If you're stuck without `temporal-opentelemetry` for your SDK version, hand-rolling activity-level tracing is a genuinely reasonable afternoon of work, not a rabbit hole — as long as you remember the one non-obvious rule: **capture `ActivityExecutionContext` in `init()`, never lazily**. Everything else here is mechanical extension of interfaces the SDK already hands you defaults for.

I'd treat this as a bridge, not a permanent replacement — swap it out for the official module as soon as it lands for your SDK line, especially if you ever need signal/query/update-level tracing. But for activity spans, error status, and attempt-aware retry visibility, this gets you fully instrumented without waiting on upstream.
