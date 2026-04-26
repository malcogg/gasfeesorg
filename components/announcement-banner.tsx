import Link from "next/link";

export function AnnouncementBanner() {
  return (
    <div className="border-b border-accent/20 bg-accent-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-3 text-sm text-accent-strong sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold">GasFees.org just got redesigned.</span> We are reconnecting legacy media and polishing migrated guides.
        </p>
        <Link href="/blog" className="font-semibold underline underline-offset-4">
          Explore the new guides
        </Link>
      </div>
    </div>
  );
}
