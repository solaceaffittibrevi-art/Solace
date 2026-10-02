import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/analisi-gratuita", destination: "/valutazione-gratuita", permanent: true }];
  },
};

export default nextConfig;
