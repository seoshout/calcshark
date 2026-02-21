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

// Quarterback Rating Calculator Schema (comprehensive with all 19 FAQs)
export const generateQuarterbackRatingCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = 'https://calcshark.com/sports-recreation/sports-performance/quarterback-rating-calculator/';

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#webapp`,
        "name": "Quarterback Rating Calculator - NFL & NCAA Passer Rating",
        "description": "Calculate NFL and NCAA passer ratings with 5 calculation modes: basic single-game rating, QB comparison, season analyzer, perfect rating calculator, and college passer efficiency. Free and instant.",
        "url": baseUrl,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "8"
        },
        "creator": {
          "@type": "Organization",
          "name": "Calcshark"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate NFL Quarterback Passer Rating",
        "description": "Step-by-step guide to calculating NFL passer rating using the official formula with four components: completion percentage, yards per attempt, touchdown percentage, and interception percentage.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Game Statistics",
            "text": "Input the quarterback's passing attempts, completions, passing yards, touchdowns, and interceptions from the game.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Select Calculation Mode",
            "text": "Choose from 5 modes: Basic (single game), Comparison (2 QBs), Season Analyzer (full season), Perfect Rating (158.3 requirements), or NCAA (college efficiency).",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Review Component Breakdown",
            "text": "See the four rating components: (A) Completion %, (B) Yards/Attempt, (C) TD %, and (D) INT %, each capped at 0-2.375 points.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "View Overall Rating",
            "text": "Get the final passer rating on a 0-158.3 scale with performance grade: Perfect (158.3), Elite (120+), Excellent (110-119), Very Good (100-109), Above Average (90-99), Average (80-89), Below Average (70-79), or Poor (<70).",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Compare or Analyze",
            "text": "Use comparison mode to evaluate two QBs side-by-side, season analyzer for full-year projections, or perfect rating mode to see what stats are needed for 158.3.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is NFL passer rating calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NFL passer rating uses four components, each capped at 0-2.375: Component A = ((Completions/Attempts - 0.3) × 5), Component B = ((Yards/Attempts - 3) × 0.25), Component C = (Touchdowns/Attempts × 20), Component D = (2.375 - (Interceptions/Attempts × 25)). Final rating = ((A + B + C + D) / 6) × 100, resulting in a 0-158.3 scale. This formula equally weights completion percentage, yards per attempt, touchdown rate, and interception avoidance."
            }
          },
          {
            "@type": "Question",
            "name": "What is a perfect passer rating of 158.3?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A perfect 158.3 passer rating requires: 77.5% completion percentage (minimum), 12.5 yards per attempt (minimum), 11.875% touchdown rate (minimum), and 0% interception rate. Example: 20/20 attempts, 250+ yards, 3+ TDs, 0 INTs. There have been 82 perfect games in NFL history among 67 different quarterbacks. Ben Roethlisberger (2007 vs Rams) holds the record with 10/10, 209 yards, 5 TDs."
            }
          },
          {
            "@type": "Question",
            "name": "What's the difference between passer rating and QBR?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NFL Passer Rating (0-158.3 scale) uses only passing stats in a public formula: completions, attempts, yards, TDs, INTs. Total QBR (0-100 scale) is ESPN's proprietary metric that includes: rushing, sacks, fumbles, game context, win probability, and Expected Points Added. Passer rating is the official NFL stat since 1973. QBR adjusts for opponent strength and clutch situations but uses a secret formula. Both measure QB performance but weight factors differently."
            }
          },
          {
            "@type": "Question",
            "name": "What is a good passer rating in the NFL?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NFL passer rating benchmarks: 158.3 = Perfect (best possible), 120+ = Elite/MVP level (top 5 QBs), 110-119 = Excellent (Pro Bowl caliber), 100-109 = Very Good (above average starter), 90-99 = Above Average (solid starter), 80-89 = Average (acceptable starter), 70-79 = Below Average (backup quality), <70 = Poor (unacceptable). League average has risen from ~80 in 2000s to ~93 in 2023. A rating above 100 indicates elite performance."
            }
          },
          {
            "@type": "Question",
            "name": "How is NCAA passer rating different from NFL?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NCAA passer efficiency formula: ((8.4 × Yards) + (330 × TDs) + (100 × Completions) - (200 × INTs)) / Attempts. Key differences: No component capping (can exceed 200), no minimum/maximum limits, heavily weights touchdowns (330 points each vs NFL's percentage-based), severely penalizes interceptions (200 points each), simpler single formula vs NFL's four components. NCAA average ~140, elite >170. NFL rating can't exceed 158.3 while NCAA has no upper limit."
            }
          },
          {
            "@type": "Question",
            "name": "Why is passer rating capped at 158.3?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 158.3 maximum occurs when all four components reach their 2.375 cap: (2.375 + 2.375 + 2.375 + 2.375) / 6 × 100 = 158.333. Each component is capped to prevent extreme outliers from dominating the rating. The formula was designed in 1971 by Don Smith (Pro Football Hall of Fame) to create a balanced 0-100 scale, but the caps create the 158.3 ceiling. This ensures no single stat category (completion %, yards, TDs, INTs) can disproportionately inflate the rating."
            }
          },
          {
            "@type": "Question",
            "name": "Who has the highest career passer rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "As of 2024, career passer rating leaders (minimum 1,500 attempts): Aaron Rodgers: 103.6 (active), Patrick Mahomes: 103.3 (active), Deshaun Watson: 98.3, Russell Wilson: 98.0, Dak Prescott: 97.5. All-time greats: Tom Brady: 97.2, Drew Brees: 98.7, Peyton Manning: 96.5, Joe Montana: 92.3. The league average has increased dramatically: 1970s: ~65, 1990s: ~75, 2010s: ~88, 2020s: ~93. Modern rule changes favoring passing have elevated ratings across the league."
            }
          },
          {
            "@type": "Question",
            "name": "How many perfect passer ratings have there been?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There have been 82 perfect 158.3 passer ratings in NFL history (as of 2024) achieved by 67 different quarterbacks. Multiple perfect games: Lamar Jackson (4), Kurt Warner (3), Peyton Manning (3), Ben Roethlisberger (3), Ken O'Brien (3). Notable perfect games: Ben Roethlisberger 2007 vs Rams (10/10, 209 yards, 5 TDs), Marcus Mariota 2015 vs Jaguars (13/16, 209 yards, 4 TDs passing + 1 rushing). Perfect games represent roughly 0.4% of all QB performances, occurring about once per season league-wide."
            }
          },
          {
            "@type": "Question",
            "name": "What stats are needed for a perfect passer rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Perfect 158.3 rating minimum requirements: 77.5% completion rate or higher (31/40, 15/19, etc.), 12.5 yards per attempt or higher, 11.875% TD rate or higher (roughly 1 TD per 8.4 attempts), 0% interception rate (no picks). Example stat lines: 10/10, 125 yards, 2 TDs, 0 INTs; 20/25, 250 yards, 3 TDs, 0 INTs; 15/15, 188 yards, 2 TDs, 0 INTs. Key: Perfect completion (100%) allows lower yards/attempt. More attempts require higher yardage to maintain 12.5 YPA."
            }
          },
          {
            "@type": "Question",
            "name": "Does NFL passer rating account for rushing yards?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, NFL passer rating only measures passing performance: attempts, completions, yards, touchdowns, and interceptions. Rushing yards, rushing TDs, sacks, and fumbles are excluded. This limitation led ESPN to create Total QBR (2011), which includes rushing stats, sacks, fumbles, and game context. For dual-threat QBs like Lamar Jackson, Josh Allen, or Jalen Hurts, passer rating undervalues their total contribution. Some analysts use 'Total QBR' or custom formulas to evaluate modern mobile quarterbacks more accurately."
            }
          },
          {
            "@type": "Question",
            "name": "Why doesn't passer rating include sacks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Passer rating excludes sacks because the formula was created in 1971 when sacks weren't an official NFL stat (tracked starting 1982). Including sacks would penalize QBs for offensive line failures and reward QBs with better protection rather than better passing. However, sacks significantly impact winning: they lose yardage, kill drives, and cause fumbles. This is why advanced metrics like ESPN's Total QBR, ANY/A (Adjusted Net Yards per Attempt), and DVOA include sack data for more complete QB evaluation."
            }
          },
          {
            "@type": "Question",
            "name": "What is the lowest possible passer rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The theoretical minimum passer rating is 0.0, achieved when all four components bottom out at 0: 0% completion rate (0 completions), negative or <3 yards per attempt, 0% TD rate (no TDs), massive interception rate. Example: 0/10, 0 yards, 0 TDs, 5 INTs = 0.0 rating. Historical lows: Ty Detmer 2001 (0/6, 0 yards, 4 INTs) = 0.0, Peyton Manning 2015 vs Chiefs (5/20, 35 yards, 0 TDs, 4 INTs) = 0.0. Ratings below 40 are extremely rare and indicate catastrophic performance."
            }
          },
          {
            "@type": "Question",
            "name": "How has average NFL passer rating changed over time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NFL passer rating league averages by era: 1970s: ~65 (dead-ball era, physical defense), 1980s: ~73 (offensive rule changes begin), 1990s: ~77 (balanced era), 2000s: ~82 (improved QB play), 2010s: ~88 (pass-friendly rules), 2020s: ~93 (modern passing era). The 28-point increase since the 1970s reflects: illegal contact rules (1978), defenseless receiver protections (2009), reduced hitting on QBs, emphasis on pass interference calls, and improved QB training/analytics. 100+ ratings are now common; in the 1970s they were elite."
            }
          },
          {
            "@type": "Question",
            "name": "Is passer rating a good measure of QB performance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Passer rating is a useful but incomplete metric. Strengths: correlates well with winning (r=0.80), includes four key passing stats, simple and transparent formula, standardized since 1973 for historical comparison. Weaknesses: ignores rushing, sacks, fumbles, game context, clutch situations, opponent quality, drops vs catchable balls, garbage time stats. Better alternatives: Total QBR (includes all plays + context), EPA/play (expected points added), DVOA (opponent-adjusted), ANY/A (includes sacks). Use passer rating alongside other metrics for complete QB evaluation."
            }
          },
          {
            "@type": "Question",
            "name": "What is Total QBR and how is it calculated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Total QBR (ESPN, 2011) measures QB performance on a 0-100 scale using Expected Points Added (EPA). Components: passing efficiency, rushing yards/TDs, sacks taken, fumbles, game context (score, time, down), win probability contribution, opponent strength. The formula is proprietary, but it weights plays by importance: 4th quarter > 1st quarter, close games > blowouts, 3rd down > 1st down. QBR credits QBs for clutch plays and penalizes garbage time stats. QBR 75+ = MVP level, 60-75 = excellent, 50-60 = above average, <50 = below average. Unlike passer rating's 158.3 cap, QBR maxes at 100."
            }
          },
          {
            "@type": "Question",
            "name": "Can non-quarterbacks have passer ratings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, any player who attempts a pass gets a passer rating: wide receivers, running backs, punters, even offensive linemen on trick plays. Notable examples: Antwaan Randle El (WR): career 157.5 rating (7/9, 191 yards, 3 TDs, 0 INTs), Walter Payton (RB): 63.9 career rating, LaDainian Tomlinson: perfect 158.3 on multiple occasions. Wide receivers often have perfect or near-perfect ratings because they attempt passes rarely and only on high-percentage trick plays (WR pass, flea flicker). Minimum attempts for official QB rating: typically 14 attempts per team game (224 per season)."
            }
          },
          {
            "@type": "Question",
            "name": "How does completion percentage affect passer rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Completion percentage is Component A: ((Completions/Attempts - 0.3) × 5), capped at 0-2.375. The 0.3 baseline means 30% completion = 0 points, and 77.5% completion = max 2.375 points. Impact on final rating: Going from 50% to 60% completion adds ~8 points to rating, 60% to 70% adds another ~8 points, 70% to 77.5% adds ~6 points. However, completion % alone doesn't guarantee high rating - you also need yards/attempt, TDs, and no INTs. A 70% completion rate with 5 YPA, no TDs, and 2 INTs = ~75 rating (below average)."
            }
          },
          {
            "@type": "Question",
            "name": "Why do interceptions hurt rating more than TDs help?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Interceptions are weighted heavily because they're drive-killers and possession changes. Component D (INT): 2.375 - (INTs/Attempts × 25) means each INT per attempt costs 25× weight. Component C (TD): TDs/Attempts × 20 means each TD per attempt adds 20× weight. Practical example: 1 INT in 20 attempts drops rating by ~21 points, but 1 TD in 20 attempts adds ~17 points. This reflects football reality: turnovers are more damaging than TDs are beneficial. INTs can lead to opponent scores (pick-six, short field), while TDs only add 6-7 points for your team."
            }
          },
          {
            "@type": "Question",
            "name": "What is the minimum number of attempts for official rating?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NFL official passer rating qualifications: 14 attempts per team game scheduled (224 attempts for 16-game season, 238 for 17-game season). For single-season records, QB must play in 75% of team's games. Career records require 1,500 career attempts minimum. These minimums prevent fluky perfect ratings from small sample sizes (backup QB throwing 3/3 for 50 yards in garbage time). Active leaders and all-time rankings only include QBs meeting attempt thresholds. However, any QB with 1+ attempts gets a game passer rating, regardless of minimum."
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

// Price Comparison Calculator Schema
export const generatePriceComparisonCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/lifestyle-daily-life/shopping-savings/price-comparison-calculator/";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Price Comparison Calculator - Unit Price Comparison Tool",
        "url": baseUrl,
        "description": "Compare product prices across different sizes and brands. Calculate unit prices to find the best deals on groceries and household items. Multi-item comparison, bulk savings analysis, and unit converter tools.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Unit price calculator for any measurement",
          "Multi-item price comparison tool",
          "Bulk savings analysis calculator",
          "Savings percentage calculator",
          "Unit converter (metric and imperial)",
          "Price comparison across brands",
          "Break-even point calculator",
          "Coupon savings calculator",
          "Supports 9 unit types: oz, lb, kg, g, ml, L, gal, fl oz, and each"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "12",
          "bestRating": "5"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Compare Product Prices",
        "description": "Step-by-step guide to calculating and comparing unit prices for any products",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Enter First Product Information",
            "text": "Input the product name, total price, quantity, and unit of measurement for the first item you want to compare."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Enter Comparison Products",
            "text": "Add information for additional products you want to compare. You can compare 2 items, or use multi-item mode to compare 3 or more brands at once."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Select Calculation Mode",
            "text": "Choose your calculation mode: Basic Unit Price, Multi-Item Comparison, Bulk Savings Analysis, Unit Converter, or Savings Calculator."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Apply Coupons (Optional)",
            "text": "If applicable, enter any coupon amounts to see how they affect the actual unit price and total savings."
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Review Results",
            "text": "View the unit prices for all products, identify the best deal, see savings percentages, and get recommendations on which product offers the best value."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate unit price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unit price is calculated by dividing the total price by the quantity. For example: if a product costs $8.99 and contains 16 ounces, the unit price is $8.99 ÷ 16 = $0.5619 per ounce. This calculator does this automatically for any unit type you select."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best way to compare prices?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The best way to compare prices is to calculate the unit price for each item, then compare those unit prices. Never compare total prices alone when package sizes differ. Always convert to the same unit (per ounce, per pound, per item, etc.) to make accurate comparisons across different brands and sizes."
            }
          },
          {
            "@type": "Question",
            "name": "How to compare different sizes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To compare different sizes, convert the price of each item to a common unit using unit pricing. For example, if comparing a 12oz box ($3.99) and a 18oz box ($5.49), calculate: 12oz = $0.3325/oz and 18oz = $0.3050/oz. The larger box has a better unit price despite the higher total price."
            }
          },
          {
            "@type": "Question",
            "name": "Is bulk buying always cheaper?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bulk buying is usually cheaper per unit, but not always the smartest choice. Consider: 1) Will you actually use the product before it expires? 2) Do you have storage space? 3) Is the per-unit savings worth the higher upfront cost? 4) Can you afford the large purchase? Use the Bulk Savings Analysis mode to determine if bulk makes financial sense for your situation."
            }
          },
          {
            "@type": "Question",
            "name": "How much can you save buying in bulk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bulk savings typically range from 10-50% per unit compared to regular-sized packages. For example, buying a 32oz bottle for $8 (25 cents/oz) instead of four 8oz bottles at $2.99 each ($0.37/oz) saves you 32%. Use this calculator's bulk analysis mode to calculate exact savings for your specific products."
            }
          },
          {
            "@type": "Question",
            "name": "What is unit pricing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Unit pricing is the cost of a product per individual unit of measurement (per ounce, pound, kilogram, liter, gallon, or item count). It's the most accurate way to compare products because it removes the confusion of different package sizes. For example, 'cost per ounce' is a unit price, making it easy to compare any size container."
            }
          },
          {
            "@type": "Question",
            "name": "Convert price per pound to per ounce?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To convert price per pound to per ounce, divide by 16 (since there are 16 ounces in a pound). For example: if a product costs $4.80 per pound, it costs $4.80 ÷ 16 = $0.30 per ounce. This calculator can convert between any unit type automatically using the Unit Converter mode."
            }
          },
          {
            "@type": "Question",
            "name": "What units for grocery comparison?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Common grocery units are: ounces (oz) for packaged goods, pounds (lb) for produce/meat, milliliters (ml) and liters (L) for liquids, and gallons for bulk liquids. This calculator supports all 9 common units: oz, lb, kg, g, ml, L, gal, fl oz, and each. Choose the unit that matches your product."
            }
          },
          {
            "@type": "Question",
            "name": "How stores use unit pricing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Stores display unit pricing on shelf labels to help customers compare products. The unit price (like $0.25/oz) shows the cost per standardized unit, helping shoppers identify the best value regardless of package size. Many stores are required by law to display unit prices, though this varies by jurisdiction."
            }
          },
          {
            "@type": "Question",
            "name": "What is 20% rule for bulk buying?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The 20% rule suggests that bulk purchases should be at least 20% cheaper per unit than the regular-sized version to justify the purchase. For example, if a regular box costs $0.50/oz, the bulk version should cost $0.40/oz or less (20% savings). This accounts for the time and effort of buying bulk."
            }
          },
          {
            "@type": "Question",
            "name": "How to calculate savings percentage?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Savings percentage is calculated as: ((Original Price - Sale Price) ÷ Original Price) × 100. For example: if something costs $10 normally and is on sale for $7, you save ((10-7)÷10)×100 = 30%. This calculator shows savings percentages when comparing products."
            }
          },
          {
            "@type": "Question",
            "name": "Always buy lowest unit price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Usually yes, but not always. Consider these factors: 1) Freshness/expiration date (especially for perishables), 2) Quality differences (cheaper isn't always better), 3) Brand preference or allergies, 4) Whether you'll actually use the full quantity, 5) Storage space. The lowest unit price is the best mathematical value, but other factors matter."
            }
          },
          {
            "@type": "Question",
            "name": "Compare prices across brands?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use the Multi-Item Comparison mode to compare 3 or more brands at once. Input each brand's name, price, quantity, and unit. The calculator will show unit prices and identify the best deal. This helps you decide between name brands, store brands, and generics based on actual unit pricing, not packaging or marketing."
            }
          },
          {
            "@type": "Question",
            "name": "Hidden costs in bulk buying?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hidden costs include: 1) Storage (space in pantry/freezer), 2) Spoilage (if items expire before use), 3) Financial carrying cost (money tied up in inventory), 4) Hassle of storage and organization, 5) Potential waste if your needs change. The calculator shows per-unit savings, but consider these real-world costs in your decision."
            }
          },
          {
            "@type": "Question",
            "name": "Calculate break-even point?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The break-even point shows how many units you need to purchase at the bulk price to equal the cost of regular-sized packages. For example, if bulk costs less but requires a large upfront investment, knowing the break-even helps you decide if the purchase makes sense. This calculator shows break-even quantity in the Bulk Savings Analysis mode."
            }
          },
          {
            "@type": "Question",
            "name": "Compare metric and imperial units?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This calculator automatically converts between metric (grams, kilograms, milliliters, liters) and imperial (ounces, pounds, gallons) units. Simply select your units for each product, and it calculates a common unit price for comparison. For example, you can compare a 500g package to a 1lb package directly."
            }
          },
          {
            "@type": "Question",
            "name": "Best value vs cheapest?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cheapest means lowest total price, while best value means lowest unit price relative to quality. Best value usually means best unit price, but consider: 1) Quality differences, 2) Expiration dates, 3) What you'll actually use, 4) Total quantity needed. A slightly more expensive item with better quality and longer shelf life may be better value than the cheapest option."
            }
          },
          {
            "@type": "Question",
            "name": "How coupons affect unit price?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Coupons reduce the effective price paid. If an item costs $5 and you have a $1 coupon, your effective price is $4. Divide this adjusted price by the quantity to get the unit price with coupons applied. Many stores' digital coupons stack with sales. Always calculate unit price after applying coupons to see true savings."
            }
          },
          {
            "@type": "Question",
            "name": "How often prices change?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Grocery prices change frequently - sometimes weekly or even daily for sales. Bulk items may have different promotional cycles than regularly-sized products. Subscribe to store apps for price tracking, compare prices before big purchases, and note when your favorite items go on sale to buy bulk at the lowest unit price. Use this calculator whenever prices change."
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
// Temporary file - content to add to schemas.ts

export const generateDaysOnMarketCalculatorSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = 'https://calcshark.com/real-estate-property/home-buying-selling/days-on-market-calculator/';

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#webapp`,
        "name": "Days on Market (DOM) Calculator - Real Estate Listing Analysis",
        "description": "Calculate Days on Market (DOM), Cumulative Days on Market (CDOM), average DOM, and analyze pricing impact. 5 calculation modes for comprehensive real estate listing analysis.",
        "url": baseUrl,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "12"
        },
        "creator": {
          "@type": "Organization",
          "name": "Calcshark"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Days on Market (DOM) for Real Estate",
        "description": "Step-by-step guide to calculating Days on Market (DOM) and Cumulative Days on Market (CDOM) for real estate listings using MLS standards.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Select Calculation Mode",
            "text": "Choose from 5 modes: Basic DOM (listing to sale), CDOM Calculator (cumulative with relistings), Average DOM (multiple properties), Pricing Impact (DOM vs list price), or Property Comparison (compare 2 properties).",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Enter Listing Dates",
            "text": "For Basic DOM: input the original listing date and the sale/contract date. For CDOM: add all relisting periods and off-market days to track cumulative time on market.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Calculate DOM Value",
            "text": "The calculator computes DOM by counting days from listing to pending status. Formula: DOM = Sale Date - List Date. For CDOM, it accumulates all listing periods unless off-market for 45+ days.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Review Market Interpretation",
            "text": "Analyze the result: Hot Market (<30 days), Balanced Market (30-60 days), Slow Market (60-90 days), or Cold Market (90+ days). National median is 43-51 days.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Get Pricing Recommendations",
            "text": "Based on your DOM compared to market average, receive pricing strategy recommendations. High DOM suggests price reduction may be needed. Low DOM indicates competitive pricing.",
            "position": 5
          },
          {
            "@type": "HowToStep",
            "name": "Compare Properties",
            "text": "Use Comparison mode to evaluate multiple listings side-by-side. See which property is selling faster and by what percentage, helping with competitive market analysis.",
            "position": 6
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Days on Market (DOM)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Days on Market (DOM) is the number of days a property has been officially listed for sale on the Multiple Listing Service (MLS). The DOM calculation starts when the property is marked as 'active' and ends when a purchase contract is signed (status changes to 'pending' or 'under contract'). It's a key metric for understanding market conditions and pricing strategies."
            }
          },
          {
            "@type": "Question",
            "name": "What is CDOM vs DOM?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DOM (Days on Market) resets each time a property is relisted, while CDOM (Cumulative Days on Market) tracks the total time across all listings. For example: if a property was listed for 30 days, delisted, then relisted for 20 days before selling, DOM would be 20 days but CDOM would be 50 days. CDOM provides a more complete picture of marketing time."
            }
          },
          {
            "@type": "Question",
            "name": "What is a good Days on Market?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A 'good' DOM depends on your market, but general guidelines are: Under 30 days = hot market (high demand), 30-60 days = balanced market (normal conditions), 60-90 days = slow market (buyer's market), Over 90 days = cold market (may need price reduction). The national average DOM is typically 40-60 days, but this varies significantly by location and price range."
            }
          },
          {
            "@type": "Question",
            "name": "Does Days on Market reset?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "DOM resets when a property is relisted as a new listing. However, most MLSs have reset rules: if a property is off-market (cancelled or expired) for more than 45 consecutive days, both DOM and CDOM reset to 0. If relisted before 45 days, DOM resets but CDOM continues accumulating. This prevents artificial manipulation of DOM statistics."
            }
          },
          {
            "@type": "Question",
            "name": "How do you calculate Days on Market?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To calculate DOM, subtract the listing date from the contract acceptance date: DOM = Sale Date - List Date. For example, if a home was listed on January 1 and accepted an offer on January 25, the DOM is 24 days. This calculator automates this process and provides market insights based on the DOM value."
            }
          },
          {
            "@type": "Question",
            "name": "What is the national average Days on Market in 2025?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "As of 2025, the national average DOM is approximately 40-60 days, though this varies significantly by region. Hot markets (major tech hubs) average 25-35 days. Moderate markets average 45-60 days. Slow markets average 70-90+ days. The national median DOM is currently around 43-51 days according to Realtor.com and Redfin."
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

// Carbon Footprint Calculator Comprehensive Schema
export const generateCarbonFootprintSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/environmental-sustainability/carbon-waste/carbon-footprint-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Carbon Footprint Calculator - Advanced Household Emissions Tool",
        "url": baseUrl,
        "description": "Free advanced carbon footprint calculator for households. Analyze energy, transportation, flights, food, consumption, and waste with reduction scenarios and per-person benchmarking.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "13",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Household and per-person carbon footprint analysis",
          "Category breakdown for energy, transport, flights, food, consumption, and waste",
          "Reduction scenarios ranked by annual tons saved",
          "Uncertainty range for planning use",
          "U.S. baseline and climate target comparisons"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Use the Carbon Footprint Calculator",
        "description": "Step-by-step guide to estimate annual household and per-person carbon emissions and prioritize high-impact reduction actions.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Home Energy Inputs",
            "text": "Add annual electricity and fuel usage values using utility statements or yearly account summaries.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Enter Transportation and Flight Inputs",
            "text": "Provide vehicle miles, MPG, public transit miles, and annual short and long flight counts.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Add Lifestyle and Household Inputs",
            "text": "Set diet profile, monthly shopping spend, weekly waste, recycling rate, and household size.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Calculate and Review Detailed Results",
            "text": "Open the results popup to review total footprint, per-person benchmark, category breakdown, and top reduction scenarios.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Use Recommendations to Plan Reductions",
            "text": "Start with the highest-tons reduction scenarios and recalculate after implementation periods.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Why do different carbon footprint calculators give different results?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Different calculators use different system boundaries, emission factors, and assumptions. Some include only direct household emissions while others include food, consumption, and indirect categories."
            }
          },
          {
            "@type": "Question",
            "name": "Is this calculator designed for U.S. users?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Inputs and baseline assumptions are structured for U.S.-style household energy and transportation behavior patterns."
            }
          },
          {
            "@type": "Question",
            "name": "Should I track total household emissions or per-person emissions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Track both. Household totals are useful for operational planning, while per-person values improve comparability across household sizes."
            }
          },
          {
            "@type": "Question",
            "name": "How are transportation emissions estimated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Transportation emissions are estimated from annual miles, vehicle type, and MPG for personal driving, plus a separate factor for transit mileage."
            }
          },
          {
            "@type": "Question",
            "name": "What does the uncertainty range represent?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The uncertainty range is a planning band that reflects model and input variability. It is not a formal statistical confidence interval."
            }
          },
          {
            "@type": "Question",
            "name": "Can this calculator be used for compliance reporting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. This tool supports planning and education. Compliance reporting requires formal boundaries, auditable data, and approved reporting methodologies."
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

// Commute Cost Calculator Comprehensive Schema
export const generateCommuteCostSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/commute-cost-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Commute Cost Calculator - Advanced Drive vs Transit Cost Tool",
        "url": baseUrl,
        "description": "Free advanced commute cost calculator for U.S. users. Estimate annual commuting cost with fuel, maintenance, depreciation, parking, tolls, insurance allocation, and optional time value.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "11",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Annual and monthly commute cost estimation",
          "Cost-per-mile and cost-per-trip analysis",
          "Drive vs transit comparison",
          "Remote-work savings projection",
          "Scenario planning by highest annual savings"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Your Commute Cost",
        "description": "Step-by-step guide to estimate full commuting cost and evaluate savings scenarios.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Distance and Commute Frequency",
            "text": "Input one-way distance, commute days per week, and commute weeks per year to model annual trip volume.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Enter Driving Cost Inputs",
            "text": "Add MPG, fuel price, parking, tolls, maintenance per mile, depreciation per mile, and insurance assumptions.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Add Transit and Schedule Inputs",
            "text": "Input transit fare assumptions and remote-work days to model mode-switch and hybrid schedule savings.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Calculate and Review Detailed Results",
            "text": "Review annual cost, monthly cost, cost per mile, cost breakdown, and highest-impact savings scenarios.",
            "position": 4
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What costs are included in commute cost calculations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This calculator includes fuel, maintenance, depreciation, parking, tolls, insurance allocation, and optionally the value of commute time."
            }
          },
          {
            "@type": "Question",
            "name": "Why is fuel-only commute math misleading?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fuel-only models miss major categories like depreciation and maintenance, which often represent a large portion of annual commuting cost."
            }
          },
          {
            "@type": "Question",
            "name": "How does remote work affect commute cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Remote work reduces commute-day volume, cutting variable costs such as fuel, parking, tolls, and potentially time burden."
            }
          },
          {
            "@type": "Question",
            "name": "Can transit be cheaper than driving?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Transit can be cheaper depending on fare structure, parking/toll burden, and driving distance. This calculator compares both using your own assumptions."
            }
          },
          {
            "@type": "Question",
            "name": "Should I include the value of commute time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Including time value is useful for strategic decisions and often changes which commute option has the lowest total cost."
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

// Cost Per Mile Calculator Comprehensive Schema
export const generateCostPerMileSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/cost-per-mile-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Cost Per Mile Calculator - Advanced Vehicle Operating Cost Tool",
        "url": baseUrl,
        "description": "Free advanced cost per mile calculator for U.S. users. Model fuel, maintenance, depreciation, insurance, financing, fees, and optional time-value costs.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "12",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "All-in vehicle cost-per-mile analysis",
          "Variable and fixed-cost category modeling",
          "Transit-alternative annual comparison",
          "Scenario planning ranked by annual savings",
          "Optional time-value cost inclusion"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Vehicle Cost Per Mile",
        "description": "Step-by-step guide to estimate full vehicle operating cost per mile and prioritize savings actions.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Annual Mileage",
            "text": "Use realistic annual miles to establish the per-mile denominator.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add Fuel and MPG Inputs",
            "text": "Input local fuel price and realistic vehicle MPG assumptions.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Add Variable Per-Mile Costs",
            "text": "Enter maintenance, depreciation, and tire costs per mile.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Add Fixed Monthly Costs",
            "text": "Include insurance, financing, parking, tolls, and other recurring monthly fees.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Calculate and Review Breakdown",
            "text": "Review annual cost, cost per mile, largest cost drivers, and scenario-based savings opportunities.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is included in cost per mile calculations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "This calculator includes fuel, maintenance, depreciation, tire costs, insurance, financing, parking, tolls, recurring monthly costs, and optional time-value burden."
            }
          },
          {
            "@type": "Question",
            "name": "Why is fuel-only cost per mile inaccurate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fuel-only models exclude major categories such as depreciation, insurance, and financing, which can materially impact total operating cost."
            }
          },
          {
            "@type": "Question",
            "name": "Should depreciation be included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Depreciation is often one of the largest vehicle cost components and can exceed fuel cost in newer vehicles."
            }
          },
          {
            "@type": "Question",
            "name": "Can this calculator be used for business mileage planning?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, for budgeting and planning. Official tax reporting should still use IRS guidance and proper documentation."
            }
          },
          {
            "@type": "Question",
            "name": "How often should cost-per-mile assumptions be updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Quarterly updates are recommended due to price volatility and changing vehicle usage patterns."
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

// Diesel vs Gas Calculator Comprehensive Schema
export const generateDieselVsGasSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/diesel-vs-gas-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Diesel vs Gas Calculator - Advanced Ownership Cost Comparison Tool",
        "url": baseUrl,
        "description": "Free advanced diesel vs gas calculator for U.S. users. Compare annual ownership costs with fuel, maintenance, depreciation, insurance, repair reserve, and break-even analysis.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "9",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Diesel vs gas annual ownership-cost comparison",
          "Powertrain-specific category breakdown",
          "Break-even mileage and years estimation",
          "Upfront premium and resale recovery modeling",
          "Scenario stress testing for fuel and maintenance assumptions"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Compare Diesel vs Gas Ownership Cost",
        "description": "Step-by-step method to evaluate diesel vs gas using all-in annual ownership economics.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Mileage and Ownership Horizon",
            "text": "Start with realistic annual miles and expected ownership years.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add Fuel Prices and MPG Assumptions",
            "text": "Enter local diesel and gas prices plus realistic MPG values for each powertrain.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Add Maintenance and Depreciation Inputs",
            "text": "Input maintenance and depreciation per mile for diesel and gas vehicles.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Add Fixed Costs and Premium Inputs",
            "text": "Include insurance, repair reserve, diesel extras, and upfront premium assumptions.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Calculate and Review Break-Even Results",
            "text": "Review annual deltas, cost-per-mile, break-even thresholds, and scenario stress cases.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "When does diesel usually become cheaper than gas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Diesel usually becomes more favorable when annual mileage is high, MPG advantage is sustained, and the diesel premium can be recovered within the ownership period."
            }
          },
          {
            "@type": "Question",
            "name": "Why is fuel-only comparison not enough?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Fuel-only comparisons ignore maintenance, depreciation, insurance, and purchase-premium effects that can materially change total ownership economics."
            }
          },
          {
            "@type": "Question",
            "name": "How is break-even mileage estimated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Break-even mileage is estimated by comparing per-mile variable-cost advantage against annual fixed-cost differences between diesel and gas vehicles."
            }
          },
          {
            "@type": "Question",
            "name": "Should diesel-specific extras be included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Diesel-specific consumables and service assumptions should be included for realistic annual ownership totals."
            }
          },
          {
            "@type": "Question",
            "name": "How often should assumptions be updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Quarterly updates are recommended, and assumptions should be refreshed before final purchase decisions."
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

// E85 vs Regular Calculator Comprehensive Schema
export const generateE85VsRegularSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/e85-vs-regular-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "E85 vs Regular Calculator - Advanced Flex-Fuel Cost Comparison Tool",
        "url": baseUrl,
        "description": "Free advanced E85 vs regular calculator for U.S. flex-fuel vehicle users. Compare cost-per-mile, net annual savings, station-overhead impact, and break-even discount thresholds.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "8",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "E85 vs regular cost-per-mile analysis",
          "Net annual savings after station-overhead adjustments",
          "Break-even E85 price and discount threshold estimation",
          "Range and fill-up frequency comparison",
          "Scenario testing for price spread and seasonal MPG shifts"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Compare E85 vs Regular Fuel Cost",
        "description": "Step-by-step workflow to evaluate E85 economics using MPG loss, price spread, and convenience overhead.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Annual Miles and Baseline MPG",
            "text": "Input annual mileage and regular-gas MPG as your baseline efficiency reference.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add Local E85 and Regular Fuel Prices",
            "text": "Use current local prices to calculate realistic cost-per-mile for each fuel option.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Set Expected MPG Loss on E85",
            "text": "Enter expected E85 MPG reduction to account for lower energy content per gallon.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Add Station Overhead Inputs",
            "text": "Include extra detour miles, fill-time, and optional time-value to capture real-world fueling friction.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Review Break-Even Threshold and Scenarios",
            "text": "Compare required discount threshold, net annual savings, and scenario outcomes before choosing a fueling strategy.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much cheaper must E85 be to break even?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A practical starting rule is that E85 discount should roughly match MPG loss percentage, then be adjusted for station detour and time overhead."
            }
          },
          {
            "@type": "Question",
            "name": "Why is MPG usually lower on E85?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "E85 has lower energy content per gallon than regular gasoline, so flex-fuel vehicles typically use more volume per mile."
            }
          },
          {
            "@type": "Question",
            "name": "Should I compare MPG or cost per mile?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cost per mile is the more reliable decision metric because it combines both fuel price and efficiency in one value."
            }
          },
          {
            "@type": "Question",
            "name": "Can all gasoline vehicles use E85?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. E85 should only be used in vehicles designed for high-ethanol fuel, typically labeled as flex-fuel vehicles."
            }
          },
          {
            "@type": "Question",
            "name": "Why include station detour and time assumptions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Detour mileage and extra fueling time can materially reduce fuel-price savings, especially when E85 stations are not on-route."
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

// Electric Vehicle Savings Calculator Comprehensive Schema
export const generateElectricVehicleSavingsSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/electric-vehicle-savings-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Electric Vehicle Savings Calculator - Advanced EV vs Gas Cost Tool",
        "url": baseUrl,
        "description": "Free advanced EV savings calculator for U.S. drivers. Compare EV vs gas operating costs, charging mix sensitivity, break-even timeline, and ownership-period economics.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "9",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "EV vs gas annual operating-cost comparison",
          "Charging mix and charging-loss modeling",
          "Public charging overhead and time-cost analysis",
          "Break-even years and miles estimation",
          "Ownership-period net savings and scenario stress tests"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Estimate EV Savings vs Gas",
        "description": "Step-by-step method to calculate electric-vehicle savings under realistic charging and ownership assumptions.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Annual Miles and Gas Baseline",
            "text": "Use expected yearly mileage, gas price, and baseline gas-vehicle MPG.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add EV Efficiency and Charging Rates",
            "text": "Input EV miles-per-kWh plus home and public charging electricity rates.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Set Charging Mix and Charging Loss",
            "text": "Define home/public charging share and optional charging-loss percentage.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Add Maintenance, Insurance, and Purchase Inputs",
            "text": "Include annual maintenance/insurance assumptions and upfront vehicle-price and incentive values.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Review Net Savings and Break-Even Results",
            "text": "Evaluate annual savings, ownership-period outcomes, break-even timeline, and scenario sensitivity.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much can EVs save compared to gas vehicles?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Savings depend on mileage, local energy prices, charging mix, maintenance differences, insurance, and upfront purchase economics."
            }
          },
          {
            "@type": "Question",
            "name": "Why does home vs public charging mix matter?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Home charging is often materially cheaper than public fast charging, so charging mix can significantly change annual EV savings."
            }
          },
          {
            "@type": "Question",
            "name": "What is EV break-even timeline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Break-even timeline is the estimated time needed for annual EV operating savings to recover net upfront EV premium after incentives."
            }
          },
          {
            "@type": "Question",
            "name": "Should charging losses be included?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Including charging losses usually improves real-world planning accuracy because delivered energy per mile is higher than ideal assumptions."
            }
          },
          {
            "@type": "Question",
            "name": "How often should EV savings assumptions be updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Quarterly updates are recommended, and assumptions should be refreshed after major electricity, fuel, insurance, or usage changes."
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

// Fuel Cost Calculator Comprehensive Schema
export const generateFuelCostSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/fuel-cost-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Fuel Cost Calculator - Advanced Trip and Annual Fuel Budget Tool",
        "url": baseUrl,
        "description": "Free advanced fuel cost calculator for U.S. drivers. Estimate trip and annual fuel spending with effective MPG, city/highway mix, idle fuel use, fixed road costs, and multi-year budget projections.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "8",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Trip and annual fuel-cost estimation",
          "City/highway weighted MPG modeling",
          "Idle fuel waste estimation",
          "Tolls and parking cost layering",
          "Fuel-price sensitivity scenarios",
          "Multi-year fuel budget projection"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Calculate Fuel Cost for Trips and Annual Budgets",
        "description": "Step-by-step guide for estimating trip fuel cost, annual fuel burden, and scenario-based budget sensitivity.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Distance and Annual Mileage",
            "text": "Input one-way trip distance and annual mileage baseline for both short-term and annual planning.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add Fuel Price and MPG Inputs",
            "text": "Use current local fuel price and realistic vehicle MPG assumptions.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Configure Driving Mix and Idle Use",
            "text": "Set city/highway split and idle fuel assumptions to model real-world operating conditions.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Include Fixed Road Costs",
            "text": "Add recurring toll and parking costs for complete travel-cost planning.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Review Scenario and Projection Results",
            "text": "Analyze annual totals, cost-per-mile, stress scenarios, and multi-year projections before setting budgets.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I calculate fuel cost for a trip?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Trip fuel cost is estimated by dividing trip miles by effective MPG and multiplying by local fuel price per gallon."
            }
          },
          {
            "@type": "Question",
            "name": "Why use effective MPG instead of sticker MPG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Effective MPG reflects actual route mix and driving conditions, so it is usually more accurate for budgeting than label MPG."
            }
          },
          {
            "@type": "Question",
            "name": "Should idle fuel use be included in annual planning?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Idle fuel use can materially increase annual spend, especially for urban, delivery, or frequent stop-and-go usage patterns."
            }
          },
          {
            "@type": "Question",
            "name": "Do tolls and parking belong in fuel budgeting?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "For full travel-cost planning, include tolls and parking because they can be significant recurring costs alongside fuel."
            }
          },
          {
            "@type": "Question",
            "name": "How often should fuel-cost assumptions be updated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Monthly updates are best during volatile fuel markets, with quarterly updates as a minimum planning cadence."
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

// Fuel Economy Comparison Calculator Comprehensive Schema
export const generateFuelEconomyComparisonSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/fuel-economy-comparison-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Fuel Economy Comparison Calculator - Vehicle A vs Vehicle B Cost Tool",
        "url": baseUrl,
        "description": "Free advanced fuel economy comparison calculator for U.S. drivers. Compare Vehicle A vs Vehicle B using MPG, fuel price, annual miles, operating costs, and payback timeline.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "8",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Vehicle A vs Vehicle B annual operating-cost comparison",
          "Weighted city/highway MPG modeling",
          "Idle fuel-use and recurring-cost adjustments",
          "Break-even and payback estimation",
          "Scenario stress testing and multi-year projections"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Compare Fuel Economy Between Two Vehicles",
        "description": "Step-by-step method for comparing two vehicles using total operating economics.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Set Annual Mileage and Driving Mix",
            "text": "Enter annual miles and city/highway driving split to model realistic usage.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Input Fuel Price and MPG for Both Vehicles",
            "text": "Add local fuel prices and MPG assumptions for Vehicle A and Vehicle B.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Add Non-Fuel Annual Costs",
            "text": "Include maintenance, insurance, registration, and optional idle-fuel cost assumptions.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Set Projection Assumptions",
            "text": "Add fuel-price growth, mileage trend, and planning horizon for multi-year analysis.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Review Savings and Break-even Results",
            "text": "Compare annual cost totals, savings, payback, and scenario outputs before making decisions.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Should I compare MPG or total annual cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Total annual cost is the better decision metric because MPG alone excludes insurance, maintenance, and other recurring expenses."
            }
          },
          {
            "@type": "Question",
            "name": "Why does annual mileage matter so much?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Higher annual mileage magnifies per-mile fuel differences, which can materially change annual savings and payback timing."
            }
          },
          {
            "@type": "Question",
            "name": "When should weighted city/highway MPG be used?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use weighted MPG whenever your driving profile is known, since it better represents real-world efficiency than generic combined MPG."
            }
          },
          {
            "@type": "Question",
            "name": "What is break-even in this comparison?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Break-even is the estimated time needed for Vehicle B operating savings to recover any upfront purchase-price premium over Vehicle A."
            }
          },
          {
            "@type": "Question",
            "name": "How often should assumptions be refreshed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Quarterly updates are recommended, with more frequent updates during high fuel-price volatility or major usage changes."
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

// Fuel Tank Range Calculator Comprehensive Schema
export const generateFuelTankRangeSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  const baseUrl = "https://calcshark.com/automotive-transportation/fuel-efficiency/fuel-tank-range-calculator";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": "Fuel Tank Range Calculator - Advanced Range and Refuel Planning Tool",
        "url": baseUrl,
        "description": "Free advanced fuel tank range calculator for U.S. drivers. Estimate practical range using fuel level, reserve strategy, weighted MPG, route conditions, and safety buffers.",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "8",
          "bestRating": "5",
          "worstRating": "3"
        },
        "featureList": [
          "Usable-fuel and reserve-based range calculation",
          "Weighted city/highway MPG support",
          "Terrain, weather, and load penalty adjustments",
          "Safety-buffer and refuel-threshold planning",
          "Annual fuel budgeting and projection scenarios"
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": "How to Estimate Practical Fuel Tank Range",
        "description": "Step-by-step method for calculating realistic tank range and conservative refuel distance.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Enter Tank and Fuel-Level Inputs",
            "text": "Input tank capacity, current fuel level, and reserve percentage.",
            "position": 1
          },
          {
            "@type": "HowToStep",
            "name": "Add MPG and Driving Mix",
            "text": "Use combined MPG or weighted city/highway MPG assumptions based on your route profile.",
            "position": 2
          },
          {
            "@type": "HowToStep",
            "name": "Configure Real-World Penalties",
            "text": "Set terrain, weather, payload, tire, and optional idle-fuel assumptions.",
            "position": 3
          },
          {
            "@type": "HowToStep",
            "name": "Set Safety Buffer and Cost Inputs",
            "text": "Apply a planning safety buffer and fuel-price context for practical route and budget decisions.",
            "position": 4
          },
          {
            "@type": "HowToStep",
            "name": "Review Conservative Range and Scenarios",
            "text": "Use popup results, scenario outputs, and projection rows to define reliable refuel strategy.",
            "position": 5
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is practical tank range different from theoretical range?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Practical range uses reserve fuel and safety margins, while theoretical range often assumes full usable fuel and ideal conditions."
            }
          },
          {
            "@type": "Question",
            "name": "Why include reserve fuel in planning?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Reserve fuel helps reduce low-fuel risk and improves reliability when station access or traffic conditions are uncertain."
            }
          },
          {
            "@type": "Question",
            "name": "Do weather and terrain meaningfully affect range?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Hilly terrain, extreme temperatures, and HVAC load can materially reduce real-world MPG and tank range."
            }
          },
          {
            "@type": "Question",
            "name": "Why is conservative range important for trip planning?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Conservative range includes margin for uncertainty, helping drivers avoid late refuel decisions and route risk."
            }
          },
          {
            "@type": "Question",
            "name": "How often should I recalibrate range assumptions?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Recalibrate quarterly and before long trips, seasonal changes, or major shifts in driving pattern and vehicle condition."
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

const generateGenericFuelCalculatorSchema = (
  breadcrumbItems: BreadcrumbItem[],
  baseUrl: string,
  name: string,
  description: string,
  howToName: string,
  howToSteps: string[],
  faqPairs: Array<{ q: string; a: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": name,
        "url": baseUrl,
        "description": description,
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
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
          "ratingCount": "8",
          "bestRating": "5",
          "worstRating": "3"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": howToName,
        "description": description,
        "step": howToSteps.map((step, index) => ({
          "@type": "HowToStep",
          "name": `Step ${index + 1}`,
          "text": step,
          "position": index + 1
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": faqPairs.map((pair) => ({
          "@type": "Question",
          "name": pair.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": pair.a
          }
        }))
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

export const generateGasMileageSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  return generateGenericFuelCalculatorSchema(
    breadcrumbItems,
    "https://calcshark.com/automotive-transportation/fuel-efficiency/gas-mileage-calculator",
    "Gas Mileage Calculator - Advanced MPG and Fuel Cost Tool",
    "Free advanced gas mileage calculator for U.S. drivers. Estimate observed MPG, cost per mile, annual fuel spend, and planning scenarios.",
    "How to Calculate Gas Mileage and Annual Fuel Cost",
    [
      "Enter trip miles and gallons used for observed mileage calculation.",
      "Add annual miles and local fuel price assumptions.",
      "Review MPG, cost per mile, and annual fuel burden outputs.",
      "Test scenario sensitivity under price and efficiency changes.",
      "Use projection results for budgeting checkpoints."
    ],
    [
      { q: "How do you calculate gas mileage?", a: "Gas mileage is calculated as miles driven divided by gallons used." },
      { q: "Why use observed MPG instead of label MPG?", a: "Observed MPG reflects real route and driving conditions, improving planning accuracy." },
      { q: "How often should MPG assumptions be updated?", a: "Quarterly updates are recommended, with more frequent updates in volatile conditions." },
      { q: "Does small MPG improvement matter financially?", a: "Yes, even modest MPG gains can materially reduce annual fuel cost at higher mileage." },
      { q: "Can this support annual budgeting?", a: "Yes, it provides annual and projected fuel-cost outputs for planning." }
    ]
  );
};

export const generateGasSavingsSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  return generateGenericFuelCalculatorSchema(
    breadcrumbItems,
    "https://calcshark.com/automotive-transportation/fuel-efficiency/gas-savings-calculator",
    "Gas Savings Calculator - Fuel Efficiency Savings Estimator",
    "Free advanced gas savings calculator for U.S. drivers. Compare baseline and improved MPG assumptions to estimate annual and monthly savings.",
    "How to Estimate Gas Savings from Efficiency Improvements",
    [
      "Enter baseline and improved MPG assumptions.",
      "Input annual miles and local fuel price.",
      "Calculate annual and monthly fuel savings.",
      "Review scenario ranges for price and mileage volatility.",
      "Use projections for multi-year planning."
    ],
    [
      { q: "How are gas savings estimated?", a: "Savings are estimated as the difference between baseline and improved annual fuel costs." },
      { q: "Does annual mileage affect savings?", a: "Yes, higher annual mileage usually increases fuel-savings impact." },
      { q: "Can fuel price changes alter savings?", a: "Yes, fuel price volatility can materially shift expected savings." },
      { q: "Should non-fuel costs be considered separately?", a: "Yes, total-cost decisions should include maintenance and insurance effects." },
      { q: "How often should assumptions be refreshed?", a: "Update assumptions quarterly and after major fuel-price changes." }
    ]
  );
};

