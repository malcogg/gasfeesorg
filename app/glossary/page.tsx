import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { buildMetadata } from "@/lib/seo/metadata";

const terms = [
  ["Gas", "A unit of computational work required to execute a blockchain transaction or contract call."],
  ["Gwei", "A small denomination of ETH commonly used to quote Ethereum gas prices."],
  ["Base fee", "The protocol-set Ethereum fee that changes with block demand under EIP-1559."],
  ["Priority fee", "An optional tip used to incentivize faster transaction inclusion."],
  ["Layer 2", "A scaling network that executes activity away from a base chain while preserving a settlement relationship."],
  ["Bridge", "A tool or protocol for moving assets or messages between blockchains."],
];

export const metadata = buildMetadata({
  title: "Glossary",
  description: "Plain-language definitions for gas fees, gwei, base fees, priority fees, Layer 2 networks, and bridges.",
  path: "/glossary",
});

export default function GlossaryPage() {
  return (
    <PageShell>
      <SectionHeader eyebrow="Glossary" title="Gas fee terms in plain English." />
      <dl className="mt-10 grid gap-4 md:grid-cols-2">
        {terms.map(([term, definition]) => (
          <div key={term} className="rounded-3xl border border-line bg-surface p-6">
            <dt className="text-xl font-semibold">{term}</dt>
            <dd className="mt-3 text-sm leading-6 text-muted">{definition}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
