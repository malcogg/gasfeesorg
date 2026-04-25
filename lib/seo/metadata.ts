import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedAt,
  updatedAt,
}: PageMeta): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type,
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
