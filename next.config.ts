import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  /* other config options */
};

export default nextConfig;
