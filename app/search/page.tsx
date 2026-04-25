import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { getSearchDocuments } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { SearchClient } from "./search-client";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search GasFees.org guides, topics, blockchain pages, calculators, and tracker content.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Search"
        title="Find the right gas fee answer fast."
        description="Search across articles, topic hubs, blockchain pages, tools, and migration-ready content."
      />
      <div className="mt-10">
        <SearchClient documents={getSearchDocuments()} initialQuery={query} />
      </div>
    </PageShell>
  );
}
