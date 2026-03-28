/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Browsers request /favicon.ico by default; serve your mark (PNG) so the tab icon is not Next/default.
      { source: "/favicon.ico", destination: "/logo_papu.png" },
    ];
  },
};

module.exports = nextConfig;
