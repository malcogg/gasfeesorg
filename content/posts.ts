import wordpressCategories from "@/docs/migration/import/wordpress-categories.json";
import wordpressPosts from "@/docs/migration/import/wordpress-posts.json";
import wordpressTags from "@/docs/migration/import/wordpress-tags.json";
import { postSchema, type Post } from "@/lib/content/schemas";

type ImportedPost = {
  sourceId: number;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt: string;
  updatedAt: string;
  cleanupStatus: Post["cleanupStatus"];
  categories?: number[];
  tags?: number[];
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
  };
  html: string;
};

type ImportedTerm = {
  id: number;
  name: string;
  slug: string;
};

const categoryNames = new Map((wordpressCategories as ImportedTerm[]).map((term) => [term.id, term.name]));
const tagNames = new Map((wordpressTags as ImportedTerm[]).map((term) => [term.id, term.name]));

function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function rewriteWordPressHtml(html: string) {
  return html
    .replace(/https:\/\/gasfees\.org\/wp-content\//g, "https://old.gasfees.org/wp-content/")
    .replace(/http:\/\/gasfees\.org\/wp-content\//g, "https://old.gasfees.org/wp-content/")
    .replace(/href=["']https:\/\/gasfees\.org\/(?!wp-content\/)([^"']*)["']/g, 'href="/$1"')
    .replace(/href=["']http:\/\/gasfees\.org\/(?!wp-content\/)([^"']*)["']/g, 'href="/$1"')
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");
}

function extractFirstImage(html: string) {
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (!imgMatch?.[1]) return undefined;
  const altMatch = imgMatch[0].match(/alt=["']([^"']*)["']/i);

  return {
    src: imgMatch[1],
    alt: altMatch?.[1] || undefined,
  };
}

function termNames(ids: number[] | undefined, lookup: Map<number, string>) {
  return (ids ?? []).map((id) => lookup.get(id)).filter((name) => name !== undefined);
}

export const posts = (wordpressPosts as ImportedPost[]).map((post) => {
  const html = rewriteWordPressHtml(post.html);

  return postSchema.parse({
    sourceId: post.sourceId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || stripHtml(html).slice(0, 220),
    html,
    image: extractFirstImage(html),
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: "Mr. GasMan",
    categories: termNames(post.categories, categoryNames),
    tags: termNames(post.tags, tagNames),
    related: [],
    cleanupStatus: post.cleanupStatus,
    seo: post.seo ?? {},
  });
});
