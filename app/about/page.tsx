import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/schemas';

export const metadata = {
  title: 'About Calcshark | Free Online Calculator Directory',
  description:
    'Learn about Calcshark, a free directory of 735+ online calculators across 17 categories built for fast, accurate, no-sign-up calculations.',
  alternates: {
    canonical: 'https://calcshark.com/about/',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about/' },
]);

const faqs = [
  {
    q: 'Is Calcshark free to use?',
    a: 'Yes. Every calculator on Calcshark is completely free, with no sign-up, no login, and no usage limits. You can use any tool as many times as you like.',
  },
  {
    q: 'How many calculators does Calcshark have?',
    a: 'Calcshark offers 735+ calculators organized into 17 categories, from finance and health to construction, cooking, automotive, and more, with new tools added regularly.',
  },
  {
    q: 'How accurate are the results?',
    a: 'Each calculator uses industry-standard formulas and is reviewed for accuracy. Results are still estimates and should be verified before making important financial, medical, or structural decisions.',
  },
  {
    q: 'Do I need to download anything?',
    a: 'No. Calcshark runs entirely in your web browser on desktop and mobile. There is nothing to install and nothing to register.',
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

export default function AboutPage() {
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
          <span className="text-foreground">About</span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-4">About Calcshark</h1>
          <p className="text-muted-foreground mb-4">
            Calcshark is a free online calculator directory built to help people make quick,
            accurate decisions without spreadsheets, sign-ups, or guesswork. We bring together
            735+ calculators across 17 categories, including finance, health and fitness,
            construction, education, business, automotive, cooking, real estate, and more.
          </p>
          <p className="text-muted-foreground mb-6">
            Whether you are estimating a{' '}
            <Link href="/finance-personal-finance/" className="text-primary hover:underline">mortgage payment</Link>,
            checking your BMI, scaling a recipe, or working out how much concrete a project needs,
            the goal is the same: fast, reliable results with clean interfaces and clear explanations,
            free for everyone.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Our mission</h2>
            <p className="text-muted-foreground">
              Everyday calculations should not require an account, a paywall, or a cluttered page
              covered in pop-ups. Calcshark exists to make trustworthy calculators accessible to
              anyone, on any device, in seconds. We focus on getting the maths right and keeping the
              experience simple, so you can get an answer and move on.
            </p>
          </section>

          <section className="bg-muted/30 border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">What we focus on</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Accurate, industry-standard formulas with transparent inputs</li>
              <li>Calculations that run in your browser for instant results</li>
              <li>Fast performance and clean, accessible interfaces on desktop and mobile</li>
              <li>Broad coverage across 17 everyday and professional categories</li>
              <li>No sign-up, no login, and no cost to use any tool</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">How our calculators work</h2>
            <p className="text-muted-foreground mb-4">
              Most Calcshark calculators run entirely on your device. When you enter values, the
              maths happens in your browser, so you get results instantly and your inputs are not
              sent to or stored on our servers. You can read more in our{' '}
              <Link href="/privacy/" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-muted-foreground">
              Ready to explore? Browse the{' '}
              <Link href="/categories/" className="text-primary hover:underline">full category list</Link>{' '}
              or jump straight into{' '}
              <Link href="/all-online-calculators/" className="text-primary hover:underline">all online calculators</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-muted/30 border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Get in touch</h2>
            <p className="text-muted-foreground">
              Have a calculator request, feedback, or a bug to report? Visit our{' '}
              <Link href="/contact/" className="text-primary hover:underline">contact page</Link>{' '}
              or email{' '}
              <a href="mailto:contact@calcshark.com" className="text-primary hover:underline">contact@calcshark.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
