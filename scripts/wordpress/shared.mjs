import { mkdir, writeFile } from "node:fs/promises";

export const WP_BASE = process.env.WORDPRESS_API_BASE ?? "https://gasfees.org/wp-json/wp/v2";
export const OUT_DIR = process.env.WORDPRESS_IMPORT_DIR ?? "docs/migration/import";

export async function fetchJson(path) {
  const response = await fetch(`${WP_BASE}${path}`, {
    headers: {
      "user-agent": "GasFeesNextMigration/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`WordPress API request failed ${response.status}: ${path}`);
  }

  return {
    data: await response.json(),
    total: Number(response.headers.get("x-wp-total") ?? 0),
    pages: Number(response.headers.get("x-wp-totalpages") ?? 1),
  };
}

export async function fetchAll(resource, fields) {
  const first = await fetchJson(`/${resource}?per_page=100&page=1&_fields=${fields}`);
  const rest = [];

  for (let page = 2; page <= first.pages; page += 1) {
    rest.push(fetchJson(`/${resource}?per_page=100&page=${page}&_fields=${fields}`));
  }

  const pages = await Promise.all(rest);
  return [first.data, ...pages.map((page) => page.data)].flat();
}

export function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function wordCount(html = "") {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

export function classifyRecord(record) {
  if (record.wordCount === 0) return "cleanup";
  if (record.wordCount < 600) return "consolidate";
  if (/price prediction|how do i buy/i.test(record.title)) return "noindex";
  return "preserve";
}

export async function writeJson(path, data) {
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(`${OUT_DIR}/${path}`, `${JSON.stringify(data, null, 2)}\n`);
}
