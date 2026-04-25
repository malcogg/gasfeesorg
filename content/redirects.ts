import { redirectSchema, type RedirectRule } from "@/lib/content/schemas";

const rawRedirects = [
  {
    source: "/aptos-gas-fees-calculator-advanced/",
    destination: "/tools/aptos-gas-fee-calculator",
    permanent: true,
    reason: "Move calculator into the tools IA while preserving the old WordPress utility URL.",
  },
  {
    source: "/gas-fees-chart/",
    destination: "/charts",
    permanent: true,
    reason: "Move beta chart page into the chart/tracker hub.",
  },
  {
    source: "/category/gas-fees/",
    destination: "/topics/gas-fees",
    permanent: true,
    reason: "Replace weak WordPress category archive with curated topic page.",
  },
  {
    source: "/category/ethereum/",
    destination: "/topics/ethereum-gas",
    permanent: true,
    reason: "Replace Ethereum category archive with curated Ethereum gas hub.",
  },
  {
    source: "/tag/blockchain/",
    destination: "/blockchains",
    permanent: true,
    reason: "Avoid low-value tag indexation and route users to the curated blockchain index.",
  },
] satisfies RedirectRule[];

export const redirects = rawRedirects.map((redirect) => redirectSchema.parse(redirect));
