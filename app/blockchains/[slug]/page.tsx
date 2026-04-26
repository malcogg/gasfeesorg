import { notFound } from "next/navigation";
import { ContentCard } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { blockchains, getBlockchain, postsForBlockchain } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return blockchains.map((blockchain) => ({ slug: blockchain.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blockchain = getBlockchain(slug);
  if (!blockchain) return {};
  return buildMetadata({
    title: `${blockchain.name} Gas Fees`,
    description: blockchain.summary,
    path: `/blockchains/${blockchain.slug}`,
  });
}

export default async function BlockchainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blockchain = getBlockchain(slug);
  if (!blockchain) notFound();
  const relatedPosts = postsForBlockchain(blockchain.slug);

  return (
    <PageShell>
      <JsonLd data={breadcrumbSchema([{ name: "Home", href: "/" }, { name: "Blockchains", href: "/blockchains" }, { name: blockchain.name, href: `/blockchains/${blockchain.slug}` }])} />
      <JsonLd
        data={faqSchema([
          { question: `How are ${blockchain.name} gas fees paid?`, answer: blockchain.feeModel },
          { question: `What type of chain is ${blockchain.name}?`, answer: blockchain.chainType },
        ])}
      />
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">
        {blockchain.chainType}
      </p>
      <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight">{blockchain.name} gas fees</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{blockchain.summary}</p>
      <div className="mt-8 grid gap-4 rounded-3xl border border-line bg-surface p-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted">Ticker</p>
          <p className="mt-1 text-xl font-semibold">{blockchain.ticker ?? "Varies"}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Fee model</p>
          <p className="mt-1 text-sm font-medium">{blockchain.feeModel}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Primary CTA</p>
          <p className="mt-1 text-sm font-medium">Read guide, compare fees, then use tools.</p>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <ContentCard
            key={post.slug}
            eyebrow="Related guide"
            title={post.title}
            excerpt={post.excerpt}
            href={`/${post.slug}`}
            image={post.image}
          />
        ))}
      </div>
    </PageShell>
  );
}