export const generateHybridSavingsSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  return generateGenericFuelCalculatorSchema(
    breadcrumbItems,
    "https://calcshark.com/automotive-transportation/fuel-efficiency/hybrid-savings-calculator",
    "Hybrid Savings Calculator - Hybrid vs Gas Cost Comparison Tool",
    "Free advanced hybrid savings calculator for U.S. drivers. Compare hybrid and gas annual operating costs and estimate premium payback timeline.",
    "How to Compare Hybrid Savings vs Gas Vehicle Costs",
    [
      "Enter annual miles and fuel assumptions.",
      "Add MPG values for gas and hybrid options.",
      "Include premium, maintenance, and insurance deltas.",
      "Review annual savings and payback results.",
      "Use scenarios and projections for risk-aware planning."
    ],
    [
      { q: "What does hybrid savings compare?", a: "It compares annual operating cost of gas and hybrid assumptions plus key deltas." },
      { q: "How is payback estimated?", a: "Payback is estimated by dividing upfront premium by annual net savings when positive." },
      { q: "Can a hybrid save fuel but still cost more?", a: "Yes, higher insurance or other costs can offset fuel savings." },
      { q: "Does mileage affect hybrid payback?", a: "Yes, higher annual mileage generally shortens hybrid payback timelines." },
      { q: "Should maintenance assumptions be included?", a: "Yes, maintenance deltas can be significant in total-cost comparisons." }
    ]
  );
};

