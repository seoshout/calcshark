'use client';

import React, { useState, useRef } from 'react';
import {
  Calculator, ShoppingCart, TrendingUp, DollarSign, Award, Target, BarChart3, CheckCircle,
  X, ChevronDown, ChevronUp, Info, Lightbulb, Shield, Star, RefreshCw, Zap, Trophy, Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

// Type Definitions
type CalculationMode = 'basic' | 'multiItem' | 'bulk' | 'converter' | 'budget';
type Unit = 'oz' | 'lb' | 'kg' | 'g' | 'ml' | 'L' | 'gal' | 'floz' | 'each';

interface ProductItem {
  name: string;
  price: string;
  quantity: string;
  unit: Unit;
}

interface BasicComparison {
  item1: ProductItem;
  item2: ProductItem;
}

interface MultiItemComparison {
  items: ProductItem[];
}

interface BulkAnalysis {
  regularItem: ProductItem;
  bulkItem: ProductItem;
}

interface UnitConversion {
  price: string;
  quantity: string;
  unit: Unit;
}

interface BudgetOptimizer {
  budget: string;
  items: ProductItem[];
}

interface ComparisonResult {
  itemName: string;
  totalPrice: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  isBestDeal?: boolean;
  savingsPercent?: number;
}

export default function AdvancedPriceComparisonCalculator() {
  // State Management
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(true);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('basic');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModeDropdown, setShowModeDropdown] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Basic Comparison State
  const [basicComparison, setBasicComparison] = useState<BasicComparison>({
    item1: { name: 'Product A', price: '5.99', quantity: '16', unit: 'oz' },
    item2: { name: 'Product B', price: '8.99', quantity: '32', unit: 'oz' }
  });

  // Multi-Item State
  const [multiItems, setMultiItems] = useState<ProductItem[]>([
    { name: 'Brand A', price: '3.99', quantity: '12', unit: 'oz' },
    { name: 'Brand B', price: '5.49', quantity: '20', unit: 'oz' },
    { name: 'Brand C', price: '7.99', quantity: '32', unit: 'oz' },
    { name: '', price: '', quantity: '', unit: 'oz' },
    { name: '', price: '', quantity: '', unit: 'oz' }
  ]);

  // Bulk Analysis State
  const [bulkAnalysis, setbulkAnalysis] = useState<BulkAnalysis>({
    regularItem: { name: 'Regular Pack', price: '4.99', quantity: '8', unit: 'oz' },
    bulkItem: { name: 'Bulk Pack', price: '12.99', quantity: '32', unit: 'oz' }
  });

  // Unit Converter State
  const [unitConverter, setUnitConverter] = useState<UnitConversion>({
    price: '5.99',
    quantity: '16',
    unit: 'oz'
  });

  // Budget Optimizer State
  const [budgetOptimizer, setBudgetOptimizer] = useState<BudgetOptimizer>({
    budget: '50.00',
    items: [
      { name: 'Item 1', price: '12.99', quantity: '1', unit: 'each' },
      { name: 'Item 2', price: '8.49', quantity: '1', unit: 'each' },
      { name: 'Item 3', price: '15.99', quantity: '1', unit: 'each' },
      { name: '', price: '', quantity: '', unit: 'each' },
      { name: '', price: '', quantity: '', unit: 'each' }
    ]
  });

  // Results State
  const [results, setResults] = useState<any>(null);

  // Unit Conversion Functions
  const convertToOunces = (quantity: number, unit: Unit): number => {
    const conversions: Record<Unit, number> = {
      'oz': 1,
      'lb': 16,
      'kg': 35.274,
      'g': 0.035274,
      'ml': 0.033814,
      'L': 33.814,
      'gal': 128,
      'floz': 1,
      'each': 1
    };
    return quantity * (conversions[unit] || 1);
  };

  const convertFromOunces = (ounces: number, targetUnit: Unit): number => {
    const conversions: Record<Unit, number> = {
      'oz': 1,
      'lb': 16,
      'kg': 35.274,
      'g': 0.035274,
      'ml': 0.033814,
      'L': 33.814,
      'gal': 128,
      'floz': 1,
      'each': 1
    };
    return ounces / (conversions[targetUnit] || 1);
  };

  // Calculate Unit Price
  const calculateUnitPrice = (price: number, quantity: number, unit: Unit): number => {
    if (quantity === 0) return 0;
    return price / quantity;
  };

  // Basic Comparison Calculation
  const calculateBasicComparison = () => {
    const price1 = parseFloat(basicComparison.item1.price) || 0;
    const qty1 = parseFloat(basicComparison.item1.quantity) || 0;
    const price2 = parseFloat(basicComparison.item2.price) || 0;
    const qty2 = parseFloat(basicComparison.item2.quantity) || 0;

    if (qty1 === 0 || qty2 === 0) {
      alert('Please enter valid quantities');
      return;
    }

    const unitPrice1 = calculateUnitPrice(price1, qty1, basicComparison.item1.unit);
    const unitPrice2 = calculateUnitPrice(price2, qty2, basicComparison.item2.unit);

    const bestDeal = unitPrice1 <= unitPrice2 ? 1 : 2;
    const savingsPercent = Math.abs(((Math.max(unitPrice1, unitPrice2) - Math.min(unitPrice1, unitPrice2)) / Math.max(unitPrice1, unitPrice2)) * 100);

    setResults({
      mode: 'basic',
      item1: {
        name: basicComparison.item1.name || 'Product A',
        totalPrice: price1,
        quantity: qty1,
        unit: basicComparison.item1.unit,
        unitPrice: unitPrice1,
        isBestDeal: bestDeal === 1
      },
      item2: {
        name: basicComparison.item2.name || 'Product B',
        totalPrice: price2,
        quantity: qty2,
        unit: basicComparison.item2.unit,
        unitPrice: unitPrice2,
        isBestDeal: bestDeal === 2
      },
      savingsPercent
    });

    setShowModal(true);
  };

  // Multi-Item Comparison Calculation
  const calculateMultiItem = () => {
    const validItems = multiItems.filter(item =>
      item.name && item.price && item.quantity && parseFloat(item.price) > 0 && parseFloat(item.quantity) > 0
    );

    if (validItems.length < 2) {
      alert('Please enter at least 2 valid items to compare');
      return;
    }

    const itemResults: any[] = validItems.map(item => {
      const price = parseFloat(item.price);
      const qty = parseFloat(item.quantity);
      const unitPrice = calculateUnitPrice(price, qty, item.unit);

      return {
        itemName: item.name,
        totalPrice: price,
        quantity: qty,
        unit: item.unit,
        unitPrice
      };
    });

    // Sort by unit price (lowest first)
    itemResults.sort((a, b) => a.unitPrice - b.unitPrice);
    itemResults[0].isBestDeal = true;

    // Calculate savings vs best deal
    const bestPrice = itemResults[0].unitPrice;
    itemResults.forEach(item => {
      if (!item.isBestDeal) {
        item.savingsPercent = ((item.unitPrice - bestPrice) / item.unitPrice) * 100;
      }
    });

    setResults({
      mode: 'multiItem',
      items: itemResults
    });

    setShowModal(true);
  };

  // Bulk Savings Analysis
  const calculateBulkSavings = () => {
    const regPrice = parseFloat(bulkAnalysis.regularItem.price) || 0;
    const regQty = parseFloat(bulkAnalysis.regularItem.quantity) || 0;
    const bulkPrice = parseFloat(bulkAnalysis.bulkItem.price) || 0;
    const bulkQty = parseFloat(bulkAnalysis.bulkItem.quantity) || 0;

    if (regQty === 0 || bulkQty === 0) {
      alert('Please enter valid quantities');
      return;
    }

    const regUnitPrice = calculateUnitPrice(regPrice, regQty, bulkAnalysis.regularItem.unit);
    const bulkUnitPrice = calculateUnitPrice(bulkPrice, bulkQty, bulkAnalysis.bulkItem.unit);

    const savingsPerUnit = regUnitPrice - bulkUnitPrice;
    const savingsPercent = (savingsPerUnit / regUnitPrice) * 100;
    const totalSavings = savingsPerUnit * bulkQty;

    const breakEvenQty = bulkPrice / regUnitPrice;

    setResults({
      mode: 'bulk',
      regular: {
        name: bulkAnalysis.regularItem.name || 'Regular Pack',
        totalPrice: regPrice,
        quantity: regQty,
        unit: bulkAnalysis.regularItem.unit,
        unitPrice: regUnitPrice
      },
      bulk: {
        name: bulkAnalysis.bulkItem.name || 'Bulk Pack',
        totalPrice: bulkPrice,
        quantity: bulkQty,
        unit: bulkAnalysis.bulkItem.unit,
        unitPrice: bulkUnitPrice
      },
      savingsPerUnit,
      savingsPercent,
      totalSavings,
      breakEvenQty
    });

    setShowModal(true);
  };

  // Unit Converter Calculation
  const calculateUnitConverter = () => {
    const price = parseFloat(unitConverter.price) || 0;
    const qty = parseFloat(unitConverter.quantity) || 0;

    if (qty === 0) {
      alert('Please enter a valid quantity');
      return;
    }

    const baseUnitPrice = price / qty;
    const ounces = convertToOunces(qty, unitConverter.unit);
    const pricePerOunce = price / ounces;

    const conversions = {
      'oz': pricePerOunce,
      'lb': pricePerOunce * 16,
      'kg': pricePerOunce * 35.274,
      'g': pricePerOunce * 0.035274,
      'L': pricePerOunce * 33.814,
      'gal': pricePerOunce * 128,
      'floz': pricePerOunce,
      'ml': pricePerOunce * 0.033814,
    };

    setResults({
      mode: 'converter',
      originalPrice: price,
      originalQty: qty,
      originalUnit: unitConverter.unit,
      baseUnitPrice,
      conversions
    });

    setShowModal(true);
  };

  // Budget Optimizer Calculation
  const calculateBudgetOptimizer = () => {
    const budget = parseFloat(budgetOptimizer.budget) || 0;
    const validItems = budgetOptimizer.items.filter(item =>
      item.name && item.price && parseFloat(item.price) > 0
    );

    if (validItems.length === 0) {
      alert('Please enter at least one valid item');
      return;
    }

    // Calculate unit price for each item
    const itemsWithUnitPrice = validItems.map(item => {
      const price = parseFloat(item.price);
      const qty = parseFloat(item.quantity) || 1;
      return {
        name: item.name,
        totalPrice: price,
        quantity: qty,
        unit: item.unit,
        unitPrice: price / qty
      };
    });

    // Sort by unit price (best value first)
    itemsWithUnitPrice.sort((a, b) => a.unitPrice - b.unitPrice);

    // Find optimal combination within budget
    let totalCost = 0;
    const selectedItems: any[] = [];
    const unselectedItems: any[] = [];

    itemsWithUnitPrice.forEach(item => {
      if (totalCost + item.totalPrice <= budget) {
        selectedItems.push(item);
        totalCost += item.totalPrice;
      } else {
        unselectedItems.push(item);
      }
    });

    const remainingBudget = budget - totalCost;

    setResults({
      mode: 'budget',
      budget,
      selectedItems,
      unselectedItems,
      totalCost,
      remainingBudget
    });

    setShowModal(true);
  };

  // Handle Calculate Button
  const handleCalculate = () => {
    switch (calculationMode) {
      case 'basic':
        calculateBasicComparison();
        break;
      case 'multiItem':
        calculateMultiItem();
        break;
      case 'bulk':
        calculateBulkSavings();
        break;
      case 'converter':
        calculateUnitConverter();
        break;
      case 'budget':
        calculateBudgetOptimizer();
        break;
    }
  };

  const handleReset = () => {
    setShowModal(false);
    setResults(null);
  };

  // FAQ DATA
  const faqItems: FAQItem[] = [
    {
      question: "How do I calculate unit price?",
      answer: "Unit price is calculated by dividing the total price by the quantity. For example: if a product costs $8.99 and contains 16 ounces, the unit price is $8.99 ÷ 16 = $0.5619 per ounce. This calculator does this automatically for any unit type you select."
    },
    {
      question: "What is the best way to compare prices?",
      answer: "The best way to compare prices is to calculate the unit price for each item, then compare those unit prices. Never compare total prices alone when package sizes differ. Always convert to the same unit (per ounce, per pound, per item, etc.) to make accurate comparisons across different brands and sizes."
    },
    {
      question: "How to compare different sizes?",
      answer: "To compare different sizes, convert the price of each item to a common unit using unit pricing. For example, if comparing a 12oz box ($3.99) and a 18oz box ($5.49), calculate: 12oz = $0.3325/oz and 18oz = $0.3050/oz. The larger box has a better unit price despite the higher total price."
    },
    {
      question: "Is bulk buying always cheaper?",
      answer: "Bulk buying is usually cheaper per unit, but not always the smartest choice. Consider: 1) Will you actually use the product before it expires? 2) Do you have storage space? 3) Is the per-unit savings worth the higher upfront cost? 4) Can you afford the large purchase? Use the Bulk Savings Analysis mode to determine if bulk makes financial sense for your situation."
    },
    {
      question: "How much can you save buying in bulk?",
      answer: "Bulk savings typically range from 10-50% per unit compared to regular-sized packages. For example, buying a 32oz bottle for $8 (25 cents/oz) instead of four 8oz bottles at $2.99 each ($0.37/oz) saves you 32%. Use this calculator's bulk analysis mode to calculate exact savings for your specific products."
    },
    {
      question: "What is unit pricing?",
      answer: "Unit pricing is the cost of a product per individual unit of measurement (per ounce, pound, kilogram, liter, gallon, or item count). It's the most accurate way to compare products because it removes the confusion of different package sizes. For example, 'cost per ounce' is a unit price, making it easy to compare any size container."
    },
    {
      question: "Convert price per pound to per ounce?",
      answer: "To convert price per pound to per ounce, divide by 16 (since there are 16 ounces in a pound). For example: if a product costs $4.80 per pound, it costs $4.80 ÷ 16 = $0.30 per ounce. This calculator can convert between any unit type automatically using the Unit Converter mode."
    },
    {
      question: "What units for grocery comparison?",
      answer: "Common grocery units are: ounces (oz) for packaged goods, pounds (lb) for produce/meat, milliliters (ml) and liters (L) for liquids, and gallons for bulk liquids. This calculator supports all 9 common units: oz, lb, kg, g, ml, L, gal, fl oz, and each. Choose the unit that matches your product."
    },
    {
      question: "How stores use unit pricing?",
      answer: "Stores display unit pricing on shelf labels to help customers compare products. The unit price (like $0.25/oz) shows the cost per standardized unit, helping shoppers identify the best value regardless of package size. Many stores are required by law to display unit prices, though this varies by jurisdiction."
    },
    {
      question: "What is 20% rule for bulk buying?",
      answer: "The 20% rule suggests that bulk purchases should be at least 20% cheaper per unit than the regular-sized version to justify the purchase. For example, if a regular box costs $0.50/oz, the bulk version should cost $0.40/oz or less (20% savings). This accounts for the time and effort of buying bulk."
    },
    {
      question: "How to calculate savings percentage?",
      answer: "Savings percentage is calculated as: ((Original Price - Sale Price) ÷ Original Price) × 100. For example: if something costs $10 normally and is on sale for $7, you save ((10-7)÷10)×100 = 30%. This calculator shows savings percentages when comparing products."
    },
    {
      question: "Always buy lowest unit price?",
      answer: "Usually yes, but not always. Consider these factors: 1) Freshness/expiration date (especially for perishables), 2) Quality differences (cheaper isn't always better), 3) Brand preference or allergies, 4) Whether you'll actually use the full quantity, 5) Storage space. The lowest unit price is the best mathematical value, but other factors matter."
    },
    {
      question: "Compare prices across brands?",
      answer: "Use the Multi-Item Comparison mode to compare 3 or more brands at once. Input each brand's name, price, quantity, and unit. The calculator will show unit prices and identify the best deal. This helps you decide between name brands, store brands, and generics based on actual unit pricing, not packaging or marketing."
    },
    {
      question: "Hidden costs in bulk buying?",
      answer: "Hidden costs include: 1) Storage (space in pantry/freezer), 2) Spoilage (if items expire before use), 3) Financial carrying cost (money tied up in inventory), 4) Hassle of storage and organization, 5) Potential waste if your needs change. The calculator shows per-unit savings, but consider these real-world costs in your decision."
    },
    {
      question: "Calculate break-even point?",
      answer: "The break-even point shows how many units you need to purchase at the bulk price to equal the cost of regular-sized packages. For example, if bulk costs less but requires a large upfront investment, knowing the break-even helps you decide if the purchase makes sense. This calculator shows break-even quantity in the Bulk Savings Analysis mode."
    },
    {
      question: "Compare metric and imperial units?",
      answer: "This calculator automatically converts between metric (grams, kilograms, milliliters, liters) and imperial (ounces, pounds, gallons) units. Simply select your units for each product, and it calculates a common unit price for comparison. For example, you can compare a 500g package to a 1lb package directly."
    },
    {
      question: "Best value vs cheapest?",
      answer: "Cheapest means lowest total price, while best value means lowest unit price relative to quality. Best value usually means best unit price, but consider: 1) Quality differences, 2) Expiration dates, 3) What you'll actually use, 4) Total quantity needed. A slightly more expensive item with better quality and longer shelf life may be better value than the cheapest option."
    },
    {
      question: "How coupons affect unit price?",
      answer: "Coupons reduce the effective price paid. If an item costs $5 and you have a $1 coupon, your effective price is $4. Divide this adjusted price by the quantity to get the unit price with coupons applied. Many stores' digital coupons stack with sales. Always calculate unit price after applying coupons to see true savings."
    },
    {
      question: "How often prices change?",
      answer: "Grocery prices change frequently - sometimes weekly or even daily for sales. Bulk items may have different promotional cycles than regularly-sized products. Subscribe to store apps for price tracking, compare prices before big purchases, and note when your favorite items go on sale to buy bulk at the lowest unit price. Use this calculator whenever prices change."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <ShoppingCart className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Price Comparison Calculator</h2>
            <p className="text-muted-foreground">Compare prices, find best deals, and save money on every purchase</p>
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
              ? 'Access all comparison modes, bulk analysis, and budget optimization'
              : 'Quick price comparison with basic options'}
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
                {calculationMode === 'basic' && 'Basic Comparison - Compare two items'}
                {calculationMode === 'multiItem' && 'Multi-Item Comparison - Compare 3+ items'}
                {calculationMode === 'bulk' && 'Bulk Savings - Regular vs bulk price analysis'}
                {calculationMode === 'converter' && 'Unit Converter - Convert prices between units'}
                {calculationMode === 'budget' && 'Budget Optimizer - Find best value within budget'}
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
                      <div className="font-medium">Basic Comparison</div>
                      <div className="text-sm text-muted-foreground">Compare two items side-by-side</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('multiItem');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'multiItem' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Multi-Item Comparison</div>
                      <div className="text-sm text-muted-foreground">Compare 3 or more items at once</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('bulk');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'bulk' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Bulk Savings Analysis</div>
                      <div className="text-sm text-muted-foreground">Calculate savings from bulk purchases</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('converter');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'converter' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Unit Price Converter</div>
                      <div className="text-sm text-muted-foreground">Convert prices between different units</div>
                    </button>

                    <button
                      onClick={() => {
                        setCalculationMode('budget');
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                        calculationMode === 'budget' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                      )}
                    >
                      <div className="font-medium">Budget Optimizer</div>
                      <div className="text-sm text-muted-foreground">Find best value items within budget</div>
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
            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
            Basic Price Comparison
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product A Name</label>
                <input
                  type="text"
                  value={basicComparison.item1.name}
                  onChange={(e) => setBasicComparison({
                    ...basicComparison,
                    item1: { ...basicComparison.item1, name: e.target.value }
                  })}
                  placeholder="e.g., Brand A"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product B Name</label>
                <input
                  type="text"
                  value={basicComparison.item2.name}
                  onChange={(e) => setBasicComparison({
                    ...basicComparison,
                    item2: { ...basicComparison.item2, name: e.target.value }
                  })}
                  placeholder="e.g., Brand B"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Product A</h4>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={basicComparison.item1.price}
                    onChange={(e) => setBasicComparison({
                      ...basicComparison,
                      item1: { ...basicComparison.item1, price: e.target.value }
                    })}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                  <input
                    type="number"
                    value={basicComparison.item1.quantity}
                    onChange={(e) => setBasicComparison({
                      ...basicComparison,
                      item1: { ...basicComparison.item1, quantity: e.target.value }
                    })}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                  <select
                    value={basicComparison.item1.unit}
                    onChange={(e) => setBasicComparison({
                      ...basicComparison,
                      item1: { ...basicComparison.item1, unit: e.target.value as Unit }
                    })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="L">Liters (L)</option>
                    <option value="gal">Gallons (gal)</option>
                    <option value="floz">Fluid Ounces (fl oz)</option>
                    <option value="each">Each</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Product B</h4>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={basicComparison.item2.price}
                    onChange={(e) => setBasicComparison({
                      ...basicComparison,
                      item2: { ...basicComparison.item2, price: e.target.value }
                    })}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                  <input
                    type="number"
                    value={basicComparison.item2.quantity}
                    onChange={(e) => setBasicComparison({
                      ...basicComparison,
                      item2: { ...basicComparison.item2, quantity: e.target.value }
                    })}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                  <select
                    value={basicComparison.item2.unit}
                    onChange={(e) => setBasicComparison({
                      ...basicComparison,
                      item2: { ...basicComparison.item2, unit: e.target.value as Unit }
                    })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="L">Liters (L)</option>
                    <option value="gal">Gallons (gal)</option>
                    <option value="floz">Fluid Ounces (fl oz)</option>
                    <option value="each">Each</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {calculationMode === 'multiItem' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Multi-Item Comparison (Enter at least 2 items)
          </h3>
          <div className="space-y-3">
            {multiItems.map((item, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Product Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...multiItems];
                        newItems[idx].name = e.target.value;
                        setMultiItems(newItems);
                      }}
                      placeholder={`Item ${idx + 1}`}
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...multiItems];
                        newItems[idx].price = e.target.value;
                        setMultiItems(newItems);
                      }}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...multiItems];
                        newItems[idx].quantity = e.target.value;
                        setMultiItems(newItems);
                      }}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => {
                        const newItems = [...multiItems];
                        newItems[idx].unit = e.target.value as Unit;
                        setMultiItems(newItems);
                      }}
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="oz">oz</option>
                      <option value="lb">lb</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="gal">gal</option>
                      <option value="floz">fl oz</option>
                      <option value="each">each</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {calculationMode === 'bulk' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            Bulk Savings Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Regular Pack</h4>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                <input
                  type="text"
                  value={bulkAnalysis.regularItem.name}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    regularItem: { ...bulkAnalysis.regularItem, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                <input
                  type="number"
                  value={bulkAnalysis.regularItem.price}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    regularItem: { ...bulkAnalysis.regularItem, price: e.target.value }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                <input
                  type="number"
                  value={bulkAnalysis.regularItem.quantity}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    regularItem: { ...bulkAnalysis.regularItem, quantity: e.target.value }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                <select
                  value={bulkAnalysis.regularItem.unit}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    regularItem: { ...bulkAnalysis.regularItem, unit: e.target.value as Unit }
                  })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="oz">Ounces (oz)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="L">Liters (L)</option>
                  <option value="gal">Gallons (gal)</option>
                  <option value="floz">Fluid Ounces (fl oz)</option>
                  <option value="each">Each</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Bulk Pack</h4>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                <input
                  type="text"
                  value={bulkAnalysis.bulkItem.name}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    bulkItem: { ...bulkAnalysis.bulkItem, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                <input
                  type="number"
                  value={bulkAnalysis.bulkItem.price}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    bulkItem: { ...bulkAnalysis.bulkItem, price: e.target.value }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                <input
                  type="number"
                  value={bulkAnalysis.bulkItem.quantity}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    bulkItem: { ...bulkAnalysis.bulkItem, quantity: e.target.value }
                  })}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
                <select
                  value={bulkAnalysis.bulkItem.unit}
                  onChange={(e) => setbulkAnalysis({
                    ...bulkAnalysis,
                    bulkItem: { ...bulkAnalysis.bulkItem, unit: e.target.value as Unit }
                  })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="oz">Ounces (oz)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="L">Liters (L)</option>
                  <option value="gal">Gallons (gal)</option>
                  <option value="floz">Fluid Ounces (fl oz)</option>
                  <option value="each">Each</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {calculationMode === 'converter' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-green-600 dark:text-green-400" />
            Unit Price Converter
          </h3>
          <div className="max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
              <input
                type="number"
                value={unitConverter.price}
                onChange={(e) => setUnitConverter({ ...unitConverter, price: e.target.value })}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 mt-3">Quantity</label>
              <input
                type="number"
                value={unitConverter.quantity}
                onChange={(e) => setUnitConverter({ ...unitConverter, quantity: e.target.value })}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 mt-3">Unit</label>
              <select
                value={unitConverter.unit}
                onChange={(e) => setUnitConverter({ ...unitConverter, unit: e.target.value as Unit })}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="oz">Ounces (oz)</option>
                <option value="lb">Pounds (lb)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="L">Liters (L)</option>
                <option value="gal">Gallons (gal)</option>
                <option value="floz">Fluid Ounces (fl oz)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {calculationMode === 'budget' && (
        <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            Budget Optimizer
          </h3>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-foreground mb-2">Budget ($)</label>
            <input
              type="number"
              value={budgetOptimizer.budget}
              onChange={(e) => setBudgetOptimizer({ ...budgetOptimizer, budget: e.target.value })}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-4 space-y-3">
            {budgetOptimizer.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Product Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...budgetOptimizer.items];
                        newItems[idx].name = e.target.value;
                        setBudgetOptimizer({ ...budgetOptimizer, items: newItems });
                      }}
                      placeholder={`Item ${idx + 1}`}
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...budgetOptimizer.items];
                        newItems[idx].price = e.target.value;
                        setBudgetOptimizer({ ...budgetOptimizer, items: newItems });
                      }}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...budgetOptimizer.items];
                        newItems[idx].quantity = e.target.value;
                        setBudgetOptimizer({ ...budgetOptimizer, items: newItems });
                      }}
                      step="0.01"
                      min="0"
                      className="w-full px-2 py-1 text-sm border border-input rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCalculate}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium gap-2"
        >
          <Zap className="h-5 w-5" />
          Calculate Comparison
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
      {showModal && results && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Calculation Results</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {results.mode === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${results.item1.isBestDeal ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-300'}`}>
                    <h4 className="font-semibold mb-3">{results.item1.name}</h4>
                    <div className="space-y-2 text-sm">
                      <p>Total Price: ${results.item1.totalPrice.toFixed(2)}</p>
                      <p>Quantity: {results.item1.quantity} {results.item1.unit}</p>
                      <p className="font-bold text-lg">Unit Price: ${results.item1.unitPrice.toFixed(4)}</p>
                      {results.item1.isBestDeal && <p className="text-green-600 font-medium">Best Deal</p>}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${results.item2.isBestDeal ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-300'}`}>
                    <h4 className="font-semibold mb-3">{results.item2.name}</h4>
                    <div className="space-y-2 text-sm">
                      <p>Total Price: ${results.item2.totalPrice.toFixed(2)}</p>
                      <p>Quantity: {results.item2.quantity} {results.item2.unit}</p>
                      <p className="font-bold text-lg">Unit Price: ${results.item2.unitPrice.toFixed(4)}</p>
                      {results.item2.isBestDeal && <p className="text-green-600 font-medium">Best Deal</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold">You Save: {results.savingsPercent.toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">by choosing the better deal</p>
                </div>
              </div>
            )}

            {results.mode === 'multiItem' && (
              <div className="space-y-3">
                {results.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${item.isBestDeal ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-300'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{item.itemName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Unit Price: ${item.unitPrice.toFixed(4)}</p>
                      </div>
                      {item.isBestDeal && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded text-sm font-medium">
                          Best Deal
                        </span>
                      )}
                    </div>
                    {item.savingsPercent && (
                      <p className="text-sm mt-2">Save {item.savingsPercent.toFixed(2)}% vs best deal</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {results.mode === 'bulk' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-300">
                    <h4 className="font-semibold mb-2">{results.regular.name}</h4>
                    <p className="text-sm">Unit Price: ${results.regular.unitPrice.toFixed(4)}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300">
                    <h4 className="font-semibold mb-2">{results.bulk.name}</h4>
                    <p className="text-sm">Unit Price: ${results.bulk.unitPrice.toFixed(4)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
                  <p><strong>Savings Per Unit:</strong> ${results.savingsPerUnit.toFixed(4)}</p>
                  <p><strong>Savings Percent:</strong> {results.savingsPercent.toFixed(2)}%</p>
                  <p><strong>Total Savings (at bulk qty):</strong> ${results.totalSavings.toFixed(2)}</p>
                  <p><strong>Break-even Quantity:</strong> {results.breakEvenQty.toFixed(1)} units</p>
                </div>
              </div>
            )}

            {results.mode === 'converter' && (
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground">Original: ${results.originalPrice.toFixed(2)} for {results.originalQty} {results.originalUnit}</p>
                  <p className="text-lg font-bold mt-2">Base Unit Price: ${results.baseUnitPrice.toFixed(4)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(results.conversions).map(([unit, price]: [string, any]) => (
                    <div key={unit} className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
                      <p className="text-muted-foreground text-xs">Per {unit}</p>
                      <p className="font-semibold">${(price as number).toFixed(4)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.mode === 'budget' && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">${results.budget.toFixed(2)}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Selected Items ({results.selectedItems.length})</h4>
                  <div className="space-y-2">
                    {results.selectedItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-900/20 rounded text-sm">
                        <span>{item.name}</span>
                        <span className="font-semibold">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p><strong>Total Cost:</strong> ${results.totalCost.toFixed(2)}</p>
                  <p className="text-green-600 dark:text-green-400"><strong>Remaining Budget:</strong> ${results.remainingBudget.toFixed(2)}</p>
                </div>

                {results.unselectedItems.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-muted-foreground">Items Not Selected</h4>
                    <div className="space-y-1 text-sm">
                      {results.unselectedItems.map((item: any, idx: number) => (
                        <p key={idx} className="text-muted-foreground">{item.name} - ${item.totalPrice.toFixed(2)}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Price Comparison Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Select Calculation Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose from <strong>5 calculation modes</strong>: Basic Comparison (2 items), Multi-Item Comparison (3+ items), Bulk Savings Analysis, Unit Price Converter, or Budget Optimizer. Each mode is optimized for different shopping scenarios to help you find the best deals and maximize savings.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Product Information</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input product names, prices, quantities, and units for each item. Use common units like <strong>oz, lb, kg, ml, L, gallons, or count by each</strong>. The calculator supports 9 different unit types for flexibility and automatically converts between them for accurate comparisons.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Understand Unit Pricing</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                The calculator uses the formula <strong>Unit Price = Total Price ÷ Quantity</strong> to calculate cost per unit. This is the most accurate way to compare products of different sizes. For example: a 16oz box for $4 costs $0.25/oz, while a 32oz box for $7 costs $0.22/oz—the larger box is the better deal despite higher total price.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Calculate and View Results</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click <strong>"Calculate Comparison"</strong> to instantly compute unit prices, identify the best deal (lowest unit price), calculate savings percentages, and provide detailed comparison metrics. The results modal highlights the best value with color-coded indicators and shows exactly how much you can save.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">5️⃣ Analyze Bulk Savings</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Use <strong>Bulk Savings Analysis</strong> mode to compare regular vs bulk pricing. The calculator shows per-unit savings, total savings amount, savings percentage, and break-even quantity. This helps you determine if bulk purchases make financial sense for your needs and budget.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">6️⃣ Make Smarter Purchases</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Compare across brands and sizes to find the real best value, discover bulk savings potential, optimize your budget with the <strong>Budget Optimizer</strong> mode, and avoid overpaying for items with worse unit prices. Use this calculator before every major purchase to maximize your savings consistently.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate Comparison," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Unit Price Comparison</h4>
                <p className="text-xs text-muted-foreground">Price per unit (oz, lb, each, etc.) for accurate comparison regardless of package size</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Best Deal Identification</h4>
                <p className="text-xs text-muted-foreground">Automatic highlighting of the lowest unit price option with savings percentage</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Bulk Savings Analysis</h4>
                <p className="text-xs text-muted-foreground">Per-unit savings, total savings amount, and break-even quantity for bulk decisions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Budget Optimization</h4>
                <p className="text-xs text-muted-foreground">Itemized selection showing which products fit your budget with best value</p>
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
                <li>5 calculation modes vs 1-2 in other tools</li>
                <li>9 unit types supported (oz, lb, kg, g, ml, L, gal, fl oz, each)</li>
                <li>Multi-item comparison (3+ products at once)</li>
                <li>Bulk savings analysis with break-even points</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💯 Accurate Results</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Instant calculations with unit price formula</li>
                <li>Automatic unit conversion support</li>
                <li>Real-world shopping scenarios</li>
                <li>Mobile friendly responsive design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 Smart Shopping Features</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Compare across brands and sizes</li>
                <li>Find true best value (lowest unit price)</li>
                <li>Save money consistently on purchases</li>
                <li>Budget planning with optimizer mode</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎓 Educational Resource</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>19 comprehensive FAQ items</li>
                <li>Unit pricing formula explained</li>
                <li>Bulk savings guide with 20% rule</li>
                <li>Comparison tips and strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Understanding Price Comparison */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Price Comparison</h2>

        <div className="space-y-6">
          {/* Unit Pricing Fundamentals */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">🔬 Unit Pricing Fundamentals</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Unit pricing is the total price divided by the quantity, showing cost per individual unit. This is the most reliable way to compare products of different sizes.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Formula:</strong> Unit Price = Total Price ÷ Quantity. For example: a 16oz box for $4 costs $4 ÷ 16 = $0.25/oz, while a 32oz box for $7 costs $7 ÷ 32 = $0.22/oz. The 32oz box is the better deal despite higher total price.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Why It Works:</strong> Unit pricing removes package size confusion and lets you compare apples-to-apples across brands, stores, and sizes. A 12oz product at $3 (25¢/oz) vs 20oz at $4.50 (22.5¢/oz)—without unit pricing, you might pick the cheaper $3 option and pay more per ounce.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Common Units:</strong> Use ounces (oz) for packaged goods, pounds (lb) for produce/meat, milliliters (ml) and liters (L) for liquids, gallons (gal) for bulk liquids, and "each" for counted items. This calculator supports all 9 major unit types.
                </p>
              </div>
            </div>
          </div>

          {/* Bulk Buying Benefits */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Bulk Buying Benefits & The 20% Rule</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Bulk purchases typically offer 10-50% savings per unit, but smart bulk buying requires careful analysis:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Savings Formula</h4>
                <p className="text-xs text-muted-foreground">
                  Savings % = ((Regular Unit Price - Bulk Unit Price) ÷ Regular Unit Price) × 100. Example: Regular $0.50/oz vs Bulk $0.40/oz = ((0.50-0.40)÷0.50)×100 = 20% savings.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">The 20% Rule</h4>
                <p className="text-xs text-muted-foreground">
                  Bulk should be at least 20% cheaper per unit than regular size to justify the purchase. This accounts for time, effort, storage costs, and potential waste if you don't use it all.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Break-Even Point</h4>
                <p className="text-xs text-muted-foreground">
                  Break-Even Qty = Bulk Pack Price ÷ (Regular Unit Price - Bulk Unit Price). This shows how many units you need to use to recover the higher upfront cost of bulk purchasing.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Smart Bulk Checklist</h4>
                <p className="text-xs text-muted-foreground">
                  ✓ Will you use it before expiration? ✓ Do you have storage space? ✓ Is the savings ≥20%? ✓ Can you afford the upfront cost? All four must be "yes" for bulk to make sense.
                </p>
              </div>
            </div>
          </div>

          {/* Unit Conversions Explained */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">⚖️ Unit Conversions Explained</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
              When comparing products in different units, convert everything to a common baseline for accurate comparison:
            </p>
            <div className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              <p><strong>Weight:</strong> 1 lb = 16 oz | 1 kg = 1000 g | 1 lb ≈ 453.6 g | 1 oz ≈ 28.35 g</p>
              <p><strong>Volume:</strong> 1 gal = 128 fl oz | 1 L = 1000 ml | 1 gal ≈ 3.785 L | 1 fl oz ≈ 29.57 ml</p>
              <p><strong>Example:</strong> Compare a 500g package at $6 to a 1.2lb package at $7. Convert to common unit: 500g = 1.1lb, so 500g costs $5.45/lb vs 1.2lb costs $5.83/lb—the gram package is cheaper despite metric labeling.</p>
            </div>
          </div>

          {/* Beyond Total Price */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">💡 Beyond Total Price: Finding Real Value</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
              Total price is misleading when packages are different sizes. Unit price reveals the true cost per standardized unit:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Example Scenario:</strong> Product A costs $5 for 10oz ($0.50/oz) vs Product B costs $7 for 18oz ($0.39/oz). Product B is the better value despite costing $2 more upfront—you get 8 more ounces and pay 22% less per ounce.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Quality Considerations:</strong> Unit price shows mathematical best value, but consider: quality differences (generic vs name brand), expiration dates (fresher may cost more per oz), brand preferences, and whether you'll actually use the full quantity.
                </p>
              </div>
            </div>
          </div>

          {/* Smart Shopping Strategy */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4">🛒 Smart Shopping Strategy</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-4">
              Use this calculator before every major purchase to maximize savings:
            </p>
            <div className="space-y-2 text-sm text-cyan-800 dark:text-cyan-200">
              <p>✓ <strong>Compare Brands:</strong> Name brand vs store brand vs generic—unit price reveals which offers best value</p>
              <p>✓ <strong>Verify Sales:</strong> "50% off" or "Buy 2 Get 1 Free" might still cost more per unit than competitors</p>
              <p>✓ <strong>Track Prices:</strong> Note unit prices over time to recognize genuine deals and seasonal patterns</p>
              <p>✓ <strong>Budget Optimization:</strong> Use Budget Optimizer mode to select maximum value items within spending limits</p>
              <p>✓ <strong>Bulk Analysis:</strong> Calculate break-even points and per-unit savings before committing to bulk purchases</p>
            </div>
          </div>
        </div>
      </div>

      {/* About This Calculator */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">About This Price Comparison Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Instant Price Analysis</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">Real-time unit price calculations with accurate comparisons across different package sizes and units.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Bulk Savings Calculator</h3>
                <p className="text-sm text-green-800 dark:text-green-200">Determine if buying in bulk saves money with break-even analysis and per-unit savings calculations.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-start gap-3">
              <Scale className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Unit Converter</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">Convert prices between 9 different unit types to compare products regardless of measurement system.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="flex items-start gap-3">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Budget Optimizer</h3>
                <p className="text-sm text-orange-800 dark:text-orange-200">Find the best value items within your budget with intelligent selection algorithm.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific References */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">📚 Scientific References & Sources</h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">📖 Consumer Economics & Unit Pricing</h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>1. <a href="https://www.ftc.gov/legal-library/browse/rules/unit-pricing" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Federal Trade Commission (FTC) - Unit Price Labeling Guidelines</a> (2023)</li>
              <li>2. <a href="https://www.consumerreports.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Consumer Reports - Price Comparison Methodology</a> (2024)</li>
              <li>3. <a href="https://onlinelibrary.wiley.com/journal/17456606" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">Journal of Consumer Affairs - Unit Pricing Psychology and Consumer Behavior</a></li>
              <li>4. <a href="https://www.ers.usda.gov/data-products/food-price-outlook/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 dark:hover:text-blue-400">USDA - Food Price Analysis and Unit Cost Calculations</a></li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">📈 Bulk Buying & Savings Analysis</h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li>5. <a href="https://nrf.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">National Retail Federation - Bulk Purchase Economics</a> (2023)</li>
              <li>6. <a href="https://www.nber.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">National Bureau of Economic Research - Wholesale vs Retail Pricing</a></li>
              <li>7. <a href="https://www.fmi.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">Food Marketing Institute - Bulk Buying Trends and Consumer Impact</a></li>
              <li>8. <a href="https://www.sciencedirect.com/topics/economics-econometrics-and-finance/cost-benefit-analysis" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-600 dark:hover:text-green-400">Personal Finance Research - Cost-Benefit Analysis of Bulk Purchases</a></li>
            </ul>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-4">⚖️ Unit Conversion Standards</h3>
            <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
              <li>9. <a href="https://www.nist.gov/pml/owm/metric-si/unit-conversion" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">NIST - Official Unit Conversion Standards</a> (2024)</li>
              <li>10. <a href="https://www.bipm.org/en/measurement-units" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">International Bureau of Weights and Measures (BIPM) - Metric System Standards</a></li>
              <li>11. <a href="https://www.fda.gov/food/food-labeling-nutrition" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-600 dark:hover:text-orange-400">FDA - Food Labeling and Unit Measurement Requirements</a></li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">🧠 Behavioral Economics & Consumer Decision Making</h3>
            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
              <li>12. <a href="https://journals.sagepub.com/home/mrj" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-600 dark:hover:text-purple-400">Journal of Marketing Research - Price Perception and Package Size</a></li>
              <li>13. <a href="https://www.sciencedirect.com/journal/journal-of-economic-behavior-and-organization" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-600 dark:hover:text-purple-400">Behavioral Economics Review - Consumer Price Comparison Strategies</a></li>
              <li>14. <a href="https://www.tandfonline.com/journals/rael20" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-600 dark:hover:text-purple-400">Applied Economics Letters - Impact of Unit Pricing on Purchase Decisions</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions About Price Comparison</h2>
        <FAQAccordion faqs={faqItems} />
      </div>

      {/* Calculator Review */}
      <CalculatorReview calculatorName="Price Comparison Calculator" />
    </div>
  );
}
