import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/schemas';

export const metadata = {
  title: 'Privacy Policy | Calcshark',
  description:
    'How Calcshark handles your data: calculator inputs stay in your browser, the limited analytics we collect, your choices, and how to contact us.',
  alternates: {
    canonical: 'https://calcshark.com/privacy/',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Privacy Policy', url: '/privacy/' },
]);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Privacy</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: June 27, 2026</p>

          <p className="text-muted-foreground mb-6">
            Calcshark ("we", "us") respects your privacy. This policy explains what information we
            collect when you use calcshark.com, how we use it, and the choices you have. We have
            built Calcshark to be useful without requiring an account or collecting unnecessary
            personal data.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Calculator inputs stay in your browser</h2>
              <p className="text-muted-foreground">
                The numbers and values you type into our calculators are processed on your device.
                These calculations run in your browser, so your inputs are not transmitted to or
                stored on our servers. When you close or refresh the page, those values are gone
                unless you have explicitly chosen to save a calculator.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Information we collect</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Aggregated, privacy-respecting analytics about which pages are visited and how the site performs</li>
                <li>Standard technical information such as browser type, device type, and approximate region</li>
                <li>Preferences you set, such as light or dark theme and saved calculators, stored locally in your browser</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                We do not ask for your name, address, or payment details, because Calcshark is free
                and requires no account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">How we use information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Improve calculator accuracy, reliability, and performance</li>
                <li>Understand which tools are most useful so we can prioritize new ones</li>
                <li>Measure site uptime and diagnose technical issues</li>
                <li>Detect and prevent abuse, spam, and fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Cookies and local storage</h2>
              <p className="text-muted-foreground">
                We use cookies and your browser's local storage to remember preferences and measure
                usage. You can control or clear these at any time. For details, see our{' '}
                <Link href="/cookies/" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Third-party services</h2>
              <p className="text-muted-foreground">
                We may use trusted third-party providers for analytics and hosting. These providers
                process limited technical data on our behalf and are not permitted to use it for
                their own purposes beyond providing their service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Your choices</h2>
              <p className="text-muted-foreground">
                You can browse Calcshark without providing personal information. You can disable
                cookies in your browser settings, clear local storage to remove saved preferences,
                and opt out of analytics where your browser or an extension supports it.
              </p>
            </section>

            <section className="bg-muted/30 border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, email us at{' '}
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
