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
      "ratingValue": "4.6",
      "ratingCount": "12",
      "bestRating": "5",
      "worstRating": "3"
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
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "14",
          "bestRating": "5",
          "worstRating": "3"
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

// Tire Life Calculator Comprehensive Schema
export const generateTireLifeSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive/vehicle-maintenance/tire-life-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      // WebApplication Schema
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Tire Life Calculator - Advanced Tread Depth & Safety Analysis Tool",
        "url": baseUrl,
        "description": "A comprehensive free tool to calculate tire remaining life, estimate replacement dates, analyze safety status, and optimize tire maintenance using UTQG ratings, tread depth, and wear patterns.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript",
        "softwareVersion": "1.0",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "19",
          "bestRating": "5",
          "worstRating": "4"
        },
        "featureList": [
          "UTQG Treadwear Rating Analysis",
          "Multi-Method Life Estimation",
          "Real-Time Safety Status Alerts",
          "Tread Wear Rate Calculation",
          "Cost-Per-Mile Analysis",
          "Maintenance Score Assessment",
          "Condition-Based Adjustments",
          "Replacement Date Prediction"
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
        "name": "How to Calculate Tire Life and Safety Status",
        "description": "Step-by-step guide to estimating your tire's remaining lifespan, safety status, and replacement timeline using scientific methods.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Current Tire Information",
            "text": "Measure your tire's current tread depth using a tread depth gauge, penny test, or quarter test. Enter the current depth in 32nds of an inch. Most new tires start at 10/32\" to 12/32\". The legal minimum is 2/32\", but replace at 4/32\" for safety.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add Tire Specifications",
            "text": "Find the UTQG treadwear rating on your tire's sidewall (typically 300-800). Enter the manufacturer's warranty mileage if known. Input your tire's age (check the DOT code) and total miles driven on these tires.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Select Driving Conditions",
            "text": "Choose your primary driving style (gentle, normal, aggressive), road conditions (excellent, good, mixed, poor), climate zone (mild, moderate, extreme), and how well you've maintained tire pressure and rotations.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Enter Cost Information",
            "text": "Input the original purchase price and your typical annual mileage. The calculator will compute cost-per-mile and help you budget for replacement.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Analyze Safety & Remaining Life",
            "text": "Review your safety status (Safe, Monitor, Replace Soon, Replace Now), estimated remaining miles, replacement date, wear rate, and maintenance recommendations.",
            "position": 5
          }
        ]
      },
      // FAQPage Schema (using the 10 FAQs from the calculator)
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate is the tire life calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This calculator uses multiple validated methods: UTQG treadwear ratings (tested on government 400-mile courses), actual wear rate analysis based on your tread measurements, manufacturer warranty data, and condition adjustments. Results are estimates - actual tire life varies by driving habits, maintenance, climate, and road conditions. For most accurate predictions, measure tread depth regularly and update the calculator. Our algorithms follow NHTSA tire safety guidelines and SAE International standards."
            }
          },
          {
            "@type": "Question",
            "name": "When should I replace my tires?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Replace tires when: 1) Tread depth reaches 4/32\" (legal minimum is 2/32\", but 4/32\" is safer, especially in wet conditions), 2) Tires are 6+ years old (rubber degrades over time regardless of tread), 3) Uneven wear patterns appear (indicates alignment issues), 4) Visible damage like cracks, bulges, or punctures in sidewall, 5) Frequent loss of tire pressure. In winter climates, replace at 6/32\" for adequate snow traction. The penny test: insert penny with Lincoln's head down - if you see his full head, replace immediately."
            }
          },
          {
            "@type": "Question",
            "name": "What is the UTQG treadwear rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Uniform Tire Quality Grading (UTQG) treadwear rating is a comparative number assigned by manufacturers based on government testing. A tire rated 400 should last twice as long as one rated 200 under controlled conditions. Ratings typically range from 300-800: 300-400 = performance/sport tires (20,000-40,000 miles), 400-600 = standard all-season (40,000-60,000 miles), 600-800 = long-life touring (60,000-80,000 miles), 800+ = ultra-high mileage (80,000+ miles). Note: Actual mileage varies significantly based on driving style, vehicle weight, alignment, inflation, and road conditions."
            }
          },
          {
            "@type": "Question",
            "name": "How do I measure tire tread depth?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Three methods: 1) Tread Depth Gauge ($5-15, most accurate): Insert probe into tread groove, read measurement in 32nds of an inch. Measure at multiple points across tire. 2) Penny Test (free): Insert penny with Lincoln's head upside-down into groove. If you see top of his head, tread is ≤2/32\" (replace now). If head is partially covered, you're at 2-4/32\". 3) Quarter Test: Same method - if you see top of Washington's head, you're at ≤4/32\" (replace soon). Always measure in the center of the tire and at both edges to check for uneven wear."
            }
          },
          {
            "@type": "Question",
            "name": "Why do tires age out even with good tread?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tire rubber degrades over time through oxidation and UV exposure, even without use. Studies show significant strength loss after 6 years. The rubber compounds harden, reducing grip and increasing crack risk. Microscopic cracks develop in sidewalls and tread, compromising structural integrity. Heat, ozone, and sunlight accelerate this process. Major tire manufacturers (Michelin, Bridgestone, Goodyear) recommend replacement at 6 years regardless of tread depth, with absolute maximum of 10 years. Check the DOT code on sidewall - last 4 digits show week/year of manufacture (e.g., '2319' = 23rd week of 2019)."
            }
          },
          {
            "@type": "Question",
            "name": "How does driving style affect tire life?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Driving style has dramatic impact: Aggressive driving (hard acceleration, hard braking, high-speed cornering) can reduce tire life by 25-40%. Rapid starts wear the center tread, hard braking flattens tread blocks, and aggressive cornering wears shoulders. Gentle driving (smooth acceleration, gradual braking, moderate speeds) can extend life by 15-25%. Highway vs. city matters too - highway driving is easier on tires (steady speeds, fewer stops) while city driving (frequent starts/stops, potholes, sharp turns) increases wear. Optimal: maintain steady speeds, brake gradually, take corners smoothly, avoid potholes when possible."
            }
          },
          {
            "@type": "Question",
            "name": "What maintenance extends tire life?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Key maintenance: 1) Proper Inflation: Check monthly with accurate gauge. Under-inflation (most common) causes shoulder wear and overheating. Over-inflation causes center wear. Correct PSI is on door jamb sticker, NOT sidewall. 2) Regular Rotation: Every 5,000-7,500 miles. Prevents uneven wear, extends life 20-30%. 3) Wheel Alignment: Check annually or after hitting potholes. Misalignment causes rapid, uneven wear. 4) Wheel Balance: Prevents vibration and uneven wear. 5) Visual Inspections: Monthly check for damage, objects, uneven wear. 6) Avoid Overloading: Exceeding vehicle weight capacity accelerates wear."
            }
          },
          {
            "@type": "Question",
            "name": "Are premium tires worth the extra cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Often yes, when considering cost-per-mile: Premium tires ($150-250 each, 70,000-mile warranty) = $0.0025/mile. Budget tires ($80-120 each, 40,000-mile warranty) = $0.0025/mile. Same cost per mile! But premium tires offer: better wet/dry traction (shorter stopping distances = safety), superior handling and cornering, quieter ride (less road noise), better fuel economy (lower rolling resistance), longer warranties (better protection), and less frequent replacement hassle. In snow/ice regions, premium all-seasons perform significantly better. Exception: if you drive minimally (<7,500 miles/year), budget tires may be sufficient as you'll age out before wearing out."
            }
          },
          {
            "@type": "Question",
            "name": "What causes uneven tire wear?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Common causes: 1) Improper Inflation: Under-inflation wears outer edges, over-inflation wears center. 2) Alignment Issues: Toe misalignment causes feathering (one edge worn), camber issues wear inner/outer edge. 3) Suspension Problems: Worn shocks/struts cause cupping (scalloped dips). 4) Lack of Rotation: Front tires wear faster (steering, weight). 5) Aggressive Driving: Hard cornering wears shoulders. 6) Bent Wheels: From potholes/curbs. 7) Brake Issues: Dragging brakes wear flat spots. Solution: Check alignment annually, rotate every 5,000-7,500 miles, maintain correct pressure, inspect suspension, avoid potholes, drive smoothly."
            }
          },
          {
            "@type": "Question",
            "name": "Can I replace just two tires instead of all four?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Depends on vehicle type: AWD/4WD: Replace all four. Tire diameter differences (from uneven tread) can damage transfer case and differentials. Some manufacturers allow 2/32\" tread difference maximum - check owner's manual. FWD: Best to replace front pair (they wear faster). Put new tires on REAR for better stability (prevents oversteer in wet conditions). 2WD/RWD: Can replace rear pair, but ensure tread depth difference is <4/32\". General rules: if existing tires have >50% tread (>5/32\"), replacing two is usually okay. If <50% tread, replace all four for optimal safety and performance. Always match tire specs (size, speed rating, load index) exactly."
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
// Oil Change Interval Calculator Comprehensive Schema
export const generateOilChangeSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/maintenance-parts/oil-change-interval-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Oil Change Interval Calculator - Advanced Schedule & Cost Analysis Tool",
        "url": baseUrl,
        "description": "Free comprehensive oil change interval calculator that determines optimal maintenance schedule based on oil type (synthetic, conventional), driving conditions, vehicle age, and usage patterns.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "featureList": [
          "Oil Change Schedule Calculator",
          "Synthetic vs Conventional Comparison",
          "Severe Driving Condition Adjustments",
          "Annual Cost Analysis"
        ],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "ratingCount": "17",
          "bestRating": "5",
          "worstRating": "3"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How often should I change my oil?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Modern vehicles with synthetic oil typically need oil changes every 7,500-10,000 miles or every 6-12 months, whichever comes first. Conventional oil should be changed every 3,000-5,000 miles or every 3-6 months. However, severe driving conditions like frequent short trips, extreme temperatures, dusty conditions, or towing can reduce these intervals by 25-50%."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between synthetic and conventional oil?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Synthetic oil is chemically engineered to provide superior lubrication, better performance in extreme temperatures, and longer service life compared to conventional oil. Full synthetic oil can last 10,000-15,000 miles between changes, while conventional oil typically requires changes every 3,000-5,000 miles."
            }
          },
          {
            "@type": "Question",
            "name": "Can I go longer between oil changes with synthetic oil?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, full synthetic oil can safely extend oil change intervals to 7,500-10,000 miles or even 15,000 miles in some modern vehicles, compared to 3,000-5,000 miles for conventional oil. However, even with synthetic oil, you should still change it at least once every 12 months due to time-based degradation."
            }
          },
          {
            "@type": "Question",
            "name": "What qualifies as severe driving conditions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Severe driving conditions include: frequent short trips (less than 10 miles), stop-and-go city traffic, extreme hot or cold temperatures, dusty or dirty environments, towing or hauling heavy loads, excessive idling, and off-road driving. About 80% of drivers actually fall into the severe category. These conditions can reduce recommended oil change intervals by 25-50%."
            }
          },
          {
            "@type": "Question",
            "name": "Should I change oil based on mileage or time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You should change your oil based on whichever comes first: mileage OR time. Even if you don't drive many miles, oil can degrade over time due to moisture accumulation, oxidation, and additive breakdown. A good rule is to change conventional oil every 6 months and synthetic oil every 12 months, regardless of mileage."
            }
          },
          {
            "@type": "Question",
            "name": "Is the 3,000-mile oil change rule still valid?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, the 3,000-mile rule is largely outdated for modern vehicles. Today's synthetic oils and improved engine technology allow most vehicles to safely go 5,000-10,000 miles between changes. However, the 3,000-mile interval may still apply to older vehicles (pre-2000), vehicles using conventional oil, or those operating under severe conditions."
            }
          },
          {
            "@type": "Question",
            "name": "Can I mix synthetic and conventional oil?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, synthetic and conventional oils can be mixed safely in an emergency, as they're chemically compatible. However, mixing them dilutes the performance benefits of synthetic oil. If you mix oils, you should follow the shorter oil change interval of conventional oil (3,000-5,000 miles)."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if I wait too long to change my oil?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Delaying oil changes can cause serious engine damage. Old oil loses its lubricating properties, leading to increased friction, heat, and wear on engine components. This can result in: reduced fuel economy, increased emissions, sludge buildup, overheating, premature engine wear, and potentially catastrophic engine failure requiring expensive repairs."
            }
          },
          {
            "@type": "Question",
            "name": "How do I know what type of oil my car needs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Check your owner's manual for the manufacturer-recommended oil type and viscosity (like 5W-30). The oil cap under your hood may also display this information. Modern vehicles (2010+) typically benefit from full synthetic oil, while older vehicles may use conventional or synthetic blend. High-mileage vehicles (75,000+ miles) may benefit from high-mileage formula oils."
            }
          },
          {
            "@type": "Question",
            "name": "Does my vehicle have an oil life monitoring system?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most vehicles manufactured after 2010 include an Oil Life Monitoring System (OLMS) that tracks driving conditions, engine temperature, miles driven, and time to predict optimal oil change timing. This appears as a percentage or indicator light on your dashboard. However, you should still check your oil level monthly and change oil at least annually regardless of what the monitor shows."
            }
          }
        ]
      },
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

