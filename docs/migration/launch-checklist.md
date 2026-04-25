# Launch Checklist

## Vercel And v0

- Import `malcogg/gasfeesorg` in Vercel.
- Framework preset: Next.js.
- Build command: `npm run build`.
- Install command: `npm install`.
- Output directory: default Next.js output.
- Use v0.dev against the GitHub repo once the first app scaffold commit is pushed.

## Domain Cutover

- Keep WordPress available at `https://old.gasfees.org`.
- Point `https://gasfees.org` and `https://www.gasfees.org` to Vercel.
- Confirm `old.gasfees.org` sends `X-Robots-Tag: noindex, nofollow`.
- Do not block `old.gasfees.org` in robots.txt until search engines can crawl and see noindex.

## SEO QA

- Crawl redirect candidates.
- Confirm canonical URLs point to `https://gasfees.org`.
- Validate `sitemap.xml` and `robots.txt`.
- Validate Article, WebSite SearchAction, BreadcrumbList, FAQPage, and tool schema where present.
- Submit the new sitemap in Google Search Console and Bing Webmaster Tools.

## Content QA

- Run `npm run wp:import`.
- Run `npm run wp:validate`.
- Review empty body, thin body, missing description, and noindex candidates before launch.
- Preserve root post slugs unless a redirect has a clear SEO or UX benefit.
