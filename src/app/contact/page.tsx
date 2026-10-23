import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";
import { BUSINESS, SERVICE_AREAS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Justin George | St George Electrical Energy Solutions",
  description:
    "Get in touch with Justin George at St George Electrical Energy Solutions. Call 0450 598 628 or email justingeorge@zohomail.com.au. Canberra ACT licensed electrician #2028729.",
};

export default function ContactPage() {
  return (
    <div className="bg-off-white min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            ACT Licence #{BUSINESS.licence} · Direct Electrician Contact
          </div>
          <h1
            className="text-3xl sm:text-5xl text-navy mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Get In Touch
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Have questions about solar, batteries, EV chargers, or electrical work? Speak directly with Justin George.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Left Column: Direct Contact Details & Trust */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card p-6 sm:p-8 space-y-6 bg-navy text-white">
              <h2
                className="text-2xl text-white mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Contact Information
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 text-green-light flex items-center justify-center flex-shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-white/60 block text-xs">Direct Phone / Urgent Callouts</span>
                    <a
                      href={phoneHref(BUSINESS.phone)}
                      className="text-lg font-bold text-white hover:text-green-light transition-colors"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 text-green-light flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-white/60 block text-xs">Email Address</span>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-white hover:text-green-light transition-colors font-medium break-all"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 text-green-light flex items-center justify-center flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-white/60 block text-xs">Trading Hours</span>
                    <p className="text-white font-medium">Monday – Friday: 7:00 AM – 5:00 PM</p>
                    <p className="text-white/60 text-xs mt-0.5">Emergency assistance available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 text-green-light flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-white/60 block text-xs">Service Radius</span>
                    <p className="text-white font-medium">Canberra, ACT &amp; Surrounding Regions</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-xs text-white/60 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-light" />
                  <span>ACT Electrical Contractor Licence #{BUSINESS.licence}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-light" />
                  <span>Master Electricians Australia Member</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-light" />
                  <span>Fully Insured &amp; Certified Clean Energy Council Installer</span>
                </div>
              </div>
            </div>

            {/* Service Areas tag list */}
            <div className="card p-6 bg-white">
              <h3 className="text-sm font-bold text-navy mb-3">Regions We Service</h3>
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.map((area) => (
                  <span
                    key={area.slug}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {area.name} ({area.region})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