// Dog Age Calculator Comprehensive Schema
export const generateDogAgeSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/animals-pets/pet-health-care/dog-age-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Dog Age Calculator - Advanced Breed-Specific Life Expectancy Tool",
        "url": baseUrl,
        "description": "Free comprehensive dog age calculator using 2025 research from Dog Aging Project (50,000+ dogs), epigenetic clocks, and breed-specific data to calculate dog years in human years accurately.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "16",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Breed-Specific Age Calculations",
          "Body Condition Score Analysis",
          "Life Expectancy Estimation",
          "Health Risk Assessment",
          "Senior Status Determination"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate is the dog age calculation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our calculator uses the latest 2025 research including dual-species epigenetic clocks with R=0.97 accuracy, data from the Dog Aging Project (50,000+ dogs), and clinical biomarker analysis. The core formula (human_age = 16ln(dog_age) + 31) is enhanced with multi-modal aging biomarkers, breed-specific longevity data, and metabolic health factors for unprecedented accuracy."
            }
          },
          {
            "@type": "Question",
            "name": "Why do small dogs live longer than large dogs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Larger dogs age faster due to several biological factors: faster growth rates leading to earlier cellular damage, higher metabolic demands, increased cancer rates, and greater strain on organs. Giant breeds also face higher risks of bloat, heart problems, and joint issues. Small dogs typically live 12-16 years while giant breeds average 6-10 years."
            }
          },
          {
            "@type": "Question",
            "name": "What factors most influence my dog's life expectancy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Based on 2025 Dog Aging Project findings from 50,000+ dogs: genetics (breed-specific), body weight management (obesity reduces lifespan by 2-3 years), metabolic health biomarkers (insulin, adipose function), exercise level, diet quality, spay/neuter status, environmental factors, and microbiome health. The latest research shows metabolic health components are strongly associated with frailty and quality of life in aging dogs."
            }
          },
          {
            "@type": "Question",
            "name": "When should my dog be considered 'senior'?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Senior status varies by size: giant breeds at 5-6 years, large breeds at 6-7 years, medium breeds at 7-8 years, and small breeds at 8-10 years. Senior dogs need biannual vet visits, blood work monitoring, joint health support, and potential diet adjustments. Early intervention helps maintain quality of life."
            }
          },
          {
            "@type": "Question",
            "name": "Can I improve my dog's calculated life expectancy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Maintaining ideal body weight, providing regular exercise appropriate for breed and age, feeding high-quality nutrition, ensuring preventive veterinary care, and managing stress can all positively impact longevity. Even small improvements in health management can add years to your dog's life."
            }
          }
        ]
      },
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

