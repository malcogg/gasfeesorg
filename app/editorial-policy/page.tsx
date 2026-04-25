import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description: "How GasFees.org reviews, updates, and improves gas fee education content.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <PageShell className="max-w-4xl">
      <SectionHeader eyebrow="Trust" title="Editorial policy" />
      <div className="content-flow mt-10">
        <p>
          GasFees.org content should be useful, sourced from reputable public information, and reviewed before
          publication. AI may support research, outlines, internal linking, and QA, but human editors remain
          responsible for accuracy and usefulness.
        </p>
        <p>
          Migration cleanup flags identify pages that should be preserved, consolidated, noindexed, or revised
          before receiving prominent internal links.
        </p>
      </div>
    </PageShell>
  );
}
