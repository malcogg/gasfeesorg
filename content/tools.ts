import { toolSchema, type Tool } from "@/lib/content/schemas";

const rawTools = [
  {
    slug: "aptos-gas-fee-calculator",
    name: "Aptos Gas Fee Calculator",
    description:
      "Estimate Aptos transaction costs from instruction gas, storage gas, and payload size assumptions.",
    status: "live",
    href: "/tools/aptos-gas-fee-calculator",
  },
  {
    slug: "gas-fee-charts",
    name: "Multichain Gas Fees Tracker",
    description:
      "Compare live EVM gas fees across Etherscan API V2 gas-oracle-supported chains.",
    status: "live",
    href: "/charts",
  },
] satisfies Tool[];

export const tools = rawTools.map((tool) => toolSchema.parse(tool));
