# Content Audit Classification

This document operationalizes the migration plan without replacing it. It is the working content QA surface for the WordPress-to-Next.js rebuild.

## Preserve

Preserve root slugs for strong informational posts and utility pages that already match search intent:

- `/what-are-ethereum-gas-fees/`
- `/understanding-eth-gas-fees-a-technical-overview/`
- `/gwei-tracking-guide/`
- `/what-are-aptos-gas-fees/`
- `/cheapest-crypto-to-transfer/`
- `/ways-to-reduce-your-gas-fees-when-trading-crypto/`
- `/glossary/`
- `/about-us/`
- `/terms-of-service/`

## Consolidate

Consolidate noisy archives and broad posts into stronger topic or blockchain pages:

- `/category/gas-fees/` -> `/topics/gas-fees`
- `/category/ethereum/` -> `/topics/ethereum-gas`
- `/tag/blockchain/` -> `/blockchains`
- Broad mega-posts such as `/the-galactic-guide-to-top-100-public-blockchains/` should feed `content/blockchains.ts`.

## Noindex Or Review Before Promotion

Keep accessible during migration but avoid prominent internal links until reviewed:

- Price prediction pages.
- “How do I buy” pages.
- Thin chain pages with fewer than 600 words.
- Old tag archives with one or zero posts.

## Cleanup

Flag empty or broken WordPress records in migration reports:

- `how-gas-fees-affect-your-crypto-investments`
- `real-time-gas-fee-trackers-do-you-need-one`
- `simple-strategies-for-predicting-gas-fee-spikes`
- `comparing-gas-fees-ethereum-vs-binance-smart-chain`
- `why-gas-fees-matter-a-beginners-guide`

The import script writes `docs/migration/import/validation-report.json` and `qa-report.json` to keep this list current after each migration run.