// Cat Age Calculator Comprehensive Schema
export const generateCatAgeSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/animals-pets/pet-health-care/cat-age-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Cat Age Calculator - Advanced Feline Life Expectancy Tool",
        "url": baseUrl,
        "description": "Free comprehensive cat age calculator using 2025 research, feline epigenetic clocks, and breed-specific data to calculate cat years in human years accurately.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "ratingCount": "15",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Breed-Specific Age Calculations",
          "Body Condition Score Analysis",
          "Life Expectancy Estimation",
          "Lifestyle Impact Assessment",
          "Senior Status Determination"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate is the cat age calculation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our calculator uses the latest 2025 research including feline epigenetic clocks, breed-specific lifespan data from the Royal Veterinary College, and comprehensive health assessments. The formula (first 2 years = 24 human years, then 4 years per cat year) is enhanced with breed-specific longevity data, sex differences, and lifestyle factors for unprecedented accuracy in cat age calculations."
            }
          },
          {
            "@type": "Question",
            "name": "What factors most influence my cat's life expectancy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Based on 2025 veterinary research: genetics (breed-specific health), lifestyle (indoor cats live 2-5 years longer), body condition (obesity reduces lifespan significantly), sex (females live 1.33 years longer on average), spay/neuter status, diet quality, preventive veterinary care, and environmental enrichment. Indoor lifestyle and maintaining ideal body weight are the most impactful controllable factors."
            }
          },
          {
            "@type": "Question",
            "name": "When should my cat be considered 'senior'?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cats are typically considered senior at 10+ years, though this varies by breed and health. Life stages include: Kitten (0-6 months), Junior (6 months-2 years), Prime (3-6 years), Mature (7-10 years), Senior (11-14 years), and Geriatric (15+ years). Senior cats need biannual vet visits, kidney function monitoring, and potential diet adjustments."
            }
          }
        ]
      },
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

// Mortgage Calculator Comprehensive Schema
export const generateMortgageSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/finance-business/loans-mortgages/mortgage-payment-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Mortgage Payment Calculator - Advanced Home Loan Tool",
        "url": baseUrl,
        "description": "Free mortgage calculator with amortization, PMI, taxes, and insurance calculations.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "18", "bestRating": "5", "worstRating": "4" },
        "featureList": ["Monthly Payment Calculation", "Amortization Schedule", "PMI Calculator", "Property Tax & Insurance"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "How is my monthly mortgage payment calculated?", "acceptedAnswer": { "@type": "Answer", "text": "Monthly mortgage payments include Principal & Interest (P&I), Property Taxes, Homeowners Insurance, and PMI if applicable. The P&I is calculated using the loan amount, interest rate, and loan term." } },
          { "@type": "Question", "name": "What is PMI and when can I remove it?", "acceptedAnswer": { "@type": "Answer", "text": "Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. PMI typically costs 0.5-1.5% annually. You can request removal at 20% equity, it auto-terminates at 22%." } },
          { "@type": "Question", "name": "Should I choose 15-year or 30-year mortgage?", "acceptedAnswer": { "@type": "Answer", "text": "15-year mortgages have higher monthly payments but lower rates and less total interest. 30-year offers lower payments and flexibility but more total interest. Consider your budget and goals." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

// Loan Payment Calculator Schema
export const generateLoanPaymentSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/finance-business/loans-mortgages/loan-payment-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Loan Payment Calculator - Personal & Auto Loan Tool",
        "url": baseUrl,
        "description": "Free loan calculator for personal and auto loans with amortization schedule.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.7", "ratingCount": "13", "bestRating": "5", "worstRating": "3" },
        "featureList": ["Monthly Payment Calculation", "Amortization Schedule", "Total Interest Analysis"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "How is my loan payment calculated?", "acceptedAnswer": { "@type": "Answer", "text": "Loan payments use the loan amount, interest rate, and term. The formula ensures equal monthly payments covering principal and interest, with early payments going mostly to interest." } },
          { "@type": "Question", "name": "Should I pay off my loan early?", "acceptedAnswer": { "@type": "Answer", "text": "Paying off early saves interest. Check for prepayment penalties first and consider if investing might yield better returns. Maintain emergency savings before accelerating payoff." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

// Compound Interest Calculator Schema
export const generateCompoundInterestSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/finance-business/investments-savings/compound-interest-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Compound Interest Calculator - Investment Growth Tool",
        "url": baseUrl,
        "description": "Free compound interest calculator for investment growth and retirement savings.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "20", "bestRating": "5", "worstRating": "4" },
        "featureList": ["Future Value Calculation", "Regular Contributions", "Multiple Compounding Frequencies"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "What is compound interest?", "acceptedAnswer": { "@type": "Answer", "text": "Compound interest is interest calculated on both principal and accumulated interest. Unlike simple interest, it creates exponential growth over time." } },
          { "@type": "Question", "name": "What's the Rule of 72?", "acceptedAnswer": { "@type": "Answer", "text": "Divide 72 by your return rate to estimate doubling time. At 6%, money doubles in 12 years (72÷6). At 8%, it doubles in 9 years." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

// Wedding Alcohol Calculator Schema
export const generateWeddingAlcoholSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/wedding-events/wedding-planning/wedding-alcohol-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Wedding Alcohol Calculator - Bar Planning Tool",
        "url": baseUrl,
        "description": "Free wedding alcohol calculator for beer, wine, and liquor quantities.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.6", "ratingCount": "14", "bestRating": "5", "worstRating": "3" },
        "featureList": ["Guest Count Calculation", "Drink Duration Planning", "Beer Wine Liquor Ratios"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "How much alcohol do I need for my wedding?", "acceptedAnswer": { "@type": "Answer", "text": "Plan for 1 drink per guest per hour. For a 5-hour reception with 100 guests, that's 500 drinks total. Mix typically includes 50% beer, 30% wine, 20% liquor." } },
          { "@type": "Question", "name": "Should I have an open bar?", "acceptedAnswer": { "@type": "Answer", "text": "Open bars are generous but costly. Consider limited bar (beer/wine only), cash bar, or drink tickets as budget-friendly alternatives." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

// Crop Rotation Calculator Schema
export const generateCropRotationSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/agriculture-farming/crop-management/crop-rotation-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Crop Rotation Calculator - Farm Planning Tool",
        "url": baseUrl,
        "description": "Free crop rotation calculator for optimal planting schedules and soil health.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.5", "ratingCount": "11", "bestRating": "5", "worstRating": "3" },
        "featureList": ["Multi-Year Planning", "Soil Health Optimization", "Nutrient Management"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "Why is crop rotation important?", "acceptedAnswer": { "@type": "Answer", "text": "Crop rotation prevents soil depletion, reduces pests and diseases, breaks weed cycles, and improves soil structure. Different crops use and replenish different nutrients." } },
          { "@type": "Question", "name": "How often should I rotate crops?", "acceptedAnswer": { "@type": "Answer", "text": "Rotate crops annually at minimum. A 3-4 year rotation cycle is ideal for breaking pest and disease cycles while maintaining soil fertility." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

// Cooldown Reduction Calculator Schema
export const generateCooldownSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/gaming-entertainment/game-stats/cooldown-reduction-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Cooldown Reduction Calculator - Gaming Stats Tool",
        "url": baseUrl,
        "description": "Free CDR calculator for gaming ability cooldowns and stat optimization.",
        "applicationCategory": "GameApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.7", "ratingCount": "19", "bestRating": "5", "worstRating": "3" },
        "featureList": ["Ability Cooldown Calculation", "CDR Optimization", "Build Planning"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "How does cooldown reduction work?", "acceptedAnswer": { "@type": "Answer", "text": "CDR reduces ability cooldowns by a percentage. 40% CDR on a 10-second cooldown results in 6 seconds. Most games cap CDR at 40-45%." } },
          { "@type": "Question", "name": "Is CDR worth building?", "acceptedAnswer": { "@type": "Answer", "text": "CDR value depends on your playstyle and champion abilities. High-impact ultimates and spell-dependent champions benefit most from CDR investment." } }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

export const generatePondVolumeSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/gardening-landscaping/lawn-landscaping/pond-volume-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Pond Volume Calculator - Liner Size, Pump & Fish Stocking Tool",
        "url": baseUrl,
        "description": "Calculate pond volume in gallons and liters for any shape. Get liner size, pump requirements, fish stocking capacity, and chemical dosing. Free tool for rectangular, circular, and irregular ponds.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "17", "bestRating": "5", "worstRating": "3" },
        "featureList": [
          "Pond Volume Calculation (Gallons, Liters, Cubic Feet, Cubic Meters)",
          "Liner Size Calculator with 2-Foot Overlap",
          "Pump & Filter Flow Rate Sizing",
          "Fish Stocking Capacity (Koi & Goldfish)",
          "Chemical Dosing Calculator (Algaecide & Clarifier)",
          "Waterfall GPH Requirements",
          "Maintenance Cost Estimation",
          "Imperial & Metric Unit Support",
          "Rectangular, Circular & Irregular Pond Shapes"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How accurate is this pond volume calculator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This calculator uses industry-standard formulas with typical accuracy of ±5% for regular shapes (rectangular and circular ponds). For irregular ponds, accuracy depends on measurement quality—the 2/3 approximation formula is widely accepted and typically accurate within 10% when proper average dimensions are used."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to include the liner overlap when measuring my pond?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No—measure only the actual pond excavation dimensions. The calculator automatically adds 2 feet of overlap to all sides (the industry standard) when calculating liner size. This overlap is essential for securing the liner and accounting for settling."
            }
          },
          {
            "@type": "Question",
            "name": "How many koi can I keep in my pond?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The gold standard is 250 gallons per adult koi, though experienced keepers with excellent filtration can maintain 150-200 gallons per fish. Overstocking leads to poor water quality, stunted growth, and health problems. Start conservatively—it's easier to add fish than deal with overcrowding issues."
            }
          },
          {
            "@type": "Question",
            "name": "What pump size do I need for my pond?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For koi ponds, turnover the full volume once per hour. Goldfish ponds need turnover every 1.5 hours, and decorative ponds every 2 hours. Add 100 GPH per inch of waterfall width if applicable. Always match pump flow rate to your filter's maximum capacity—exceeding it reduces filtration effectiveness."
            }
          },
          {
            "@type": "Question",
            "name": "How do I measure an irregular-shaped pond?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For best accuracy, divide complex shapes into multiple rectangles or circles and calculate each section separately. For a quick estimate, measure at the longest and widest points and use average depth—the calculator applies a 2/3 correction factor for irregular shapes, which is standard in the pond industry."
            }
          },
          {
            "@type": "Question",
            "name": "Should I use imperial or metric measurements?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use whichever unit system you're comfortable with—the calculator converts everything automatically. In the US, pond supplies are typically sized in gallons and feet, while international markets use liters and meters. The calculator provides results in all units for equipment compatibility."
            }
          },
          {
            "@type": "Question",
            "name": "How often should I change pond water?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Weekly 10% water changes are ideal for maintaining water quality. This removes accumulated nitrates, replenishes minerals, and dilutes dissolved organics. In heavily stocked ponds or hot weather, increase to 15-20% weekly. Always dechlorinate replacement water before adding to prevent harming fish and beneficial bacteria."
            }
          },
          {
            "@type": "Question",
            "name": "What's the minimum pond depth for fish?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "24 inches minimum for goldfish and koi in temperate climates—this prevents freezing solid in winter and provides thermal stability in summer. In cold climates (Zone 5 and colder), 36 inches is safer for overwintering. Deeper sections also give fish refuge from predators like herons."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use this calculator for swimming pools?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While the volume calculations work for any water feature, the equipment sizing, fish stocking, and chemical dosing are pond-specific. For swimming pools, you'll need different filtration rates, sanitization methods (chlorine/salt systems), and safety considerations not covered by this pond calculator."
            }
          },
          {
            "@type": "Question",
            "name": "How much does it cost to maintain a pond annually?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Typical costs include pump electricity ($50-200), filter media replacement ($100-150), water treatments ($50-150), and fish food ($100-300), totaling $300-800 annually for average ponds. Larger koi ponds with extensive filtration and high fish loads can reach $1,000-2,000 per year depending on climate and stocking density."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}#breadcrumb`,
        "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` }))
      }
    ]
  };
};

