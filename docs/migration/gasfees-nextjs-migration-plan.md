# GasFees.org Next.js Migration Plan

## Current Site Audit

Sources reviewed: [homepage](https://gasfees.org/), [robots.txt](https://gasfees.org/robots.txt), [sitemap index](https://gasfees.org/sitemap.html), WordPress REST endpoints for posts, pages, categories, tags, and sampled URLs including [Ethereum gas fees](https://gasfees.org/what-are-ethereum-gas-fees/), [Gas Fees category](https://gasfees.org/category/gas-fees/), [Aptos calculator](https://gasfees.org/aptos-gas-fees-calculator-advanced/), and [Gas tracker chart](https://gasfees.org/gas-fees-chart/).

The site currently has 114 posts, 13 pages, 89 categories, and 417 tags. The strongest content pattern is blockchain-specific explainers, especially `what-are-*-gas-fees` posts. There are also guide posts, tracker/tool posts, Ethereum education posts, a glossary, an Aptos calculator page, a beta gas chart page, affiliate disclosure blocks, and trust/legal pages. The current homepage is already search-oriented in intent but visually cluttered, link-heavy, and inconsistent in information hierarchy.

Key weaknesses to address:
- The primary `https://gasfees.org/sitemap.xml` returns a 500, while `sitemap.html`, `post-sitemap.html`, and `page-sitemap.html` work.
- Several posts have zero or very thin rendered content, including some 2024 guide posts. These should be flagged for manual cleanup or consolidation before being promoted heavily.
- Taxonomy is noisy: duplicate umbrella categories such as `Gas Fees` and `GasFees`, dozens of one-post chain categories, and hundreds of low-value tags.
- Some pages are thin or stale: `gas-fees-chart`, `books-%f0%9f%93%9a`, `subscribe`, `new-home`, `gasfees-org`, and duplicate homepage-like pages.
- Some posts are likely off-core or risky for SEO trust, such as price prediction and "how do I buy" articles.
- Category and tag archive pages are mostly weak SEO surfaces today and should not all be recreated as indexable pages.

High-value URL preservation strategy:
- Preserve all existing post slugs at the root path initially, e.g. `/what-are-ethereum-gas-fees/`, to avoid unnecessary redirect churn.
- Preserve strong utility pages where useful, e.g. `/glossary/`, `/gas-fees-chart/`, `/aptos-gas-fees-calculator-advanced/`, `/about-us/`, `/terms-of-service/`.
- Rebuild weak archives as clean `/topics/[slug]/` and `/blockchains/[slug]/` surfaces, then selectively redirect old `/category/*` pages only where there is a strong mapped equivalent.
- Do not recreate all `/tag/*` pages as indexable pages; most should redirect to stronger topics or return noindex if kept temporarily.

## Proposed Sitemap / IA

Keep the top-level experience simple:
- `/` Search-first homepage
- `/search` Search results
- `/blog` Editorial index
- `/[post-slug]` Legacy-compatible blog post route for migrated WordPress posts
- `/topics` Topic index
- `/topics/[slug]` Curated topic pages such as Ethereum gas, reducing fees, DeFi/NFT fees, trackers, Layer 2, rollups
- `/blockchains` Blockchain index
- `/blockchains/[slug]` Chain detail pages such as Ethereum, Solana, Polygon, Arbitrum, Base, Aptos, Bitcoin, Tron
- `/tools` Tools index
- `/tools/aptos-gas-fee-calculator` Preferred new calculator URL, with redirect from the current Aptos calculator page if desired
- `/charts` Tracker/chart hub, with redirect from `/gas-fees-chart/` if the new page changes URL
- `/glossary`
- `/about`
- `/editorial-policy`
- `/privacy-policy`
- `/terms-of-service`

Recommended main nav:
- Search
- Blog
- Blockchains
- Topics
- Tools
- Charts
- About

## Page Template Inventory

Needed templates:
- Homepage search gateway
- Search results page
- Blog index with filtering and featured editorial sections
- Blog post detail page preserving imported HTML/MDX content
- Topic index and topic detail pages
- Blockchain index and blockchain detail pages
- Tool/calculator page template
- Chart/tracker page template
- Glossary page
- About/editorial trust page
- Legal/static page template
- Redirect and not-found handling for old WordPress routes

Recommended content model:
- `Post`: source ID, slug, title, excerpt, body, dates, author, categories, tags, featured image, SEO title/description, canonical, old URL, cleanup flags.
- `Topic`: slug, name, description, related posts, related chains, SEO metadata, indexability.
- `Blockchain`: slug, name, ticker, chain type, fee model, native token, related posts, calculators, external references, structured data.
- `Tool`: slug, name, description, inputs, outputs, methodology, related content, schema.
- `Redirect`: source, destination, status, reason, validation status.

## Wireframes / Component Maps

Homepage:
- Minimal header with wordmark and compact nav.
- Centered brand mark, one-line value proposition, and large search bar above the fold.
- Popular chips: Ethereum, Solana, Base, Arbitrum, Aptos, cheapest transfers, reduce gas fees.
- Below fold: featured guides, trending blockchains, tools/charts, latest research.
- CTA strategy: search first, secondary CTAs to popular chains and tools.
- Schema: WebSite with SearchAction, Organization.
- Mobile: search remains primary, chips wrap into horizontal scroll.

Blog index:
- Editorial headline and short positioning copy.
- Featured guide row, latest posts list, topic filters, blockchain filters.
- Internal links to top topics and blockchain pages.
- Schema: CollectionPage, BreadcrumbList.
- Mobile: single-column cards with sticky filter affordance only if needed.

Blog article:
- Clean article header with title, excerpt, updated date, author/trust block, reading time, breadcrumbs.
- Article body with strong typography, table of contents for long posts, inline related links, FAQ block when present.
- End modules: related posts, related blockchain, tool/chart CTA, disclosure.
- Schema: Article, BreadcrumbList, FAQPage where useful.
- Mobile: wide readable line length, collapsible TOC, no intrusive affiliate blocks.

Topic page:
- Topic definition and user intent summary.
- Best guides, latest posts, related chains, FAQs.
- Schema: CollectionPage, BreadcrumbList, FAQPage where editorially valid.
- Mobile: filters collapse below summary.

Blockchain detail page:
- Chain summary: what fees are paid in, typical fee model, user actions affected.
- Related gas fee guide, related tools, latest posts, external official docs.
- CTA strategy: read guide, compare fees, use calculator if available.
- Schema: WebPage, BreadcrumbList, FAQPage where supported.

Calculator/tool page:
- Tool title, explanation, calculator UI, assumptions/methodology, example calculation, related guides.
- Schema: SoftwareApplication or WebApplication where appropriate, BreadcrumbList, FAQPage.
- Mobile: inputs stacked, output sticky or immediately below form.

Search results:
- Search input at top, instant suggestions if index supports it, grouped results by posts/topics/chains/tools.
- Relevance signals: title, excerpt, body, topic, chain, date freshness.
- CTA strategy: refine query chips and direct links to high-value hubs.
- Schema: SearchResultsPage where appropriate.

## Technical Stack Recommendation

Use Next.js latest stable App Router with TypeScript, Tailwind CSS, Vercel, and static-first rendering. Current public docs show active Next.js 16 App Router support and metadata routes for sitemap/robots generation: [Next.js App Router docs](https://nextjs.org/docs/app/guides), [Next.js sitemap docs](https://nextjs.org/docs/advanced-features/sitemap-generation), [Next.js robots docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

Recommended libraries and systems:
- Next.js App Router, TypeScript, Tailwind CSS.
- MDX/content files for imported and edited articles in v1.
- Zod schemas for content validation.
- `rehype-sanitize`, `rehype-slug`, `remark-gfm`, and related transform utilities for WordPress HTML/MDX cleanup.
- Pagefind for v1 static search because it is simple, fast, Vercel-friendly, and avoids external search infrastructure. See [Pagefind docs](https://pagefind.app/docs).
- Optional later upgrade to Algolia/Meilisearch if analytics show advanced faceting, typo tolerance, or frequent publishing without full rebuilds is needed.
- Vercel Analytics or Plausible-style analytics hooks, plus Search Console/Bing Webmaster validation.

Suggested repo structure after scaffolding:
- `app/` routes, layouts, metadata routes, and page templates.
- `components/` reusable UI and content modules.
- `content/` imported posts, curated topics, blockchains, and tools.
- `lib/content/` loaders, validation, search indexing helpers.
- `lib/seo/` metadata, schema, canonical helpers.
- `scripts/wordpress/` import, transform, validate, redirect generation.
- `public/` static assets and migrated images where appropriate.
- `docs/migration/` audit outputs, redirect reports, cleanup reports.

## WordPress Content Migration Plan

Use WordPress REST API endpoints for posts, pages, categories, tags, media, and Yoast SEO metadata. Yoast exposes `yoast_head` and `yoast_head_json` through REST responses, which can preserve SEO title, description, canonical, Open Graph, Twitter metadata, and schema clues. Reference: [WordPress Posts REST API](https://developer.wordpress.org/rest-api/reference/posts), [WordPress Categories REST API](https://developer.wordpress.org/rest-api/reference/categories), [Yoast REST API](https://yoast.com/developer-blog/yoast-seo-rest-api-endpoint).

Migration pipeline:
- Pull all posts and pages with `id`, `slug`, `link`, `date`, `modified`, `title`, `excerpt`, `content`, author, categories, tags, featured media, and Yoast metadata.
- Download or proxy featured images only after auditing image rights, sizes, and hotlink assumptions.
- Sanitize WordPress HTML and transform to MDX or typed content records.
- Preserve headings, lists, internal links, images, embeds where reasonable.
- Rewrite internal links from old WordPress URLs to new canonical URLs.
- Generate a redirect map from every old URL to its preserved or new destination.
- Generate a validation report with word counts, missing bodies, missing titles/descriptions, broken internal links, broken images, missing featured images, and posts flagged for manual cleanup.

Manual cleanup candidates from audit:
- Zero-content posts: `how-gas-fees-affect-your-crypto-investments`, `real-time-gas-fee-trackers-do-you-need-one`, `simple-strategies-for-predicting-gas-fee-spikes`, `comparing-gas-fees-ethereum-vs-binance-smart-chain`, `why-gas-fees-matter-a-beginners-guide`.
- Thin or off-core posts: `what-is-kadena-gas-fees`, `how-to-add-acala-blockchain-to-metamask`, `aptos-blockchain`, `what-is-the-price-of-pulsechain`, `how-do-i-buy-pulsechain`, `what-is-the-price-prediction-for-acala-in-2024-2025`.
- Thin pages: `gas-fees-chart`, `books-%f0%9f%93%9a`, `subscribe`, `new-home`, `ethereum-blockchain`, `about-us`.

## Search Recommendation

Use Pagefind for v1:
- It indexes generated static HTML after build.
- It works well on Vercel with no hosted service.
- It supports fast client-side search across title, excerpt, body, and metadata.
- It is low maintenance for roughly 120 posts and future editorial growth.

Implementation shape:
- Mark searchable regions in templates with `data-pagefind-body` and metadata attributes.
- Generate weighted metadata for title, topic, blockchain, excerpt, and updated date.
- Build `/search` with an accessible search input, URL query state, highlighted results, and grouped suggestions.
- Add homepage autocomplete only after core search is working; keep the first release dependable.

Escalation path:
- Move to Algolia if you need hosted analytics, typo tolerance, ranking controls, and instant autocomplete at larger scale.
- Move to Postgres full-text only if content becomes database-backed and publishing happens without static rebuilds.

## SEO Migration Strategy

Technical SEO:
- Preserve root post slugs where possible.
- Generate metadata from imported Yoast values first, then normalize with site-wide patterns.
- Implement canonical helpers so every page emits one canonical URL on `https://gasfees.org`.
- Generate `sitemap.ts` and `robots.ts` through Next metadata routes.
- Generate structured data: WebSite/SearchAction, Organization, Article, BreadcrumbList, CollectionPage, FAQPage, and WebApplication/SoftwareApplication for tools where appropriate.
- Add breadcrumbs on posts, topics, chains, tools, and charts.
- Validate with Search Console, Rich Results Test, sitemap fetch, redirect crawl, and broken-link checks before launch.

Redirect strategy:
- No redirect needed for preserved root post slugs.
- Redirect `/blog/` to the new blog index only if it no longer resolves to homepage content.
- Redirect old category URLs to curated `/topics/*` or `/blockchains/*` equivalents when there is a strong one-to-one mapping.
- Redirect noisy tag URLs to stronger topic/blockchain pages when valuable; otherwise noindex or 410 only after reviewing traffic/backlinks.
- Redirect old pages whose URLs change, e.g. `/aptos-gas-fees-calculator-advanced/` to `/tools/aptos-gas-fee-calculator` only if the URL change is worth it.

Old WordPress subdomain handling:
- Move WordPress to `https://old.gasfees.org` for reference access.
- Add `X-Robots-Tag: noindex, nofollow` headers or page-level `noindex` on all old subdomain pages. Prefer headers so media/files can also be covered.
- Keep old pages accessible to humans; do not block crawling with `robots.txt` alone because blocked pages may remain indexed without seeing `noindex`.
- Add canonical tags from old pages to the matching new `https://gasfees.org` URLs where possible.
- Keep `old.gasfees.org` out of XML sitemaps.

## Vercel / v0 Readiness Notes

The immediate repo goal is to get a first commit pushed so Vercel and v0 can connect to `malcogg/gasfeesorg`. After this note lands, the next commit should scaffold a real Next.js app so Vercel can detect the framework, install dependencies, and produce a preview deployment.

Initial scaffolding should include:
- `package.json` with `dev`, `build`, `start`, and `lint` scripts.
- Next.js App Router with TypeScript and Tailwind CSS.
- A minimal homepage that reflects the approved search-first direction.
- A `README.md` with setup, Vercel, v0, and migration workflow notes.
- Placeholder folders for `content/`, `scripts/wordpress/`, `lib/seo/`, and `lib/content/`.

## Step-by-Step Build Roadmap

Phase 1: Project setup
- Scaffold Next.js App Router with TypeScript and Tailwind in the cloned GitHub repo.
- Add linting, formatting, base app shell, environment conventions, and Vercel-ready scripts.

Phase 2: Design system
- Build tokens, typography, layout primitives, buttons, cards, chips, inputs, article typography, and disclosure/trust components.
- Use v0.dev for mockup support, then translate selected patterns into maintainable local components.

Phase 3: Content model
- Define typed schemas for posts, topics, blockchains, tools, redirects, and SEO metadata.
- Add content loaders and validation utilities.

Phase 4: Migration scripts
- Implement WordPress import, transform, sanitize, link rewrite, image inventory, redirect generation, and validation report scripts.

Phase 5: Core page templates
- Build homepage, blog index, article, topic, blockchain, tool, chart, search, glossary, about, and legal templates.

Phase 6: Search
- Add Pagefind indexing, `/search`, homepage search entry, and result grouping.

Phase 7: SEO layer
- Add metadata helpers, schema helpers, canonical rules, breadcrumbs, sitemap, robots, and redirect config generation.

Phase 8: QA
- Validate imported content, redirects, search coverage, mobile layouts, accessibility, performance, structured data, and broken links.

Phase 9: Launch
- Configure Vercel project, environment, domain routing, WordPress move to `old.gasfees.org`, redirects, and Search Console resubmission.

Phase 10: Post-launch monitoring
- Monitor crawl errors, rankings, traffic, indexed pages, Core Web Vitals, search queries, and content cleanup backlog.
