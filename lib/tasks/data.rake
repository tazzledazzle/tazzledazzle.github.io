namespace :data do
  desc 'Validate structured hiring YAML in _data/'
  task :validate do
    ok = system('ruby', 'scripts/validate-data.rb', '--check', 'all')
    abort 'data:validate failed' unless ok
  end

  desc 'Regenerate _data/blog-inventory.yml from _posts/ scan'
  task :inventory do
    load File.expand_path('../../scripts/generate-blog-inventory.rb', __dir__)
    BlogInventoryGenerator.run!
  end
end
