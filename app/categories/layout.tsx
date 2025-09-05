import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator Categories - Browse All 17 Categories | Calcshark',
  description: 'Explore all calculator categories including Finance, Health, Education, Business, Construction, and more. Find the perfect calculator from our collection of 735+ free tools.',
  keywords: 'calculator categories, online calculators, free calculators by category, finance calculators, health calculators, education calculators, business calculators',
  openGraph: {
    title: 'Calculator Categories - Browse All 17 Categories',
    description: 'Explore all calculator categories with 735+ free online calculators. From finance to health, find the perfect tool for your needs.',
    url: '/categories',
    type: 'website',
  },
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}