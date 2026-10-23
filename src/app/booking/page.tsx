import type { Metadata } from "next";
import { ShieldCheck, Phone, CheckCircle, Clock } from "lucide-react";
import BookingForm from "@/components/forms/booking-form";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book an Electrician Canberra | St George Electrical",
  description:
    "Schedule an electrical repair, switchboard upgrade, or safety inspection in Canberra & ACT. Licensed electrician Justin George (Licence #2028729). Prompt & reliable service.",
};

export default function BookingPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <Clock size={14} />
            Prompt Scheduling Across ACT &amp; Surrounds
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book an Electrician
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Request a service visit or inspection for your home, commercial property, or industrial facility.
          </p>
        </div>

        <BookingForm />

        <div className="mt-12 text-center max-w-md mx-auto">
          <p className="text-sm text-gray-500 mb-2">Have an urgent power outage or sparking hazard?</p>
          <a
            href={phoneHref(BUSINESS.phone)}
            className="inline-flex items-center gap-2 text-base font-bold text-red-600 hover:underline"
          >
            <Phone size={18} />
            Call Emergency Dispatch: {BUSINESS.phoneDisplay}
          </a>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-3">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-green" /> ACT Licence #{BUSINESS.licence}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-green" /> Master Electricians
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
