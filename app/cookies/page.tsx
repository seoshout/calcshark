import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | Calcshark',
  description: 'Read the Calcshark cookie policy.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Cookies</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-6">
            This page explains how Calcshark uses cookies and similar technologies.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">What are cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files stored by your browser. They help websites remember
                settings and improve user experience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">How we use cookies</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Remember user preferences such as theme</li>
                <li>Measure site performance and usage patterns</li>
                <li>Protect the site from abuse</li>
              </ul>
            </section>

            <section className="bg-muted/30 border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Managing cookies</h2>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings. Disabling cookies may affect
                some site features.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
