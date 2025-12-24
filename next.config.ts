// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@istanbul-care/ui", "@istanbul-care/types"],

  images: {
    unoptimized: true, 
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.istanbul-care.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*", 
        destination: "https://api.istanbul-care.com/v1/admin/:path*",
      },
      {
        source: "/media/:path*",
        destination: "https://api.istanbul-care.com/media/:path*",
      },
      // /img/ klasörünü sunucuya yönlendiriyoruz
      {
        source: "/img/:path*",
        destination: "https://api.istanbul-care.com/img/:path*",
      },
      {
        source: "/static/:path*",
        destination: "https://api.istanbul-care.com/static/:path*",
      },
    ];
  },
};

export default nextConfig;