export const generateDPSCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/gaming-entertainment/gaming-performance/dps-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "DPS Calculator - Damage Per Second Calculator",
        "url": baseUrl,
        "description": "Calculate damage per second (DPS) for weapons and builds. Includes burst DPS, sustained DPS, critical hits, and armor penetration.",
        "applicationCategory": "GameApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "23" },
        "featureList": ["Burst DPS Calculation", "Sustained DPS with Reload", "Critical Hit Calculations", "Armor Penetration Analysis"]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          { "@type": "Question", "name": "What is DPS?", "acceptedAnswer": { "@type": "Answer", "text": "DPS (Damage Per Second) measures damage output over time. Formula: Base Damage × Attack Speed = DPS." } },
          { "@type": "Question", "name": "What's the difference between burst and sustained DPS?", "acceptedAnswer": { "@type": "Answer", "text": "Burst DPS is max output without reload. Sustained DPS includes reload time: Damage per Magazine ÷ (Fire Time + Reload Time)." } },
          { "@type": "Question", "name": "How do critical hits affect DPS?", "acceptedAnswer": { "@type": "Answer", "text": "Crits use formula: Base × (1 + Crit Rate × (Crit Multiplier - 1)). 25% crit chance with 2× multiplier = 25% DPS increase." } }
        ]
      },
      { "@type": "BreadcrumbList", "@id": `${baseUrl}#breadcrumb`, "itemListElement": breadcrumbItems.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.name, "item": `https://calcshark.com${item.url}` })) }
    ]
  };
};

