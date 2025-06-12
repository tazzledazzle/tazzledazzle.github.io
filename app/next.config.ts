import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

const withMDX = require("next-mdx")({
    extension: /\.mdx?$/
});

module.exports = withMDX({
    pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
    // Add any other Next.js configuration options here
    // reactStrictMode: true,
    // swcMinify: true,
    // images: {
    //     domains: ["example.com"], // Replace with your image domains
    // },
});
