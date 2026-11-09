import type { Metadata } from "next";
import { ShieldCheck, Phone, CheckCircle } from "lucide-react";
import BookingForm from "@/components/forms/booking-form";
import { BUSINESS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book an Electrician Canberra | St George Electrical",
  description:
    "Schedule an electrical repair, switchboard upgrade, or safety inspection in Canberra & ACT. St George Electrical Energy Solutions (ACT Licence #2024729). Prompt & reliable service.",
};

export default function BookingPage() {
  return (
    <div className="section-light min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow mb-3 !text-orange-strong">
            Prompt Scheduling Across ACT &amp; Surrounds
          </span>
          <h1 className="text-3xl sm:text-5xl text-ink mb-3">
            Book an <span className="text-accent">Electrician</span>
          </h1>
          <p className="text-body-muted text-sm sm:text-base">
            Request a service visit or inspection for your property.
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
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-3">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-orange-strong" /> ACT Licence #{BUSINESS.licence}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-orange-strong" /> Master Electricians
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
