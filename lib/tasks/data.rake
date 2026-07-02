namespace :data do
  desc 'Validate structured hiring YAML in src/data/ (fallback _data/)'
  task :validate do
    ok = system('ruby', 'scripts/validate-data.rb', '--check', 'all')
    abort 'data:validate failed' unless ok
  end

  desc 'Regenerate src/data/blog-inventory.yml from content scan'
  task :inventory do
    load File.expand_path('../../scripts/generate-blog-inventory.rb', __dir__)
    BlogInventoryGenerator.run!
  end
end
