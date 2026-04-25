import { classifyRecord, fetchAll, stripHtml, wordCount, writeJson } from "./shared.mjs";

const POST_FIELDS =
  "id,date,modified,slug,link,title,excerpt,content,categories,tags,featured_media,yoast_head_json";
const PAGE_FIELDS = "id,date,modified,slug,link,title,excerpt,content,parent,menu_order,yoast_head_json";
const TAXONOMY_FIELDS = "id,count,slug,name,parent,link,description";

function normalizePost(post, type) {
  const title = stripHtml(post.title?.rendered ?? "");
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");
  const html = post.content?.rendered ?? "";
  const count = wordCount(html);

  return {
    type,
    sourceId: post.id,
    slug: post.slug,
    oldUrl: post.link,
    title,
    excerpt,
    publishedAt: post.date,
    updatedAt: post.modified,
    wordCount: count,
    cleanupStatus: classifyRecord({ title, wordCount: count }),
    categories: post.categories ?? [],
    tags: post.tags ?? [],
    featuredMedia: post.featured_media ?? null,
    seo: {
      title: post.yoast_head_json?.title,
      description: post.yoast_head_json?.description,
      canonical: post.yoast_head_json?.canonical,
      robots: post.yoast_head_json?.robots,
    },
    html,
  };
}

function buildRedirects(records) {
  return records.map((record) => ({
    source: new URL(record.oldUrl).pathname,
    destination: record.type === "post" ? `/${record.slug}` : `/${record.slug}`,
    permanent: true,
    status: record.cleanupStatus,
  }));
}

const [posts, pages, categories, tags] = await Promise.all([
  fetchAll("posts", POST_FIELDS),
  fetchAll("pages", PAGE_FIELDS),
  fetchAll("categories", TAXONOMY_FIELDS),
  fetchAll("tags", "id,count,slug,name,link"),
]);

const normalizedPosts = posts.map((post) => normalizePost(post, "post"));
const normalizedPages = pages.map((page) => normalizePost(page, "page"));
const records = [...normalizedPosts, ...normalizedPages];

await writeJson("wordpress-posts.json", normalizedPosts);
await writeJson("wordpress-pages.json", normalizedPages);
await writeJson("wordpress-categories.json", categories);
await writeJson("wordpress-tags.json", tags);
await writeJson("redirect-candidates.json", buildRedirects(records));
await writeJson("validation-report.json", {
  generatedAt: new Date().toISOString(),
  totals: {
    posts: normalizedPosts.length,
    pages: normalizedPages.length,
    categories: categories.length,
    tags: tags.length,
  },
  cleanupCandidates: records
    .filter((record) => record.cleanupStatus !== "preserve")
    .map(({ type, sourceId, slug, title, wordCount, cleanupStatus, oldUrl }) => ({
      type,
      sourceId,
      slug,
      title,
      wordCount,
      cleanupStatus,
      oldUrl,
    })),
});

console.log(`Imported ${normalizedPosts.length} posts and ${normalizedPages.length} pages.`);
