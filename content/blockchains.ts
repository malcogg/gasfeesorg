import { blockchainSchema, type Blockchain } from "@/lib/content/schemas";

const rawBlockchains = [
  {
    slug: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    chainType: "Layer 1",
    feeModel: "EIP-1559 base fee plus priority fee, paid in ETH.",
    summary:
      "Ethereum is the main smart contract network for DeFi, NFTs, and settlement. Its fees vary with demand and contract complexity.",
    featuredSlugs: [
      "what-are-ethereum-gas-fees",
      "understanding-eth-gas-fees-a-technical-overview",
      "gwei-tracking-guide",
    ],
  },
  {
    slug: "aptos",
    name: "Aptos",
    ticker: "APT",
    chainType: "Layer 1",
    feeModel: "Execution, storage, and payload costs, paid in APT.",
    summary:
      "Aptos uses a fee model that accounts for transaction execution and storage, making calculators useful for complex activity.",
    featuredSlugs: ["what-are-aptos-gas-fees"],
  },
  {
    slug: "base",
    name: "Base",
    ticker: "ETH",
    chainType: "Layer 2",
    feeModel: "Layer 2 execution cost plus Ethereum settlement-related costs.",
    summary:
      "Base is an Ethereum Layer 2 where fees are typically lower than Ethereum mainnet for many user actions.",
    featuredSlugs: ["understanding-eth-gas-fees-a-technical-overview"],
  },
  {
    slug: "arbitrum",
    name: "Arbitrum",
    ticker: "ETH",
    chainType: "Layer 2",
    feeModel: "Rollup execution fees plus data availability costs.",
    summary:
      "Arbitrum is a major Ethereum rollup used for lower-cost DeFi and app interactions.",
    featuredSlugs: ["understanding-eth-gas-fees-a-technical-overview"],
  },
  {
    slug: "solana",
    name: "Solana",
    ticker: "SOL",
    chainType: "Layer 1",
    feeModel: "Transaction and priority fees paid in SOL.",
    summary:
      "Solana is known for low transaction costs, but users still need to understand priority fees and congestion effects.",
    featuredSlugs: ["cheapest-crypto-to-transfer"],
  },
  {
    slug: "polygon",
    name: "Polygon",
    ticker: "POL",
    chainType: "Sidechain / scaling network",
    feeModel: "Network fees paid in the native gas token.",
    summary:
      "Polygon has long been used as a lower-cost alternative for transfers, NFTs, and app interactions.",
    featuredSlugs: ["cheapest-crypto-to-transfer"],
  },
] satisfies Blockchain[];

export const blockchains = rawBlockchains.map((blockchain) => blockchainSchema.parse(blockchain));
