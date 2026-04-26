---
title: "feat: Harden SEO schema and indexing signals"
type: feat
status: active
date: 2026-04-25
---

# feat: Harden SEO schema and indexing signals

## Overview

GasFees.org already has a solid baseline: canonical metadata, sitemap, robots, WebSite schema, Organization schema, Article schema, BreadcrumbList schema, and Pagefind search. This plan upgrades that baseline into a more complete SEO system that protects the WordPress migration, improves crawler clarity, and prepares content for both traditional search results and AI answer surfaces.

---

## Problem Frame

The site is newly migrated and live, so the immediate SEO risk is not lack of content but weak or inconsistent signals: migrated posts may have thin or duplicated metadata, placeholders should not accidentally become article images, old WordPress URLs need stronger redirect coverage, and topic/tool pages need schema that matches their actual page intent.

---

## Requirements Trace

- R1. Preserve ranking equity from migrated WordPress posts and changed URLs.
- R2. Ensure every indexable page has a unique title, description, canonical URL, and sitemap entry.
- R3. Expand schema by page type without adding misleading markup.
- R4. Keep `old.gasfees.org` accessible for reference but excluded from search competition.
- R5. Add validation so SEO regressions are caught before deploy.

---

## Scope Boundaries

- This plan does not rewrite article content quality or author credentials beyond the schema/data needed to represent them.
- This plan does not replace Search Console, analytics, or rank tracking; it prepares the site to be measured there.
- This plan does not add spammy FAQ schema to every page. FAQ schema should only be used where visible Q&A content exists.

---

## Context & Research

### Relevant Code and Patterns

- `lib/seo/schema.ts` currently defines `websiteSchema`, `organizationSchema`, `articleSchema`, `breadcrumbSchema`, and `faqSchema`.
- `lib/seo/metadata.ts` centralizes canonical, Open Graph, and Twitter metadata.
- `app/sitemap.ts` generates indexable routes from posts, topics, blockchains, tools, and static pages.
- `app/robots.ts` allows the main site and points crawlers to `/sitemap.xml`.
- `next.config.ts` contains redirect and `old.gasfees.org` noindex header behavior.
- `app/[slug]/page.tsx` renders article schema and breadcrumbs for migrated posts.

### External References

- Google Article structured data guidance supports JSON-LD with headline, image, author, publisher, publication date, and modification date.
- Google Breadcrumb structured data expects ordered `BreadcrumbList` items matching page navigation.
- FAQ rich results are limited in Google search, but FAQPage remains useful when the page has visible, user-facing Q&A content.

---

## Key Technical Decisions

- Use `BlogPosting` or `Article` only on article pages; use `CollectionPage` for topic/blog indexes, `WebApplication` or `SoftwareApplication` for calculators/tools, and `Dataset`/`DataFeed` only once tracker data is real.
- Do not mark placeholder images as article images. Article image schema should be omitted until real, stable media is available.
- Generate canonical URLs from `siteConfig.url` and route paths only; avoid carrying old WordPress canonical values unless they intentionally point to the new site.
- Keep `old.gasfees.org` noindexed at the HTTP header layer and avoid linking to it except for temporary media references.

---

## Implementation Units

- [ ] U1. **Schema helper expansion**

**Goal:** Add page-type schema helpers for `CollectionPage`, `WebApplication`, `SoftwareApplication`, `ItemList`, and richer publisher identity.

**Requirements:** R2, R3

**Dependencies:** None

**Files:**
- Modify: `lib/seo/schema.ts`
- Modify: `lib/site.ts`
- Test: `lib/seo/schema.test.ts`

**Approach:**
- Add stable organization fields such as logo URL and sameAs links once available.
- Add list schemas for blog/topic/blockchain index pages using visible page content.
- Add calculator/tool schema only for actual user-facing tools.

**Test scenarios:**
- Happy path: article schema includes required dates, headline, author, publisher, and main entity URL.
- Edge case: article without a trusted image omits image fields rather than using a placeholder.
- Integration: topic and blog pages emit valid `CollectionPage`/`ItemList` JSON-LD with absolute URLs.

**Verification:**
- JSON-LD validates in Google Rich Results Test or Schema Markup Validator for representative pages.

- [ ] U2. **Metadata quality audit**

**Goal:** Detect duplicate, missing, too-short, or too-long SEO titles/descriptions across migrated posts and landing pages.

**Requirements:** R1, R2, R5

**Dependencies:** None

**Files:**
- Create: `scripts/seo/audit-metadata.mjs`
- Create: `docs/migration/import/seo-audit-report.json`
- Modify: `package.json`

**Approach:**
- Reuse the existing content loader data.
- Flag duplicate titles, duplicate descriptions, empty descriptions, weak excerpts, noindex candidates, and canonical mismatches.
- Add an npm script such as `seo:audit`.

**Test scenarios:**
- Happy path: valid posts pass with no blocking warnings.
- Edge case: duplicate imported SEO descriptions are grouped together in the report.
- Error path: malformed canonical URLs are reported with the affected slug.

**Verification:**
- The report identifies actionable SEO cleanup without failing normal builds.

- [ ] U3. **Redirect coverage hardening**

**Goal:** Convert import redirect candidates into complete Vercel/Next redirect rules for high-value changed URLs.

**Requirements:** R1, R4

**Dependencies:** U2

**Files:**
- Modify: `content/redirects.ts`
- Modify: `next.config.ts`
- Test: `scripts/seo/audit-redirects.mjs`

**Approach:**
- Compare imported WordPress slugs, pages, category URLs, and tag URLs against new routes.
- Preserve same-slug article URLs without redirects.
- Add explicit redirects for renamed tools, charts, categories, and tags.

**Test scenarios:**
- Happy path: changed WordPress URL maps to a 301 destination on the new site.
- Edge case: same-slug post does not create a redundant redirect.
- Error path: redirect destination that does not exist is flagged.

**Verification:**
- A sampled redirect crawl returns 301 to `https://gasfees.org/...` and then 200.

- [ ] U4. **Indexability and sitemap controls**

**Goal:** Ensure only useful pages are indexed and sitemap priorities reflect current content quality.

**Requirements:** R1, R2, R4, R5

**Dependencies:** U2

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `app/[slug]/page.tsx`
- Test: `app/sitemap.test.ts`

**Approach:**
- Exclude or lower-priority posts marked `noindex` or `cleanup`.
- Add per-page metadata robots controls where content should stay available but not indexed.
- Keep generated search assets and internal docs disallowed.

**Test scenarios:**
- Happy path: preserve posts appear in sitemap with article last-modified dates.
- Edge case: noindex/cleanup content is omitted or marked appropriately.
- Integration: robots points to the canonical sitemap URL and does not block important public sections.

**Verification:**
- `/sitemap.xml` contains only intended canonical URLs and `/robots.txt` remains crawler-friendly.

---

## Risks & Dependencies

- **Risk:** Placeholder images accidentally become SEO images. **Mitigation:** omit article image schema until trusted media migration is complete.
- **Risk:** Overusing FAQ schema creates misleading structured data. **Mitigation:** only emit FAQ schema from visible FAQ sections.
- **Risk:** Redirect gaps lose WordPress ranking equity. **Mitigation:** generate redirect audits from imported source URLs and sample crawl them before launch changes.

---

## Documentation / Operational Notes

- Add Search Console verification and submit `/sitemap.xml` after deployment.
- Track 404s, redirected URLs, indexed pages, and top landing pages for the first 2-4 weeks after each migration cleanup pass.
- Keep the SEO audit report in `docs/migration/import/` as a working artifact until content cleanup stabilizes.
