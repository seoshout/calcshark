import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Calcshark',
  description: 'Read the Calcshark privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Privacy</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">
            We respect your privacy. This page explains what we collect and how we use it.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Information we collect</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Basic analytics data to understand site usage</li>
                <li>Technical information such as browser type and device</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">How we use information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Improve calculator accuracy and performance</li>
                <li>Measure site reliability and uptime</li>
                <li>Prevent abuse and spam</li>
              </ul>
            </section>

            <section className="bg-muted/30 border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about privacy, email us at{' '}
                <a href="mailto:contact@calcshark.com" className="text-primary hover:underline">
                  contact@calcshark.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
