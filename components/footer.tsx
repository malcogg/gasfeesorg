import Link from "next/link";

const links = [
  { href: "/editorial-policy", label: "Editorial policy" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-of-service", label: "Terms" },
  { href: "/sitemap.xml", label: "Sitemap" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="font-mono text-sm font-semibold tracking-[0.24em] uppercase">GasFees.org</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Clear gas fee education, blockchain cost research, calculators, and migration-safe editorial
            workflows.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-4 text-sm text-muted md:justify-end">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-line px-5 py-4 text-center text-xs text-muted">
        Disclaimer: GasFees.org is informational only and does not provide financial advice.
      </div>
    </footer>
  );
}
