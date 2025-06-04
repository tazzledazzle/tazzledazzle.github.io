const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
module.exports = withMDX({
  output: 'export',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true
  }
})