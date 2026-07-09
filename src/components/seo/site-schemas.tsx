import { JsonLd } from "@/components/seo/json-ld";
import { DEFAULT_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/seo";

const base = siteUrl();

/** Site-wide structured data for the Black Squid company hub. */
export function SiteSchemas() {
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: base,
          description: DEFAULT_DESCRIPTION,
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: base,
          description: DEFAULT_DESCRIPTION,
        },
      ]}
    />
  );
}

type FaqEntry = { q: string; a: string };

export function FaqSchema({ entries }: { entries: FaqEntry[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entries.map((entry) => ({
          "@type": "Question",
          name: entry.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.a,
          },
        })),
      }}
    />
  );
}
