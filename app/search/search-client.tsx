"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchBox } from "@/components/search-box";

export type SearchDocument = {
  type: string;
  title: string;
  excerpt: string;
  href: string;
  text: string;
};

export function SearchClient({
  documents,
  initialQuery,
}: {
  documents: SearchDocument[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents.slice(0, 8);
    return documents
      .map((document) => {
        const haystack = document.text.toLowerCase();
        const titleHit = document.title.toLowerCase().includes(q) ? 3 : 0;
        const excerptHit = document.excerpt.toLowerCase().includes(q) ? 2 : 0;
        const bodyHit = haystack.includes(q) ? 1 : 0;
        return { document, score: titleHit + excerptHit + bodyHit };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((result) => result.document);
  }, [documents, query]);

  return (
    <div>
      <div onChangeCapture={(event) => {
        const target = event.target as HTMLInputElement;
        if (target.id === "site-search") setQuery(target.value);
      }}>
        <SearchBox defaultValue={initialQuery} large />
      </div>
      <p className="mt-6 text-sm text-muted">
        {results.length} result{results.length === 1 ? "" : "s"} {query ? `for "${query}"` : "to explore"}
      </p>
      <div className="mt-8 divide-y divide-line rounded-3xl border border-line bg-surface">
        {results.map((result) => (
          <Link key={result.href} href={result.href} className="block p-6 transition hover:bg-surface-alt">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">
              {result.type}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{result.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{result.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
