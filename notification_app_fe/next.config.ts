import type { NextConfig } from "next";

// Proxy all /api/* requests to the evaluation server.
// This avoids mixed-content and CORS issues since the browser only ever
// talks to our own Next.js server, which then forwards the request server-side.
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://20.207.122.201/evaluation-service/:path*",
      },
    ];
  },
};

export default nextConfig;
