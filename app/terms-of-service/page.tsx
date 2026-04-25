import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of service placeholder for the GasFees.org rebuild.",
  path: "/terms-of-service",
});

export default function TermsPage() {
  return (
    <PageShell className="max-w-4xl">
      <SectionHeader eyebrow="Legal" title="Terms of service" />
      <div className="content-flow mt-10">
        <p>
          This page preserves the legal route needed for launch. Replace this placeholder with the current
          WordPress terms and review affiliate, liability, and informational-only disclaimers before cutover.
        </p>
      </div>
    </PageShell>
  );
}
