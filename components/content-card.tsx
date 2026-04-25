import Link from "next/link";

export function ContentCard({
  eyebrow,
  title,
  excerpt,
  href,
}: {
  eyebrow: string;
  title: string;
  excerpt: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-sm"
    >
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">{eyebrow}</p>
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground group-hover:text-accent-strong">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">{excerpt}</p>
    </Link>
  );
}
