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
      "ratingCount": "8",
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
    "datePublished": "2025-01-28",
    "dateModified": "2025-01-28",
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

// Smart Thermostat Calculator Comprehensive Schema
export const generateSmartThermostatSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/home-garden/smart-home/smart-thermostat-savings-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      // WebApplication Schema
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Smart Thermostat Savings Calculator & ROI Estimator",
        "url": baseUrl,
        "description": "A free tool to estimate energy bill savings, ROI, and payback periods when upgrading to a smart thermostat. Features regional data for USA, UK, and Europe.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript",
        "softwareVersion": "2026.1",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "Net Present Value (NPV) Calculation",
          "Heating Degree Day (HDD) Climate Adjustment",
          "CO2 Reduction Estimation",
          "Global Energy Price Database",
          "HVAC Efficiency Analysis"
        ],
        "author": {
          "@type": "Organization",
          "name": "Calcshark",
          "url": "https://calcshark.com"
        }
      },
      // HowTo Schema
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Smart Thermostat Savings",
        "description": "Step-by-step guide to estimating your ROI on a smart thermostat upgrade using the Calcshark estimator.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select Location & Climate",
            "text": "Choose your region (USA, UK, Europe, Canada) to auto-load the latest average energy rates and climate zone data.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Input HVAC Details",
            "text": "Select your current heating type (Gas Furnace, Heat Pump, etc.) and thermostat style to establish a baseline efficiency.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Add Costs & Incentives",
            "text": "Enter the device cost and installation fees, then deduct any active utility rebates found in the Incentives Database.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Analyze Financial Results",
            "text": "Review your Payback Period, 10-Year ROI, and Net Present Value to determine if the upgrade is financially sound.",
            "position": 4
          }
        ]
      },
      // FAQPage Schema
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much can I really save with a smart thermostat?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Based on extensive research from Nest, Ecobee, and independent studies, smart thermostats save 10-23% on heating and cooling costs on average. US customers typically save $131-$284 annually (Nest: $131-145, Ecobee: up to $284), while European customers can save up to 37% (Netatmo) with €485 average annual savings (Tado). Your actual savings depend on your climate, home size, current thermostat type, and usage patterns. Homes with irregular occupancy and older HVAC systems see the highest savings."
            }
          },
          {
            "@type": "Question",
            "name": "What's the payback period for a smart thermostat?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most smart thermostats pay for themselves in 1-3 years. With utility rebates (typically $50-$100 in the US, or ECO subsidies in UK), the payback can be under 2 years. The average payback period is 2.6 years with a 10-year ROI of 454%. Smart thermostats also increase home value and provide non-financial benefits like comfort, convenience, and detailed energy insights."
            }
          },
          {
            "@type": "Question",
            "name": "How do smart thermostats save energy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Smart thermostats save energy through multiple mechanisms: 1) Learning algorithms that analyze your schedule and auto-adjust temperatures, 2) Geofencing technology that detects when you leave/arrive using smartphone GPS (saving 10-15%), 3) Remote control via smartphone app, 4) Weather-responsive adjustments using local forecasts, 5) Detailed energy reports showing usage patterns and optimization opportunities, 6) Smart setbacks during sleep/away periods (1% savings per degree for 8 hours), 7) Integration with smart home devices for whole-home efficiency."
            }
          },
          {
            "@type": "Question",
            "name": "Which smart thermostat brand saves the most money?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Savings vary by brand and usage: Nest reports 10-12% heating and 15% cooling savings ($131-$145/year based on 41-state study), Ecobee claims up to 23-26% savings ($200-$284/year), Sensi reports 23% HVAC savings, Honeywell ENERGY STAR models save ~8% ($50/year), Tado (Europe) claims 22-28% (€485/year), and Netatmo reports 37% average. The best choice depends on your smart home ecosystem (Google, Apple, Amazon), HVAC compatibility, desired features, and proper setup. Most brands deliver similar savings with consistent use of smart features."
            }
          },
          {
            "@type": "Question",
            "name": "Do smart thermostats work in Europe?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Smart thermostats are increasingly popular in Europe with strong government support. European models support 220-240V systems and EU heating equipment (individual boilers, heat pumps, radiant heating). Savings can be higher in Europe due to higher energy costs - Tado reports €485 annual savings, Netatmo shows 37% reduction. Major programs include UK ECO4 subsidies, Germany Steuerbonus tax credits (20% deduction over 3 years), France Coup de Pouce (recently discontinued), Netherlands SEEH (€120 subsidy), and Italy Ecobonus (65% deduction with boiler)."
            }
          },
          {
            "@type": "Question",
            "name": "Are there rebates or tax credits available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Many programs exist: USA - Utility companies offer $25-$100 rebates for ENERGY STAR thermostats (check DSIRE database), some states offer tax credits. UK - ECO4 scheme for low-income households (ends March 2026), Great British Insulation Scheme. Germany - Steuerbonus (20% tax deduction) or BAFA funding (15-20% subsidy). France - Coup de Pouce discontinued November 2024. Canada - Ontario $75 instant rebate, BC Hydro up to $150, Federal Greener Homes $50-100. Always check programs BEFORE purchasing as some require pre-approval."
            }
          },
          {
            "@type": "Question",
            "name": "Will a smart thermostat work with my HVAC system?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most smart thermostats work with conventional HVAC systems: gas furnaces, electric heat pumps, central AC, radiant heating, and multi-stage systems. However, compatibility varies - always check manufacturer compatibility tools before purchasing. Important considerations: 1) C-wire requirement - homes 15+ years old may lack common wire ($90-200 to install, or use included adapter), 2) System voltage - most require 24V systems, 3) Heat pump compatibility varies by model, 4) Some systems need professional assessment. Ecobee and Honeywell noted for good older system compatibility."
            }
          },
          {
            "@type": "Question",
            "name": "How does climate affect smart thermostat savings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Climate significantly impacts savings: Very cold climates (Minnesota, Northern Europe) see higher absolute dollar savings due to heavy heating usage but 10-12% typical percentage. Hot-humid climates (Southeast US, Southern Europe) can achieve 15-30% cooling savings, especially with variable-speed systems. Moderate climates (Pacific Coast, UK) show best percentage efficiency but lower absolute savings. Extreme climates benefit from higher baseline HVAC usage - more runtime means more optimization opportunity. The calculator adjusts for your specific climate zone using heating/cooling degree day data."
            }
          },
          {
            "@type": "Question",
            "name": "Is it worth upgrading from a programmable thermostat?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, if you're not using your programmable thermostat effectively. Smart thermostats save 8-10% more than programmable models through features programmables lack: automatic schedule learning (no manual programming needed), geofencing for presence detection, remote access when plans change, weather adaptation, and detailed usage insights. Studies show many people with programmable thermostats don't use scheduling features - if you're in 'set-and-forget' mode at 72°F, a smart thermostat can save up to 23%. The convenience and automation alone often justify the upgrade."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is this calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This calculator uses peer-reviewed research, manufacturer data (Nest 41-state study, Ecobee runtime analysis, DOE guidelines), and government statistics (EIA, Eurostat). It accounts for regional energy prices, climate zones, HVAC types, occupancy patterns, and system efficiency using validated models. Results are estimates based on industry averages - actual savings vary by individual usage, weather patterns, home insulation, and HVAC performance. For most accurate predictions, consider a professional energy audit. Calculator methodology follows IPMVP verification protocols and uses 2% inflation, 5% discount rate for NPV calculations."
            }
          }
        ]
      },
      // Breadcrumb Schema
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `https://calcshark.com${item.url}`
        }))
      }
    ]
  };
};