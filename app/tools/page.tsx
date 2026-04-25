import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { tools } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Tools",
  description: "Gas fee calculators, tracker hubs, and migration tooling for GasFees.org.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Tools"
        title="Calculators and workflows for transaction cost research."
        description="Tool pages pair usable calculators with methodology, related guides, and structured data."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {tools.map((tool) => (
          <ContentCard key={tool.slug} eyebrow={tool.status} title={tool.name} excerpt={tool.description} href={tool.href} />
        ))}
      </div>
    </PageShell>
  );
}
