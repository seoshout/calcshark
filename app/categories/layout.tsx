import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator Categories - Browse All 17 Categories | Calcshark',
  description: 'Explore all calculator categories including Finance, Health, Education, Business, Construction, and more. Find the perfect calculator from our collection of 735+ free tools.',
  openGraph: {
    title: 'Calculator Categories - Browse All 17 Categories',
    description: 'Explore all calculator categories with 735+ free online calculators. From finance to health, find the perfect tool for your needs.',
    url: 'https://calcshark.com/categories/',
    type: 'website',
  },
  alternates: {
    canonical: 'https://calcshark.com/categories/',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}