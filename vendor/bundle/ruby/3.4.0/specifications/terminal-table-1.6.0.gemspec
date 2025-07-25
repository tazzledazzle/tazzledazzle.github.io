# -*- encoding: utf-8 -*-
# stub: terminal-table 1.6.0 ruby lib

Gem::Specification.new do |s|
  s.name = "terminal-table".freeze
  s.version = "1.6.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["TJ Holowaychuk".freeze, "Scott J. Goldman".freeze]
  s.date = "2016-06-06"
  s.email = ["tj@vision-media.ca".freeze]
  s.homepage = "https://github.com/tj/terminal-table".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "2.5.1".freeze
  s.summary = "Simple, feature rich ascii table generation library".freeze

  s.installed_by_version = "3.6.9".freeze

  s.specification_version = 4

  s.add_development_dependency(%q<bundler>.freeze, ["~> 1.10".freeze])
  s.add_development_dependency(%q<rake>.freeze, ["~> 10.0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, [">= 3.0".freeze])
  s.add_development_dependency(%q<term-ansicolor>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<pry>.freeze, [">= 0".freeze])
end
