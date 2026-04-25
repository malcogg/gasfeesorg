import { topicSchema, type Topic } from "@/lib/content/schemas";

const rawTopics = [
  {
    slug: "gas-fees",
    name: "Gas Fees",
    description: "Core explainers about transaction costs, fee markets, and avoiding overpayment.",
    intent: "Help readers understand what gas fees are and how to make lower-cost transaction decisions.",
    featuredSlugs: [
      "what-are-ethereum-gas-fees",
      "what-influences-gas-fees-a-quick-guide",
      "ways-to-reduce-your-gas-fees-when-trading-crypto",
    ],
  },
  {
    slug: "ethereum-gas",
    name: "Ethereum Gas",
    description: "Ethereum fee mechanics, gwei tracking, EIP-1559, and Layer 2 cost reduction.",
    intent: "Serve Ethereum users who need clear, practical gas fee guidance.",
    featuredSlugs: [
      "what-are-ethereum-gas-fees",
      "understanding-eth-gas-fees-a-technical-overview",
      "gwei-tracking-guide",
    ],
  },
  {
    slug: "cheap-transfers",
    name: "Cheap Transfers",
    description: "Compare low-fee transfer options without ignoring security or usability tradeoffs.",
    intent: "Help readers choose practical low-cost routes for moving crypto.",
    featuredSlugs: ["cheapest-crypto-to-transfer", "ways-to-reduce-your-gas-fees-when-trading-crypto"],
  },
  {
    slug: "trackers-and-tools",
    name: "Trackers and Tools",
    description: "Gas fee trackers, calculators, charts, and practical tooling guides.",
    intent: "Connect searchers to calculators, charts, and explainers that support transaction planning.",
    featuredSlugs: ["gwei-tracking-guide", "what-are-aptos-gas-fees"],
  },
  {
    slug: "layer-2-rollups",
    name: "Layer 2 and Rollups",
    description: "Scaling networks, rollups, and lower-cost execution paths for blockchain users.",
    intent: "Explain when Layer 2 networks reduce costs and what tradeoffs they introduce.",
    featuredSlugs: ["understanding-eth-gas-fees-a-technical-overview"],
  },
] satisfies Topic[];

export const topics = rawTopics.map((topic) => topicSchema.parse(topic));
