# St George Electrical Energy Solutions — Production Web Application

Production-ready, mobile-first lead-generation platform and clean energy product catalogue for **St George Electrical Energy Solutions**, a licensed electrical contractor based in Canberra / ACT, Australia (ACT Licence #2028729).

---

## ⚡ Key Features

- **Mobile-First High-Converting UX**:
  - Sticky header with click-to-call (`0450 598 628`) and instant "Get a Free Quote" CTAs.
  - Floating mobile quick-action bar (Call, WhatsApp, Request Quote).
  - Multi-step interactive quote wizard (`/quote`) with service, property, location, usage, and contact steps.
  - Urgent repair & inspection booking form (`/booking`).
  - Interactive Solar & Battery Savings Calculator (`/calculator`) tailored to Canberra solar radiation and retail tariffs.
  - Interactive EV Charger Sizing & Matchmaker Tool (`/ev-selector`).

- **Services & Sector Solutions**:
  - Solar & Battery Solutions (`/solar-battery`)
  - EV Charger Installation (`/ev-chargers`)
  - General Electrical Contracting & Switchboard Upgrades (`/electrical`)
  - Domestic Residential Sector (`/domestic`)
  - Commercial Fitouts & Peak Shaving (`/commercial`)
  - Industrial Power & Machinery Wiring (`/industrial`)

- **Catalogue & Packages**:
  - Product catalogue with category filter pills (`/products`)
  - Individual product detail pages with technical specs, warranties, and quote pre-fill (`/products/[category]/[slug]`)
  - Turnkey clean energy packages (`/packages` and `/packages/[slug]`)
  - Rebates & Incentives Guide (`/rebates`) explaining the ACT Sustainable Household Scheme & Federal STC discounts.

- **Trust & Social Proof**:
  - Verified project case studies & gallery (`/gallery`)
  - Customer review carousel & testimonials page (`/testimonials`)
  - Categorized FAQ page with JSON-LD schema (`/faq`)
  - Educational energy guides blog (`/blog` and `/blog/[slug]`)
  - Local SEO landing pages for Canberra, Queanbeyan, Belconnen, Gungahlin, Woden, Tuggeranong, Goulburn, and Yass (`/areas/[slug]`)

- **Admin Control Dashboard**:
  - Overview KPI metrics and recent leads (`/admin`)
  - Quotes management pipeline (`/admin/quotes`)
  - Service bookings tracker (`/admin/bookings`)
  - Catalogue inventory overview (`/admin/products`, `/admin/packages`, `/admin/blog`)

- **SEO & Compliance**:
  - Dynamic XML sitemap generator (`/sitemap.xml`)
  - Search engine crawler rules (`/robots.txt`)
  - JSON-LD structured schemas (`LocalBusiness`, `Electrician`, `Product`, `FAQPage`)
  - WCAG accessible design with semantic tags and high-contrast styling

---

## 🛠️ Tech Stack

- **Framework**: Next.js App Router (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables design system
- **Icons**: Lucide React
- **Forms & Validation**: Zod schemas with bot honeypot protection
- **Email Service**: Resend API integration with safe mock fallback for development

---

## 🚀 Getting Started

1. Clone or navigate to repository:
   ```bash
   cd "d:/St George"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Ownership
Copyright © 2025 St George Electrical Energy Solutions. All rights reserved.
Owner: Justin George (ACT Licence #2028729).
