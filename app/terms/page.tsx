import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/schemas';

export const metadata = {
  title: 'Terms of Service | Calcshark',
  description:
    'The terms for using Calcshark’s free online calculators, including acceptable use, accuracy disclaimers, and limitations of liability.',
  alternates: {
    canonical: 'https://calcshark.com/terms/',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Terms of Service', url: '/terms/' },
]);

export default function TermsPage() {
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
          <span className="text-foreground">Terms</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: June 27, 2026</p>

          <p className="text-muted-foreground mb-6">
            These Terms of Service ("Terms") govern your use of calcshark.com and the calculators
            and content provided on it. By accessing or using Calcshark, you agree to these Terms.
            If you do not agree, please do not use the site.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Use of our calculators</h2>
              <p className="text-muted-foreground">
                Calcshark provides free online calculators for informational and educational
                purposes only. Results are estimates based on the inputs you provide and the
                formulas we use, and they may not reflect your specific circumstances. Always verify
                important figures and consult a qualified professional before making financial,
                medical, legal, tax, or structural decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Acceptable use</h2>
              <p className="text-muted-foreground mb-3">When using Calcshark, you agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Use the site for any unlawful purpose or in violation of these Terms</li>
                <li>Attempt to disrupt, overload, or gain unauthorized access to the site or its systems</li>
                <li>Scrape, copy, or republish large portions of our content without permission</li>
                <li>Misrepresent results or use the site in a way that could harm others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Intellectual property</h2>
              <p className="text-muted-foreground">
                The Calcshark name, branding, design, and original content are owned by Calcshark
                and protected by applicable laws. You may use the calculators for your personal or
                business needs, but you may not reproduce or redistribute the site’s content as your
                own.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">No warranties</h2>
              <p className="text-muted-foreground">
                The site and all calculators are provided "as is" and "as available" without
                warranties of any kind, express or implied, including accuracy, fitness for a
                particular purpose, or uninterrupted availability. We work to keep formulas correct
                and the site running, but we do not guarantee error-free results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Limitation of liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Calcshark is not liable for any direct,
                indirect, incidental, or consequential damages arising from your use of, or
                inability to use, the site or its calculators, including decisions made based on
                calculated results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Third-party links</h2>
              <p className="text-muted-foreground">
                Some pages may reference or link to third-party websites. We are not responsible for
                the content, accuracy, or practices of those external sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-2">Changes to these terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. The "Last updated" date above reflects
                the latest version, and continued use of the site after changes indicates your
                acceptance of them.
              </p>
            </section>

            <section className="bg-muted/30 border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">Contact</h2>
              <p className="text-muted-foreground">
                Questions about these Terms? Email{' '}
                <a href="mailto:contact@calcshark.com" className="text-primary hover:underline">contact@calcshark.com</a>{' '}
                or use our{' '}
                <Link href="/contact/" className="text-primary hover:underline">contact page</Link>.
                You may also review our{' '}
                <Link href="/privacy/" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
