source 'https://rubygems.org'

gem "minima", "~> 2.5.1"
gem 'csv'
gem 'base64'
gem 'faraday-retry'
# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
gem "github-pages", '~> 228', group: :jekyll_plugins
# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-seo-tag", "~> 2.1"
  gem "jekyll-github-metadata", "~> 2.13.0"
  gem "jekyll-coffeescript"
  gem "jekyll-commonmark-ghpages"
  gem "jekyll-gist", "~> 1.5.0"
  gem "jekyll-readme-index"
  gem "jekyll-default-layout"
  gem "jekyll-titles-from-headings"
end

group :development, :test do
  gem 'html-proofer', '~> 5.0.0'
  gem 'rake', '~> 13.0.0'
end


# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
gem "webrick"
# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]