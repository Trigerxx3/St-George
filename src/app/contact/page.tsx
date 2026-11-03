import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle } from "lucide-react";
import ContactForm from "@/components/forms/contact-form";
import { BUSINESS, SERVICE_AREAS } from "@/lib/constants";
import { phoneHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us | St George Electrical Energy Solutions",
  description:
    "Get in touch with St George Electrical Energy Solutions. Call 0450 598 628 or email justingeorge@zohomail.com.au. Canberra ACT licensed electrician #2028729.",
};

export default function ContactPage() {
  return (
    <div className="section-light min-h-screen py-12 lg:py-16">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-3 !text-orange-strong">
            ACT Licence #{BUSINESS.licence} · Direct Electrician Contact
          </span>
          <h1 className="text-3xl sm:text-5xl text-ink mb-3">
            Get In <span className="text-accent">Touch</span>
          </h1>
          <p className="text-body-muted text-sm sm:text-base">
            Have questions about solar, batteries, EV chargers, heating &amp; cooling, security, or electrical work? Speak directly with our licensed team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-5 space-y-6">
            <div className="section-dark rounded-3xl p-6 sm:p-8 space-y-6 text-white shadow-xl">
              <h2 className="text-2xl text-white mb-4">
                Contact Information
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-orange/40 text-orange-light flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-[#9fb2c8] block text-xs">Direct Phone / Urgent Callouts</span>
                    <a
                      href={phoneHref(BUSINESS.phone)}
                      className="text-lg font-bold text-white hover:text-orange-light transition-colors"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-orange/40 text-orange-light flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[#9fb2c8] block text-xs">Email Address</span>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-white hover:text-orange-light transition-colors font-medium break-all"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-orange/40 text-orange-light flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[#9fb2c8] block text-xs">Trading Hours</span>
                    <p className="text-white font-medium">Monday – Friday: 7:00 AM – 5:00 PM</p>
                    <p className="text-[#9fb2c8] text-xs mt-0.5">Emergency assistance available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border border-orange/40 text-orange-light flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[#9fb2c8] block text-xs">Service Radius</span>
                    <p className="text-white font-medium">Canberra, ACT &amp; Surrounding Regions</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-0 text-xs text-[#9fb2c8] space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-orange" />
                  <span>ACT Electrical Contractor Licence #{BUSINESS.licence}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-orange" />
                  <span>Master Electricians Australia Member</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-orange" />
                  <span>Fully Insured &amp; Certified Clean Energy Council Installer</span>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-white">
              <h3 className="text-sm font-bold text-ink mb-3">Regions We Service</h3>
              <div className="flex flex-wrap gap-2">
                {SERVICE_AREAS.map((area) => (
                  <span
                    key={area.slug}
                    className="px-2.5 py-1 bg-off-white border border-gray-200 text-gray-700 text-xs rounded-md"
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
