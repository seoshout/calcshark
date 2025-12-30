import Link from 'next/link';

export const metadata = {
  title: 'Calcshark Hindi | Calcshark',
  description: 'Hindi version of Calcshark.',
};

export default function HindiLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Hindi</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">Hindi Version Coming Soon</h1>
          <p className="text-muted-foreground mb-6">
            We are working on a Hindi version of Calcshark. For now, you can use the main site.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
