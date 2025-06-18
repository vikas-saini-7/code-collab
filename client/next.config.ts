import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // for socket io 
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;
