import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy placeholder for the GasFees.org rebuild.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PageShell className="max-w-4xl">
      <SectionHeader eyebrow="Legal" title="Privacy policy" />
      <div className="content-flow mt-10">
        <p>
          This page is a migration-ready placeholder. Before launch, replace it with the current legal policy
          from WordPress and review analytics, affiliate, and cookie disclosures.
        </p>
      </div>
    </PageShell>
  );
}
