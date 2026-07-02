namespace :data do
  desc 'Validate structured hiring YAML in _data/'
  task :validate do
    ok = system('ruby', 'scripts/validate-data.rb', '--check', 'all')
    abort 'data:validate failed' unless ok
  end

  desc 'Stub inventory generator (implemented in Plan 04)'
  task :inventory do
    puts 'Run Plan 04 to implement inventory generator'
  end
end

