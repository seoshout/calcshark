import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/ui/scroll-to-top';
import { generateMetadata } from '@/lib/seo';
import { defaultSEO } from '@/lib/seo';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/schemas';

const inter = Inter({ subsets: ['latin'] });

export const metadata = generateMetadata(defaultSEO);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ccy55KcJU0ipM04D2NwEognPYdL2fiaJLlpxaeBeM_U" />
        <meta name="yandex-verification" content="7b0686d059379d1c" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme !== 'light';
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to dark mode if localStorage is not available
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}