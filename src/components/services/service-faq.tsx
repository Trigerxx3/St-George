"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  includeSchema?: boolean;
}

export default function ServiceFAQ({
  title = "Frequently Asked Questions",
  subtitle = "Clear answers about installations, warranties, ACT regulations, and rebates.",
  faqs,
  includeSchema = true,
}: ServiceFAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  // Structured FAQ JSON-LD schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="section-padding bg-off-white">
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-primary mb-3">Got Questions?</span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-navy mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg">{subtitle}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-navy hover:text-green transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-green" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
