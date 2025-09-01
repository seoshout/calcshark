import Link from 'next/link';
import { Calculator, Github, Twitter, Mail, Heart } from 'lucide-react';
import { calculatorCategories } from '@/lib/calculator-categories';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    popular: [
      { name: 'Mortgage Calculator', href: '/calculator/mortgage-payment' },
      { name: 'BMI Calculator', href: '/calculator/bmi' },
      { name: 'Loan Payment Calculator', href: '/calculator/loan-payment' },
      { name: 'Percentage Calculator', href: '/calculator/percentage' },
      { name: 'Tip Calculator', href: '/calculator/tip' },
      { name: 'Compound Interest Calculator', href: '/calculator/compound-interest' },
    ],
    categories: calculatorCategories.slice(0, 6).map(cat => ({
      name: cat.name,
      href: `/category/${cat.slug}`
    })),
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Sitemap', href: '/sitemap.xml' },
    ],
    resources: [
      { name: 'All Calculators', href: '/all-online-calculators' },
      { name: 'Popular Calculators', href: '/popular' },
      { name: 'Financial Tools', href: '/category/finance-personal-finance' },
      { name: 'Health Calculators', href: '/category/health-fitness' },
      { name: 'Math Tools', href: '/category/mathematics-science' },
      { name: 'Calculator Categories', href: '/categories' },
    ]
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Calcverse
              </span>
            </Link>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              The ultimate collection of online calculators. From financial planning to health metrics, 
              construction to cooking - find the perfect calculator for every need.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/calcverse" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com/calcverse" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:contact@calcverse.com" 
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
            <div className="flex items-center text-sm text-gray-400">
              <span>© {currentYear} Calcverse. All rights reserved.</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
              <span>for calculator enthusiasts everywhere</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
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