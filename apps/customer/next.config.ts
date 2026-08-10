import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the desktop app's in-app browser exercise this local Next.js project
  // through its LAN address during development. This does not affect production.
  allowedDevOrigins: ["192.168.1.100"],
  // Keep the 390px design reference unobstructed while running locally.
  devIndicators: false,
  transpilePackages: ["@nobateno/ui-kit"],
};

export default nextConfig;
