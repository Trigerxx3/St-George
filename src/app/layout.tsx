import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/layout/public-shell";
import { BUSINESS } from "@/lib/constants";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope-next",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://stgeorgeelectrical.com.au"),
  title: {
    default: "St George Electrical Energy Solutions | Licensed Electrician Canberra ACT",
    template: "%s | St George Electrical Energy Solutions",
  },
  description:
    "Licensed electrical contractor in Canberra & ACT. Solar panels, battery storage, EV charger installation, electrical services. Licence #2024729. Call 0450 598 628 for a free quote.",
  keywords: [
    "electrician Canberra",
    "solar panels ACT",
    "battery storage Canberra",
    "EV charger installation Canberra",
    "switchboard upgrade Canberra",
    "licensed electrician ACT",
    "St George Electrical Energy Solutions",
    "Canberra electrical contractor",
  ],
  authors: [{ name: "St George Electrical Energy Solutions", url: "https://stgeorgeelectrical.com.au" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "St George Electrical Energy Solutions",
    title: "St George Electrical Energy Solutions | Licensed Electrician Canberra ACT",
    description:
      "Licensed electrical contractor in Canberra & ACT. Solar, battery, EV chargers & electrical services. Licence #2024729. Call 0450 598 628.",
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
  image: "https://stgeorgeelectrical.com.au/brand/logo.png",
  logo: "https://stgeorgeelectrical.com.au/brand/logo.png",
  telephone: BUSINESS.phoneDisplay,
  email: BUSINESS.email,
  priceRange: "$$",
  sameAs: [BUSINESS.social.facebook, BUSINESS.social.instagram].filter(Boolean),
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
    <html lang="en" className={`h-full ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
