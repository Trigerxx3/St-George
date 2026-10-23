import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  AlertCircle,
  Zap,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ACT Solar Rebates & Incentives | Sustainable Household Scheme Canberra",
  description:
    "Learn about the ACT Sustainable Household Scheme ($15,000 interest-free loans) and Federal STC solar rebates available in Canberra. St George Electrical handles all paperwork.",
};

const SCHEMES = [
  {
    title: "ACT Sustainable Household Scheme (SHS)",
    badge: "Up to $15,000 Interest-Free",
    highlight: "0% Interest over 2 to 10 years",
    description:
      "The ACT Government provides eligible Canberra homeowners with zero-interest loans between $2,000 and $15,000 to help with the upfront costs of installing energy-efficient and renewable technologies.",
    eligibleItems: [
      "Rooftop solar systems (up to eligible caps)",
      "Household battery storage systems (e.g. Tesla Powerwall, Sungrow)",
      "Electric Vehicle (EV) home charging stations",
      "Switchboard upgrades required for installation",
    ],
    whoEligible:
      "ACT residents who own the property. No loan application fee or early repayment penalties.",
    howWeHelp:
      "St George Electrical is an accredited scheme participant. We provide compliant quotes and assist with the Brighte loan application process.",
  },
  {
    title: "Federal STC Solar Rebate (SRES)",
    badge: "Direct Point-of-Sale Discount",
    highlight: "Save up to $2,500 – $4,000 upfront",
    description:
      "Under the Australian Federal Small-scale Renewable Energy Scheme (SRES), eligible solar panel installations generate Small-scale Technology Certificates (STCs) based on expected clean energy generation.",
    eligibleItems: [
      "Residential rooftop solar installations (up to 100kW)",
      "Clean Energy Council approved solar panels and inverters",
      "Commercial solar installations",
    ],
    whoEligible: "All Canberra and NSW homeowners and businesses installing accredited solar systems.",
    howWeHelp:
      "We calculate and apply the STC discount directly on your quote as an upfront price reduction. You never have to trade certificates or wait for a government reimbursement.",
  },
  {
    title: "ACT Home Energy Support Program",
    badge: "Up to $5,000 in Grants",
    highlight: "Targeted support for concession card holders",
    description:
      "The ACT Government provides rebates to help low-income Canberra homeowners reduce energy bills and transition away from expensive fossil fuels.",
    eligibleItems: [
      "50% rebate up to $2,500 for rooftop solar",
      "50% rebate up to $2,500 for reverse-cycle heating/cooling or hot water",
      "Maximum combined rebate of $5,000",
    ],
    whoEligible:
      "Homeowners holding an eligible Australian Government Pensioner Concession Card or DVA Gold Card.",
    howWeHelp:
      "We verify your equipment eligibility, provide formal conforming quotes, and coordinate documentation for Access Canberra grant sign-off.",
  },
];

export default function RebatesPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <Award size={14} />
            Government Incentives &amp; Zero-Interest Financing
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-4 font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ACT Solar Rebates &amp; Incentives
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Maximize your return on clean energy with zero-interest ACT Government loans and Federal STC discounts. We handle the paperwork from start to finish.
          </p>
        </div>

        {/* Schemes list */}
        <div className="space-y-8 max-w-4xl mx-auto mb-16">
          {SCHEMES.map((scheme, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <span className="inline-block text-xs font-bold text-green bg-green/10 px-3 py-1 rounded-full">
                  {scheme.badge}
                </span>
                <span className="text-xs font-bold text-navy/70">{scheme.highlight}</span>
              </div>

              <h2
                className="text-2xl sm:text-3xl text-navy font-bold mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {scheme.title}
              </h2>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                {scheme.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-off-white rounded-xl p-5 mb-6 border border-gray-100">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
                    Eligible Technologies
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {scheme.eligibleItems.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
                    Eligibility &amp; Approvals
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{scheme.whoEligible}</p>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-1">
                    How Justin Assists
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{scheme.howWeHelp}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  ACT Licence #{BUSINESS.licence} · Full compliance documentation supplied
                </span>
                <Link
                  href="/quote?service=solar-battery"
                  className="btn-primary !py-2.5 !px-6 text-xs w-full sm:w-auto text-center"
                >
                  Check Your Rebate Eligibility <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Card */}
        <div className="max-w-4xl mx-auto p-5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Government Scheme Disclaimer:</span>
            <p className="text-amber-800 leading-relaxed">
              Rebate values and zero-interest loan availability are governed by ACT Government guidelines and Federal Clean Energy Regulator policies. All proposals issued by St George Electrical include itemized rebate calculations for complete transparency. Final approval rests with the respective statutory bodies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
