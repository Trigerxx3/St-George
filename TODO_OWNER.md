# St George Electrical Energy Solutions — Owner Handover Checklist

Welcome Justin! This checklist outlines the final operational items and verification details to launch your website.

---

## 1. Business & Registration Information
- [ ] **ABN Verification**: Insert your Australian Business Number (ABN) in `src/lib/constants.ts` under `BUSINESS.abn`.
- [ ] **Street Address**: Update your registered physical or workshop address in `src/lib/constants.ts` (currently defaulted to Canberra, ACT 2600).
- [ ] **Social Profiles**: Add your official Facebook, Instagram, or LinkedIn page URLs to `BUSINESS.social` in `src/lib/constants.ts`.
- [ ] **Google Business Profile**: Add your Google Business review link in `src/lib/constants.ts` so clients can leave Google reviews directly.

---

## 2. Brand Assets & Photos
- [ ] **Official Logo**: Place your high-resolution vector logo in `public/brand/logo.svg` (or PNG format).
- [ ] **Van / Team Photos**: Replace placeholder images in `public/images/` with real photos of Justin George, your service van, and completed Canberra installations.
- [ ] **Project Case Studies**: Review the projects in `src/app/gallery/page.tsx` and add any additional high-profile Canberra or NSW installations.

---

## 3. Email & Lead Notification Dispatch
- [ ] **Resend API Key**: Sign up for a free account at [Resend.com](https://resend.com) (100 free emails/day).
- [ ] Add your API key to `.env.local`:
  ```bash
  RESEND_API_KEY="re_your_api_key_here"
  EMAIL_FROM="St George Electrical <notifications@stgeorgeelectrical.com.au>"
  ```
- [ ] Verify that lead notification emails are arriving in `justingeorge@zohomail.com.au`.

---

## 4. Government Schemes & Rebate Verification
- [ ] **ACT Sustainable Household Scheme (Brighte)**: Confirm your current active merchant account details with Brighte to ensure 0% interest loan applications can be linked seamlessly.
- [ ] **Clean Energy Regulator (STC)**: Confirm your preferred STC certificate aggregator/trader for point-of-sale customer discounts.

---

## 5. Domain & Production Deployment (Vercel)
- [ ] Connect your repository to **Vercel** ([vercel.com](https://vercel.com)).
- [ ] Configure your custom domain (`stgeorgeelectrical.com.au`) in Vercel project settings.
- [ ] Set `NEXT_PUBLIC_SITE_URL="https://stgeorgeelectrical.com.au"` in Vercel Environment Variables.
- [ ] Test the `/sitemap.xml` and `/robots.txt` in Google Search Console for automated search indexing.

---

*Built with Next.js 14/16 App Router, TypeScript, and Tailwind CSS. Mobile-first lead-generation platform.*
