import { blockchains } from "@/content/blockchains";
import { posts } from "@/content/posts";
import { redirects } from "@/content/redirects";
import { topics } from "@/content/topics";
import { tools } from "@/content/tools";

export { blockchains, posts, redirects, topics, tools };
export type { Blockchain, Post, RedirectRule, Tool, Topic } from "@/lib/content/schemas";

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getBlockchain(slug: string) {
  return blockchains.find((blockchain) => blockchain.slug === slug);
}

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function postsForSlugs(slugs: string[]) {
  return slugs.map(getPost).filter((post) => post !== undefined);
}

export function postsForTopic(slug: string) {
  const topic = getTopic(slug);
  if (!topic) return [];
  const featured = postsForSlugs(topic.featuredSlugs);
  const related = posts.filter((post) =>
    post.categories.some((category) => category.toLowerCase().includes(topic.name.toLowerCase().split(" ")[0])),
  );
  return [...new Map([...featured, ...related].map((post) => [post.slug, post])).values()];
}

export function postsForBlockchain(slug: string) {
  const blockchain = getBlockchain(slug);
  if (!blockchain) return [];
  const featured = postsForSlugs(blockchain.featuredSlugs);
  const related = posts.filter((post) =>
    [...post.categories, ...post.tags].some(
      (value) => value.toLowerCase() === blockchain.name.toLowerCase() || value.toLowerCase() === slug,
    ),
  );
  return [...new Map([...featured, ...related].map((post) => [post.slug, post])).values()];
}

export function getSearchDocuments() {
  return [
    ...posts.map((post) => ({
      type: "Article",
      title: post.title,
      excerpt: post.excerpt,
      href: `/${post.slug}`,
      text: [post.title, post.excerpt, ...post.body, ...post.categories, ...post.tags].join(" "),
    })),
    ...topics.map((topic) => ({
      type: "Topic",
      title: topic.name,
      excerpt: topic.description,
      href: `/topics/${topic.slug}`,
      text: [topic.name, topic.description, topic.intent].join(" "),
    })),
    ...blockchains.map((blockchain) => ({
      type: "Blockchain",
      title: blockchain.name,
      excerpt: blockchain.summary,
      href: `/blockchains/${blockchain.slug}`,
      text: [blockchain.name, blockchain.ticker, blockchain.chainType, blockchain.feeModel, blockchain.summary]
        .filter(Boolean)
        .join(" "),
    })),
    ...tools.map((tool) => ({
      type: "Tool",
      title: tool.name,
      excerpt: tool.description,
      href: tool.href,
      text: [tool.name, tool.description, tool.status].join(" "),
    })),
  ];
}
