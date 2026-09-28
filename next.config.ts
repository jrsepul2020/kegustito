import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kegustito.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "**.kegustito.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "10099",
        pathname: "/wp-content/**",
      },
    ],
  },
};

export default nextConfig;
