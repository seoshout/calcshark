import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Online Calculators - Complete Collection of 735+ Free Calculators | Calcshark',
  description: 'Browse our complete collection of 735+ free online calculators across 17 categories. Find calculators for finance, health, education, business, construction, and more.',
  keywords: 'online calculators, free calculators, calculator collection, math calculators, finance calculators, health calculators, business calculators',
  openGraph: {
    title: 'All Online Calculators - Complete Collection of 735+ Free Calculators',
    description: 'Browse our complete collection of 735+ free online calculators across 17 categories.',
    url: '/all-online-calculators',
  }
};

export default function AllOnlineCalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}