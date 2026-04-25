import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/aptos-gas-fees-calculator-advanced/",
        destination: "/tools/aptos-gas-fee-calculator",
        permanent: true,
      },
      {
        source: "/gas-fees-chart/",
        destination: "/charts",
        permanent: true,
      },
      {
        source: "/category/gas-fees/",
        destination: "/topics/gas-fees",
        permanent: true,
      },
      {
        source: "/category/ethereum/",
        destination: "/topics/ethereum-gas",
        permanent: true,
      },
      {
        source: "/tag/blockchain/",
        destination: "/blockchains",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "old.gasfees.org" }],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
