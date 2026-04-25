import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { blockchains } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Gas Fee Charts",
  description: "Tracker hub for current and future gas fee charts across major blockchains.",
  path: "/charts",
});

export default function ChartsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Charts"
        title="Gas fee tracker hub."
        description="The chart surface starts as a clean tracker directory and is ready for live data integrations."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {blockchains.map((chain) => (
          <Link key={chain.slug} href={`/blockchains/${chain.slug}`} className="rounded-3xl border border-line bg-surface p-6">
            <p className="text-sm text-muted">{chain.chainType}</p>
            <h2 className="mt-2 text-2xl font-semibold">{chain.name}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{chain.feeModel}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
