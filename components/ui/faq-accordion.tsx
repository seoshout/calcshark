'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  title?: string;
  faqs: FAQItem[];
  className?: string;
  defaultOpen?: boolean;
}

export default function FAQAccordion({ 
  title = "Frequently Asked Questions", 
  faqs, 
  className = "",
  defaultOpen = false
}: FAQAccordionProps) {
  // Safety check for faqs
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return null;
  }

  const [openItems, setOpenItems] = useState<Set<number>>(
    defaultOpen ? new Set(Array.from({ length: faqs.length }, (_, i) => i)) : new Set()
  );

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className={cn("bg-background border rounded-xl p-8", className)}>
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openItems.has(index);
          return (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
              >
                <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  isOpen ? "max-h-96" : "max-h-0"
                )}
              >
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.category && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {faq.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {faqs.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Still have questions?</strong> Our calculators are designed to be accurate and easy to use. 
            If you need more help, consider consulting with a professional for personalized advice.
          </p>
        </div>
      )}
    </div>
  );
}