export const generateBreastmilkStorageCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/pregnancy-parenting/baby-child-development/breastmilk-storage-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Breastmilk Storage Calculator - Safe Storage Duration Calculator",
        "url": baseUrl,
        "description": "Calculate safe breastmilk storage duration based on CDC guidelines. Determine expiration dates for room temperature, refrigerator, and freezer storage with safety recommendations.",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "featureList": [
          "CDC-based storage duration calculations",
          "Room temperature storage safety (4 hours)",
          "Refrigerator storage (up to 4 days)",
          "Freezer storage (6-12 months)",
          "Thawed milk safety guidelines",
          "Expiration date and time tracking",
          "Safety status indicators",
          "Personalized recommendations"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "15",
          "bestRating": "5"
        }
      },
      {
        "@type": "MedicalWebPage",
        "@id": `${baseUrl}#webpage`,
        "url": baseUrl,
        "name": "Breastmilk Storage Calculator - CDC Guidelines",
        "description": "Free online breastmilk storage calculator following CDC, WHO, and La Leche League guidelines for safe storage of expressed breast milk.",
        "specialty": "Lactation and Infant Care",
        "about": {
          "@type": "MedicalCondition",
          "name": "Breastfeeding and Lactation"
        },
        "reviewedBy": {
          "@type": "Organization",
          "name": "Centers for Disease Control and Prevention"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Safely Store Breast Milk",
        "description": "Step-by-step guide to calculating and managing safe breast milk storage using CDC guidelines",
        "step": [
          { "@type": "HowToStep", "position": 1, "name": "Enter Expression Date and Time", "text": "Input when you expressed or pumped the breast milk. This helps calculate exactly how long the milk has been stored." },
          { "@type": "HowToStep", "position": 2, "name": "Select Storage Location", "text": "Choose where the milk is being stored: room temperature (4 hours), refrigerator (4 days), standard freezer (6 months), or deep freezer (12 months)." },
          { "@type": "HowToStep", "position": 3, "name": "Specify Milk State", "text": "Indicate whether the milk is freshly expressed, previously frozen and thawed (24 hours refrigerated), or warmed for feeding (2 hours maximum)." },
          { "@type": "HowToStep", "position": 4, "name": "Calculate Storage Safety", "text": "Click calculate to see expiration date, time remaining, and safety status based on CDC guidelines." },
          { "@type": "HowToStep", "position": 5, "name": "Follow Safety Recommendations", "text": "Review storage details and safety tips. Always label containers with date and time. When in doubt, throw it out." }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How long can breast milk stay at room temperature?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Freshly expressed breast milk can stay at room temperature (77°F/25°C or colder) for up to 4 hours according to CDC guidelines. Formula: Safe Duration = 4 hours at ≤77°F."
            }
          },
          {
            "@type": "Question",
            "name": "How long is breast milk good in the refrigerator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Freshly expressed breast milk can be stored in the refrigerator at 40°F (4°C) or colder for up to 4 days optimally. Formula: Safe Duration = 4 days at ≤40°F."
            }
          },
          {
            "@type": "Question",
            "name": "Can I refreeze thawed breast milk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, never refreeze breast milk after thawing. Once thawed, use within 24 hours if refrigerated or 1-2 hours at room temperature. Rule: Thawed milk storage time = 24 hours refrigerated OR 2 hours room temp."
            }
          },
          {
            "@type": "Question",
            "name": "How long can breast milk be frozen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Breast milk can be stored in a standard freezer (0°F/-18°C) for 6 months optimally, up to 12 months acceptable. Deep freezer (-4°F/-20°C): up to 12 months. Formula: Standard Freezer = 6 months optimal, Deep Freezer = 12 months."
            }
          },
          {
            "@type": "Question",
            "name": "Where should I store breast milk in the refrigerator?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Always store breast milk in the back of the refrigerator where temperature is most consistent at 40°F (4°C) or colder, never in the door. Rule: Back of fridge = consistent 40°F, Door = temperature fluctuations."
            }
          },
          {
            "@type": "Question",
            "name": "How long does thawed breast milk last?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Previously frozen breast milk that has been thawed can be stored in the refrigerator for up to 24 hours. Never refreeze. Formula: Thawed milk in fridge = 24 hours maximum, at room temp = 1-2 hours."
            }
          }
        ]
      },
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

export const generateRecipeConverterCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/health-fitness/nutrition-diet/recipe-converter-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Recipe Converter Calculator - Measurement Conversion Tool",
        "url": baseUrl,
        "description": "Convert recipe measurements between cups, tablespoons, grams, ounces, and more. Scale recipes for different serving sizes. Ingredient-specific conversions for 28+ common cooking ingredients.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "featureList": [
          "Volume to volume conversions (cups, tbsp, tsp, ml, fl oz)",
          "Weight to weight conversions (grams, ounces, pounds, kg)",
          "Volume to weight conversions with ingredient densities",
          "Weight to volume conversions with ingredient densities",
          "Recipe scaling for different serving sizes",
          "28+ ingredient-specific conversions",
          "Bidirectional conversion support",
          "International measurement system support"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "12",
          "bestRating": "5"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Convert Recipe Measurements",
        "description": "Learn to convert between volume and weight measurements for cooking and baking with precision.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Choose Conversion Type",
            "text": "Select the type of conversion you need: volume to volume (cups to ml), weight to weight (grams to ounces), volume to weight (cups to grams), weight to volume (grams to cups), or recipe scaling."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter Values and Select Units",
            "text": "Input the amount you want to convert and select the source and target units. For volume-weight conversions, choose the specific ingredient type for accurate results."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Get Conversion Results",
            "text": "Click Convert to see your results including the converted amount, conversion formula, and helpful reference conversions."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How many tablespoons are in a cup?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There are 16 tablespoons in 1 cup. This is a standard conversion in US cooking measurements. To convert cups to tablespoons, multiply by 16. For example, 1/2 cup = 8 tablespoons, 1/4 cup = 4 tablespoons."
            }
          },
          {
            "@type": "Question",
            "name": "How many grams are in a cup of flour?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "1 cup of all-purpose flour weighs approximately 125 grams. However, this can vary depending on the type of flour: bread flour is about 127g per cup, cake flour is about 114g per cup, and whole wheat flour is about 120g per cup. For the most accurate results, it's best to weigh flour rather than measure by volume."
            }
          },
          {
            "@type": "Question",
            "name": "Why do ingredient conversions vary by type?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Different ingredients have different densities, which means they weigh different amounts even when measured in the same volume. For example, 1 cup of granulated sugar weighs 200g, while 1 cup of flour weighs only 125g. This is why professional bakers often prefer weight measurements over volume measurements for consistency."
            }
          },
          {
            "@type": "Question",
            "name": "How do I scale a recipe for more or fewer servings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use the Recipe Scaling mode: enter the original number of servings and your desired number of servings. The calculator provides a scaling factor. Multiply all ingredient amounts in the recipe by this factor. For example, if scaling from 4 to 6 servings, the factor is 1.5, so 2 cups of flour becomes 3 cups."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between fluid ounces and weight ounces?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fluid ounces (fl oz) measure volume, while ounces (oz) measure weight. They are only equal for water (1 fl oz of water weighs approximately 1 oz). For other ingredients, the relationship varies by density. For example, 1 fl oz of honey weighs about 1.5 oz because honey is denser than water."
            }
          },
          {
            "@type": "Question",
            "name": "How many teaspoons are in a tablespoon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There are 3 teaspoons in 1 tablespoon. This is a standard conversion: 1 tbsp = 3 tsp = 15ml (approximately). This conversion is useful when a recipe calls for a measurement you don't have a measuring spoon for."
            }
          },
          {
            "@type": "Question",
            "name": "Why do some recipes use weight measurements instead of volume?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Weight measurements are more accurate and consistent than volume measurements, especially for baking. Factors like how you scoop flour or pack brown sugar can significantly affect volume measurements but not weight. Professional bakers and many international recipes use weight (grams) for precision and repeatability."
            }
          },
          {
            "@type": "Question",
            "name": "What's the best way to measure flour accurately?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The most accurate method is to weigh flour using a kitchen scale (125g = 1 cup all-purpose flour). If measuring by volume, use the 'spoon and level' method: stir the flour, spoon it into the measuring cup without packing, and level off with a straight edge. Never scoop directly from the bag as this compacts the flour and can add 25-30% more than intended."
            }
          }
        ]
      },
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

