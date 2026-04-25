import { z } from "zod";

export const contentStatusSchema = z.enum(["preserve", "consolidate", "noindex", "cleanup"]);

export const postSchema = z.object({
  sourceId: z.number().optional(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  body: z.array(z.string()).default([]),
  html: z.string().default(""),
  image: z
    .object({
      src: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  author: z.string(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  cleanupStatus: contentStatusSchema.default("preserve"),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonical: z.string().optional(),
    })
    .default({}),
});

export const topicSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  intent: z.string(),
  featuredSlugs: z.array(z.string()).default([]),
});

export const blockchainSchema = z.object({
  slug: z.string(),
  name: z.string(),
  ticker: z.string().optional(),
  chainType: z.string(),
  feeModel: z.string(),
  summary: z.string(),
  featuredSlugs: z.array(z.string()).default([]),
});

export const toolSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["live", "planned", "beta"]),
  href: z.string(),
});

export const redirectSchema = z.object({
  source: z.string(),
  destination: z.string(),
  permanent: z.boolean().default(true),
  reason: z.string(),
});

export type Post = z.infer<typeof postSchema>;
export type Topic = z.infer<typeof topicSchema>;
export type Blockchain = z.infer<typeof blockchainSchema>;
export type Tool = z.infer<typeof toolSchema>;
export type RedirectRule = z.infer<typeof redirectSchema>;
