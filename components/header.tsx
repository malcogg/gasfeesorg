import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b border-line/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-[0.28em] uppercase">
          GasFees
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/search"
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent-strong"
        >
          Search
        </Link>
      </div>
    </header>
  );
}
