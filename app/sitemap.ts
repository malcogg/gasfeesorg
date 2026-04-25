import type { MetadataRoute } from "next";
import { blockchains, posts, topics, tools } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/search",
    "/blog",
    "/topics",
    "/blockchains",
    "/tools",
    "/charts",
    "/glossary",
    "/about",
    "/editorial-policy",
    "/privacy-policy",
    "/terms-of-service",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/${post.slug}`),
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: post.cleanupStatus === "preserve" ? 0.8 : 0.4,
    })),
    ...topics.map((topic) => ({
      url: absoluteUrl(`/topics/${topic.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blockchains.map((blockchain) => ({
      url: absoluteUrl(`/blockchains/${blockchain.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...tools.map((tool) => ({
      url: absoluteUrl(tool.href),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
