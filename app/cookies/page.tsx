import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/schemas';

export const metadata = {
  title: 'Cookie Policy | Calcshark',
  description:
    'How Calcshark uses cookies, browser local storage, and analytics, what each type does, and how you can manage or disable them.',
  alternates: {
    canonical: 'https://calcshark.com/cookies/',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Cookie Policy', url: '/cookies/' },
]);

const faqs = [
  {
    q: 'Does Calcshark require cookies to work?',
    a: 'No. The calculators run without cookies. We use cookies and local storage only to remember preferences like your theme and to measure aggregate usage. You can disable them and still use the tools.',
  },
  {
    q: 'Do you use advertising cookies?',
    a: 'We use cookies primarily for essential functionality and privacy-respecting analytics. We do not sell your personal information.',
  },
  {
    q: 'How do I delete cookies set by Calcshark?',
    a: 'Clear your browsing data or delete site data for calcshark.com in your browser settings. This also clears local storage such as saved calculators and theme preference.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Cookies</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: June 27, 2026</p>

          <p className="text-muted-foreground mb-6">
            This Cookie Policy explains how Calcshark uses cookies and similar technologies, such as
            browser local storage, on calcshark.com. It should be read alongside our{' '}
            <Link href="/privacy/" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">What are cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files stored by your browser when you visit a website. They
                help sites remember your settings and understand how the site is used. We also use
                "local storage", a related browser technology, to keep your preferences on your
                device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Types of cookies we use</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Essential:</span>{' '}
                  Needed for the site to function and stay secure, such as protecting against abuse.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Preferences:</span>{' '}
                  Remember choices like light or dark theme and any calculators you save. These are
                  stored in your browser's local storage, not on our servers.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Analytics:</span>{' '}
                  Help us measure aggregate usage and performance so we can improve the calculators.
                  This data is privacy-respecting and not used to identify you personally.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">How we use cookies</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Remember your theme and saved-calculator preferences</li>
                <li>Measure site performance and which tools are most useful</li>
                <li>Keep the site secure and protect it from abuse</li>
              </ul>
            </section>

            <section className="bg-muted/30 border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Managing cookies</h2>
              <p className="text-muted-foreground">
                You can control or delete cookies and local storage through your browser settings.
                Most browsers let you block cookies, clear stored data, or browse privately.
                Disabling cookies will not stop the calculators from working, but it may reset your
                preferences each visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
                    <p className="text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Contact</h2>
              <p className="text-muted-foreground">
                Questions about cookies? Email{' '}
                <a href="mailto:contact@calcshark.com" className="text-primary hover:underline">contact@calcshark.com</a>{' '}
                or use our{' '}
                <Link href="/contact/" className="text-primary hover:underline">contact page</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
