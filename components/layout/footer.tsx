import Link from 'next/link';
import { Calculator, Github, Twitter, Mail, Heart } from 'lucide-react';
import { calculatorCategories, getCalculatorBySlug, getCalculatorURL } from '@/lib/calculator-categories';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Helper function to convert CAPITAL CASE to Title Case
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Generate popular calculator links dynamically
  const popularCalculatorSlugs = [
    'mortgage-payment-calculator',
    'bmi-calculator', 
    'loan-payment-calculator',
    'percentage-calculator',
    'tip-calculator',
    'compound-interest-calculator'
  ];

  const footerLinks = {
    popular: popularCalculatorSlugs.map(slug => {
      const calculator = getCalculatorBySlug(slug);
      return calculator ? {
        name: calculator.name,
        href: getCalculatorURL(calculator)
      } : null;
    }).filter(Boolean) as { name: string; href: string }[],
    categories: calculatorCategories.slice(0, 6).map(cat => ({
      name: toTitleCase(cat.name),
      href: `/${cat.slug}/`
    })),
    company: [
      { name: 'About Us', href: '/about/' },
      { name: 'Contact', href: '/contact/' },
      { name: 'Privacy Policy', href: '/privacy/' },
      { name: 'Terms of Service', href: '/terms/' },
      { name: 'Cookie Policy', href: '/cookies/' },
      { name: 'Sitemap', href: '/sitemap.xml' },
    ],
    resources: [
      { name: 'All Calculators', href: '/all-online-calculators/' },
      { name: 'Popular Calculators', href: '/popular/' },
      { name: 'Financial Tools', href: '/finance-personal-finance/' },
      { name: 'Health Calculators', href: '/health-fitness/' },
      { name: 'Math Tools', href: '/mathematics-science/' },
      { name: 'Calculator Categories', href: '/categories/' },
    ]
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-center md:text-left">
          {/* Brand Section */}
          <div className="lg:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Calcshark
              </span>
            </Link>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              The ultimate collection of online calculators. From financial planning to health metrics, 
              construction to cooking - find the perfect calculator for every need.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <Link 
                href="https://github.com/calcshark" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com/calcshark" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@calcshark.com" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Popular Calculators */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4 text-white">Popular Calculators</h3>
            <ul className="space-y-2">
              {footerLinks.popular.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-400 justify-center md:justify-start">
              <span>© {currentYear} Calcshark. All rights reserved.</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-400 justify-center md:justify-start">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
              <span>for calculator enthusiasts everywhere</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm justify-center md:justify-start">
              <span className="text-gray-400">735+ Calculators Available</span>
              <div className="h-4 w-px bg-gray-700" />
              <span className="text-gray-400">Free to Use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}