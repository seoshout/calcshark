import Link from 'next/link';

export const metadata = {
  title: 'Contact | Calcshark',
  description: 'Contact the Calcshark team for feedback or support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Contact</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">Contact</h1>
          <p className="text-muted-foreground mb-6">
            Have feedback, a calculator request, or a bug to report? Send us a note and we will follow up.
          </p>

          <div className="bg-muted/30 border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Email</h2>
            <p className="text-muted-foreground">
              <a href="mailto:contact@calcshark.com" className="text-primary hover:underline">
                contact@calcshark.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