export const generateMPGSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  return generateGenericFuelCalculatorSchema(
    breadcrumbItems,
    "https://calcshark.com/automotive-transportation/fuel-efficiency/mpg-calculator",
    "MPG Calculator - Weighted Fuel Economy and Cost Planner",
    "Free advanced MPG calculator for U.S. drivers. Estimate weighted MPG, cost per mile, and annual fuel cost using route-mix assumptions.",
    "How to Calculate Weighted MPG for Better Fuel Planning",
    [
      "Enter city MPG, highway MPG, and route mix percentages.",
      "Add annual miles and fuel price assumptions.",
      "Calculate weighted MPG and cost-per-mile outputs.",
      "Compare scenario sensitivity under changing assumptions.",
      "Use projection rows for budgeting cadence."
    ],
    [
      { q: "How is weighted MPG calculated?", a: "Weighted MPG uses city/highway shares and corresponding MPG values to estimate blended efficiency." },
      { q: "Why not use combined MPG only?", a: "Combined MPG can misstate cost if your real route profile differs from test assumptions." },
      { q: "Can weighted MPG improve budgeting accuracy?", a: "Yes, it aligns fuel estimates more closely with actual driving patterns." },
      { q: "Should route mix be updated seasonally?", a: "Yes, update route mix when usage patterns materially change." },
      { q: "How often should MPG assumptions be refreshed?", a: "Refresh assumptions quarterly or after major usage changes." }
    ]
  );
};

