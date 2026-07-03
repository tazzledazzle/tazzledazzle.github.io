require 'rake'

# Load custom task files (data validation lives under lib/tasks/).
Dir.glob('lib/tasks/*.rake').sort.each do |task_file|
  load task_file
end

task default: 'data:validate'
