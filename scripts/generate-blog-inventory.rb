#!/usr/bin/env ruby
# frozen_string_literal: true

require 'psych'
require 'time'
require 'date'

# Generates _data/blog-inventory.yml from _posts/ scan (DATA-04, D-13–D-17).
class BlogInventoryGenerator
  POSTS_GLOB = '_posts/*.{md,markdown}'.freeze
  OUTPUT_PATH = File.join('_data', 'blog-inventory.yml').freeze

  META_PATTERNS = [
    /welcome-to-jekyll/i,
    /welcome-back/i,
    /\bgreetings\b/i,
    /status-update/i
  ].freeze

  TECHNICAL_KEYWORDS = %w[
    kotlin monorepo devops debugging forge binary-search algorithm data-mining
    practice-problem datetime cloud-comp
  ].freeze

  # 2015 filename fragment => { group:, canonical_id: }
  DUPLICATE_PAIRS = {
    /setting up automated/i => {
      group: 'macos-automated-testing',
      canonical_id: '2024-01-30-design-document-for-setting-up-automated'
    },
    /project 3: multithre/i => {
      group: 'macos-multithreading',
      canonical_id: '2024-07-25-design-document-for-multithre'
    },
    /mastering xcode inst/i => {
      group: 'mastering-xcode-installers',
      canonical_id: '2024-11-29-design-document-for-mastering-xcode-inst'
    },
    /learning homebrew/i => {
      group: 'learning-homebrew',
      canonical_id: '2024-12-09-design-document-for-learning-homebrew-an'
    },
    /project 5: macos dis/i => {
      group: 'macos-distribution',
      canonical_id: '2024-12-09-design-document-for-macos-dis'
    },
    /understanding macos/i => {
      group: 'understanding-macos',
      canonical_id: '2024-12-09-design-document-for-understanding-macos'
    },
    /automating macos/i => {
      group: 'automating-macos',
      canonical_id: '2024-12-09-design-document-for-automating-macos'
    },
    /testing across macos/i => {
      group: 'testing-across-macos',
      canonical_id: '2024-12-08-design-document-for-testing-across-macos'
    },
    /implementing code si/i => {
      group: 'code-signing-notarization',
      canonical_id: '2024-12-08-design-document-for-implementing-code-signing-and-notarization'
    },
    /debugging kernel-lev/i => {
      group: 'debugging-kernel-level',
      canonical_id: '2024-12-08-design-document-for-debugging-kernel-lev'
    }
  }.freeze

  # Manual curation to reach 10–15 featured (D-15) after auto-rules.
  FEATURED_IDS = %w[
    2024-11-08-kotlin-cheatsheet
    2025-07-03-monorepo-tooling-strategy
    2025-08-01-dev-ops-helper-tool
    2025-01-13-debugging
    2025-01-16-kotlinx-datetime-use
    2015-02-18-binary-search
    2015-12-20-guide-to-data-mining
    2016-01-05-fun-algorithms
    2016-01-07-competitve-programming
    2025-01-03-diagrams
    2024-12-10-behavioral-questions
    2024-12-16-aditl
  ].freeze

  def self.run!(output_path: OUTPUT_PATH)
    new(output_path: output_path).run!
  end

  def initialize(output_path: OUTPUT_PATH)
    @output_path = output_path
  end

  def run!
    posts = scan_posts.sort_by { |p| [p[:pub_date], p[:id]] }
    raise "Expected 51 posts, found #{posts.length}" unless posts.length == 51

    posts.each { |post| assign_tier!(post) }

    featured = posts.count { |p| p[:tier] == 'featured' }
    raise "Featured count #{featured} outside 10–15" unless (10..15).cover?(featured)

    tier_counts = posts.group_by { |p| p[:tier] }.transform_values(&:size)
    data = {
      'meta' => {
        'generated_at' => Time.now.utc.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'total_posts' => posts.length,
        'tier_counts' => {
          'featured' => tier_counts['featured'] || 0,
          'standard' => tier_counts['standard'] || 0,
          'archived' => tier_counts['archived'] || 0
        }
      },
      'posts' => posts.map { |p| serialize_post(p) }
    }

    File.write(@output_path, Psych.dump(data))
    puts "Wrote #{@output_path} (#{posts.length} posts, featured=#{tier_counts['featured']})"
    data
  end

  private

  def scan_posts
    Dir.glob(POSTS_GLOB).map do |path|
      parse_post(path)
    end
  end

  def parse_post(path)
    filename = File.basename(path)
    raw = File.read(path)
    frontmatter, body = split_frontmatter(raw)
    fm = parse_frontmatter(frontmatter)

    date_match = filename.match(/\A(\d{4})-(\d{2})-(\d{2})-/)
    raise "No date prefix in #{filename}" unless date_match

    year, month, day = date_match.captures
    pub_date = fm['date'] ? parse_date(fm['date']) : "#{year}-#{month}-#{day}"

    title = extract_title(fm, body, filename)
    slug = slugify(title)
    permalink = "/#{year}/#{month}/#{day}/#{slug}/"
    id = post_id(filename)

    {
      id: id,
      filename: filename,
      title: title,
      pub_date: pub_date,
      permalink: permalink,
      tier: nil,
      auto_rule: nil,
      hide_frontmatter: hide_true?(fm),
      canonical_slug: nil,
      duplicate_group: nil,
      layout: fm['layout'],
      body: body,
      year: year.to_i
    }
  end

  def split_frontmatter(raw)
    return ['', raw] unless raw.match?(/\A-{3,}\s*\n/)

    # Support --- and ---- (some legacy posts use four dashes).
    if (m = raw.match(/\A(-{3,})\s*\n(.*)\n\1\s*\n/m))
      [m[2], raw[m.end(0)..] || '']
    else
      ['', raw]
    end
  end

  def parse_frontmatter(yaml_text)
    return {} if yaml_text.strip.empty?

    Psych.safe_load(
      yaml_text,
      permitted_classes: [Date, Time],
      permitted_symbols: [],
      aliases: false
    ) || {}
  rescue Psych::SyntaxError
    {}
  end

  def hide_true?(fm)
    value = fm['hide']
    value == true || value.to_s.downcase == 'true'
  end

  def parse_date(value)
    case value
    when Date then value.strftime('%Y-%m-%d')
    when Time then value.strftime('%Y-%m-%d')
    else
      value.to_s[0, 10]
    end
  end

  def extract_title(fm, body, filename)
    title = fm['title']
    return title.strip if title.is_a?(String) && !title.strip.empty?

    if body
      body.each_line do |line|
        if (m = line.match(/\A#\s+(.+)\s*\z/))
          return m[1].strip
        end
      end
    end

    slug_part = filename.sub(/\A\d{4}-\d{2}-\d{2}-/, '').sub(/\.(md|markdown)\z/i, '')
    slug_part.tr('-', ' ').split.map(&:capitalize).join(' ')
  end

  def post_id(filename)
    base = filename.sub(/\.(md|markdown)\z/i, '')
    base.downcase.gsub(/[^a-z0-9]+/, '-').gsub(/\A-+|-+\z/, '')
  end

  def slugify(text)
    text.to_s.downcase
        .gsub(/[^a-z0-9\s-]/, '')
        .gsub(/\s+/, '-')
        .gsub(/-+/, '-')
        .gsub(/\A-|-\z/, '')
  end

  def assign_tier!(post)
    if post[:hide_frontmatter]
      post[:tier] = 'archived'
      post[:auto_rule] = 'hide_frontmatter'
      return
    end

    if design_document?(post)
      apply_design_doc_rules!(post)
      return
    end

    if meta_post?(post)
      post[:tier] = 'archived'
      post[:auto_rule] = 'meta_post'
      return
    end

    if FEATURED_IDS.include?(post[:id])
      post[:tier] = 'featured'
      post[:auto_rule] = 'manual_featured'
      return
    end

    if recent_technical_candidate?(post)
      post[:tier] = 'standard'
      post[:auto_rule] = 'recent_technical_remainder'
      return
    end

    post[:tier] = 'standard'
    post[:auto_rule] = 'remainder'
  end

  def design_document?(post)
    post[:filename].match?(/design document/i) || post[:title].match?(/design document/i)
  end

  def apply_design_doc_rules!(post)
    pair = duplicate_pair_for(post)
    if pair && post[:year] == 2015
      post[:tier] = 'archived'
      post[:auto_rule] = 'design_doc_2015_duplicate'
      post[:canonical_slug] = pair[:canonical_id]
      post[:duplicate_group] = pair[:group]
    else
      post[:tier] = 'archived'
      post[:auto_rule] = 'design_document'
    end
  end

  def duplicate_pair_for(post)
    DUPLICATE_PAIRS.each do |pattern, info|
      return info if post[:filename].match?(pattern) || post[:title].match?(pattern)
    end
    nil
  end

  def meta_post?(post)
    META_PATTERNS.any? { |pat| post[:filename].match?(pat) || post[:title].match?(pat) }
  end

  def recent_technical_candidate?(post)
    return false unless post[:year] >= 2024

    haystack = "#{post[:filename]} #{post[:title]}".downcase
    TECHNICAL_KEYWORDS.any? { |kw| haystack.include?(kw) }
  end

  def serialize_post(post)
    {
      'id' => post[:id],
      'filename' => post[:filename],
      'title' => post[:title],
      'pub_date' => post[:pub_date],
      'permalink' => post[:permalink],
      'tier' => post[:tier],
      'auto_rule' => post[:auto_rule],
      'hide_frontmatter' => post[:hide_frontmatter],
      'canonical_slug' => post[:canonical_slug],
      'duplicate_group' => post[:duplicate_group]
    }
  end
end

BlogInventoryGenerator.run! if $PROGRAM_NAME == __FILE__