export const generateOctaneSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  return generateGenericFuelCalculatorSchema(
    breadcrumbItems,
    "https://calcshark.com/automotive-transportation/fuel-efficiency/octane-calculator",
    "Octane Calculator - Regular vs Premium Fuel Economics Tool",
    "Free advanced octane calculator for U.S. drivers. Compare regular vs premium cost per mile using price spread and performance assumptions.",
    "How to Compare Octane Fuel Grade Economics",
    [
      "Enter regular and premium fuel prices.",
      "Add baseline MPG and premium MPG-gain assumption.",
      "Calculate cost per mile and annual cost delta.",
      "Review break-even thresholds for premium economics.",
      "Test scenarios for price and mileage changes."
    ],
    [
      { q: "How is octane economics compared?", a: "Comparison uses cost per mile and annual cost under regular and premium assumptions." },
      { q: "Does premium always save money?", a: "No, premium only saves money when efficiency/performance gain offsets price spread." },
      { q: "How should MPG gain assumptions be set?", a: "Use conservative assumptions and validate with observed data where possible." },
      { q: "Can annual mileage change octane decision outcomes?", a: "Yes, higher annual mileage magnifies annual cost differences between grades." },
      { q: "Should manufacturer recommendations be followed first?", a: "Yes, always follow compatibility guidance before economics optimization." }
    ]
  );
};

