'use client';

import React, { useState } from 'react';
import {
  Home, Calendar, TrendingUp, BarChart3, CheckCircle, X, ChevronDown, ChevronUp,
  RefreshCw, Calculator, Clock, DollarSign, Target, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

// Type Definitions
type CalculationMode = 'basic' | 'cdom' | 'average' | 'pricing' | 'comparison';

interface PropertyListing {
  listDate: string;
  saleDate: string;
  price: string;
  address: string;
}

export default function AdvancedDaysOnMarketCalculator() {
  // State Management
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(true);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('basic');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModeDropdown, setShowModeDropdown] = useState<boolean>(false);

  // Basic Mode - Single Property
  const [listDate, setListDate] = useState<string>('');
  const [saleDate, setSaleDate] = useState<string>('');

  // CDOM Mode - With Previous Listing
  const [initialListDate, setInitialListDate] = useState<string>('');
  const [delistDate, setDelistDate] = useState<string>('');
  const [relistDate, setRelistDate] = useState<string>('');
  const [finalSaleDate, setFinalSaleDate] = useState<string>('');

  // Average DOM Mode - Multiple Properties
  const [properties, setProperties] = useState<PropertyListing[]>([
    { listDate: '', saleDate: '', price: '', address: '' },
    { listDate: '', saleDate: '', price: '', address: '' },
    { listDate: '', saleDate: '', price: '', address: '' }
  ]);

  // Pricing Impact Mode
  const [propertyDOM, setPropertyDOM] = useState<string>('');
  const [listPrice, setListPrice] = useState<string>('');
  const [marketAvgDOM, setMarketAvgDOM] = useState<string>('');

  // Comparison Mode
  const [property1DOM, setProperty1DOM] = useState<string>('');
  const [property2DOM, setProperty2DOM] = useState<string>('');

  // Results
  const [result, setResult] = useState<any>(null);

  // Helper: Calculate days between dates
  const calculateDaysBetween = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper: Get market interpretation
  const getMarketInterpretation = (dom: number): { status: string; color: string; description: string } => {
    if (dom < 30) {
      return {
        status: 'Hot Market',
        color: 'red',
        description: 'Properties selling very quickly. High demand, low inventory.'
      };
    } else if (dom < 60) {
      return {
        status: 'Balanced Market',
        color: 'green',
        description: 'Normal market conditions. Properties selling at average pace.'
      };
    } else if (dom < 90) {
      return {
        status: 'Slow Market',
        color: 'orange',
        description: 'Properties taking longer to sell. More negotiating power for buyers.'
      };
    } else {
      return {
        status: 'Cold Market',
        color: 'blue',
        description: 'Properties sitting for extended periods. Consider price adjustments.'
      };
    }
  };

  // Calculation Handler
  const handleCalculate = () => {
    if (calculationMode === 'basic') {
      if (!listDate || !saleDate) {
        alert('Please enter both listing date and sale date');
        return;
      }

      const dom = calculateDaysBetween(listDate, saleDate);
      if (dom < 0) {
        alert('Sale date must be after listing date');
        return;
      }

      const interpretation = getMarketInterpretation(dom);

      setResult({
        mode: 'basic',
        dom,
        listDate,
        saleDate,
        interpretation
      });
      setShowModal(true);
    } else if (calculationMode === 'cdom') {
      if (!initialListDate || !finalSaleDate) {
        alert('Please enter initial listing date and final sale date');
        return;
      }

      let cdom = 0;
      let dom = 0;
      let wasRelisted = false;

      if (delistDate && relistDate) {
        // Property was delisted and relisted
        const firstListingDays = calculateDaysBetween(initialListDate, delistDate);
        const secondListingDays = calculateDaysBetween(relistDate, finalSaleDate);
        const offMarketDays = calculateDaysBetween(delistDate, relistDate);

        wasRelisted = true;
        dom = secondListingDays; // DOM resets on relist
        cdom = firstListingDays + secondListingDays; // CDOM accumulates

        const resetThreshold = 45; // Standard threshold
        const cdomWithReset = offMarketDays > resetThreshold ? secondListingDays : cdom;

        setResult({
          mode: 'cdom',
          dom,
          cdom,
          cdomWithReset,
          wasRelisted,
          firstListingDays,
          secondListingDays,
          offMarketDays,
          resetThreshold,
          interpretation: getMarketInterpretation(cdom)
        });
      } else {
        // Single continuous listing
        cdom = calculateDaysBetween(initialListDate, finalSaleDate);
        dom = cdom;

        setResult({
          mode: 'cdom',
          dom,
          cdom,
          wasRelisted: false,
          interpretation: getMarketInterpretation(dom)
        });
      }
      setShowModal(true);
    } else if (calculationMode === 'average') {
      const validProperties = properties.filter(p => p.listDate && p.saleDate);

      if (validProperties.length < 2) {
        alert('Please enter at least 2 properties with listing and sale dates');
        return;
      }

      const propertyResults = validProperties.map(p => {
        const dom = calculateDaysBetween(p.listDate, p.saleDate);
        return {
          ...p,
          dom,
          interpretation: getMarketInterpretation(dom)
        };
      });

      const totalDOM = propertyResults.reduce((sum, p) => sum + p.dom, 0);
      const avgDOM = totalDOM / propertyResults.length;
      const medianDOM = propertyResults.map(p => p.dom).sort((a, b) => a - b)[Math.floor(propertyResults.length / 2)];

      setResult({
        mode: 'average',
        properties: propertyResults,
        avgDOM,
        medianDOM,
        totalProperties: propertyResults.length,
        interpretation: getMarketInterpretation(avgDOM)
      });
      setShowModal(true);
    } else if (calculationMode === 'pricing') {
      if (!propertyDOM || !listPrice || !marketAvgDOM) {
        alert('Please enter property DOM, list price, and market average DOM');
        return;
      }

      const dom = parseFloat(propertyDOM);
      const price = parseFloat(listPrice);
      const avgDOM = parseFloat(marketAvgDOM);

      const percentDifference = ((dom - avgDOM) / avgDOM) * 100;

      let pricingRecommendation = '';
      let recommendedPriceChange = 0;

      if (dom > avgDOM * 1.5) {
        recommendedPriceChange = -0.05; // -5%
        pricingRecommendation = 'Consider reducing price by 5-10%';
      } else if (dom > avgDOM * 1.2) {
        recommendedPriceChange = -0.03; // -3%
        pricingRecommendation = 'Consider reducing price by 3-5%';
      } else if (dom < avgDOM * 0.5) {
        recommendedPriceChange = 0.03; // +3%
        pricingRecommendation = 'Property may be underpriced - could increase 3-5%';
      } else {
        pricingRecommendation = 'Pricing appears appropriate for market';
      }

      const suggestedPrice = price * (1 + recommendedPriceChange);

      setResult({
        mode: 'pricing',
        dom,
        avgDOM,
        price,
        percentDifference,
        pricingRecommendation,
        suggestedPrice,
        recommendedPriceChange,
        interpretation: getMarketInterpretation(dom)
      });
      setShowModal(true);
    } else if (calculationMode === 'comparison') {
      if (!property1DOM || !property2DOM) {
        alert('Please enter DOM for both properties');
        return;
      }

      const dom1 = parseFloat(property1DOM);
      const dom2 = parseFloat(property2DOM);
      const difference = Math.abs(dom1 - dom2);
      const percentDiff = ((difference / Math.max(dom1, dom2)) * 100);

      setResult({
        mode: 'comparison',
        dom1,
        dom2,
        difference,
        percentDiff,
        faster: dom1 < dom2 ? 'Property 1' : 'Property 2',
        interpretation1: getMarketInterpretation(dom1),
        interpretation2: getMarketInterpretation(dom2)
      });
      setShowModal(true);
    }
  };

  const handleReset = () => {
    setShowModal(false);
    setResult(null);
  };

  // FAQ DATA
  const faqItems: FAQItem[] = [
    {
      question: "What is Days on Market (DOM)?",
      answer: "Days on Market (DOM) is the number of days a property has been officially listed for sale on the Multiple Listing Service (MLS). The DOM calculation starts when the property is marked as 'active' and ends when a purchase contract is signed (status changes to 'pending' or 'under contract'). It's a key metric for understanding market conditions and pricing strategies."
    },
    {
      question: "How do you calculate Days on Market?",
      answer: "To calculate DOM, subtract the listing date from the contract acceptance date: DOM = Sale Date - List Date. For example, if a home was listed on January 1 and accepted an offer on January 25, the DOM is 24 days. This calculator automates this process and provides market insights based on the DOM value."
    },
    {
      question: "What is CDOM vs DOM?",
      answer: "DOM (Days on Market) resets each time a property is relisted, while CDOM (Cumulative Days on Market) tracks the total time across all listings. For example: if a property was listed for 30 days, delisted, then relisted for 20 days before selling, DOM would be 20 days but CDOM would be 50 days. CDOM provides a more complete picture of marketing time."
    },
    {
      question: "What is a good Days on Market?",
      answer: "A 'good' DOM depends on your market, but general guidelines are: Under 30 days = hot market (high demand), 30-60 days = balanced market (normal conditions), 60-90 days = slow market (buyer's market), Over 90 days = cold market (may need price reduction). The national average DOM is typically 40-60 days, but this varies significantly by location and price range."
    },
    {
      question: "Does Days on Market reset?",
      answer: "DOM resets when a property is relisted as a new listing. However, most MLSs have reset rules: if a property is off-market (cancelled or expired) for more than 45 consecutive days, both DOM and CDOM reset to 0. If relisted before 45 days, DOM resets but CDOM continues accumulating. This prevents artificial manipulation of DOM statistics."
    },
    {
      question: "Why do Days on Market matter?",
      answer: "DOM matters because it signals: 1) Market conditions (hot vs cold), 2) Pricing accuracy (overpriced properties sit longer), 3) Negotiating power (high DOM = more buyer leverage), 4) Property issues (very high DOM may indicate problems), 5) Urgency (low DOM creates buyer competition). Sellers want low DOM, buyers can use high DOM to negotiate better prices."
    },
    {
      question: "How to calculate average Days on Market?",
      answer: "To calculate average DOM for multiple properties: Add up the DOM for all properties, then divide by the number of properties. Formula: Average DOM = (DOM₁ + DOM₂ + ... + DOMₙ) ÷ Number of Properties. For example: properties with 20, 30, and 40 days = (20+30+40)÷3 = 30 average DOM. Use median DOM to avoid outlier skewing."
    },
    {
      question: "What affects Days on Market?",
      answer: "Key factors affecting DOM include: 1) Pricing (overpriced homes sit longer), 2) Location (desirable areas sell faster), 3) Condition (well-maintained homes sell quicker), 4) Season (spring/summer typically faster), 5) Market conditions (inventory levels), 6) Marketing quality (photos, staging), 7) Price range (luxury homes typically longer DOM). Proper pricing is the most controllable factor."
    },
    {
      question: "DOM vs list price relationship?",
      answer: "There's a strong inverse relationship: higher DOM typically indicates overpricing. Properties priced 10% above market value can take 3x longer to sell. Every additional week on market often requires a 1-2% price reduction to generate interest. Properties priced correctly sell within 30-45 days. Use this calculator's Pricing Impact mode to assess if your pricing aligns with DOM expectations."
    },
    {
      question: "How to reduce Days on Market?",
      answer: "To reduce DOM: 1) Price competitively from day 1 (most important), 2) Stage and photograph professionally, 3) Make necessary repairs before listing, 4) Be flexible with showings, 5) Respond quickly to offers, 6) Market aggressively online, 7) Consider pre-inspection to reduce buyer concerns. Most importantly, if DOM exceeds 60 days, evaluate a price reduction rather than waiting."
    },
    {
      question: "What is median Days on Market?",
      answer: "Median DOM is the middle value when all DOMs are arranged in order. It's often more useful than average DOM because it's not affected by extreme outliers. For example: DOMs of 10, 20, 30, 40, 200 days have an average of 60 days but median of 30 days. Median better represents typical market performance when some properties are anomalies."
    },
    {
      question: "Normal Days on Market by season?",
      answer: "DOM varies by season: Spring (March-May): 35-45 days average (fastest), Summer (June-August): 40-50 days (strong), Fall (September-November): 50-65 days (slowing), Winter (December-February): 60-80+ days (slowest). Spring has lowest DOM due to optimal weather, motivated buyers, and school year timing. Adjust expectations based on listing season."
    },
    {
      question: "High Days on Market meaning?",
      answer: "High DOM (over 90 days) typically signals: 1) Property is overpriced for the market, 2) Condition issues or needed repairs, 3) Poor location or undesirable features, 4) Ineffective marketing or photos, 5) Cold market conditions. For buyers, high DOM properties offer negotiating opportunities. For sellers, it's usually time for a price reduction or addressing underlying issues."
    },
    {
      question: "Low Days on Market meaning?",
      answer: "Low DOM (under 30 days) indicates: 1) Competitive pricing or underpricing, 2) High demand area/property type, 3) Excellent condition and presentation, 4) Hot market with low inventory, 5) Effective marketing strategy. Very low DOM (under 10 days) may suggest the property was underpriced. Low DOM creates urgency and often results in multiple offers and over-asking prices."
    },
    {
      question: "DOM impact on sale price?",
      answer: "DOM significantly impacts final sale price: 0-30 days: Properties often sell at or above asking (avg 99-102% of list), 31-60 days: Properties sell near asking (avg 96-99%), 61-90 days: Properties sell below asking (avg 93-96%), 90+ days: Significant price reductions (avg 88-93%). Each additional month on market typically reduces final sale price by 1-3%. Quick sales preserve negotiating power."
    },
    {
      question: "Best DOM for buyers?",
      answer: "For buyers, properties with 60-90+ DOM offer the best negotiating opportunities. Sellers become more motivated, inventory costs accumulate, and price reductions become likely. However, always investigate WHY the DOM is high - it could indicate serious property issues. DOM of 30-60 days represents balanced negotiation. Very low DOM (under 15 days) often means multiple offers and paying full or over asking price."
    },
    {
      question: "Best DOM for sellers?",
      answer: "For sellers, DOM under 30 days is ideal, indicating strong pricing and marketing. DOM under 10 days often generates multiple offers and bidding wars. However, extremely fast sales (under 5 days) might mean you left money on the table by underpricing. Target: list and sell within 30-45 days at or near asking price. If DOM exceeds 60 days without offers, reassess pricing strategy immediately."
    },
    {
      question: "How MLSs calculate DOM?",
      answer: "Most MLSs calculate DOM automatically from listing status changes: DOM starts when status = 'Active', pauses when status = 'Pending' or 'Under Contract', resets when relisted after cancellation/expiration. CDOM accumulates across all listing periods unless off-market for 45+ days (varies by MLS). Some MLSs distinguish between DOM-M (MLS-specific) and DOM-P (property total across all MLSs)."
    },
    {
      question: "National average Days on Market 2025?",
      answer: "As of 2025, the national average DOM is approximately 40-60 days, though this varies significantly by region. Hot markets (major tech hubs) average 25-35 days. Moderate markets average 45-60 days. Slow markets average 70-90+ days. The national median DOM is currently around 43-51 days according to Realtor.com and Redfin. Use this calculator's Average DOM mode to compare your local market."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Home className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Days on Market Calculator</h2>
            <p className="text-muted-foreground">Calculate DOM, CDOM, and market insights for real estate listings</p>
          </div>
        </div>
      </div>

      {/* Advanced Mode Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            {isAdvancedMode
              ? 'Access all calculation modes including CDOM, average DOM, and pricing analysis'
              : 'Quick DOM calculation with basic options'}
          </p>
        </div>
        <button
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          {isAdvancedMode ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Switch to Simple
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Advanced Options
            </>
          )}
        </button>
      </div>

      {/* Calculation Mode Selector */}
      {isAdvancedMode && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
            Calculation Mode
          </label>
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg bg-background text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors flex items-center justify-between"
            >
              <span className="font-medium">
                {calculationMode === 'basic' && 'Basic DOM - Calculate days on market'}
                {calculationMode === 'cdom' && 'CDOM Calculator - Cumulative days on market'}
                {calculationMode === 'average' && 'Average DOM - Multiple properties analysis'}
                {calculationMode === 'pricing' && 'Pricing Impact - DOM vs list price analysis'}
                {calculationMode === 'comparison' && 'Property Comparison - Compare two properties'}
              </span>
              <ChevronDown className={cn(
                "h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform",
                showModeDropdown && "rotate-180"
              )} />
            </button>

            {showModeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowModeDropdown(false)}
                />
                <div className="absolute z-20 w-full mt-2 bg-background border border-purple-300 dark:border-purple-700 rounded-lg shadow-xl overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCalculationMode('basic');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors",
                        calculationMode === 'basic' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Basic DOM Calculator</div>
                      <div className="text-sm text-muted-foreground">Calculate days from listing to sale</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('cdom');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'cdom' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">CDOM Calculator</div>
                      <div className="text-sm text-muted-foreground">Cumulative days including relistings</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('average');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'average' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Average DOM Analysis</div>
                      <div className="text-sm text-muted-foreground">Calculate avg/median for multiple properties</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('pricing');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'pricing' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Pricing Impact Analyzer</div>
                      <div className="text-sm text-muted-foreground">Assess pricing based on DOM</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('comparison');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'comparison' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Property Comparison</div>
                      <div className="text-sm text-muted-foreground">Compare DOM between properties</div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Input Forms */}
      {calculationMode === 'basic' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            Basic Days on Market
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Listing Date
              </label>
              <input
                type="date"
                value={listDate}
                onChange={(e) => setListDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sale/Contract Date
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {calculationMode === 'cdom' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            Cumulative Days on Market (CDOM)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Initial Listing Date
              </label>
              <input
                type="date"
                value={initialListDate}
                onChange={(e) => setInitialListDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Final Sale Date
              </label>
              <input
                type="date"
                value={finalSaleDate}
                onChange={(e) => setFinalSaleDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              <strong>Optional:</strong> If property was delisted and relisted, enter dates below:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delisted Date (Optional)
                </label>
                <input
                  type="date"
                  value={delistDate}
                  onChange={(e) => setDelistDate(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Relisted Date (Optional)
                </label>
                <input
                  type="date"
                  value={relistDate}
                  onChange={(e) => setRelistDate(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {calculationMode === 'average' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Average DOM Analysis (Enter at least 2 properties)
          </h3>
          <div className="space-y-3">
            {properties.map((prop, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-3">Property {idx + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Address (Optional)</label>
                    <input
                      type="text"
                      value={prop.address}
                      onChange={(e) => {
                        const newProps = [...properties];
                        newProps[idx].address = e.target.value;
                        setProperties(newProps);
                      }}
                      placeholder="123 Main St"
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Listing Date</label>
                    <input
                      type="date"
                      value={prop.listDate}
                      onChange={(e) => {
                        const newProps = [...properties];
                        newProps[idx].listDate = e.target.value;
                        setProperties(newProps);
                      }}
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Sale Date</label>
                    <input
                      type="date"
                      value={prop.saleDate}
                      onChange={(e) => {
                        const newProps = [...properties];
                        newProps[idx].saleDate = e.target.value;
                        setProperties(newProps);
                      }}
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Price (Optional)</label>
                    <input
                      type="number"
                      value={prop.price}
                      onChange={(e) => {
                        const newProps = [...properties];
                        newProps[idx].price = e.target.value;
                        setProperties(newProps);
                      }}
                      placeholder="$"
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {calculationMode === 'pricing' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            Pricing Impact Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Property Days on Market
              </label>
              <input
                type="number"
                value={propertyDOM}
                onChange={(e) => setPropertyDOM(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Current List Price ($)
              </label>
              <input
                type="number"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Market Average DOM
              </label>
              <input
                type="number"
                value={marketAvgDOM}
                onChange={(e) => setMarketAvgDOM(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {calculationMode === 'comparison' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            Property Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Property 1 DOM (Days)
              </label>
              <input
                type="number"
                value={property1DOM}
                onChange={(e) => setProperty1DOM(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Property 2 DOM (Days)
              </label>
              <input
                type="number"
                value={property2DOM}
                onChange={(e) => setProperty2DOM(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCalculate}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium gap-2"
        >
          <Calculator className="h-5 w-5" />
          Calculate DOM
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Reset
        </button>
      </div>

      {/* Results Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                DOM Calculation Results
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {result.mode === 'basic' && (
                <>
                  <div className={`bg-gradient-to-r from-${result.interpretation.color}-50 to-${result.interpretation.color}-100 dark:from-${result.interpretation.color}-900/20 dark:to-${result.interpretation.color}-800/20 p-6 rounded-lg border-2 border-${result.interpretation.color}-300`}>
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Days on Market</div>
                      <div className="text-5xl font-bold text-foreground mb-2">
                        {result.dom}
                      </div>
                      <div className="text-lg font-semibold mb-2">
                        {result.interpretation.status}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.interpretation.description}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Listing Date</h4>
                      <p className="text-sm">{new Date(result.listDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Sale/Contract Date</h4>
                      <p className="text-sm">{new Date(result.saleDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </>
              )}

              {result.mode === 'cdom' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-2 border-blue-300">
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">DOM (Current Listing)</div>
                        <div className="text-4xl font-bold text-foreground">
                          {result.dom} days
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-2 border-purple-300">
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">CDOM (Total)</div>
                        <div className="text-4xl font-bold text-foreground">
                          {result.cdom} days
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.wasRelisted && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Relisting Detected</h4>
                      <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                        <p>• First listing period: {result.firstListingDays} days</p>
                        <p>• Off-market period: {result.offMarketDays} days</p>
                        <p>• Second listing period: {result.secondListingDays} days</p>
                        <p>• Total CDOM: {result.cdom} days</p>
                        {result.offMarketDays > result.resetThreshold && (
                          <p className="font-semibold mt-2">⚠️ Off-market period exceeded {result.resetThreshold} days - CDOM would reset to {result.cdomWithReset} days in most MLSs</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`bg-${result.interpretation.color}-50 dark:bg-${result.interpretation.color}-900/20 p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">Market Status: {result.interpretation.status}</h4>
                    <p className="text-sm text-muted-foreground">{result.interpretation.description}</p>
                  </div>
                </>
              )}

              {result.mode === 'average' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Average DOM</div>
                      <div className="text-3xl font-bold text-foreground">{result.avgDOM.toFixed(1)} days</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Median DOM</div>
                      <div className="text-3xl font-bold text-foreground">{result.medianDOM} days</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Properties</div>
                      <div className="text-3xl font-bold text-foreground">{result.totalProperties}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Individual Properties</h4>
                    {result.properties.map((prop: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium">{prop.address || `Property ${idx + 1}`}</h5>
                            {prop.price && <p className="text-sm text-muted-foreground">${parseFloat(prop.price).toLocaleString()}</p>}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{prop.dom} days</div>
                            <div className={`text-xs text-${prop.interpretation.color}-600`}>{prop.interpretation.status}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`bg-${result.interpretation.color}-50 dark:bg-${result.interpretation.color}-900/20 p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">Market Status: {result.interpretation.status}</h4>
                    <p className="text-sm text-muted-foreground">{result.interpretation.description}</p>
                  </div>
                </>
              )}

              {result.mode === 'pricing' && (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border-2 border-blue-300">
                    <h4 className="text-lg font-semibold mb-4">Pricing Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Property DOM</p>
                        <p className="text-2xl font-bold">{result.dom} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Market Average DOM</p>
                        <p className="text-2xl font-bold">{result.avgDOM} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold">${result.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">DOM vs Market</p>
                        <p className={`text-2xl font-bold ${result.percentDifference > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.percentDifference > 0 ? '+' : ''}{result.percentDifference.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`bg-${result.recommendedPriceChange !== 0 ? 'orange' : 'green'}-50 dark:bg-${result.recommendedPriceChange !== 0 ? 'orange' : 'green'}-900/20 p-6 rounded-lg border-2 border-${result.recommendedPriceChange !== 0 ? 'orange' : 'green'}-300`}>
                    <h4 className="font-semibold text-lg mb-3">Pricing Recommendation</h4>
                    <p className="text-xl mb-4">{result.pricingRecommendation}</p>
                    {result.recommendedPriceChange !== 0 && (
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Suggested Price</p>
                        <p className="text-3xl font-bold text-foreground">${result.suggestedPrice.toLocaleString()}</p>
                        <p className="text-sm mt-2 text-muted-foreground">
                          {result.recommendedPriceChange > 0 ? 'Increase' : 'Decrease'} of ${Math.abs(result.suggestedPrice - result.price).toLocaleString()} ({Math.abs(result.recommendedPriceChange * 100).toFixed(1)}%)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className={`bg-${result.interpretation.color}-50 dark:bg-${result.interpretation.color}-900/20 p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">Market Status: {result.interpretation.status}</h4>
                    <p className="text-sm text-muted-foreground">{result.interpretation.description}</p>
                  </div>
                </>
              )}

              {result.mode === 'comparison' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`bg-${result.interpretation1.color}-50 dark:bg-${result.interpretation1.color}-900/20 p-6 rounded-lg border-2 border-${result.interpretation1.color}-300`}>
                      <h4 className="font-semibold mb-3">Property 1</h4>
                      <div className="text-4xl font-bold mb-2">{result.dom1} days</div>
                      <div className="text-sm font-semibold mb-1">{result.interpretation1.status}</div>
                      <div className="text-xs text-muted-foreground">{result.interpretation1.description}</div>
                    </div>
                    <div className={`bg-${result.interpretation2.color}-50 dark:bg-${result.interpretation2.color}-900/20 p-6 rounded-lg border-2 border-${result.interpretation2.color}-300`}>
                      <h4 className="font-semibold mb-3">Property 2</h4>
                      <div className="text-4xl font-bold mb-2">{result.dom2} days</div>
                      <div className="text-sm font-semibold mb-1">{result.interpretation2.status}</div>
                      <div className="text-xs text-muted-foreground">{result.interpretation2.description}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-3">Comparison Results</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Faster Property:</strong> {result.faster} ({result.dom1 < result.dom2 ? result.dom1 : result.dom2} days)</p>
                      <p><strong>Difference:</strong> {result.difference} days ({result.percentDiff.toFixed(1)}% faster)</p>
                      <p className="text-muted-foreground mt-3">
                        {result.faster} sold {result.difference} days faster, which is {result.percentDiff.toFixed(1)}% quicker than the other property.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Days on Market Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Select Calculation Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose from <strong>5 calculation modes</strong>: Basic DOM for simple calculations, CDOM Calculator for properties with relistings, Average DOM for market analysis across multiple properties, Pricing Impact to assess pricing strategy, or Property Comparison to compare two listings. Each mode provides specialized insights for different real estate scenarios.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Property Dates</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input <strong>listing date and sale/contract date</strong> for your property. For CDOM calculations, also enter delisting and relisting dates if applicable. For average DOM mode, enter dates for multiple comparable properties. The calculator automatically validates dates and calculates the days between them using the formula: <strong>DOM = Sale Date - List Date</strong>.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Understand DOM vs CDOM</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>DOM (Days on Market)</strong> resets when a property is relisted, while <strong>CDOM (Cumulative Days on Market)</strong> tracks total time across all listings. For example: 30 days + delisting + 20 days relisting = 20 DOM but 50 CDOM. CDOM resets only if off-market for 45+ days (varies by MLS). Use CDOM mode to get both metrics automatically.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Calculate and View Results</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click <strong>"Calculate DOM"</strong> to see comprehensive results including days on market, market status interpretation (Hot/Balanced/Slow/Cold), pricing recommendations, and comparison metrics. Results show whether DOM indicates proper pricing, along with actionable insights for buyers and sellers based on current market conditions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">5️⃣ Analyze Market Conditions</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Interpret results using standard benchmarks: <strong>Under 30 days = Hot Market</strong> (high demand), <strong>30-60 days = Balanced</strong> (normal conditions), <strong>60-90 days = Slow</strong> (buyer's market), <strong>90+ days = Cold</strong> (price adjustment likely needed). Use Average DOM mode to compare your property against local market averages for pricing strategy insights.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">6️⃣ Make Informed Decisions</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Use DOM insights to <strong>price competitively</strong> (sellers), <strong>negotiate effectively</strong> (buyers), identify market trends, and time your listing strategically. High DOM (60+ days) signals pricing concerns or property issues. Low DOM (under 30) indicates strong demand and potential multiple offers. Use Pricing Impact mode for specific price adjustment recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate DOM," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">DOM Calculation</h4>
                <p className="text-xs text-muted-foreground">Exact number of days from listing to contract acceptance with market status indicator</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Market Interpretation</h4>
                <p className="text-xs text-muted-foreground">Hot/Balanced/Slow/Cold market classification with description of what it means for buyers and sellers</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">CDOM Analysis</h4>
                <p className="text-xs text-muted-foreground">Cumulative days tracking across relistings with 45-day reset rule explanation and relisting breakdown</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Pricing Recommendations</h4>
                <p className="text-xs text-muted-foreground">Suggested price adjustments based on DOM vs market average with specific dollar amounts and percentages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use This Calculator */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">🔬 Most Comprehensive Tool</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>5 calculation modes (Basic, CDOM, Average, Pricing, Comparison)</li>
                <li>DOM and CDOM tracking with reset rules</li>
                <li>Multiple property market analysis</li>
                <li>Pricing impact assessment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💯 Accurate Calculations</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Precise date-based DOM calculation</li>
                <li>Industry-standard 45-day reset rules</li>
                <li>Real-time market status interpretation</li>
                <li>National average benchmarks (40-60 days)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🏠 Real Estate Insights</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Market condition indicators (Hot/Cold)</li>
                <li>Pricing strategy recommendations</li>
                <li>Buyer/seller negotiation insights</li>
                <li>Property comparison analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎓 Educational Resource</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>19 comprehensive FAQ items</li>
                <li>DOM vs CDOM explained</li>
                <li>Market interpretation guide</li>
                <li>Pricing strategy tips</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Understanding Days on Market */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Days on Market (DOM)</h2>

        <div className="space-y-6">
          {/* The Science Behind DOM */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">🔬 The Science Behind Days on Market</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Days on Market (DOM) is a fundamental real estate metric that measures the number of days a property remains actively listed for sale. It's calculated from the moment a property enters the Multiple Listing Service (MLS) as "active" until it reaches "pending" or "under contract" status.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Formula:</strong> DOM = Contract Acceptance Date - Initial Listing Date. For example: Listed January 1st, contract accepted January 25th = 24 Days on Market. This simple calculation reveals complex market dynamics including pricing accuracy, property appeal, and market conditions.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>National Benchmarks:</strong> The current national average DOM is 40-60 days according to Realtor.com and Redfin data. However, this varies dramatically by location (hot markets: 15-30 days, slow markets: 70-90+ days), price range (luxury properties: 90-150+ days), property type, and season (spring/summer faster than winter).
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Why DOM Matters:</strong> DOM serves as a proxy for multiple factors: pricing accuracy (correctly priced homes sell in 30-45 days), property condition, market health, buyer demand, and seller motivation. High DOM indicates problems; low DOM indicates strong appeal or underpricing.
                </p>
              </div>
            </div>
          </div>

          {/* DOM vs CDOM Explained */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 DOM vs CDOM: Understanding the Difference</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              DOM and CDOM track time differently, with important implications for buyers and sellers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">DOM (Days on Market)</h4>
                <p className="text-xs text-muted-foreground">
                  Resets with each new listing. If a property is canceled/expired and relisted, DOM starts at 0 again. Formula: DOM = Days from most recent listing to current status. This allows sellers to "refresh" DOM by relisting, potentially hiding how long the property has really been available.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">CDOM (Cumulative DOM)</h4>
                <p className="text-xs text-muted-foreground">
                  Accumulates across all listings unless off-market 45+ days (varies by MLS). Formula: CDOM = Sum of all listing periods. Example: 30 days + delisted + 20 days = 50 CDOM. Provides true picture of total marketing time.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Reset Rules</h4>
                <p className="text-xs text-muted-foreground">
                  Most MLSs reset both DOM and CDOM if property is off-market (cancelled/expired) for more than 45 consecutive days. If relisted before 45 days, DOM resets but CDOM continues accumulating. This prevents artificial DOM manipulation.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Buyer Perspective</h4>
                <p className="text-xs text-muted-foreground">
                  Always check CDOM in addition to DOM. A property showing 15 DOM might have 90 CDOM, revealing it's been relisted multiple times—a red flag suggesting overpricing or property issues. CDOM reveals the complete history.
                </p>
              </div>
            </div>
          </div>

          {/* Market Interpretation Guide */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">📈 Market Interpretation Guide</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
              DOM reveals market conditions and pricing accuracy through standardized benchmarks:
            </p>
            <div className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              <p><strong>0-30 Days (Hot Market):</strong> High demand, low inventory. Properties selling at/above asking price (99-102% of list price). Multiple offers common. Sellers have leverage. May indicate underpricing if under 10 days.</p>
              <p><strong>30-60 Days (Balanced Market):</strong> Normal market conditions. Properties selling near asking (96-99% of list). Fair negotiation for both parties. Standard timeframe for properly priced homes.</p>
              <p><strong>60-90 Days (Slow Market):</strong> Properties taking longer to sell. Selling below asking (93-96%). More buyer leverage for negotiations. Consider 3-5% price reduction after 60 days without offers.</p>
              <p><strong>90+ Days (Cold Market):</strong> Extended time on market signals problems. Properties sell significantly below asking (88-93%). Serious buyer's market. Likely indicates overpricing by 10%+ or property issues requiring attention.</p>
            </div>
          </div>

          {/* Pricing Strategy Based on DOM */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">💡 Pricing Strategy Based on DOM</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
              DOM directly correlates with pricing accuracy. Use these guidelines for pricing decisions:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>If DOM &gt; Market Average × 1.5:</strong> Property is likely overpriced by 10%+. Recommend immediate 5-10% price reduction. Each additional week adds 1-2% more reduction needed. Don't wait—prices become stale quickly.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>If DOM &lt; Market Average × 0.5:</strong> Property may be underpriced. If sold under 5 days with multiple offers, likely left 3-5% on table. For future listings, price 3-5% higher initially in hot markets to capture maximum value.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Optimal Strategy:</strong> Price competitively from day 1 (at or slightly below market value). First 14 days generate 75% of total showings. Properties priced right sell in 30-45 days at 97-100% of asking. Overpricing then reducing later results in 88-93% of asking—significant loss.
                </p>
              </div>
            </div>
          </div>

          {/* Seasonal DOM Patterns */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4">📅 Seasonal DOM Patterns</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-4">
              DOM varies significantly by season. Adjust expectations based on listing timing:
            </p>
            <div className="space-y-2 text-sm text-cyan-800 dark:text-cyan-200">
              <p>🌸 <strong>Spring (March-May):</strong> Average 35-45 DOM (fastest season). Optimal weather, motivated buyers, school year timing. Best time to list for quick sale at maximum price.</p>
              <p>☀️ <strong>Summer (June-August):</strong> Average 40-50 DOM. Strong market but vacation season slows some buyers. Still excellent selling conditions with good inventory turnover.</p>
              <p>🍂 <strong>Fall (September-November):</strong> Average 50-65 DOM. Market slowing as holidays approach. Serious buyers remain active. Price competitively to close before winter.</p>
              <p>❄️ <strong>Winter (December-February):</strong> Average 60-80+ DOM (slowest season). Holidays and weather reduce buyer activity. Only serious buyers looking. Expect longer DOM and more negotiation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About This Calculator */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">About This Days on Market Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Precise DOM Calculation</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">Accurate date-based calculation from listing to contract acceptance with market status interpretation.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">CDOM Tracking</h3>
                <p className="text-sm text-green-800 dark:text-green-200">Cumulative days on market calculator with 45-day reset rules and relisting analysis.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Market Analysis</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">Average and median DOM calculator for multiple properties with market trend identification.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="flex items-start gap-3">
              <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Pricing Intelligence</h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">DOM-based pricing recommendations with suggested adjustments and market benchmarks.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific References */}
      <div className="bg-background border rounded-xl p-6 mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">📚 Scientific References & Sources</h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">📖 Real Estate Metrics & DOM Standards</h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>1. <a href="https://www.redfin.com/blog/days-on-market-home-buying/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Redfin - Days on Market Real Estate: What It Tells Buyers and How to Use It to Your Advantage</a> (2025 Data)</li>
              <li>2. <a href="https://www.opendoor.com/articles/why-days-on-market-matter" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Opendoor - Days on Market Explained: What Every Home Buyer Should Know</a></li>
              <li>3. <a href="https://homeabroadinc.com/research/housing-days-on-market-statistics/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Home Abroad - Homes Stay 16 Days Longer on Market in 2025</a> (Current Statistics)</li>
              <li>4. <a href="https://listwithclever.com/research/how-long-are-houses-on-the-market/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Clever Real Estate - 2025 Data: U.S. Cities and States Where It Takes the Longest to Sell a Home</a></li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">📈 Market Data & Federal Statistics</h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li>5. <a href="https://fred.stlouisfed.org/series/MEDDAYONMARUS" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">Federal Reserve Economic Data (FRED) - Median Days on Market in the United States</a> (Official Statistics)</li>
              <li>6. <a href="https://www.bankrate.com/real-estate/housing-heat-index/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">Bankrate - Housing Heat Index 2025</a> (Market Temperature Analysis)</li>
              <li>7. <a href="https://www.thebalancemoney.com/hot-cold-and-neutral-real-estate-markets-1798785" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">The Balance Money - Hot, Cold, and Neutral Real Estate Markets</a></li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">⚖️ DOM & CDOM Calculation Standards</h3>
            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              <li>8. <a href="https://armls.com/days-on-market-calculations" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">ARMLS - Days On Market Calculations (DOM, CDOM, ADOM)</a> (MLS Standards)</li>
              <li>9. <a href="https://showingtimeplus.com/resources/blog/the-difference-between-days-on-market-cumulative-days-on-market" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">ShowingTime+ - The Difference Between Days on Market & Cumulative Days on Market</a></li>
              <li>10. <a href="https://wowa.ca/dom-real-estate" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">WOWA - What Does Days on Market (DOM) Mean in Real Estate</a></li>
              <li>11. <a href="https://www.maxrealestateexposure.com/cdom-real-estate/" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">Max Real Estate Exposure - CDOM in Real Estate: The Meaning Explained</a></li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">🧠 DOM Reset Rules & MLS Policies</h3>
            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
              <li>12. <a href="https://armls.com/days-on-market-dom-reset-to-zero" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-600 dark:hover:text-purple-400">ARMLS - Looking To Reset Days on Market (DOM)?</a> (45-Day Reset Rule)</li>
              <li>13. <a href="https://support.brightmls.com/s/article/The-Difference-Between-DOM-and-CDOM" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-600 dark:hover:text-purple-400">BrightMLS - The Difference Between DOM and CDOM</a> (MLS Guidelines)</li>
              <li>14. <a href="https://support.homecoin.com/hc/en-us/articles/360038369114-Resetting-Days-On-Market-For-Your-MLS-Listing" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-600 dark:hover:text-purple-400">HomeCoin - Resetting Days On Market For Your MLS Listing</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions About Days on Market</h2>
        <FAQAccordion faqs={faqItems} />
      </div>

      {/* Calculator Review */}
      <CalculatorReview calculatorName="Days on Market Calculator" />
    </div>
  );
}
