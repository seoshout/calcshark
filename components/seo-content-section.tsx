import { SeoContentBlock } from '@/lib/seo-content';

// Renders SEO body content (intro + "why" + FAQ) on category and subcategory
// pages. Server component; uses native <details> for the FAQ accordion and
// emits FAQPage JSON-LD. Renders nothing when no content is provided.
export default function SeoContentSection({
  title,
  content,
}: {
  title: string;
  content?: SeoContentBlock;
}) {
  if (!content) return null;

  const faqSchema = content.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <section className="mt-16 max-w-4xl mx-auto space-y-8">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {content.intro?.length ? (
        <div className="bg-background border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
          <div className="space-y-4 text-muted-foreground">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      ) : null}

      {content.why?.length ? (
        <div className="bg-background border rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            {content.whyHeading || 'Why use these calculators'}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            {content.why.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      ) : null}

      {content.faqs?.length ? (
        <div className="bg-background border rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {content.faqs.map((f, i) => (
              <details key={i} className="group border-b border-border pb-4 last:border-0 last:pb-0">
                <summary className="flex justify-between items-center cursor-pointer text-foreground font-medium py-2">
                  {f.q}
                  <span className="ml-6 flex-shrink-0 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="mt-3 text-muted-foreground">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
