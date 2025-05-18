#!/bin/bash

echo "Starting test suite..."

# Build the Jekyll site
echo "Building Jekyll site..."
JEKYLL_ENV=test bundle exec jekyll build

# Run HTML Proofer
echo "Running HTML Proofer..."
bundle exec rake test

# Run Jest tests
echo "Running Jest tests..."
NODE_ENV=test npm run test:unit

# Run Cypress tests (if server is running)
echo "Running Cypress tests..."
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    npm run test:e2e
else
    echo "Starting Jekyll server..."
    bundle exec jekyll serve --detach
    npm run test:e2e
    pkill -f jekyll
fi
