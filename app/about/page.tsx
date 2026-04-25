import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About",
  description: "About GasFees.org, its editorial mission, migration, and trust posture.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell className="max-w-4xl">
      <SectionHeader
        eyebrow="About"
        title="GasFees.org is being rebuilt as a calmer research tool."
        description="The new site prioritizes search, readability, technical SEO, and editorial cleanup over cluttered archive pages."
      />
      <div className="content-flow mt-10">
        <p>
          GasFees.org helps readers understand blockchain transaction costs before they make expensive or
          confusing on-chain decisions.
        </p>
        <p>
          The migration preserves valuable WordPress content while introducing cleaner topic pages, blockchain
          pages, calculators, structured data, and a scalable AI-assisted publishing workflow with human review.
        </p>
      </div>
    </PageShell>
  );
}