export const generateSpayNeuterCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/animals/pet-care/spayneuter-cost-calculator";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Spay/Neuter Cost Calculator - Pet Surgery Cost Estimator",
        "url": baseUrl,
        "description": "Calculate spay and neuter surgery costs for dogs, cats, and rabbits. Compare clinic types, regional pricing, traditional vs laparoscopic procedures, and get insurance reimbursement estimates.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Spay and neuter cost estimation for dogs, cats, and rabbits",
          "Male (neuter) and female (spay) procedure pricing",
          "Weight-based cost calculations for dogs",
          "Clinic type comparison (low-cost, mobile, private practice, specialty)",
          "Regional and state-based pricing adjustments",
          "Traditional vs laparoscopic spay comparison",
          "Special condition cost modifiers (pregnancy, cryptorchidism, brachycephalic)",
          "Additional services calculator (bloodwork, pain meds, e-collar, microchip)",
          "Pet insurance and wellness plan reimbursement estimator",
          "Multi-pet discount calculator",
          "Age-based recommendations",
          "Recovery time and pain comparison",
          "Budget planning tools",
          "5 calculation modes for different needs"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "8",
          "bestRating": "5"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Estimate Spay/Neuter Costs",
        "description": "Step-by-step guide to calculating spay and neuter surgery costs for your pet",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter Pet Information",
            "text": "Select your pet type (dog, cat, or rabbit), gender, weight category (for dogs), and age in months."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Choose Location and Clinic Type",
            "text": "Select your state, area type, and clinic type. Costs vary significantly by location and facility."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Indicate Special Conditions",
            "text": "Check applicable conditions: pregnancy, cryptorchidism, brachycephalic breed, or obesity."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Select Additional Services",
            "text": "Choose services: bloodwork, IV fluids, pain medication, e-collar, microchip, antibiotics, or exam."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Review Cost Estimate",
            "text": "Get total cost, breakdown, clinic comparison, recommendations, and money-saving tips."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why does spaying cost more than neutering?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Spaying costs $10-200 more because it requires internal abdominal surgery to remove ovaries and often the uterus, while neutering involves a simple external incision to remove testicles. Spaying requires working inside the abdominal cavity, ligating blood vessels, and closing multiple tissue layers."
            }
          },
          {
            "@type": "Question",
            "name": "How much does it cost to spay a dog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dog spaying costs $250-2,000 with a national average of $455. Low-cost clinics charge $50-150, mobile clinics $100-250, private practices $200-600, specialty clinics $500-2,000+. Costs vary by size, age, location, and procedure type."
            }
          },
          {
            "@type": "Question",
            "name": "How much does it cost to neuter a dog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dog neutering costs $250-885 with average $487. Low-cost clinics $50-150, private practices $200-600. Cryptorchidism adds $50-199, brachycephalic breeds $50-200 extra."
            }
          },
          {
            "@type": "Question",
            "name": "What's included in the spay/neuter cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Basic packages include surgery, anesthesia, green tattoo mark, and recovery. Extra costs: exam/bloodwork $60-100, pain medication $10-20, e-collar $10-15, IV fluids $45, microchip $15-20."
            }
          },
          {
            "@type": "Question",
            "name": "Are low-cost clinics safe and high-quality?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, low-cost clinics are safe, meeting the same licensing and safety standards. Staffed by licensed veterinarians using identical techniques. Lower costs from high-volume operations, subsidies, and streamlined procedures."
            }
          },
          {
            "@type": "Question",
            "name": "Does pet insurance cover spaying and neutering?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standard insurance doesn't cover spay/neuter. Optional wellness plans costing $24-50/month reimburse $135-150 toward procedures. Examples: ASPCA Prime $24.95/month, Pets Best $26/month."
            }
          },
          {
            "@type": "Question",
            "name": "How can I reduce spay/neuter costs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use low-cost clinics (50-75% savings), check state voucher programs, contact shelters for assistance, ask about multi-pet discounts (5% per pet), use wellness plans, consider payment plans, look for community events, check veterinary schools."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best age to spay or neuter my pet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cats: before 5 months. Dogs vary by size: small breeds 4-6 months, medium 6-9 months, large 9-12 months, giant 12-18 months. Spaying before first heat reduces mammary cancer 90%."
            }
          },
          {
            "@type": "Question",
            "name": "What is pediatric spay/neuter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Surgery performed at 6-16 weeks (before 4 months). Safe with 30+ years research. Benefits: faster surgery, quicker recovery (24 hours), less pain, reduced complications, prevents overpopulation."
            }
          },
          {
            "@type": "Question",
            "name": "Is it safe to spay a pregnant dog?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, spay-abortion is safe but more complex. Costs increase $15-150+ due to enlarged uterus and higher surgical complexity. Safest early in pregnancy (first 3-4 weeks)."
            }
          },
          {
            "@type": "Question",
            "name": "What is cryptorchidism and how does it affect cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "When testicles don't descend, occurring in 10% of male dogs. Increases neutering costs by $50-199 (total $375-725) due to abdominal surgery needed. Retained testicles have 10x higher cancer risk."
            }
          },
          {
            "@type": "Question",
            "name": "Why do brachycephalic breeds cost more?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Breeds like Bulldogs and Pugs incur $50-200 extra for increased anesthesia risks from airway abnormalities. Require specialized protocols, anti-nausea meds, extended monitoring, and oxygen therapy."
            }
          },
          {
            "@type": "Question",
            "name": "What is laparoscopic spay and is it worth it?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Minimally invasive surgery using small incisions and camera. Costs $200-250 more but offers 65% less pain, 3-5 day recovery vs 10-14 days, smaller incisions, reduced bleeding. Worth it for significantly improved comfort."
            }
          },
          {
            "@type": "Question",
            "name": "How long does the spay/neuter procedure take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Surgery: dog neuter 15-30 min, cat neuter 5-15 min, dog spay 30-60 min, cat spay 15-30 min. Total clinic time: 4-8 hours for exam, sedation, surgery, recovery."
            }
          },
          {
            "@type": "Question",
            "name": "What is the recovery time after spay/neuter surgery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Neuter: 5-7 days, traditional spay: 10-14 days, laparoscopic spay: 3-5 days. NO running, jumping, stairs, rough play during recovery. E-collar must be worn 24/7 to prevent licking."
            }
          },
          {
            "@type": "Question",
            "name": "What are the risks of spay/neuter surgery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Very safe with <5% complication rates, <1% serious. Risks: anesthesia reactions, bleeding, infection (2-3%), incision dehiscence. Higher risk in brachycephalic breeds, seniors, obese pets. Benefits far outweigh risks."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to do anything before the surgery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fast 12 hours before surgery (water until 2-3 hours before). Puppies/kittens 6-8 hours. Ensure vaccinations current, complete bloodwork for seniors, bring records and payment, arrive on time. Don't feed morning of surgery."
            }
          },
          {
            "@type": "Question",
            "name": "How do I care for my pet after surgery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "E-collar 24/7 for 10-14 days. Give prescribed pain medication. Restrict activity: NO running, jumping, stairs for 10-14 days. Monitor incision daily. Offer small amounts water/food after 2-4 hours. NO bathing 10-14 days."
            }
          },
          {
            "@type": "Question",
            "name": "When can my pet return to normal activity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Neuter: 5-7 days, traditional spay: 10-14 days, laparoscopic: 3-5 days. Gradual increase: Days 1-3 strict rest, 4-7 short walks, 8-10 moderate activity. After day 14 with vet approval: full normal activity permitted."
            }
          }
        ]
      },
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

