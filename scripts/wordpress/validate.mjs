import { readFile, writeFile } from "node:fs/promises";
import { OUT_DIR } from "./shared.mjs";

async function readJson(name) {
  return JSON.parse(await readFile(`${OUT_DIR}/${name}`, "utf8"));
}

const [posts, pages, redirects] = await Promise.all([
  readJson("wordpress-posts.json"),
  readJson("wordpress-pages.json"),
  readJson("redirect-candidates.json"),
]);

const records = [...posts, ...pages];
const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    records: records.length,
    redirects: redirects.length,
    preserve: records.filter((record) => record.cleanupStatus === "preserve").length,
    consolidate: records.filter((record) => record.cleanupStatus === "consolidate").length,
    cleanup: records.filter((record) => record.cleanupStatus === "cleanup").length,
    noindex: records.filter((record) => record.cleanupStatus === "noindex").length,
  },
  issues: {
    missingTitle: records.filter((record) => !record.title).map((record) => record.oldUrl),
    missingDescription: records.filter((record) => !record.seo.description && !record.excerpt).map((record) => record.oldUrl),
    emptyBody: records.filter((record) => record.wordCount === 0).map((record) => record.oldUrl),
    thinBody: records.filter((record) => record.wordCount > 0 && record.wordCount < 600).map((record) => ({
      url: record.oldUrl,
      wordCount: record.wordCount,
    })),
  },
};

await writeFile(`${OUT_DIR}/qa-report.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Validation complete. ${report.issues.emptyBody.length} empty records flagged.`);