export const generateTripFuelSchema = (breadcrumbItems: BreadcrumbItem[]) => {
  return generateGenericFuelCalculatorSchema(
    breadcrumbItems,
    "https://calcshark.com/automotive-transportation/fuel-efficiency/trip-fuel-calculator",
    "Trip Fuel Calculator - Route Cost and Fuel Stop Estimator",
    "Free advanced trip fuel calculator for U.S. drivers. Estimate trip fuel usage, trip cost, and refuel-stop strategy under practical assumptions.",
    "How to Estimate Trip Fuel Cost and Refuel Stops",
    [
      "Enter trip distance and MPG assumptions.",
      "Add fuel price and optional return-trip setting.",
      "Input tank capacity for stop-planning estimates.",
      "Calculate trip cost and fuel demand outputs.",
      "Review scenarios and projections for reliability."
    ],
    [
      { q: "How is trip fuel cost calculated?", a: "Trip fuel cost is estimated from trip miles divided by MPG multiplied by fuel price." },
      { q: "Why include return distance?", a: "Including return distance prevents underestimation for round-trip planning." },
      { q: "How are refuel stops estimated?", a: "Stops are estimated from trip fuel demand relative to tank-capacity assumptions." },
      { q: "What causes trip fuel estimate errors?", a: "Traffic, elevation, weather, and load changes can shift realized fuel use." },
      { q: "Should I plan with conservative assumptions?", a: "Yes, conservative assumptions reduce risk during long or uncertain routes." }
    ]
  );
};

