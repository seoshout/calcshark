import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Calcshark',
  description: 'Read the Calcshark terms of service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Terms</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">
            By using Calcshark, you agree to the following terms.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Use of calculators</h2>
              <p className="text-muted-foreground">
                Calculators are provided for informational purposes only. Results are estimates and
                should be verified before making decisions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">No warranties</h2>
              <p className="text-muted-foreground">
                The site is provided as-is without warranties of any kind, express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Updates</h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. Continued use of the site indicates
                acceptance of any changes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
