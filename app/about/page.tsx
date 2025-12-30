import Link from 'next/link';

export const metadata = {
  title: 'About | Calcshark',
  description: 'Learn about Calcshark and our mission to provide free, accurate calculators.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">About</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">About Calcshark</h1>
          <p className="text-muted-foreground mb-4">
            Calcshark is a collection of free online calculators built to help people make quick,
            accurate decisions across finance, health, education, construction, and more.
          </p>
          <p className="text-muted-foreground mb-6">
            Our goal is to provide fast, reliable results with simple interfaces and clear explanations.
            We keep the tools free and easy to access for everyone.
          </p>

          <div className="bg-muted/30 border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">What we focus on</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Accurate formulas with transparent inputs</li>
              <li>Fast performance on desktop and mobile</li>
              <li>Clean, accessible interfaces</li>
              <li>Coverage across many everyday categories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
