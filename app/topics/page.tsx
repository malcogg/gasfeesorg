import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { topics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Topics",
  description: "Curated gas fee topics replacing noisy WordPress category and tag archives.",
  path: "/topics",
});

export default function TopicsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Topics"
        title="Curated entry points for gas fee research."
        description="Topics consolidate weak archive pages into stronger search and discovery surfaces."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {topics.map((topic) => (
          <ContentCard key={topic.slug} eyebrow="Topic" title={topic.name} excerpt={topic.description} href={`/topics/${topic.slug}`} />
        ))}
      </div>
    </PageShell>
  );
}