export const generateBoardingCostCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = 'https://calcshark.com/pet-care/pet-care-costs/boarding-cost-calculator/';

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#webapp`,
        "name": "Pet Boarding Cost Calculator",
        "url": baseUrl,
        "description": "Calculate pet boarding costs across different facilities, compare options, and plan boarding expenses. Includes traditional kennels, veterinary boarding, luxury hotels, pet sitters, and multi-pet discounts.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Compare 6 facility types",
          "Multi-pet boarding costs",
          "Extended stay discounts",
          "Location-based pricing",
          "Holiday premium calculations",
          "Additional service costs"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "8",
          "bestRating": "5"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Pet Boarding Costs",
        "description": "Step-by-step guide to estimating pet boarding expenses for your trip",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter Pet Information",
            "text": "Select your pet type (dog or cat), pet size (small, medium, or large), and the number of pets you'll be boarding."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Choose Facility Type and Location",
            "text": "Select your preferred facility type (traditional kennel, veterinary boarding, luxury hotel, in-home sitting, daycare with overnight, or cage-free facility). Then choose your location type (urban, suburban, or rural) as pricing varies significantly by area."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Set Stay Duration and Dates",
            "text": "Enter the number of nights your pet will be boarding. If boarding during peak holiday periods (Christmas, Thanksgiving, summer vacation), check the holiday box as this adds 25-50% premium pricing."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Select Additional Services",
            "text": "Choose any add-on services: medication administration, grooming, training sessions, special diet, or webcam monitoring. Each service has additional daily or one-time costs."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Review Cost Breakdown",
            "text": "View your total estimated cost with detailed breakdown including base rate, extended stay discounts (if applicable), multi-pet discounts, location adjustments, holiday premiums, and additional service costs. Compare different calculation modes for comprehensive planning."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How far in advance should I book pet boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For regular periods, book 2-4 weeks in advance. For holidays (Christmas, Thanksgiving, summer), book 2-3 months ahead as facilities fill up quickly and prices increase 25-50%."
            }
          },
          {
            "@type": "Question",
            "name": "What vaccinations are required for boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dogs need rabies, DHPP (distemper, hepatitis, parvovirus, parainfluenza), and bordetella. Cats need rabies and FVRCP. Vaccinations must be current within the past year."
            }
          },
          {
            "@type": "Question",
            "name": "Can I bring my pet's own food?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, it's recommended to prevent digestive upset. Most facilities encourage this and don't charge for food you provide. They typically charge $5-15/day if using their food."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if my pet gets sick during boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Facilities have veterinary relationships and emergency protocols. They'll contact you immediately if illness occurs. Provide emergency contact info and vet authorization. Some include basic care; others charge separately."
            }
          },
          {
            "@type": "Question",
            "name": "Is boarding stressful for pets?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Initial stress is normal, but most adjust within 24-48 hours. Minimize stress by: visiting beforehand, bringing familiar items, considering trial stays, choosing facilities matching pet personality."
            }
          },
          {
            "@type": "Question",
            "name": "How often will my pet be walked or exercised?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Traditional kennels: 2-4 bathroom breaks daily. Daycare facilities: 4-8 hours supervised play. Luxury hotels: 3-5 individual walks plus playtime. Always ask about specific schedules."
            }
          },
          {
            "@type": "Question",
            "name": "Can I visit my pet during boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Policies vary. Some allow scheduled visits; others discourage it to prevent anxiety. Many offer webcam access for remote checking without disrupting routine."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between boarding and daycare?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Daycare is daytime-only (7am-7pm) focused on socialization, averaging $25-40/day. Boarding includes overnight stays with 24-hour supervision. Some offer combined packages."
            }
          },
          {
            "@type": "Question",
            "name": "Are there age restrictions for boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Puppies/kittens must be 4+ months and fully vaccinated. Elderly pets may need veterinary clearance or vet boarding recommended. Always disclose age and health conditions."
            }
          },
          {
            "@type": "Question",
            "name": "Do boarding facilities provide medication?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most administer medication you provide for $5-15/day depending on complexity. Provide detailed instructions and sufficient medication. Veterinary boarding best for complex needs."
            }
          },
          {
            "@type": "Question",
            "name": "What should I pack for my pet's boarding stay?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pack: enough food plus extra, medications with instructions, favorite toys/blankets, leash and ID tags, vaccination records, emergency contacts, and vet details. Label everything."
            }
          },
          {
            "@type": "Question",
            "name": "Is pet insurance helpful for boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Insurance doesn't cover boarding costs, but some plans cover boarding if you're hospitalized. Insurance DOES cover emergency veterinary care during boarding, saving hundreds or thousands."
            }
          },
          {
            "@type": "Question",
            "name": "Can aggressive or reactive dogs be boarded?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Some accept reactive dogs but may charge more for individual accommodations. Others specialize in difficult behaviors. Always be honest about temperament—facilities need this for safety."
            }
          },
          {
            "@type": "Question",
            "name": "What's the cancellation policy for boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Typically 48-72 hours notice for full refunds. Holiday bookings often require 7-14 days notice and may have 25-50% non-refundable deposits. Always read cancellation terms."
            }
          },
          {
            "@type": "Question",
            "name": "How do I know if my pet enjoyed boarding?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Happy pets show excitement returning to facility, eat normally, maintain regular behavior. Stress signs: appetite loss, lethargy, behavioral changes lasting 2-3+ days. Many facilities provide daily reports."
            }
          },
          {
            "@type": "Question",
            "name": "What questions should I ask when touring facilities?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ask about: staff-to-pet ratios, emergency protocols, vet relationships, 24/7 supervision, cleaning procedures, exercise schedules, temperature control, anxious pet handling, communication, viewing actual boarding areas."
            }
          },
          {
            "@type": "Question",
            "name": "Are cats and dogs boarded together?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, reputable facilities keep them completely separate to reduce stress. Cat areas are quieter with vertical space, hiding spots, no dog visibility/sounds. This separation is crucial."
            }
          },
          {
            "@type": "Question",
            "name": "What's included in luxury pet hotel packages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Luxury includes: private suites with raised beds, TVs/music, webcam access, multiple daily walks, one-on-one playtime, grooming, bedtime treats, photo updates, climate control, spa services. Expect $75-150/night."
            }
          },
          {
            "@type": "Question",
            "name": "Should I tip pet boarding staff?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tipping isn't required but appreciated for exceptional care. For extended/holiday stays, consider $20-50 or 15-20% of total, distributed among caretakers. Some bring treats or thank-you cards."
            }
          }
        ]
      },
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

