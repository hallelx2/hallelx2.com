import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www → apex. Both hosts are attached to the Vercel project; the apex is
      // canonical (metadataBase), so www 308s instead of serving duplicates.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hallelx2.com" }],
        destination: "https://hallelx2.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
