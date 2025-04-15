import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "storage.googleapis.com",
      "cdn.myanimelist.net",
      "cdn.anime-planet.com",
      "cdn.anidb.net",
      "cdn.anisearch.com",
    ],
  },
};

export default nextConfig;
