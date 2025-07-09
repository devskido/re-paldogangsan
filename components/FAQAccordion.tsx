'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenIndices = new Set(openIndices);
    if (newOpenIndices.has(index)) {
      newOpenIndices.delete(index);
    } else {
      newOpenIndices.add(index);
    }
    setOpenIndices(newOpenIndices);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndices.has(index);
        
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            
            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}