import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import MobileFloatingBar from "@/components/layout/mobile-floating-bar";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://stgeorgeelectrical.com.au"),
  title: {
    default: "St George Electrical Energy Solutions | Licensed Electrician Canberra ACT",
    template: "%s | St George Electrical Energy Solutions",
  },
  description:
    "Licensed electrical contractor in Canberra & ACT. Solar panels, battery storage, EV charger installation, electrical services. Licence #2028729. Call 0450 598 628 for a free quote.",
  keywords: [
    "electrician Canberra",
    "solar panels ACT",
    "battery storage Canberra",
    "EV charger installation Canberra",
    "switchboard upgrade Canberra",
    "licensed electrician ACT",
    "St George Electrical Energy Solutions",
    "Justin George electrician",
  ],
  authors: [{ name: "Justin George", url: "https://stgeorgeelectrical.com.au" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "St George Electrical Energy Solutions",
    title: "St George Electrical Energy Solutions | Licensed Electrician Canberra ACT",
    description:
      "Licensed electrical contractor in Canberra & ACT. Solar, battery, EV chargers & electrical services. Licence #2028729. Call 0450 598 628.",
    url: "https://stgeorgeelectrical.com.au",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["Electrician", "LocalBusiness"],
  name: BUSINESS.name,
  image: "https://stgeorgeelectrical.com.au/brand/logo.svg",
  telephone: BUSINESS.phoneDisplay,
  email: BUSINESS.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Canberra",
    addressRegion: "ACT",
    postalCode: "2600",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -35.2809,
    longitude: 149.13,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "17:00",
    },
  ],
  areaServed: [
    { "@type": "AdministrativeArea", name: "Canberra, ACT" },
    { "@type": "AdministrativeArea", name: "Queanbeyan, NSW" },
    { "@type": "AdministrativeArea", name: "Goulburn, NSW" },
    { "@type": "AdministrativeArea", name: "Yass, NSW" },
    { "@type": "AdministrativeArea", name: "Gungahlin, ACT" },
    { "@type": "AdministrativeArea", name: "Belconnen, ACT" },
    { "@type": "AdministrativeArea", name: "Tuggeranong, ACT" },
    { "@type": "AdministrativeArea", name: "Woden, ACT" },
  ],
  memberOf: {
    "@type": "Organization",
    name: "Master Electricians Australia",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Dancing+Script:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileFloatingBar />
      </body>
    </html>
  );
}
