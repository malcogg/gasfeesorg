import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { JsonLd } from "@/components/json-ld";
import { SearchBox } from "@/components/search-box";
import { SectionHeader } from "@/components/section-header";
import { blockchains, posts, topics, tools } from "@/lib/content";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

export default function Home() {
  const featuredPosts = posts.slice(0, 3);
  const featuredChains = blockchains.slice(0, 6);

  return (
    <>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={organizationSchema()} />
      <section className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="font-mono text-xs font-semibold tracking-[0.32em] text-accent-strong uppercase">
          Gas fee research, without the noise
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-foreground md:text-7xl">
          Search crypto gas fees before you spend them.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Clear guides, chain explainers, calculators, and tracker pages for understanding transaction
          costs across major blockchains.
        </p>
        <div className="mt-10 w-full">
          <SearchBox large />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Ethereum", "Aptos", "Base", "Arbitrum", "Cheapest transfers", "Reduce gas fees"].map((chip) => (
            <Link
              key={chip}
              href={`/search?q=${encodeURIComponent(chip)}`}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-accent-strong"
            >
              {chip}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3">
          {tools.map((tool) => (
            <ContentCard key={tool.slug} eyebrow={tool.status} title={tool.name} excerpt={tool.description} href={tool.href} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeader
          eyebrow="Featured guides"
          title="Start with the pages that answer real transaction questions."
          description="The new information architecture favors search, reading, and internal discovery over noisy archive pages."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <ContentCard
              key={post.slug}
              eyebrow={post.categories[0] ?? "Guide"}
              title={post.title}
              excerpt={post.excerpt}
              href={`/${post.slug}`}
              image={post.image}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <SectionHeader eyebrow="Blockchains" title="Compare gas fee models by chain." />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredChains.map((chain) => (
            <Link
              key={chain.slug}
              href={`/blockchains/${chain.slug}`}
              className="rounded-2xl border border-line bg-surface-alt p-5 transition hover:border-accent"
            >
              <p className="font-semibold">{chain.name}</p>
              <p className="mt-2 text-sm text-muted">{chain.feeModel}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Link key={topic.slug} href={`/topics/${topic.slug}`} className="text-sm font-medium text-accent-strong underline">
              {topic.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
