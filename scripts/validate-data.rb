#!/usr/bin/env ruby
# frozen_string_literal: true

require 'psych'
require 'uri'

class DataValidator
  CHECKS = {
    'all' => %i[navigation social projects_featured projects_archive career inventory],
    'navigation' => %i[navigation],
    'social' => %i[social],
    'projects' => %i[projects_featured projects_archive],
    'career' => %i[career],
    'inventory' => %i[inventory]
  }.freeze

  DATA_FILES = {
    navigation: File.join('_data', 'navigation.yml'),
    social: File.join('_data', 'social.yml'),
    projects_featured: File.join('_data', 'projects', 'featured.yml'),
    projects_archive: File.join('_data', 'projects', 'archive.yml'),
    career: File.join('_data', 'career.yml'),
    inventory: File.join('_data', 'blog-inventory.yml')
  }.freeze

  QUANTIFIED_METRIC_PATTERN = /(\d|%)/.freeze
  DEMO_STATUS = %w[live code_only broken].freeze

  def initialize(stderr: $stderr)
    @stderr = stderr
    @errors = []
  end

  def valid?
    @errors.empty?
  end

  def errors
    @errors.dup
  end

  def validate_file_exists(path, label:)
    unless File.file?(path)
      @stderr.puts("SKIP: missing expected data file #{path} (#{label})")
      return false
    end
    true
  end

  def safe_load_yaml(path:, label:)
    raw = File.read(path)
    Psych.safe_load(raw, permitted_classes: [], permitted_symbols: [], aliases: false)
  rescue Psych::SyntaxError => e
    @errors << "#{label}: YAML syntax error in #{path}: #{e.message}"
    nil
  rescue Errno::ENOENT
    @stderr.puts("SKIP: missing expected data file #{path} (#{label})")
    nil
  end

  def validate_navigation(data)
    unless data.is_a?(Array)
      @errors << 'navigation.yml: expected an array'
      return
    end

    required_keys = %w[title url order]
    if data.length != 4
      @errors << "navigation.yml: expected exactly 4 entries, got #{data.length}"
    end

    urls = []
    data.each_with_index do |item, idx|
      unless item.is_a?(Hash)
        @errors << "navigation.yml: entry #{idx} expected a hash"
        next
      end

      missing = required_keys.reject { |k| item.key?(k) }
      @errors << "navigation.yml: entry #{idx} missing keys: #{missing.join(', ')}" if missing.any?

      url = item['url']
      urls << url if url.is_a?(String)

      next unless url.is_a?(String)

      if url != url.downcase
        @errors << "navigation.yml: url must be lowercase (entry #{idx}): #{url.inspect}"
      end
      unless url.end_with?('/')
        @errors << "navigation.yml: url must end with '/' (entry #{idx}): #{url.inspect}"
      end
    end

    required_urls = %w[/about/ /work/ /career/ /blog/]
    missing_required = required_urls - urls.uniq
    if missing_required.any?
      @errors << "navigation.yml: missing required urls: #{missing_required.join(', ')}"
    end
  end

  def validate_social(data)
    unless data.is_a?(Hash)
      @errors << 'social.yml: expected a hash'
      return
    end

    required_keys = %w[name email github linkedin twitter gravatar_hash]
    missing = required_keys.reject { |k| data.key?(k) }
    @errors << "social.yml: missing keys: #{missing.join(', ')}" if missing.any?

    %w[github linkedin twitter].each do |platform|
      platform_data = data[platform]
      unless platform_data.is_a?(Hash) && platform_data.key?('url')
        @errors << "social.yml: #{platform} must be a hash with a url key"
        next
      end

      url = platform_data['url']
      next unless url.is_a?(String)

      unless url.start_with?('http://', 'https://')
        @errors << "social.yml: #{platform}.url must be http(s) URL: #{url.inspect}"
      end
    end
  end

  def validate_project_entries(data, label:, featured_count: nil)
    unless data.is_a?(Array)
      @errors << "#{label}: expected an array"
      return
    end

    if featured_count
      min, max = featured_count
      if data.length < min || data.length > max
        @errors << "#{label}: expected #{min}–#{max} entries, got #{data.length}"
      end
    end

    data.each_with_index do |entry, idx|
      unless entry.is_a?(Hash)
        @errors << "#{label}: entry #{idx} expected a hash"
        next
      end

      validate_project_entry(entry, label: "#{label} (entry #{idx})")
    end
  end

  def validate_project_entry(entry, label:)
    required_keys = %w[id title summary tech_stack github_url demo_url demo_status]
    missing = required_keys.reject { |k| entry.key?(k) }
    @errors << "#{label}: missing keys: #{missing.join(', ')}" if missing.any?

    tech_stack = entry['tech_stack']
    unless tech_stack.is_a?(Array) && !tech_stack.empty?
      @errors << "#{label}: tech_stack must be a non-empty array"
    end

    github_url = entry['github_url']
    if github_url.is_a?(String)
      downcased = github_url.downcase
      if downcased.include?('uw-css')
        @errors << "#{label}: github_url contains UW-CSS; featured tier must exclude it: #{github_url}"
      end

      # Basic URL sanity.
      begin
        uri = URI.parse(github_url)
        if uri.scheme.nil? || uri.host.nil?
          @errors << "#{label}: github_url must be an absolute URL: #{github_url.inspect}"
        end
      rescue URI::InvalidURIError
        @errors << "#{label}: github_url is not a valid URL: #{github_url.inspect}"
      end
    else
      @errors << "#{label}: github_url must be a string"
    end

    demo_status = entry['demo_status']
    unless DEMO_STATUS.include?(demo_status)
      @errors << "#{label}: demo_status must be one of #{DEMO_STATUS.join(', ')}, got #{demo_status.inspect}"
    end

    demo_url = entry['demo_url']
    demo_url = nil if demo_url.is_a?(String) && demo_url.strip.empty?
    if !demo_url.nil? && !demo_url.is_a?(String)
      @errors << "#{label}: demo_url must be a string or null"
    end
    if demo_url.is_a?(String) && !(demo_url.start_with?('http://', 'https://'))
      @errors << "#{label}: demo_url must be http(s) URL when not null: #{demo_url.inspect}"
    end
  end

  def validate_projects_featured(data)
    validate_project_entries(data, label: 'projects/featured.yml', featured_count: [3, 5])
  end

  def validate_projects_archive(data)
    validate_project_entries(data, label: 'projects/archive.yml', featured_count: nil)
  end

  def validate_career(data)
    unless data.is_a?(Hash)
      @errors << 'career.yml: expected a hash'
      return
    end

    status = data['status']

    education = data['education']
    unless education.is_a?(Array)
      @errors << 'career.yml: education must be an array'
      return
    end

    education.each_with_index do |edu, idx|
      unless edu.is_a?(Hash)
        @errors << "career.yml: education[#{idx}] expected a hash"
        next
      end

      required_keys = %w[institution degree]
      missing = required_keys.reject { |k| edu.key?(k) }
      @errors << "career.yml: education[#{idx}] missing keys: #{missing.join(', ')}" if missing.any?

      allowed = required_keys
      extra = edu.keys.map(&:to_s) - allowed
      @errors << "career.yml: education[#{idx}] contains forbidden keys: #{extra.join(', ')}" if extra.any?
    end

    roles = data['roles']
    unless roles.is_a?(Array)
      @errors << 'career.yml: roles must be an array'
      return
    end

    if roles.length > 3
      @errors << "career.yml: roles max is 3, got #{roles.length}"
    end

    roles.each_with_index do |role, idx|
      unless role.is_a?(Hash)
        @errors << "career.yml: roles[#{idx}] expected a hash"
        next
      end

      required_keys = %w[employer title start_date end_date bullets]
      missing = required_keys.reject { |k| role.key?(k) }
      @errors << "career.yml: roles[#{idx}] missing keys: #{missing.join(', ')}" if missing.any?

      bullets = role['bullets']
      unless bullets.is_a?(Array) && !bullets.empty?
        @errors << "career.yml: roles[#{idx}].bullets must be a non-empty array"
      end

      next unless bullets.is_a?(Array)

      if status != 'pending_linkedin'
        bullets.each_with_index do |bullet, bidx|
          unless bullet.is_a?(String) && !bullet.strip.empty?
            @errors << "career.yml: roles[#{idx}].bullets[#{bidx}] must be a non-empty string"
            next
          end

          unless bullet.match?(QUANTIFIED_METRIC_PATTERN)
            @errors << "career.yml: roles[#{idx}].bullets[#{bidx}] must contain a digit or '%': #{bullet.inspect}"
          end
        end
      end
    end
  end

  def validate_blog_inventory(data)
    unless data.is_a?(Hash)
      @errors << 'blog-inventory.yml: expected a hash'
      return
    end

    meta = data['meta']
    posts = data['posts']

    unless meta.is_a?(Hash)
      @errors << 'blog-inventory.yml: meta must be a hash'
      return
    end
    unless posts.is_a?(Array) && !posts.empty?
      @errors << 'blog-inventory.yml: posts must be a non-empty array'
      return
    end

    total_posts = meta['total_posts']
    total_posts_int = if total_posts.is_a?(Integer)
                        total_posts
                      elsif total_posts.is_a?(String) && total_posts.match?(/\A\d+\z/)
                        total_posts.to_i
                      else
                        nil
                      end

    if total_posts_int.nil?
      @errors << "blog-inventory.yml: meta.total_posts must be an integer, got #{total_posts.inspect}"
      return
    end

    if total_posts_int != posts.length
      @errors << "blog-inventory.yml: meta.total_posts (#{total_posts_int}) must equal posts.length (#{posts.length})"
    end
  end

  def run!(checks)
    checks = normalize_checks(checks)

    checks.each do |check|
      case check
      when :navigation
        path = DATA_FILES[:navigation]
        next unless validate_file_exists(path, label: 'navigation.yml')
        data = safe_load_yaml(path: path, label: 'navigation.yml')
        validate_navigation(data) if data
      when :social
        path = DATA_FILES[:social]
        next unless validate_file_exists(path, label: 'social.yml')
        data = safe_load_yaml(path: path, label: 'social.yml')
        validate_social(data) if data
      when :projects_featured
        path = DATA_FILES[:projects_featured]
        next unless validate_file_exists(path, label: 'projects/featured.yml')
        data = safe_load_yaml(path: path, label: 'projects/featured.yml')
        validate_projects_featured(data) if data
      when :projects_archive
        path = DATA_FILES[:projects_archive]
        next unless validate_file_exists(path, label: 'projects/archive.yml')
        data = safe_load_yaml(path: path, label: 'projects/archive.yml')
        validate_projects_archive(data) if data
      when :career
        path = DATA_FILES[:career]
        next unless validate_file_exists(path, label: 'career.yml')
        data = safe_load_yaml(path: path, label: 'career.yml')
        validate_career(data) if data
      when :inventory
        path = DATA_FILES[:inventory]
        next unless validate_file_exists(path, label: 'blog-inventory.yml')
        data = safe_load_yaml(path: path, label: 'blog-inventory.yml')
        validate_blog_inventory(data) if data
      else
        @errors << "Unknown check requested: #{check.inspect}"
      end
    end

    unless valid?
      @stderr.puts
      @stderr.puts 'Validation failed:'
      @stderr.puts @errors.map { |e| "- #{e}" }
    end

    valid? ? 0 : 1
  end

  private

  def normalize_checks(checks)
    return CHECKS['all'] if checks.nil? || checks.empty?

    selected = []
    checks.each do |c|
      if c == 'all'
        selected.concat(CHECKS['all'])
      elsif CHECKS.key?(c)
        selected.concat(CHECKS[c])
      else
        @errors << "Unknown --check value: #{c}"
      end
    end
    selected.uniq
  end
end

def usage_and_exit!
  $stderr.puts("Usage: ruby scripts/validate-data.rb [--check all|navigation|social|projects|career|inventory]")
  exit 2
end

checks = nil
if (idx = ARGV.index('--check'))
  value = ARGV[idx + 1]
  usage_and_exit! if value.nil?
  checks = value.split(',').map(&:strip)
end

validator = DataValidator.new
exit_code = validator.run!(checks)
exit(exit_code)

