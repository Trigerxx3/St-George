"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/section-heading";

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
    <section className="section-light section-padding">
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}

      <div className="container-custom">
        <SectionHeading eyebrow="Got Questions?" line1={title} intro={subtitle} />

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-orange-strong/40 shadow-md" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-bold text-ink hover:text-orange-strong transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-orange-strong" : "text-gray-400"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-body-muted text-sm sm:text-base leading-relaxed border-t border-gray-100">
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