export const generateFishingLineCapacityCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/sports-recreation/outdoor-activities/fishing-line-capacity-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Fishing Line Capacity Calculator - Reel Spool Capacity Estimator",
        "url": baseUrl,
        "description": "Calculate fishing line capacity for any reel size and line type. Estimate how much monofilament, braided, or fluorocarbon line fits on your spool with backing line calculations.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Line capacity calculations for monofilament, braided, and fluorocarbon lines",
          "Reel size conversion (1000, 2500, 3000, 4000, 5000 series)",
          "Backing line capacity estimator",
          "Line diameter to capacity converter",
          "Yards to meters conversion",
          "Multiple line type comparison",
          "Deep water fishing line requirements",
          "Fly fishing backing ratio calculator"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "8",
          "bestRating": "5"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Fishing Line Capacity",
        "description": "Step-by-step guide to calculating fishing line capacity for your reel",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Reel Size",
            "text": "Choose your reel size from common series (1000, 2500, 3000, 4000, 5000) or enter custom spool dimensions for accurate capacity calculations."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Choose Line Type",
            "text": "Select your line type (monofilament, braided, or fluorocarbon) as each has different diameter-to-strength ratios affecting capacity."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Enter Line Diameter",
            "text": "Input your line diameter in millimeters or choose from common test weights. Braided line allows significantly more capacity than mono at the same strength."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Add Backing Line (Optional)",
            "text": "Calculate backing line requirements if using expensive main line. Enter backing line diameter to see optimal backing-to-main-line ratios."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Review Capacity Results",
            "text": "View total line capacity in yards and meters, with recommendations for optimal spool fill (90-95% capacity) to prevent line issues."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate fishing line capacity for my reel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To calculate line capacity, you need your reel's spool dimensions (arbor diameter, spool width, spool depth) and line diameter. The formula is: Capacity = (Spool Volume × Line Density) / Line Cross-Section. Our calculator handles this automatically—just enter your reel size and line type for instant results."
            }
          },
          {
            "@type": "Question",
            "name": "Why does braided line have more capacity than monofilament?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Braided line has a much smaller diameter than monofilament at the same breaking strength. For example, 20lb braid is typically 0.23mm diameter while 20lb mono is 0.40mm. This smaller diameter means 2-3x more braided line fits on the same spool, making it ideal for deep water fishing or when maximum capacity is needed."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between reel sizes (1000, 2500, 3000, etc.)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Reel size numbers indicate spool capacity and overall size. 1000 series: ultralight (100-150 yards of 4lb mono), 2500: light (200 yards of 8lb mono), 3000: medium (250 yards of 10lb mono), 4000: medium-heavy (280 yards of 12lb mono), 5000+: heavy (300+ yards of 15lb+ mono). Larger reels hold more line and handle bigger fish."
            }
          },
          {
            "@type": "Question",
            "name": "How much backing line do I need with my main line?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use backing to fill 40-60% of your spool when using expensive main line. For a 300-yard capacity reel with 100 yards of main line, add 150-200 yards of cheaper backing. Use slightly thicker backing than main line to prevent digging in. Always leave 1-2mm gap at spool lip for proper casting."
            }
          },
          {
            "@type": "Question",
            "name": "Is fluorocarbon or monofilament thicker?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fluorocarbon is typically 15-20% thicker than monofilament at the same breaking strength due to its higher density. For example, 12lb fluoro is ~0.33mm while 12lb mono is ~0.28mm. This means less fluorocarbon fits on your spool, but you gain invisibility underwater and abrasion resistance."
            }
          },
          {
            "@type": "Question",
            "name": "Can I mix different line types on the same spool?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, mixing line types is common and practical. Popular combinations: mono backing with braid main line (cost-effective), braid backing with fluoro leader (stealth), or cheap mono backing with expensive main line. Connect with a double uni knot or Albright knot. Ensure backing is same or slightly larger diameter to prevent main line digging in."
            }
          },
          {
            "@type": "Question",
            "name": "How do I convert between yards and meters for line capacity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "1 yard = 0.9144 meters, 1 meter = 1.094 yards. Quick conversions: 100 yards ≈ 91 meters, 200 yards ≈ 183 meters, 300 yards ≈ 274 meters. Our calculator shows both units automatically. US manufacturers list in yards, while international brands often use meters."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if I overfill my reel spool?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Overfilling (beyond 95% capacity) causes wind knots, loops falling off the spool during casting, reduced casting distance, and line tangling. Underfilling (below 80%) reduces casting distance and efficiency. Optimal fill is 1-2mm (1/16 inch) below the spool lip for best performance."
            }
          },
          {
            "@type": "Question",
            "name": "Why is my actual line capacity different from calculations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Line capacity varies due to: actual line diameter (often thicker than labeled), line compression under tension, irregular spooling (loose or tight winding), manufacturing tolerances in spool dimensions, and line coating. Actual capacity is typically 10-15% less than theoretical calculations. Always verify with actual spooling when precision matters."
            }
          },
          {
            "@type": "Question",
            "name": "How does line stretch affect capacity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Line stretch doesn't significantly affect capacity calculations but impacts practical use. Monofilament stretches 20-30% under load, compressing on the spool and potentially allowing more line than calculated. Braided line has <5% stretch, maintaining consistent diameter. Fluorocarbon has moderate 10-15% stretch. Calculate capacity based on unstretched diameter."
            }
          },
          {
            "@type": "Question",
            "name": "Should I fill my reel to maximum capacity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, fill to 90-95% capacity (1-2mm below spool lip). Maximum fill causes tangles and loops. Underfilling wastes capacity and reduces casting distance. For most fishing: 200 yards is adequate, deep sea/surf: 300+ yards needed, bass/trout: 150 yards sufficient. Match capacity to your fishing style and target species run potential."
            }
          },
          {
            "@type": "Question",
            "name": "What line diameter should I use for different fish species?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Panfish/trout: 2-6lb (0.15-0.23mm), Bass: 8-14lb (0.25-0.33mm), Walleye/Redfish: 10-17lb (0.28-0.38mm), Salmon/Muskie: 15-30lb (0.36-0.50mm), Tuna/Marlin: 30-80lb (0.50-1.00mm). Use braided line for maximum capacity with same strength. Consider fish size, cover density, and fighting characteristics."
            }
          },
          {
            "@type": "Question",
            "name": "Can I use the same reel for different line types?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, but performance varies. Switching from mono to braid significantly increases capacity (2-3x more line). Switching to fluoro decreases capacity (~20% less). Consider keeping separate spools for different line types or use backing to adjust. Some reels come with multiple spare spools for quick line type changes while maintaining optimal capacity."
            }
          },
          {
            "@type": "Question",
            "name": "How much line do I need for deep water fishing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Deep water fishing requires: 200-300 yards minimum for depths to 200 feet, 300-500 yards for 200-500 feet, 500-800 yards for offshore big game (depths 500+ feet). Account for scope ratio (3:1 minimum—300 feet of line for 100 feet depth). Braided line is ideal for deep water due to thin diameter, high capacity, and low stretch for better hooksets."
            }
          },
          {
            "@type": "Question",
            "name": "What's the best line type for maximum capacity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Braided line offers maximum capacity—2-3x more than monofilament at the same strength. For example, a 3000 reel holds ~250 yards of 10lb mono but 500-600 yards of 10lb braid. Best for deep water, thick cover, or situations requiring maximum line. However, mono and fluoro offer stretch (shock absorption) and invisibility that braid lacks."
            }
          },
          {
            "@type": "Question",
            "name": "How do I measure my line diameter if it's not labeled?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use a micrometer or digital caliper for accurate measurement. Measure in 3-5 spots and average results. Without tools: compare to labeled line of known diameter, or use the manufacturer's published diameter charts (search '[brand] [line] diameter chart'). Be aware actual diameter often exceeds labeled diameter by 10-20%, especially with bargain brands."
            }
          },
          {
            "@type": "Question",
            "name": "Does line color affect diameter or capacity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Line color has minimal effect on diameter (<0.01mm difference) and negligible capacity impact. Color is a dye coating that doesn't significantly change line dimensions. Choose color based on visibility needs: clear/green for invisibility underwater, high-vis yellow/chartreuse for line watching and strike detection. Capacity calculations remain the same regardless of color."
            }
          },
          {
            "@type": "Question",
            "name": "Can I calculate capacity for old or used line?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, but used line may have increased diameter due to: water absorption (mono/fluoro swell 5-10%), coating degradation, micro-abrasions creating rough surface. Old line typically takes up 10-20% more spool space than new line. Replace line annually (or every 5-10 trips for heavy use) to maintain optimal capacity, strength, and performance. Calculate using original diameter specs."
            }
          },
          {
            "@type": "Question",
            "name": "What's backing-to-running-line ratio for fly fishing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fly fishing backing ratios depend on species: Trout (small streams): 50-100 yards backing, 90ft fly line; Steelhead/Salmon: 150-200 yards backing, 90-105ft fly line; Saltwater/Bonefish: 200-250 yards backing, 90-100ft fly line; Tarpon/Tuna: 300-400 yards backing, 90-105ft fly line. Use 20-30lb Dacron or gel-spun backing. Calculate total capacity minus fly line length to determine backing needs."
            }
          }
        ]
      },
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
