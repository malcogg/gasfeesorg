import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { blockchains } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Blockchains",
  description: "Compare blockchain gas fee models, native fee tokens, and related guides.",
  path: "/blockchains",
});

export default function BlockchainsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Blockchains"
        title="Gas fee models by chain."
        description="Structured blockchain pages replace one-post category archives with reusable research hubs."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {blockchains.map((blockchain) => (
          <ContentCard
            key={blockchain.slug}
            eyebrow={blockchain.chainType}
            title={blockchain.name}
            excerpt={blockchain.summary}
            href={`/blockchains/${blockchain.slug}`}
          />
        ))}
      </div>
    </PageShell>
  );
}
