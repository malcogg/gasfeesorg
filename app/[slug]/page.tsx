import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { getPost, posts, postsForSlugs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo.title ?? post.title,
    description: post.seo.description ?? post.excerpt,
    path: `/${post.slug}`,
    type: "article",
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const relatedPosts = postsForSlugs(post.related).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-5 py-16" data-pagefind-body>
      <JsonLd data={articleSchema(post)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title, href: `/${post.slug}` }])} />
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">
        {post.categories.join(" / ")}
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">{post.title}</h1>
      <p className="mt-5 text-xl leading-8 text-muted">{post.excerpt}</p>
      <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
        <span>By {post.author}</span>
        <span>Updated {post.updatedAt}</span>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-accent-strong">{post.cleanupStatus}</span>
      </div>
      <div className="content-flow mt-10 border-y border-line py-10">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <aside className="mt-10 rounded-3xl border border-line bg-surface-alt p-6">
        <h2 className="text-xl font-semibold">Related reading</h2>
        <div className="mt-4 grid gap-3">
          {relatedPosts.length ? (
            relatedPosts.map((related) => (
              <Link key={related.slug} href={`/${related.slug}`} className="font-medium text-accent-strong underline">
                {related.title}
              </Link>
            ))
          ) : (
            <Link href="/blog" className="font-medium text-accent-strong underline">
              Browse all guides
            </Link>
          )}
        </div>
      </aside>
    </article>
  );
}
