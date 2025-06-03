require 'html-proofer'
require 'rake'

task :test do
  sh 'bundle exec jekyll build'
  options = { 
    :assume_extension => true,
    :check_html => true,
    :check_img_http => true,
    :disable_external => true,
    :report_invalid_tags => true,
    :check_favicon => true
  }
  HTMLProofer.check_directory('./_site', options).run
end

task :default => :test
