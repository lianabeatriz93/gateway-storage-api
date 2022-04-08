/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/home": { page: "/home" },
    };
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, process: false };

    return config;
  },
};

module.exports = nextConfig;
