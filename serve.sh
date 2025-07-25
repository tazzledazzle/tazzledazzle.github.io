#!/bin/bash

# Jekyll Development Server Script
echo "🚀 Starting Jekyll development server..."

# Check if bundle is installed
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundler not found. Please install it first:"
    echo "   gem install bundler"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "vendor/bundle" ]; then
    echo "📦 Installing dependencies..."
    bundle install --path vendor/bundle
fi

# Start the development server
echo "🌐 Starting server at http://localhost:4000"
echo "📝 Press Ctrl+C to stop the server"
echo ""

bundle exec jekyll serve --livereload --drafts --future