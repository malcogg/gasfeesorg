import { NextResponse } from "next/server";
import { fetchAllEvmGasFees } from "@/lib/gas/etherscan";
import type { GasTrackerResponse } from "@/lib/gas/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REFRESH_INTERVAL_MS = 30_000;

export async function GET() {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        updatedAt: new Date().toISOString(),
        refreshIntervalMs: REFRESH_INTERVAL_MS,
        chains: [],
        errors: [{ chainId: 0, name: "Etherscan", message: "Missing ETHERSCAN_API_KEY environment variable" }],
      } satisfies GasTrackerResponse,
      { status: 500 },
    );
  }

  const chains = await fetchAllEvmGasFees(apiKey);
  const response: GasTrackerResponse = {
    updatedAt: new Date().toISOString(),
    refreshIntervalMs: REFRESH_INTERVAL_MS,
    chains,
    errors: chains
      .filter((chain) => chain.status === "error")
      .map((chain) => ({
        chainId: chain.chainId,
        name: chain.name,
        message: chain.error ?? "Unable to load gas data",
      })),
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "s-maxage=15, stale-while-revalidate=30",
    },
  });
}
