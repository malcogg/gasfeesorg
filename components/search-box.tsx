"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({
  defaultValue = "",
  large = false,
}: {
  defaultValue?: string;
  large?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={`mx-auto flex w-full items-center rounded-full border border-line bg-surface shadow-sm transition focus-within:border-accent ${
        large ? "max-w-3xl p-2" : "max-w-xl p-1.5"
      }`}
    >
      <label className="sr-only" htmlFor="site-search">
        Search GasFees.org
      </label>
      <input
        id="site-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search gas fees, chains, guides, tools..."
        className={`min-w-0 flex-1 bg-transparent px-5 text-foreground outline-none placeholder:text-muted ${
          large ? "h-14 text-lg" : "h-11 text-base"
        }`}
      />
      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong"
      >
        Search
      </button>
    </form>
  );
}
