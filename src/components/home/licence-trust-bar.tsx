import { Shield, Award, CheckCircle, FileCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function LicenceTrustBar() {
  return (
    <section className="bg-off-white border-y border-gray-200">
      <div className="container-custom py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Licence */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-navy/5 text-navy mb-3">
              <Shield size={24} strokeWidth={1.5} />
            </div>
            <p
              className="text-sm font-bold text-navy uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ACT Licensed
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Licence #{BUSINESS.licence}
            </p>
          </div>

          {/* Insured */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green/5 text-green mb-3">
              <CheckCircle size={24} strokeWidth={1.5} />
            </div>
            <p
              className="text-sm font-bold text-navy uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Fully Insured
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Public liability coverage
            </p>
          </div>

          {/* Master Electricians */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange/5 text-orange mb-3">
              <Award size={24} strokeWidth={1.5} />
            </div>
            <p
              className="text-sm font-bold text-navy uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Master Electricians
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Proud member
            </p>
          </div>

          {/* Standards */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-navy/5 text-navy mb-3">
              <FileCheck size={24} strokeWidth={1.5} />
            </div>
            <p
              className="text-sm font-bold text-navy uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              AS/NZS Compliant
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Australian Standards
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
