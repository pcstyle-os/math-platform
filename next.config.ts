import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip type-checking during Vercel builds (already done in pre-commit hook)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
