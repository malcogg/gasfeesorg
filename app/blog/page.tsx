import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { posts, topics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Gas fee guides, blockchain explainers, migration-safe research, and transaction cost education.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Blog"
        title="Readable gas fee guides for practical crypto decisions."
        description="A cleaner editorial index for preserved WordPress posts and future AI-assisted publishing."
      />
      <div className="mt-8 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <a key={topic.slug} href={`/topics/${topic.slug}`} className="rounded-full border border-line px-4 py-2 text-sm text-muted">
            {topic.name}
          </a>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ContentCard key={post.slug} eyebrow={post.cleanupStatus} title={post.title} excerpt={post.excerpt} href={`/${post.slug}`} />
        ))}
      </div>
    </PageShell>
  );
}