interface MaintenanceSchemaConfig {
  title: string;
  description: string;
  howToTitle: string;
  howToSteps: string[];
  faqs: Array<{ q: string; a: string }>;
}

const maintenanceSchemaConfigs: Record<string, MaintenanceSchemaConfig> = {
  'battery-life-calculator': {
    title: 'Battery Life Calculator - Vehicle Battery Replacement Planner',
    description: 'Free advanced battery life calculator for U.S. drivers. Estimate remaining battery life, replacement risk, and reserve budgeting using age and warranty assumptions.',
    howToTitle: 'How to Plan Vehicle Battery Replacement Timing',
    howToSteps: [
      'Enter battery age, warranty horizon, and replacement cost assumptions.',
      'Review estimated remaining life and replacement-risk output.',
      'Use reserve targets to schedule replacement budgeting.',
      'Compare conservative and stress scenarios before deciding.',
      'Refresh assumptions after inspections and seasonal extremes.'
    ],
    faqs: [
      { q: 'How is remaining battery life estimated?', a: 'It estimates remaining life by comparing current battery age against the warranty or planning horizon.' },
      { q: 'Can weather affect battery lifespan?', a: 'Yes, very hot and very cold conditions can shorten real-world battery life.' },
      { q: 'Should I budget before failure happens?', a: 'Yes, reserve budgeting reduces sudden replacement stress and downtime risk.' },
      { q: 'Is warranty end date the same as battery failure date?', a: 'No, warranty limits coverage and does not guarantee exact lifespan.' },
      { q: 'How often should this estimate be updated?', a: 'Update after periodic inspections or when reliability symptoms appear.' }
    ]
  },
  'brake-pad-life-calculator': {
    title: 'Brake Pad Life Calculator - Remaining Miles and Service Timing',
    description: 'Free advanced brake pad life calculator for U.S. drivers. Estimate miles remaining, months to service, and reserve cost from wear and thickness assumptions.',
    howToTitle: 'How to Estimate Brake Pad Service Timing',
    howToSteps: [
      'Enter current pad thickness, minimum threshold, and wear rate.',
      'Add annual mileage and service cost assumptions.',
      'Calculate estimated miles and months remaining.',
      'Review downside wear scenarios before scheduling service.',
      'Confirm with inspection findings for safety decisions.'
    ],
    faqs: [
      { q: 'How are brake-pad miles remaining calculated?', a: 'The estimate uses usable pad thickness divided by assumed wear rate, then converted to miles.' },
      { q: 'Why does wear rate vary so much?', a: 'Driving style, traffic density, terrain, and vehicle load all change wear patterns.' },
      { q: 'Is this enough to make safety decisions?', a: 'Use this with physical inspection and braking-performance checks, not in isolation.' },
      { q: 'Can city driving shorten pad life?', a: 'Yes, stop-and-go driving usually increases wear and reduces service intervals.' },
      { q: 'Should I replace pads before minimum limit?', a: 'Conservative replacement thresholds are often safer and reduce unplanned downtime.' }
    ]
  },
  'diagnostic-time-calculator': {
    title: 'Diagnostic Time Calculator - Labor Hours and Cost Estimator',
    description: 'Free advanced diagnostic time calculator for U.S. shops and drivers. Estimate diagnostic labor hours and cost using complexity and labor-rate assumptions.',
    howToTitle: 'How to Estimate Diagnostic Labor Time',
    howToSteps: [
      'Enter base diagnostic hours and complexity multiplier.',
      'Add labor rate and applicable shop fees.',
      'Calculate expected diagnostic time and total cost.',
      'Run high-complexity scenarios to set expectation ranges.',
      'Track planned versus actual results for calibration.'
    ],
    faqs: [
      { q: 'How is diagnostic time estimated?', a: 'Diagnostic time is modeled as base hours multiplied by a complexity factor.' },
      { q: 'Why include a complexity multiplier?', a: 'Complexity captures case variance in fault isolation and troubleshooting scope.' },
      { q: 'Can this support quote preparation?', a: 'Yes, as a planning baseline before final scope confirmation and approvals.' },
      { q: 'How do shops reduce diagnostic overruns?', a: 'Standard intake and repeatable workflows usually reduce estimate variance.' },
      { q: 'Should I include misc fees in planning?', a: 'Yes, excluding fees often understates total customer-facing diagnostic cost.' }
    ]
  },
  'diy-savings-calculator': {
    title: 'DIY Savings Calculator - DIY vs Shop Repair Economics',
    description: 'Free advanced DIY savings calculator for U.S. vehicle owners. Compare DIY and shop economics including labor, markup, and time-value assumptions.',
    howToTitle: 'How to Compare DIY and Shop Repair Cost',
    howToSteps: [
      'Enter shop labor rate, hours, parts, and markup assumptions.',
      'Add DIY hours and your value-of-time assumption.',
      'Calculate net savings between DIY and professional service.',
      'Stress-test with rework and time-overrun scenarios.',
      'Choose a strategy based on risk and total cost.'
    ],
    faqs: [
      { q: 'How are DIY savings calculated?', a: 'Savings compare shop total cost against DIY parts plus time-value and risk assumptions.' },
      { q: 'Why include value-of-time?', a: 'Ignoring your time can overstate DIY savings on complex jobs.' },
      { q: 'Is DIY always cheaper?', a: 'No, tools, rework risk, and time requirements can offset savings.' },
      { q: 'Should I include tool purchases?', a: 'Yes, first-time tool costs should be part of realistic DIY planning.' },
      { q: 'When should I avoid DIY?', a: 'Avoid high-risk or safety-critical jobs if required skill or tooling is uncertain.' }
    ]
  },
  'fleet-maintenance-calculator': {
    title: 'Fleet Maintenance Calculator - Multi-Vehicle Cost Planner',
    description: 'Free advanced fleet maintenance calculator for U.S. operators. Estimate annual fleet maintenance spend including labor, parts, event frequency, and downtime.',
    howToTitle: 'How to Estimate Fleet Maintenance Budget',
    howToSteps: [
      'Enter fleet size and annual maintenance event assumptions.',
      'Add labor, parts, fees, and downtime-cost inputs.',
      'Calculate annual fleet maintenance and total exposure.',
      'Run frequency and cost-inflation stress scenarios.',
      'Use outputs to set budget and scheduling thresholds.'
    ],
    faqs: [
      { q: 'What does annual fleet maintenance output include?', a: 'It includes per-event maintenance cost multiplied by event frequency and vehicle count.' },
      { q: 'Why include downtime cost?', a: 'Downtime can materially increase total fleet impact beyond invoice cost.' },
      { q: 'Can this support annual budgeting?', a: 'Yes, it is built for planning and scenario-based budget setting.' },
      { q: 'How often should assumptions be refreshed?', a: 'Quarterly reviews are typical, or sooner after major cost shifts.' },
      { q: 'What input usually drives the largest variance?', a: 'Fleet size and event frequency often dominate total cost variance.' }
    ]
  },
  'labor-rate-calculator': {
    title: 'Labor Rate Calculator - Fully Burdened Shop Rate Tool',
    description: 'Free advanced labor rate calculator for U.S. shops. Estimate fully burdened labor rates using wage, overhead, and margin assumptions.',
    howToTitle: 'How to Set a Sustainable Labor Rate',
    howToSteps: [
      'Enter base technician wage, overhead, and target margin.',
      'Calculate recommended fully burdened labor rate.',
      'Review hourly margin buffer from current assumptions.',
      'Test wage and overhead stress cases before pricing updates.',
      'Validate with realized job-margin tracking each month.'
    ],
    faqs: [
      { q: 'How is labor rate calculated?', a: 'Rate is estimated from base wage with overhead and target margin adjustments.' },
      { q: 'Why separate overhead from wage?', a: 'Separating layers improves transparency and pricing governance.' },
      { q: 'Can underpricing hurt operations?', a: 'Yes, persistent underpricing compresses margins and limits reinvestment.' },
      { q: 'How often should labor rates be reviewed?', a: 'Review quarterly or whenever wage and overhead assumptions shift.' },
      { q: 'Is this useful for quote consistency?', a: 'Yes, it helps standardize labor policy across service lines.' }
    ]
  },
  'maintenance-schedule-calculator': {
    title: 'Maintenance Schedule Calculator - Next Service Timing Planner',
    description: 'Free advanced maintenance schedule calculator for U.S. drivers and fleets. Estimate miles to next service, overdue risk, and scheduling windows.',
    howToTitle: 'How to Plan Vehicle Service Intervals',
    howToSteps: [
      'Enter current odometer, last-service odometer, and interval miles.',
      'Add annual mileage and service-ticket assumptions.',
      'Calculate miles and months to next service window.',
      'Review overdue or high-usage risk scenarios.',
      'Set alert thresholds for schedule reassessment.'
    ],
    faqs: [
      { q: 'How are miles to next service calculated?', a: 'It subtracts miles since last service from the planned service interval.' },
      { q: 'What if the result is negative?', a: 'A negative value indicates overdue service and should be prioritized.' },
      { q: 'Why convert miles to months?', a: 'Month-based planning helps coordinate calendar scheduling and workload.' },
      { q: 'Can intervals change over time?', a: 'Yes, severe usage conditions can justify shorter service intervals.' },
      { q: 'How often should this schedule be recalculated?', a: 'Monthly updates are practical when mileage patterns vary.' }
    ]
  },
  'parts-markup-calculator': {
    title: 'Parts Markup Calculator - Parts Pricing and Margin Estimator',
    description: 'Free advanced parts markup calculator for U.S. shops. Estimate sale price, gross profit, and margin quality from parts-cost and markup assumptions.',
    howToTitle: 'How to Evaluate Parts Markup and Margin',
    howToSteps: [
      'Enter base parts cost and markup percentage.',
      'Calculate expected sale price and gross profit.',
      'Review resulting margin percentage and sensitivity.',
      'Run supplier-cost stress scenarios for pricing resilience.',
      'Use realized margin tracking to calibrate policy.'
    ],
    faqs: [
      { q: 'What is the difference between markup and margin?', a: 'Markup is based on cost, while margin is based on sale price.' },
      { q: 'How is parts selling price estimated?', a: 'Price is calculated as parts cost multiplied by one plus markup percent.' },
      { q: 'Can high markup reduce close rates?', a: 'Yes, excessive markup can weaken competitiveness and customer trust.' },
      { q: 'Should markup policy be standardized?', a: 'Yes, standardization improves quote consistency and margin control.' },
      { q: 'How frequently should markup assumptions be revised?', a: 'Update when supplier costs or target margin requirements change.' }
    ]
  },
  'repair-vs-replace-calculator': {
    title: 'Repair vs Replace Calculator - Lifecycle Cost Decision Tool',
    description: 'Free advanced repair vs replace calculator for U.S. vehicle decisions. Compare repair-path cost and replacement cost over a multi-year horizon.',
    howToTitle: 'How to Compare Repair and Replacement Paths',
    howToSteps: [
      'Enter current repair cost, replacement cost, and planning horizon.',
      'Add annual repair-growth and downtime assumptions.',
      'Calculate lifecycle cost delta between both options.',
      'Evaluate downside scenarios for repair escalation risk.',
      'Choose action thresholds for replacement timing.'
    ],
    faqs: [
      { q: 'What does repair vs replace delta represent?', a: 'It represents the cost difference between replacement and projected repair path.' },
      { q: 'Why model repair-cost growth?', a: 'Escalating repairs can change decision economics quickly over time.' },
      { q: 'Should downtime be included?', a: 'Yes, downtime often has meaningful operational and financial impact.' },
      { q: 'Can replacement be correct before failure?', a: 'Yes, proactive replacement can be rational under high repair-risk conditions.' },
      { q: 'How often should this decision be revisited?', a: 'Reevaluate after major repairs, usage changes, or cost shocks.' }
    ]
  },
  'service-cost-estimator-calculator': {
    title: 'Service Cost Estimator Calculator - Full Service Ticket Planner',
    description: 'Free advanced service cost estimator for U.S. shops and drivers. Estimate full service ticket cost from labor, parts, fees, and downtime assumptions.',
    howToTitle: 'How to Estimate Total Service Ticket Cost',
    howToSteps: [
      'Enter labor rate, service hours, and parts assumptions.',
      'Add parts markup, fees, and optional downtime cost.',
      'Calculate estimated total service-ticket amount.',
      'Run rate and parts inflation scenarios for quote resilience.',
      'Compare estimated versus actual after completion.'
    ],
    faqs: [
      { q: 'What does total service estimate include?', a: 'It includes labor, marked-up parts, fees, and optional downtime impact.' },
      { q: 'Why include downtime in service estimates?', a: 'Downtime can materially increase total economic impact for clients.' },
      { q: 'Can this be used for quote preparation?', a: 'Yes, it is a planning baseline before final scope confirmation.' },
      { q: 'How can estimate variance be reduced?', a: 'Use standardized rate assumptions and post-job variance review loops.' },
      { q: 'Should parts and labor be stress tested separately?', a: 'Yes, separate stress tests reveal which layer drives volatility.' }
    ]
  },
  'tire-pressure-calculator': {
    title: 'Tire Pressure Calculator - Pressure Impact on Fuel and Wear',
    description: 'Free advanced tire pressure calculator for U.S. drivers. Estimate fuel-cost impact and efficiency penalty from PSI deviation assumptions.',
    howToTitle: 'How to Estimate Tire Pressure Cost Impact',
    howToSteps: [
      'Enter current and recommended PSI values.',
      'Add annual miles, MPG, and fuel-price assumptions.',
      'Calculate annual fuel-impact estimate from pressure delta.',
      'Review downside cases for additional underinflation.',
      'Use output to set pressure-check maintenance cadence.'
    ],
    faqs: [
      { q: 'How does pressure deviation affect cost?', a: 'Underinflation can reduce efficiency and increase annual fuel spend.' },
      { q: 'Is even small PSI drift important?', a: 'Yes, small PSI deviations can compound over high annual mileage.' },
      { q: 'Does this tool estimate tire wear too?', a: 'It focuses on cost and efficiency impact, with wear risk as planning context.' },
      { q: 'How often should PSI be checked?', a: 'Regular checks and seasonal adjustments are recommended.' },
      { q: 'Can fuel-price changes magnify impact?', a: 'Yes, higher fuel prices increase the annual cost penalty from underinflation.' }
    ]
  },
  'tire-size-calculator': {
    title: 'Tire Size Calculator - Diameter and Fitment Change Analyzer',
    description: 'Free advanced tire size calculator for U.S. drivers. Compare old and new tire dimensions and estimate diameter and speedometer-impact deltas.',
    howToTitle: 'How to Compare Tire Size Changes Safely',
    howToSteps: [
      'Enter new tire width, aspect ratio, and rim diameter.',
      'Enter current tire size as baseline.',
      'Calculate diameter and percent-delta outputs.',
      'Review speedometer-shift and fitment-context estimates.',
      'Validate clearances and OEM guidance before purchase.'
    ],
    faqs: [
      { q: 'How is tire-size difference calculated?', a: 'It compares computed tire diameters from width, aspect ratio, and rim size.' },
      { q: 'Why does diameter change matter?', a: 'Diameter shifts can affect speedometer readings and fitment behavior.' },
      { q: 'Can larger tires always improve performance?', a: 'No, changes can introduce tradeoffs in handling, efficiency, and clearance.' },
      { q: 'Should fitment be verified beyond calculator math?', a: 'Yes, always validate vehicle-specific clearance and compatibility.' },
      { q: 'Can tire-size changes affect costs?', a: 'Yes, they can influence fuel use, replacement pricing, and wear profile.' }
    ]
  },
  'warranty-coverage-calculator': {
    title: 'Warranty Coverage Calculator - Covered vs Out-of-Pocket Estimator',
    description: 'Free advanced warranty coverage calculator for U.S. vehicle repairs. Estimate covered amount, deductible impact, and out-of-pocket exposure.',
    howToTitle: 'How to Estimate Warranty Claim Exposure',
    howToSteps: [
      'Enter claim amount, deductible, and coverage percentage.',
      'Calculate covered and out-of-pocket estimate outputs.',
      'Review sensitivity to deductible and coverage changes.',
      'Use results before authorizing major repair work.',
      'Confirm final coverage with provider policy terms.'
    ],
    faqs: [
      { q: 'How is covered amount estimated?', a: 'Covered amount is eligible claim after deductible multiplied by coverage percent.' },
      { q: 'Why does deductible matter so much?', a: 'Deductible directly increases out-of-pocket exposure on each claim.' },
      { q: 'Can high coverage still leave large costs?', a: 'Yes, exclusions and deductible rules can still create significant exposure.' },
      { q: 'Is this calculator a policy guarantee?', a: 'No, final outcomes depend on warranty contract terms and approvals.' },
      { q: 'Should assumptions be verified every claim?', a: 'Yes, verify coverage terms and pre-authorization requirements each time.' }
    ]
  }
};

