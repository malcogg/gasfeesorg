"use client";

import { useQuery } from "@tanstack/react-query";
import type { GasTrackerResponse } from "@/lib/gas/types";

async function fetchGasFees() {
  const response = await fetch("/api/gas/evm", {
    cache: "no-store",
  });

  const data = (await response.json()) as GasTrackerResponse;

  if (!response.ok) {
    throw new Error(data.errors[0]?.message ?? "Unable to load gas fees");
  }

  return data;
}

export function useEvmGasFees() {
  return useQuery({
    queryKey: ["evm-gas-fees"],
    queryFn: fetchGasFees,
    refetchInterval: 30_000,
  });
}
