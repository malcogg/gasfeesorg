"use client";

import { useState } from "react";

const unreliableImageHosts = ["old.gasfees.org", "media.go2speed.org"];

function shouldUsePlaceholder(src?: string) {
  if (!src) return true;

  try {
    const host = new URL(src).host;
    return unreliableImageHosts.some((unreliableHost) => host.includes(unreliableHost));
  } catch {
    return true;
  }
}

export function ContentImage({
  src,
  alt,
  title,
  eyebrow = "GasFees.org",
  className = "",
  priority = false,
}: {
  src?: string;
  alt?: string;
  title: string;
  eyebrow?: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const usePlaceholder = failed || shouldUsePlaceholder(src);

  if (!usePlaceholder && src) {
    return (
      // Imported WordPress images remain remote until the media migration is finalized.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`flex aspect-[16/9] flex-col justify-between overflow-hidden rounded-3xl border border-line bg-[linear-gradient(135deg,#fffaf0_0%,#dff3ef_55%,#f4efe7_100%)] p-6 ${className}`}
      role="img"
      aria-label={alt || `${title} placeholder image`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-surface/80 px-3 py-1 font-mono text-[0.65rem] font-semibold tracking-[0.18em] text-accent-strong uppercase">
          {eyebrow}
        </span>
        <span className="h-10 w-10 rounded-full border border-accent/30 bg-surface/70" />
      </div>
      <div>
        <p className="max-w-md text-2xl font-semibold tracking-tight text-accent-strong">{title}</p>
        <p className="mt-2 text-sm font-medium text-muted">Image update in progress</p>
      </div>
    </div>
  );
}
