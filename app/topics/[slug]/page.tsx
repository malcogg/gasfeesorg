import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { getTopic, postsForTopic, topics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return buildMetadata({
    title: topic.name,
    description: topic.description,
    path: `/topics/${topic.slug}`,
  });
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  const relatedPosts = postsForTopic(topic.slug);

  return (
    <PageShell>
      <JsonLd data={breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Topics", href: "/topics" }, { name: topic.name, href: `/topics/${topic.slug}` }])} />
      <JsonLd
        data={faqSchema([
          { question: `What is ${topic.name}?`, answer: topic.description },
          { question: "Why does this topic matter?", answer: topic.intent },
        ])}
      />
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">Topic</p>
      <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight">{topic.name}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{topic.intent}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <ContentCard key={post.slug} eyebrow="Guide" title={post.title} excerpt={post.excerpt} href={`/${post.slug}`} />
        ))}
      </div>
    </PageShell>
  );
}
