"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Clock3,
  RefreshCw,
  Search,
  SunMoon,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useEvmGasFees } from "@/hooks/use-evm-gas-fees";
import type { GasFeeQuote } from "@/lib/gas/types";

type SortKey =
  | "name"
  | "symbol"
  | "safeGasPrice"
  | "proposeGasPrice"
  | "fastGasPrice"
  | "baseFee"
  | "gasUsedRatio"
  | "transferCostUsd"
  | "updatedAt";

type SortDirection = "asc" | "desc";

const columns: Array<{ key: SortKey; label: string; align?: "right" }> = [
  { key: "name", label: "Chain" },
  { key: "symbol", label: "Token" },
  { key: "safeGasPrice", label: "Safe / Low", align: "right" },
  { key: "proposeGasPrice", label: "Average", align: "right" },
  { key: "fastGasPrice", label: "Fast", align: "right" },
  { key: "baseFee", label: "Base Fee", align: "right" },
  { key: "gasUsedRatio", label: "Gas Used", align: "right" },
  { key: "transferCostUsd", label: "Send Tx", align: "right" },
  { key: "updatedAt", label: "Updated", align: "right" },
];

function formatGwei(value: number | null) {
  if (value === null) return "—";
  if (value < 0.01) return "<0.01";
  if (value < 10) return value.toFixed(2);
  return value.toFixed(1);
}

