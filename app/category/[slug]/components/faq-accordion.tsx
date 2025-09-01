'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQAccordionProps {
  category: {
    slug: string;
    name: string;
  };
}

export function FAQAccordion({ category }: FAQAccordionProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const getFAQs = (categorySlug: string) => {
    const faqs: { [key: string]: Array<{ question: string; answer: string }> } = {
      'finance': [
        {
          question: "How accurate are your financial calculators?",
          answer: "Our financial calculators use industry-standard formulas and are regularly updated to reflect current financial regulations and best practices. They're designed by financial experts and tested for accuracy. However, results should be used for estimation purposes and we recommend consulting with a financial advisor for personalized advice."
        },
        {
          question: "Are my financial calculations saved or stored?",
          answer: "No, we prioritize your privacy. All calculations are performed entirely in your browser and no personal financial data is stored on our servers. Your information remains completely private and secure."
        },
        {
          question: "Can I use these calculators for tax purposes?",
          answer: "While our calculators provide accurate estimates based on standard formulas, they should not be used as the sole basis for tax filings. Always consult with a qualified tax professional or use official tax software for actual tax preparation and filing."
        },
        {
          question: "How often are the calculators updated?",
          answer: "We regularly review and update our calculators to ensure they reflect current interest rates, tax laws, and financial regulations. Major updates are made quarterly, with critical updates implemented as needed when regulations change."
        },
        {
          question: "Do you offer calculators for international users?",
          answer: "Currently, our calculators are primarily designed for US financial systems, including tax rates, regulations, and standard practices. We're working on expanding to support international markets. Some basic calculators like compound interest and percentage calculations work universally."
        }
      ],
      'education': [
        {
          question: "How do I calculate my GPA accurately?",
          answer: "Enter your grades and credit hours for each course. Our GPA calculator uses the standard 4.0 scale and properly weighs each course by credit hours to give you an accurate cumulative GPA."
        },
        {
          question: "Can these calculators help with college planning?",
          answer: "Yes! Our education calculators help with college costs, student loans, financial aid calculations, and academic planning. Use them to make informed decisions about your educational investment."
        },
        {
          question: "Are the test score calculations accurate for SAT/ACT?",
          answer: "Our test score calculators use official scoring methods and are regularly updated to reflect current testing standards. However, always verify with official test preparation resources."
        },
        {
          question: "Do you support different grading systems?",
          answer: "Currently, our calculators primarily support the US 4.0 GPA system. We're working on adding support for international grading systems and percentage-based calculations."
        },
        {
          question: "How can I improve my calculated GPA?",
          answer: "Use our grade calculators to see how future grades will impact your GPA. Plan your course load and target grades needed to reach your GPA goals."
        }
      ],
      'health': [
        {
          question: "Are your health calculators medically accurate?",
          answer: "Our health calculators use scientifically validated formulas and are based on established medical guidelines. However, they are for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for medical decisions."
        },
        {
          question: "Can I use these calculators to replace medical consultations?",
          answer: "No, our calculators are educational tools designed to provide estimates and general guidance. They cannot replace professional medical evaluations, diagnoses, or personalized treatment recommendations from qualified healthcare providers."
        },
        {
          question: "How accurate are the BMI and body composition calculators?",
          answer: "Our calculators use standard medical formulas, but individual results may vary. BMI calculations don't account for muscle mass, bone density, or body composition. For comprehensive health assessment, consult with healthcare professionals."
        },
        {
          question: "Are the calorie and nutrition calculations reliable?",
          answer: "Our nutrition calculators use established nutritional science and dietary guidelines. Results provide good estimates for general planning, but individual needs vary based on metabolism, activity level, health conditions, and other factors."
        },
        {
          question: "Can I track my progress over time?",
          answer: "While our calculators provide instant results, they don't store historical data for privacy reasons. We recommend keeping your own records to track progress and discuss trends with your healthcare provider."
        }
      ],
      'real-estate': [
        {
          question: "Are your real estate calculators accurate for investment analysis?",
          answer: "Our real estate calculators use industry-standard formulas and are designed by real estate professionals. They provide reliable estimates for investment analysis, but market conditions, local factors, and individual circumstances can affect actual results. Always consult with real estate professionals for major investment decisions."
        },
        {
          question: "Can I use these calculators for tax planning purposes?",
          answer: "Our calculators provide general estimates based on standard tax scenarios, but tax situations vary greatly by location, income level, and individual circumstances. For accurate tax planning and advice, consult with a qualified tax professional or CPA."
        },
        {
          question: "Do the calculators account for local market conditions?",
          answer: "Our calculators use standard formulas and allow you to input local data like property values, taxes, and market rates. However, they don't automatically adjust for specific local market conditions, regulations, or trends. Research local market data for the most accurate analysis."
        },
        {
          question: "How often should I update my real estate calculations?",
          answer: "Real estate markets change frequently, so it's recommended to update your calculations quarterly or when market conditions change significantly. Key factors like interest rates, property values, and rental rates can impact your investment analysis."
        },
        {
          question: "Are these tools suitable for commercial real estate?",
          answer: "While our calculators can provide basic analysis for commercial properties, they're primarily designed for residential real estate. Commercial real estate often requires specialized analysis considering factors like triple net leases, CAM charges, and complex financing structures."
        }
      ],
      'construction': [
        {
          question: "How accurate are your construction material calculators?",
          answer: "Our construction calculators use industry-standard formulas and are designed with input from construction professionals. They provide reliable estimates for material quantities, but we always recommend adding 5-10% waste allowance and consulting with contractors for complex projects."
        },
        {
          question: "Do the calculators account for waste and cutting allowances?",
          answer: "Many of our calculators include built-in waste factors for common materials, but waste can vary significantly based on project complexity, material quality, and installation method. Always verify waste allowances with your contractor or material supplier."
        },
        {
          question: "Can I use these calculators for commercial construction projects?",
          answer: "While our calculators work for basic commercial calculations, they're primarily designed for residential and light commercial projects. Large commercial projects often require specialized engineering calculations and should involve qualified professionals."
        },
        {
          question: "Are the cost estimates included in calculations accurate?",
          answer: "Material and labor costs vary significantly by location, market conditions, and project complexity. Our cost estimates provide general guidance, but always get current quotes from local suppliers and contractors for accurate budgeting."
        },
        {
          question: "Should I always consult with professionals for construction projects?",
          answer: "Yes, for any structural work, electrical, plumbing, or projects requiring permits, always consult with licensed professionals. Our calculators are planning tools to help you understand project scope and prepare for professional consultations."
        }
      ],
      'automotive': [
        {
          question: "How accurate are your automotive calculators for financial planning?",
          answer: "Our automotive calculators use industry-standard formulas and current market data to provide reliable estimates. However, actual costs can vary based on location, vehicle condition, driving habits, and market fluctuations. Use results as planning guides and get quotes from dealers and service providers for precise figures."
        },
        {
          question: "Do your fuel efficiency calculators work for all vehicle types?",
          answer: "Yes, our fuel calculators work for gasoline, diesel, hybrid, and electric vehicles. However, efficiency can vary significantly based on driving conditions, vehicle maintenance, weather, and driving style. Track your actual consumption over time for the most accurate personal data."
        },
        {
          question: "Can I use these calculators for commercial vehicle fleets?",
          answer: "While our calculators can provide basic analysis for commercial vehicles, they're primarily designed for personal vehicle use. Fleet management often requires specialized considerations like commercial insurance rates, bulk fuel pricing, and regulatory compliance."
        },
        {
          question: "How often should I update my automotive calculations?",
          answer: "Vehicle costs and fuel prices change frequently. Update loan and lease calculations when rates change, recalculate fuel costs monthly, and review maintenance schedules annually or when service patterns change. Market conditions significantly impact automotive expenses."
        },
        {
          question: "Are the insurance and maintenance cost estimates reliable?",
          answer: "Our estimates provide general guidance based on national averages, but actual costs vary widely by location, vehicle type, driving record, and coverage levels. Always get personalized quotes from insurance companies and service providers for accurate budgeting."
        }
      ],
      'business': [
        {
          question: "Are your business calculators suitable for all business sizes?",
          answer: "Our business calculators are designed to work for small businesses, startups, and medium-sized companies. While they provide valuable insights for larger enterprises, complex corporations may require specialized financial modeling and should consult with business analysts or financial advisors."
        },
        {
          question: "How accurate are the financial projections and ROI calculations?",
          answer: "Our calculators use standard business formulas and industry benchmarks to provide reliable estimates. However, actual results depend on market conditions, execution, competition, and numerous variables. Use results as planning tools and validate assumptions with market research and professional advice."
        },
        {
          question: "Can I use these calculators for tax planning and compliance?",
          answer: "Our calculators provide general estimates for planning purposes, but tax obligations vary by business structure, location, and specific circumstances. Always consult with qualified accountants, tax professionals, or CPAs for accurate tax planning and compliance requirements."
        },
        {
          question: "Do the HR calculators comply with current labor laws?",
          answer: "Our HR calculators use general formulas and federal guidelines, but labor laws vary significantly by state and locality. Employment regulations change frequently, so always verify calculations with current local laws and consult with HR professionals or employment attorneys for compliance."
        },
        {
          question: "Are the marketing and sales calculators updated for digital trends?",
          answer: "Yes, our marketing calculators include modern metrics like digital conversion rates, social media ROI, and online customer acquisition costs. However, digital marketing evolves rapidly, so supplement our calculations with current industry benchmarks and platform-specific analytics."
        }
      ],
      'mathematics': [
        {
          question: "Are your mathematical calculators accurate for academic and professional use?",
          answer: "Yes, our mathematics calculators use standard mathematical formulas and algorithms that are widely accepted in academic and professional settings. They're designed for accuracy and are regularly tested. However, for critical applications like engineering calculations or research, always verify results with multiple sources."
        },
        {
          question: "Can these calculators handle complex mathematical operations?",
          answer: "Our calculators cover a wide range of mathematical operations from basic arithmetic to advanced statistics and calculus concepts. For highly specialized or advanced mathematical computations, you may need dedicated mathematical software like Mathematica, MATLAB, or similar professional tools."
        },
        {
          question: "Are the statistical calculators suitable for research and data analysis?",
          answer: "Our statistical calculators provide accurate results for basic to intermediate statistical analysis and are suitable for educational purposes and preliminary research. For comprehensive research requiring advanced statistical methods, consider using specialized statistical software like R, SPSS, or SAS."
        },
        {
          question: "Do you provide step-by-step solutions for equations?",
          answer: "Our calculators focus on providing accurate results quickly. While we include explanations for many calculations, they're designed for efficiency rather than detailed step-by-step instruction. For learning purposes, supplement with textbooks or educational resources that show complete solution methods."
        },
        {
          question: "How precise are the calculations, especially for scientific applications?",
          answer: "Our calculators use standard precision arithmetic suitable for most applications. For scientific and engineering work requiring high precision or specialized mathematical functions, consider using scientific computing software or programming languages with arbitrary precision libraries."
        }
      ]
    };

    return faqs[categorySlug] || [
      {
        question: "How do I use these calculators?",
        answer: "Simply select the calculator you need, enter your information in the provided fields, and get instant results. Each calculator includes helpful tooltips and explanations to guide you through the process."
      },
      {
        question: "Are the calculations accurate?",
        answer: "Yes, all our calculators use industry-standard formulas and are regularly tested for accuracy. However, results should be used for estimation purposes, and we recommend consulting with professionals for important decisions."
      },
      {
        question: "Is my data saved or stored?",
        answer: "No, we prioritize your privacy. All calculations are performed in your browser and no personal data is stored on our servers. Your information remains completely private."
      },
      {
        question: "Can I use these calculators on mobile devices?",
        answer: "Absolutely! All our calculators are fully responsive and work seamlessly on smartphones, tablets, and desktop computers."
      },
      {
        question: "Are these calculators free to use?",
        answer: "Yes, all our calculators are completely free to use with no hidden fees, registration requirements, or usage limits."
      }
    ];
  };

  const faqData = getFAQs(category.slug);

  return (
    <div className="py-12 bg-background">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our {category.name.toLowerCase()} calculators
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-background hover:bg-muted/30 transition-colors flex items-center justify-between"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                aria-expanded={openFAQ === index}
                aria-controls={`faq-content-${index}`}
              >
                <span className="font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                    openFAQ === index ? "rotate-180" : ""
                  )}
                />
              </button>
              <div
                id={`faq-content-${index}`}
                className={cn(
                  "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                  openFAQ === index
                    ? "py-4 max-h-96 opacity-100"
                    : "py-0 max-h-0 opacity-0"
                )}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}