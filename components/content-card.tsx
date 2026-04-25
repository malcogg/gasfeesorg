import Link from "next/link";

export function ContentCard({
  eyebrow,
  title,
  excerpt,
  href,
  image,
}: {
  eyebrow: string;
  title: string;
  excerpt: string;
  href: string;
  image?: {
    src: string;
    alt?: string;
  };
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-3xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-accent hover:shadow-sm"
    >
      {image ? (
        // Imported WordPress images remain remote until the media migration is finalized.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt ?? ""} className="aspect-[16/9] w-full object-cover" loading="lazy" />
      ) : null}
      <div className="p-6">
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">{eyebrow}</p>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground group-hover:text-accent-strong">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">{excerpt}</p>
      </div>
    </Link>
  );
}
