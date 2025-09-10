/**
 * Structured Data Schemas for SEO
 */

// Breadcrumb Schema Generator
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://calcshark.com${item.url}`
    }))
  };
};

// Software Application Schema for Calculator Tools
export const generateSoftwareSchema = (calculatorName: string, description: string, category: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": calculatorName,
    "description": description,
    "url": `https://calcshark.com/calculator/${calculatorName.toLowerCase().replace(/\s+/g, '-')}`,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript",
    "softwareVersion": "1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "Calcshark",
      "url": "https://calcshark.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Calcshark",
      "url": "https://calcshark.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Free to use",
      "No registration required",
      "Instant results",
      "Mobile responsive",
      "Accurate calculations"
    ],
    "keywords": [category, "calculator", "free", "online", "tool"],
    "inLanguage": "en-US",
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Calcshark"
    }
  };
};

// Organization Schema for main pages
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Calcshark",
    "url": "https://calcshark.com",
    "logo": "https://calcshark.com/favicon.svg",
    "description": "The ultimate collection of 735+ free online calculators across 17 categories including finance, health, construction, education, business, and more.",
    "foundingDate": "2025-09-01",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://github.com/calcshark",
      "https://twitter.com/calcshark"
    ]
  };
};

// Website Schema for main site
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Calcshark",
    "url": "https://calcshark.com",
    "description": "The ultimate collection of 735+ free online calculators",
    "publisher": {
      "@type": "Organization",
      "name": "Calcshark"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://calcshark.com/all-online-calculators?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};