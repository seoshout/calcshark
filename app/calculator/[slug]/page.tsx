import { notFound, permanentRedirect } from 'next/navigation';
import { getCalculatorBySlug, getCalculatorURL } from '@/lib/calculator-categories';

interface CalculatorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Legacy /calculator/[slug] route.
// Permanently redirects (308) to the canonical nested URL
// (/{category}/{subcategory}/{slug}/) so old inbound links keep working
// without indexing duplicate, thin "Coming Soon" pages.
export default async function LegacyCalculatorPage({ params }: CalculatorPageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  permanentRedirect(getCalculatorURL(calculator));
}
