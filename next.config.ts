import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*", 
        destination: "https://api.istanbul-care.com/v1/admin/:path*", // Hedef sunucu
      },
    ];
  },
};

export default nextConfig;