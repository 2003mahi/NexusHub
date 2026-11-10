import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: "..",
  },
  async redirects() {
    return [
      { source: "/ventures/:path*", destination: "/", permanent: false },
      { source: "/academy/:path*", destination: "/", permanent: false },
      { source: "/mentorship/:path*", destination: "/", permanent: false },
      { source: "/impact/:path*", destination: "/", permanent: false },
      { source: "/founders/:path*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