export const generateMaintenanceSuiteSchema = (calculatorSlug: string, breadcrumbItems: BreadcrumbItem[]) => {
  const config = maintenanceSchemaConfigs[calculatorSlug];
  const baseUrl = `https://calcshark.com/automotive-transportation/maintenance-parts/${calculatorSlug}`;

  if (!config) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        generateSoftwareSchema('Maintenance Calculator', 'Maintenance planning calculator', 'Automotive Maintenance'),
        generateBreadcrumbSchema(breadcrumbItems)
      ]
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": config.title,
        "url": baseUrl,
        "description": config.description,
        "applicationCategory": "UtilityApplication",
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
          "Advanced maintenance calculations",
          "Scenario sensitivity analysis",
          "Multi-year projections",
          "Popup-only detailed result reporting",
          "No sign-up required"
        ],
        "author": {
          "@type": "Organization",
          "name": "Calcshark",
          "url": "https://calcshark.com"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": config.howToTitle,
        "description": config.description,
        "step": config.howToSteps.map((step, index) => ({
          "@type": "HowToStep",
          "name": `Step ${index + 1}`,
          "text": step,
          "position": index + 1
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": config.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      generateBreadcrumbSchema(breadcrumbItems)
    ]
  };
};

const vehicleCostsSchemaConfigs: Record<string, MaintenanceSchemaConfig> = {
  'auto-loan-calculator': {
    title: 'Auto Loan Calculator - Payment and Interest Planner',
    description: 'Free advanced auto loan calculator for U.S. drivers. Estimate monthly payment, total interest, and loan affordability under multiple financing assumptions.',
    howToTitle: 'How to Estimate Auto Loan Cost',
    howToSteps: [
      'Enter vehicle price, down payment, trade-in value, APR, and loan term.',
      'Calculate monthly payment and total interest.',
      'Review scenario sensitivity before choosing financing terms.',
      'Use projection rows for budgeting and affordability planning.'
    ],
    faqs: [
      { q: 'How is monthly payment calculated?', a: 'Payment is calculated using standard amortization from principal, APR, and term.' },
      { q: 'What drives total interest most?', a: 'APR and loan length usually drive the largest total-interest changes.' },
      { q: 'Should I optimize monthly payment only?', a: 'No, compare monthly payment with total interest and all-in ownership cost.' }
    ]
  },
  'car-depreciation-calculator': {
    title: 'Car Depreciation Calculator - Vehicle Value Decline Estimator',
    description: 'Free advanced car depreciation calculator for U.S. owners. Estimate current value, value loss, and trade-in baseline with age and condition assumptions.',
    howToTitle: 'How to Estimate Vehicle Depreciation',
    howToSteps: [
      'Enter original price, vehicle age, depreciation rate, and mileage.',
      'Apply condition adjustments for practical valuation context.',
      'Review estimated current value and depreciation loss.',
      'Compare scenarios before resale or trade-in decisions.'
    ],
    faqs: [
      { q: 'How is depreciation modeled?', a: 'Depreciation is modeled as compounded annual value decline over vehicle age.' },
      { q: 'Does mileage affect value significantly?', a: 'Yes, higher mileage often reduces value relative to baseline assumptions.' },
      { q: 'Is this a final market quote?', a: 'No, it is a planning estimate and should be validated with live market offers.' }
    ]
  },
  'car-insurance-calculator': {
    title: 'Car Insurance Calculator - Annual Premium Planning Tool',
    description: 'Free advanced car insurance calculator for U.S. drivers. Estimate annual premium exposure and monthly impact using value and usage assumptions.',
    howToTitle: 'How to Estimate Annual Insurance Cost',
    howToSteps: [
      'Enter baseline annual insurance and vehicle value assumptions.',
      'Add mileage and usage context.',
      'Calculate estimated annual and monthly insurance exposure.',
      'Compare sensitivity cases to improve policy budgeting.'
    ],
    faqs: [
      { q: 'What is included in this estimate?', a: 'The estimate uses baseline premium with modeled value and usage adjustments.' },
      { q: 'Can coverage choices change results a lot?', a: 'Yes, deductibles and coverage limits can materially change premium cost.' },
      { q: 'Should insurance be reviewed with TCO?', a: 'Yes, insurance is a major recurring ownership cost driver.' }
    ]
  },
  'car-lease-calculator': {
    title: 'Car Lease Calculator - Lease Payment and Cost Analyzer',
    description: 'Free advanced car lease calculator for U.S. drivers. Estimate lease payments from cap cost, residual value, money factor, and term assumptions.',
    howToTitle: 'How to Estimate Car Lease Payments',
    howToSteps: [
      'Enter vehicle price, residual percentage, money factor, and lease term.',
      'Include down payment, trade-in, and acquisition fees.',
      'Calculate monthly lease payment and total lease-path cost.',
      'Use scenarios for residual and money-factor stress testing.'
    ],
    faqs: [
      { q: 'What drives lease payment the most?', a: 'Cap cost, residual value, money factor, and lease term are the main drivers.' },
      { q: 'Is money factor the same as APR?', a: 'Not exactly, but it serves a similar financing-cost role in leases.' },
      { q: 'Should upfront fees be included?', a: 'Yes, excluding upfront fees can understate total lease economics.' }
    ]
  },
  'car-payment-calculator': {
    title: 'Car Payment Calculator - Monthly Payment and Total Cost Tool',
    description: 'Free advanced car payment calculator for U.S. buyers. Estimate monthly payment, interest, and affordability under practical financing assumptions.',
    howToTitle: 'How to Plan Car Payment Affordability',
    howToSteps: [
      'Enter financed amount inputs and loan assumptions.',
      'Calculate monthly payment and total financing burden.',
      'Add ownership costs for realistic affordability analysis.',
      'Review stress scenarios before final commitment.'
    ],
    faqs: [
      { q: 'Does lower monthly payment always mean better deal?', a: 'No, longer terms can lower payment but increase total interest.' },
      { q: 'Should ownership costs be included?', a: 'Yes, payment should be evaluated with insurance, fuel, and maintenance.' },
      { q: 'Can this support budget setting?', a: 'Yes, use projection rows and scenarios for planning resilience.' }
    ]
  },
  'down-payment-calculator': {
    title: 'Down Payment Calculator - LTV and Upfront Cash Planner',
    description: 'Free advanced down payment calculator for U.S. car buyers. Estimate required down payment from target LTV and financing assumptions.',
    howToTitle: 'How to Estimate Required Down Payment',
    howToSteps: [
      'Enter vehicle price, target down-payment percentage, and target LTV.',
      'Include trade-in and current cash contribution.',
      'Calculate required down payment and any shortfall.',
      'Review price and LTV sensitivity before purchase.'
    ],
    faqs: [
      { q: 'Why does LTV matter?', a: 'LTV affects financing risk, terms, and negative-equity exposure.' },
      { q: 'Can trade-in reduce required cash?', a: 'Yes, trade-in value can offset down-payment requirements.' },
      { q: 'Should I aim for higher down payment?', a: 'Often yes, because it reduces financed principal and interest risk.' }
    ]
  },
  'early-payoff-calculator': {
    title: 'Early Payoff Calculator - Interest Savings Estimator',
    description: 'Free advanced early payoff calculator for U.S. auto loans. Estimate payoff acceleration and interest savings from extra monthly payments.',
    howToTitle: 'How to Estimate Early Payoff Savings',
    howToSteps: [
      'Enter current payment, remaining balance, APR, and term.',
      'Add planned extra monthly payment amount.',
      'Calculate months saved and estimated interest savings.',
      'Compare scenarios for different extra-payment levels.'
    ],
    faqs: [
      { q: 'How are interest savings estimated?', a: 'Savings are estimated by comparing amortization with and without extra payments.' },
      { q: 'What input drives payoff speed most?', a: 'Extra monthly payment size typically drives the biggest timeline reduction.' },
      { q: 'Should I always prioritize payoff?', a: 'Compare payoff benefits against liquidity and alternative use of cash.' }
    ]
  },
  'extended-warranty-calculator': {
    title: 'Extended Warranty Calculator - Expected Value Comparison',
    description: 'Free advanced extended warranty calculator for U.S. drivers. Compare warranty cost against expected claim value from repair-risk assumptions.',
    howToTitle: 'How to Evaluate Extended Warranty Value',
    howToSteps: [
      'Enter warranty cost, expected repair cost, and claim probability.',
      'Calculate expected claim value and net expected position.',
      'Review downside and upside risk scenarios.',
      'Use output to support warranty purchase decisions.'
    ],
    faqs: [
      { q: 'How is net warranty value calculated?', a: 'Expected claim value is compared against warranty premium to estimate net value.' },
      { q: 'Can negative expected value still be acceptable?', a: 'Yes, risk preferences may justify coverage despite lower expected value.' },
      { q: 'What should I verify before buying?', a: 'Confirm covered components, exclusions, and claim process terms.' }
    ]
  },
  'gap-insurance-calculator': {
    title: 'GAP Insurance Calculator - Negative Equity Exposure Tool',
    description: 'Free advanced GAP insurance calculator for U.S. auto loans. Estimate negative equity gap and potential uncovered exposure.',
    howToTitle: 'How to Estimate GAP Coverage Need',
    howToSteps: [
      'Enter current loan balance and current market value.',
      'Set expected GAP coverage percentage.',
      'Calculate total gap, covered amount, and residual exposure.',
      'Review scenarios for depreciation and paydown changes.'
    ],
    faqs: [
      { q: 'What is GAP exposure?', a: 'It is the difference between loan balance and market value.' },
      { q: 'When is GAP risk highest?', a: 'Risk is usually highest early in the loan with low down payment.' },
      { q: 'Does GAP coverage remove all risk?', a: 'Not always, policy caps and exclusions can leave residual exposure.' }
    ]
  },
  'interest-rate-calculator': {
    title: 'Interest Rate Calculator - Implied APR Back-Solver',
    description: 'Free advanced interest rate calculator for U.S. auto financing. Back-solve implied APR from payment, principal, and term assumptions.',
    howToTitle: 'How to Back-Solve Implied APR',
    howToSteps: [
      'Enter monthly payment, principal, and remaining term.',
      'Calculate implied APR from amortization balance.',
      'Compare implied APR with quoted rates.',
      'Use scenarios to evaluate quote consistency and risk.'
    ],
    faqs: [
      { q: 'Why use implied APR checks?', a: 'It helps validate financing assumptions and quote consistency.' },
      { q: 'Can fees affect implied rate?', a: 'Yes, financed fees and add-ons can raise effective rate materially.' },
      { q: 'Is implied APR exact?', a: 'It is an estimate based on provided assumptions and payment structure.' }
    ]
  },
  'lease-vs-buy-calculator': {
    title: 'Lease vs Buy Calculator - Lifecycle Cost Comparator',
    description: 'Free advanced lease vs buy calculator for U.S. drivers. Compare lease and ownership economics with residual and depreciation assumptions.',
    howToTitle: 'How to Compare Lease vs Buy Economics',
    howToSteps: [
      'Enter lease assumptions including residual and money factor.',
      'Enter buy assumptions including APR, term, and down payment.',
      'Calculate lease-path versus buy-path cost delta.',
      'Review sensitivity to depreciation and financing changes.'
    ],
    faqs: [
      { q: 'What does the lease vs buy delta mean?', a: 'It measures modeled net cost difference between lease and buy paths.' },
      { q: 'Which factors often flip the decision?', a: 'Residual, depreciation, APR, and mileage assumptions can flip outcomes.' },
      { q: 'Should resale value be included for buy?', a: 'Yes, ownership economics require projected residual/trade-in value.' }
    ]
  },
  'refinance-calculator': {
    title: 'Refinance Calculator - Break-Even and Savings Planner',
    description: 'Free advanced refinance calculator for U.S. auto loans. Estimate monthly savings, break-even period, and net refinance impact.',
    howToTitle: 'How to Evaluate Auto Loan Refinance',
    howToSteps: [
      'Enter current balance, current rate, and remaining term.',
      'Add new refinance rate, new term, and refinance fees.',
      'Calculate monthly savings and fee break-even timeline.',
      'Compare scenarios for rate, fees, and term choices.'
    ],
    faqs: [
      { q: 'How is refinance break-even estimated?', a: 'Break-even compares refinance fees against monthly payment savings.' },
      { q: 'Can lower payment still cost more long-term?', a: 'Yes, longer terms can increase lifetime interest despite lower payment.' },
      { q: 'What should be validated before refinancing?', a: 'Confirm fees, prepayment terms, and final effective rate details.' }
    ]
  },
  'registration-fee-estimator-calculator': {
    title: 'Registration Fee Estimator Calculator - DMV Fee Planner',
    description: 'Free advanced registration fee estimator for U.S. vehicles. Estimate registration fees from base-fee and value-based rate assumptions.',
    howToTitle: 'How to Estimate Vehicle Registration Fees',
    howToSteps: [
      'Enter base registration fee and value-based rate assumptions.',
      'Provide vehicle value for the fee estimate.',
      'Calculate estimated total registration charge.',
      'Use scenarios to stress value and rate assumptions.'
    ],
    faqs: [
      { q: 'Why can actual registration differ?', a: 'States and counties use different rules, surcharges, and classes.' },
      { q: 'Is this estimate final?', a: 'No, confirm exact fees from your local DMV authority.' },
      { q: 'What usually drives variance?', a: 'Vehicle value and jurisdiction-specific rate schedules drive most variance.' }
    ]
  },
  'total-cost-of-ownership-calculator': {
    title: 'Total Cost of Ownership Calculator - All-In Vehicle Cost Tool',
    description: 'Free advanced total cost of ownership calculator for U.S. drivers. Estimate annual and multi-year all-in vehicle costs including depreciation.',
    howToTitle: 'How to Estimate Total Vehicle Ownership Cost',
    howToSteps: [
      'Enter annual insurance, fuel, maintenance, fees, and other costs.',
      'Include depreciation assumptions for economic ownership view.',
      'Calculate annual total ownership cost output.',
      'Review projection and scenario sensitivity for planning.'
    ],
    faqs: [
      { q: 'Why include depreciation in TCO?', a: 'Depreciation is a major economic cost even if it is not monthly cash outflow.' },
      { q: 'What recurring costs matter most?', a: 'Insurance, fuel, and depreciation often dominate annual cost structure.' },
      { q: 'How often should TCO be refreshed?', a: 'Quarterly refresh cycles are useful in changing rate and cost environments.' }
    ]
  },
  'trade-in-value-calculator': {
    title: 'Trade-in Value Calculator - Dealer Offer Baseline Estimator',
    description: 'Free advanced trade-in value calculator for U.S. drivers. Estimate trade-in baseline from age, depreciation, condition, and mileage assumptions.',
    howToTitle: 'How to Estimate Trade-in Value Baseline',
    howToSteps: [
      'Enter original vehicle value and age assumptions.',
      'Set depreciation, mileage, and condition adjustments.',
      'Calculate estimated trade-in value baseline.',
      'Use scenario ranges for negotiation planning.'
    ],
    faqs: [
      { q: 'Can this replace a dealer appraisal?', a: 'No, use it as a negotiation baseline before obtaining live offers.' },
      { q: 'Why is condition adjustment important?', a: 'Condition can significantly shift trade-in value versus average baselines.' },
      { q: 'Should I compare multiple offers?', a: 'Yes, compare multiple offers to reduce pricing uncertainty.' }
    ]
  }
};

export const generateVehicleCostsSuiteSchema = (calculatorSlug: string, breadcrumbItems: BreadcrumbItem[]) => {
  const config = vehicleCostsSchemaConfigs[calculatorSlug];
  const baseUrl = `https://calcshark.com/automotive-transportation/vehicle-costs/${calculatorSlug}`;

  if (!config) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        generateSoftwareSchema('Vehicle Cost Calculator', 'Vehicle cost planning calculator', 'Automotive Vehicle Costs'),
        generateBreadcrumbSchema(breadcrumbItems)
      ]
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}#app`,
        "name": config.title,
        "url": baseUrl,
        "description": config.description,
        "applicationCategory": "UtilityApplication",
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
          "Advanced vehicle-cost calculations",
          "Scenario sensitivity analysis",
          "Multi-year projections",
          "Popup-only detailed result reporting",
          "No sign-up required"
        ],
        "author": {
          "@type": "Organization",
          "name": "Calcshark",
          "url": "https://calcshark.com"
        }
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#howto`,
        "name": config.howToTitle,
        "description": config.description,
        "step": config.howToSteps.map((step, index) => ({
          "@type": "HowToStep",
          "name": `Step ${index + 1}`,
          "text": step,
          "position": index + 1
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}#faq`,
        "mainEntity": config.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      generateBreadcrumbSchema(breadcrumbItems)
    ]
  };
};
