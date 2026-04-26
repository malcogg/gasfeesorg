import Link from "next/link";
import { ContentImage } from "@/components/content-image";

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
        <ContentImage
          src={image.src}
          alt={image.alt}
          title={title}
          eyebrow={eyebrow}
          className="w-full rounded-none border-0 object-cover"
        />
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
