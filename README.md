# GasFees.org

Search-first Next.js rebuild of GasFees.org, designed for Vercel, v0.dev, WordPress content migration, and SEO-safe domain cutover.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` contains App Router page templates, metadata routes, and SEO surfaces.
- `components/` contains reusable UI primitives for the editorial/product experience.
- `content/` contains seed content for posts, topics, blockchains, tools, and redirects.
- `lib/content/` contains typed content schemas and loaders.
- `lib/seo/` contains metadata and JSON-LD helpers.
- `scripts/wordpress/` contains the WordPress import and validation pipeline.
- `docs/migration/` contains audit, launch, and migration planning docs.

## Migration Scripts

```bash
npm run wp:import
npm run wp:validate
```

The import script writes generated reports to `docs/migration/import/`. Review cleanup and noindex candidates before promoting imported posts.

## Vercel / v0

Use the default Vercel Next.js settings:

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: default

Once connected to GitHub, v0 can use the repo as the implementation target for page and component iterations.
