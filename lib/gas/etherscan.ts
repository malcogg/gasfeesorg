import { evmChains, gasOracleEvmChains, type EvmChainConfig } from "@/lib/gas/chains";
import type { FeeLevel, GasFeeQuote } from "@/lib/gas/types";

const SIMPLE_TRANSFER_GAS_UNITS = 21_000;
const ETHERSCAN_BATCH_SIZE = 4;
const ETHERSCAN_BATCH_DELAY_MS = 1_100;

type EtherscanGasOracleResult = {
  LastBlock?: string;
  SafeGasPrice?: string;
  ProposeGasPrice?: string;
  FastGasPrice?: string;
  suggestBaseFee?: string;
  SuggestBaseFee?: string;
  gasUsedRatio?: string;
};

type EtherscanGasOracleResponse =
  | {
      status: "1";
      message: string;
      result: EtherscanGasOracleResult;
    }
  | {
      status: "0";
      message: string;
      result: string;
    };

type CoinGeckoPriceResponse = Record<string, { usd?: number }>;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseNumber(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseGasUsedRatio(value: string | undefined) {
  if (!value) return null;
  const ratios = value
    .split(",")
    .map((ratio) => Number(ratio))
    .filter((ratio) => Number.isFinite(ratio));

  if (!ratios.length) return null;

  const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  return Math.round(average * 10_000) / 100;
}

function getFeeLevel(proposeGasPrice: number | null): FeeLevel {
  if (proposeGasPrice === null) return "moderate";
  if (proposeGasPrice <= 1) return "cheap";
  if (proposeGasPrice <= 15) return "moderate";
  return "expensive";
}

function estimateTransferCostUsd(gwei: number | null, tokenPriceUsd: number | null) {
  if (gwei === null || tokenPriceUsd === null) return null;
  const nativeCost = (gwei * SIMPLE_TRANSFER_GAS_UNITS) / 1_000_000_000;
  return nativeCost * tokenPriceUsd;
}

async function fetchTokenPrices() {
  const ids = Array.from(new Set(evmChains.map((chain) => chain.coingeckoId).filter(Boolean)));
  if (!ids.length) return new Map<string, number>();

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) return new Map<string, number>();

    const data = (await response.json()) as CoinGeckoPriceResponse;
    return new Map(
      Object.entries(data)
        .map(([id, price]) => [id, price.usd] as const)
        .filter((entry): entry is readonly [string, number] => typeof entry[1] === "number"),
    );
  } catch {
    return new Map<string, number>();
  }
}

async function fetchChainGas(chain: EvmChainConfig, apiKey: string, tokenPriceUsd: number | null): Promise<GasFeeQuote> {
  const updatedAt = new Date().toISOString();
  const url = new URL("https://api.etherscan.io/v2/api");
  url.searchParams.set("module", "gastracker");
  url.searchParams.set("action", "gasoracle");
  url.searchParams.set("chainid", String(chain.chainId));
  url.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(url, {
      next: { revalidate: 15 },
    });

    if (!response.ok) {
      throw new Error(`Etherscan returned ${response.status}`);
    }

    const data = (await response.json()) as EtherscanGasOracleResponse;

    if (data.status !== "1") {
      throw new Error(typeof data.result === "string" ? data.result : data.message);
    }

    const result = data.result;
    const safeGasPrice = parseNumber(result.SafeGasPrice);
    const proposeGasPrice = parseNumber(result.ProposeGasPrice);
    const fastGasPrice = parseNumber(result.FastGasPrice);
    const baseFee = parseNumber(result.suggestBaseFee ?? result.SuggestBaseFee);
    const gasUsedRatio = parseGasUsedRatio(result.gasUsedRatio);
    const transferCostUsd = estimateTransferCostUsd(proposeGasPrice, tokenPriceUsd);

    return {
      ...chain,
      status: "ok",
      safeGasPrice,
      proposeGasPrice,
      fastGasPrice,
      baseFee,
      gasUsedRatio,
      lastBlock: parseNumber(result.LastBlock),
      tokenPriceUsd,
      transferCostUsd,
      feeLevel: getFeeLevel(proposeGasPrice),
      updatedAt,
      source: "etherscan",
    };
  } catch (error) {
    return {
      ...chain,
      status: "error",
      safeGasPrice: null,
      proposeGasPrice: null,
      fastGasPrice: null,
      baseFee: null,
      gasUsedRatio: null,
      lastBlock: null,
      tokenPriceUsd,
      transferCostUsd: null,
      feeLevel: "moderate",
      updatedAt,
      source: "etherscan",
      error: error instanceof Error ? error.message : "Unable to load gas data",
    };
  }
}

export async function fetchAllEvmGasFees(apiKey: string) {
  const priceMap = await fetchTokenPrices();
  const quotes: GasFeeQuote[] = [];

  for (let index = 0; index < gasOracleEvmChains.length; index += ETHERSCAN_BATCH_SIZE) {
    const batch = gasOracleEvmChains.slice(index, index + ETHERSCAN_BATCH_SIZE);
    const batchQuotes = await Promise.all(
      batch.map((chain) => fetchChainGas(chain, apiKey, chain.coingeckoId ? (priceMap.get(chain.coingeckoId) ?? null) : null)),
    );

    quotes.push(...batchQuotes);

    if (index + ETHERSCAN_BATCH_SIZE < gasOracleEvmChains.length) {
      await wait(ETHERSCAN_BATCH_DELAY_MS);
    }
  }

  return quotes;
}
