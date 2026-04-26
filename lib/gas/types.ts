import type { EvmChainConfig } from "@/lib/gas/chains";

export type FeeLevel = "cheap" | "moderate" | "expensive";

export type GasFeeQuote = EvmChainConfig & {
  status: "ok" | "error";
  safeGasPrice: number | null;
  proposeGasPrice: number | null;
  fastGasPrice: number | null;
  baseFee: number | null;
  gasUsedRatio: number | null;
  lastBlock: number | null;
  tokenPriceUsd: number | null;
  transferCostUsd: number | null;
  feeLevel: FeeLevel;
  updatedAt: string;
  source: "etherscan";
  error?: string;
};

export type GasTrackerResponse = {
  updatedAt: string;
  refreshIntervalMs: number;
  chains: GasFeeQuote[];
  errors: Array<{
    chainId: number;
    name: string;
    message: string;
  }>;
};