function formatUsd(value: number | null) {
  if (value === null) return "—";
  if (value < 0.01) return "<$0.01";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function relativeTime(value: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}

function feeClasses(value: number | null) {
  if (value === null) return "border-slate-700 bg-slate-800/70 text-slate-300";
  if (value <= 1) return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
  if (value <= 15) return "border-amber-400/30 bg-amber-400/10 text-amber-200";
  return "border-red-400/30 bg-red-400/10 text-red-300";
}

function compareValues(a: GasFeeQuote, b: GasFeeQuote, key: SortKey, direction: SortDirection) {
  const multiplier = direction === "asc" ? 1 : -1;
  const aValue = a[key];
  const bValue = b[key];

  if (typeof aValue === "string" && typeof bValue === "string") {
    return aValue.localeCompare(bValue) * multiplier;
  }

  const aNumber = typeof aValue === "number" ? aValue : Number.POSITIVE_INFINITY;
  const bNumber = typeof bValue === "number" ? bValue : Number.POSITIVE_INFINITY;
  return (aNumber - bNumber) * multiplier;
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index} className="border-b border-slate-800/80">
          {columns.map((column) => (
            <td key={column.key} className="px-4 py-5">
              <div className="h-4 animate-pulse rounded-full bg-slate-800" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function SortButton({
  column,
  sortKey,
  sortDirection,
  onSort,
}: {
  column: (typeof columns)[number];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const active = sortKey === column.key;

  return (
    <button
      type="button"
      onClick={() => onSort(column.key)}
      className={`inline-flex items-center gap-1 text-xs font-semibold tracking-[0.16em] uppercase transition ${
        column.align === "right" ? "justify-end" : ""
      } ${active ? "text-cyan-200" : "text-slate-400 hover:text-white"}`}
    >
      {column.label}
      {active ? (
        sortDirection === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function GasFeesTable() {
  const { data, isError, isFetching, isLoading, error, refetch } = useEvmGasFees();
  const [query, setQuery] = useState("");
  const [popularOnly, setPopularOnly] = useState(true);
  const [lightMode, setLightMode] = useState(false);
  const [calculatorChainId, setCalculatorChainId] = useState(1);
  const [gasUnits, setGasUnits] = useState(21_000);
  const [sortKey, setSortKey] = useState<SortKey>("proposeGasPrice");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const rows = useMemo(() => {
    return [...(data?.chains ?? [])]
      .filter((chain) => (popularOnly ? chain.popular : true))
      .filter((chain) => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return true;
        return [chain.name, chain.shortName, chain.symbol].some((value) => value.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => compareValues(a, b, sortKey, sortDirection));
  }, [data?.chains, popularOnly, query, sortDirection, sortKey]);

  const calculatorChain = data?.chains.find((chain) => chain.chainId === calculatorChainId) ?? data?.chains[0];
  const calculatorNativeCost =
    calculatorChain?.proposeGasPrice === null || calculatorChain?.proposeGasPrice === undefined
      ? null
      : (calculatorChain.proposeGasPrice * gasUnits) / 1_000_000_000;
  const calculatorUsdCost =
    calculatorNativeCost === null || !calculatorChain?.tokenPriceUsd ? null : calculatorNativeCost * calculatorChain.tokenPriceUsd;

  function onSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "name" || nextKey === "symbol" ? "asc" : "asc");
  }

  const shellClass = lightMode
    ? "bg-slate-50 text-slate-950"
    : "bg-[radial-gradient(circle_at_top_left,#10343b_0%,#061015_38%,#020617_100%)] text-white";
  const panelClass = lightMode ? "border-slate-200 bg-white/95" : "border-white/10 bg-slate-950/75";
  const mutedClass = lightMode ? "text-slate-600" : "text-slate-400";
  const tableHeaderClass = lightMode ? "bg-slate-100/90" : "bg-slate-900/95";
  const rowClass = lightMode
    ? "border-b border-slate-200 transition hover:bg-slate-50"
    : "border-b border-slate-800/80 transition hover:bg-slate-900/80";

  return (
    <section className={`min-h-screen px-5 py-10 transition-colors md:px-10 ${shellClass}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
              <Zap className="h-3.5 w-3.5" />
              Multichain Gas Tracker
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Live EVM gas fees across Etherscan-supported chains.
            </h1>
            <p className={`mt-4 max-w-2xl text-base leading-7 ${mutedClass}`}>
              Compare safe, average, and fast gas prices with simple transfer cost estimates. Data refreshes every 30 seconds from Etherscan API V2 gas oracle.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
            <div className={`rounded-2xl border p-4 ${panelClass}`}>
              <p className={`flex items-center gap-2 text-xs font-semibold uppercase ${mutedClass}`}>
                <Clock3 className="h-4 w-4" />
                Last updated
              </p>
              <p className="mt-2 text-2xl font-semibold">{data ? relativeTime(data.updatedAt) : "Loading"}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${panelClass}`}>
              <p className={`text-xs font-semibold uppercase ${mutedClass}`}>Tracked chains</p>
              <p className="mt-2 text-2xl font-semibold">{data?.chains.length ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className={`mt-8 rounded-3xl border shadow-2xl shadow-cyan-950/20 backdrop-blur ${panelClass}`}>
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 ${lightMode ? "border-slate-200 bg-slate-50" : "border-white/10 bg-slate-900/80"}`}>
              <Search className={`h-4 w-4 ${mutedClass}`} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search chains..."
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-500 lg:w-72"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPopularOnly((current) => !current)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  popularOnly
                    ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                    : lightMode
                      ? "border-slate-200 text-slate-700"
                      : "border-white/10 text-slate-300"
                }`}
              >
                {popularOnly ? "Popular only" : "All chains"}
              </button>
              <button
                type="button"
                onClick={() => setLightMode((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  lightMode ? "border-slate-200 text-slate-700" : "border-white/10 text-slate-300"
                }`}
              >
                <SunMoon className="h-4 w-4" />
                {lightMode ? "Light" : "Dark"}
              </button>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {isError ? (
            <div className="m-4 flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">Gas tracker temporarily unavailable</p>
                <p className="mt-1 text-sm text-red-100/80">
                  {error instanceof Error ? error.message : "Etherscan data could not be loaded. Try refreshing in a moment."}
                </p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 border-b border-white/10 p-4 lg:grid-cols-[1.2fr_1fr_1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold">Quick cost estimator</p>
              <p className={`mt-1 text-sm ${mutedClass}`}>
                Estimate a transaction with the selected chain&apos;s current average gas price.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Chain
                <select
                  value={calculatorChain?.chainId ?? calculatorChainId}
                  onChange={(event) => setCalculatorChainId(Number(event.target.value))}
                  className={`mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none ${
                    lightMode ? "border-slate-200 bg-white text-slate-950" : "border-white/10 bg-slate-900 text-white"
                  }`}
                >
                  {(data?.chains ?? []).map((chain) => (
                    <option key={chain.chainId} value={chain.chainId}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Gas units
                <select
                  value={gasUnits}
                  onChange={(event) => setGasUnits(Number(event.target.value))}
                  className={`mt-2 h-11 w-full rounded-xl border px-3 text-sm outline-none ${
                    lightMode ? "border-slate-200 bg-white text-slate-950" : "border-white/10 bg-slate-900 text-white"
                  }`}
                >
                  <option value={21_000}>Transfer · 21k</option>
                  <option value={65_000}>Token transfer · 65k</option>
                  <option value={100_000}>Approve token · 100k</option>
                  <option value={180_000}>Swap · 180k</option>
                  <option value={300_000}>Complex DeFi · 300k</option>
                </select>
              </label>
            </div>
            <div className={`rounded-2xl border p-4 ${lightMode ? "border-slate-200 bg-slate-50" : "border-cyan-300/20 bg-cyan-300/10"}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${mutedClass}`}>Estimated cost</p>
              <p className="mt-1 text-2xl font-semibold">
                {calculatorNativeCost === null || !calculatorChain
                  ? "—"
                  : `${calculatorNativeCost.toFixed(calculatorNativeCost < 0.001 ? 6 : 4)} ${calculatorChain.symbol}`}
              </p>
              <p className={`text-sm ${mutedClass}`}>{formatUsd(calculatorUsdCost)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] border-collapse">
              <thead className={tableHeaderClass}>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className={`px-4 py-4 ${column.align === "right" ? "text-right" : "text-left"}`}>
                      <SortButton column={column} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonRows />
                ) : (
                  rows.map((chain) => (
                    <tr key={chain.chainId} className={rowClass}>
                      <td className="px-4 py-4">
                        <a href={chain.explorerUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300 text-xs font-black text-slate-950">
                            {chain.shortName.slice(0, 3)}
                          </span>
                          <span>
                            <span className="block font-semibold">{chain.name}</span>
                            <span className={`text-xs ${mutedClass}`}>Chain ID {chain.chainId}</span>
                          </span>
                        </a>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm">{chain.symbol}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-flex rounded-full border px-3 py-1 font-mono text-sm ${feeClasses(chain.safeGasPrice)}`}>
                          {formatGwei(chain.safeGasPrice)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-sm">{formatGwei(chain.proposeGasPrice)}</td>
                      <td className="px-4 py-4 text-right font-mono text-sm">{formatGwei(chain.fastGasPrice)}</td>
                      <td className="px-4 py-4 text-right font-mono text-sm">{formatGwei(chain.baseFee)}</td>
                      <td className="px-4 py-4 text-right font-mono text-sm">
                        {chain.gasUsedRatio === null ? "—" : `${chain.gasUsedRatio.toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold">{formatUsd(chain.transferCostUsd)}</span>
                        <span className={`block text-xs ${mutedClass}`}>21k gas</span>
                      </td>
                      <td className={`px-4 py-4 text-right text-sm ${mutedClass}`}>
                        {chain.status === "ok" ? relativeTime(chain.updatedAt) : "Unavailable"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={`flex flex-col gap-2 border-t border-white/10 p-4 text-xs ${mutedClass} md:flex-row md:items-center md:justify-between`}>
            <p>Safe, average, and fast values are reported in gwei. Transfer cost estimates assume a simple 21,000 gas transfer.</p>
            <p>Data from Etherscan API V2. Prices from CoinGecko when available.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
