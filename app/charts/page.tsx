import { GasFeesTable } from "@/components/gas-tracker/gas-fees-table";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Multichain Gas Fees Tracker",
  description:
    "Track live EVM gas fees across Etherscan API V2 gas-oracle-supported chains with sortable fee and transfer-cost estimates.",
  path: "/charts",
});

export default function ChartsPage() {
  return <GasFeesTable />;
}
