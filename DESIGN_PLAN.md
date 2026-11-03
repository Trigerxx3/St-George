# DESIGN_PLAN.md — St George Electrical restyle

Status: **DRAFT, awaiting approval. No code has been changed.**
Scope: styling and layout only. Routes, copy, SEO titles/meta/schema, forms, data and features stay as they are.

---

## 1. Design tokens

All tokens live in [`src/app/globals.css`](./src/app/globals.css) (Tailwind v4 `@theme`, there is no `tailwind.config`). Existing token names are kept and re-pointed, so most pages restyle without per-file edits.

### Colour
| Token | Value | Use |
|---|---|---|
| `--color-navy-950` (new) | `#071522` | Dark section background, header, footer |
| `--color-navy` / `-light` / `-dark` | `#0B1D30` / `#12304D` / `#071522` | Panels and gradients (re-pointed, same names) |
| `--color-off-white` | `#F9FAFB` | Light section background (was `#F5F7FA`) |
| `--color-ink` (new) | `#0B1220` | Near-black text on light |
| `--color-orange` | `#E8751A` (brand, unchanged) | Glows, borders, icons and text **on dark only** |
| `--color-orange-light` | `#F08B3A` | Hover, glow |
| `--color-orange-strong` (new) | `#B84E08` | Orange **text on light** and **button fill with white text** (see contrast) |
| `--color-green` | `#4C8C2B` (unchanged) | Glowing line details, small highlights only |
| `--color-green-glow` (new) | `#5DA335` | Green line glow |
| `--text-on-dark-muted` (new) | `#9FB2C8` | Body text on dark |
| `--text-on-light-muted` (new) | `#4B5563` | Body text on light |
| `--glass-bg` / `--glass-border` (new) | `rgba(255,255,255,.06)` / `rgba(255,255,255,.12)` | Glass panels, with `backdrop-blur-xl` |

**Contrast check (my calculations, I will re-verify with a tool during build):**
- `#E8751A` on `#071522`: about 5.8:1. Passes AA, so it is used for text on dark.
- `#E8751A` on `#F9FAFB`: about 3:1. **Fails AA for body or small text.** On light I use `#B84E08` (about 4.9:1) for eyebrows, highlighted words and text links.
- White text on `#E8751A`: about 3:1. **Fails for small bold button text.** Options in section 6, Q1.

### Typography
- Font: **Manrope** (weights 400–800), loaded with `next/font/google` (built into Next, **no new dependency**). It replaces the render-blocking Google Fonts `<link>` in `layout.tsx` and helps Lighthouse and layout shift.
- `--font-heading` and `--font-body` both point to Manrope, so the many inline `style={{fontFamily:"var(--font-heading)"}}` usages need no edits.
- Headings: remove the global `text-transform: uppercase`. Tight tracking (`-0.03em`), `clamp()` sizes, two-line pattern (line 1 base colour, line 2 accent).
- New utilities: `.eyebrow` (11–12px, uppercase, `0.18em` tracking, accent), `.heading-accent` (accent span).
- `--font-accent` (Dancing Script, used for taglines): see Q4.

### Spacing, radius, shadow, motion
- `.section-padding`: 72px mobile → 112px desktop. `.container-custom`: max-width 1200px (was 1280px).
- Radius tokens: `--radius-card: 16px`, `--radius-control: 12px`, `--radius-pill: 999px`.
- Glow shadows: `--shadow-glow-orange`, `--shadow-glow-green`.
- Motion: CSS only (`.reveal` fade/slide via a tiny IntersectionObserver hook, card hover-lift, CSS marquee, scroll-snap carousel). All wrapped in `prefers-reduced-motion`. **No animation library added.**
- Light/dark section helpers: `.section-dark` (navy-950 with radial glows and faint dot texture), `.section-light`.
- `.wire-line`: shared SVG curved-line component with a faint glow, reused between sections.

### Shared component classes (rewritten in `globals.css`)
- `.btn-primary`: orange rounded-rectangle, bold small text, `↗` icon slot.
- `.btn-secondary`: ghost on dark.
- `.btn-outline`: ghost outline.
- `.btn-pill-glow` (new): final CTA.
- `.card`, `.card-glass`, `.input-field` and a shared modal style, so catalogue and forms inherit them.
- The existing `.btn-*`, `.card`, `.badge-primary` class names are kept, so pages that use them restyle automatically.

---

## 2. New shared components (all presentational)
| New file | Purpose |
|---|---|
| `src/components/ui/section-heading.tsx` | Eyebrow (optionally numbered) plus two-line heading plus optional right-hand intro |
| `src/components/ui/wire-line.tsx` | Curved glowing SVG line |
| `src/components/ui/reveal.tsx` | Scroll fade/slide wrapper (reduced-motion safe) |
| `src/components/ui/glass-card.tsx` | Glass panel |
| `src/components/ui/modal.tsx` | Dimmed blurred backdrop, white rounded dialog, round close button, focus trap, Esc to close |
| `src/components/home/showcase-hotspots.tsx` | Interactive showcase (pattern 3) |
| `src/components/home/logo-marquee.tsx` | Marquee with clearly marked placeholder tiles (pattern 5) |
| `src/components/home/process-timeline.tsx` | Home timeline (pattern 7); `ProcessSteps` is restyled and reused on service pages |

---

## 3. Homepage mapping (current section → pattern)

Order below is the proposed order. Nothing existing is deleted.

| # | Our current section (file) | Pattern | What changes |
|---|---|---|---|
| 1 | `hero-section.tsx` | **2 Hero (dark)** | Same headline, tagline, paragraph, CTAs, image and licence text. Adds eyebrow, glow, one curved line, large rounded photo with a glass card overlapping the edge. Trust row keeps our existing items. Existing floating callouts (“Tier-1 N-Type Solar”, “0% Interest ACT Scheme Finance”) become the glass card. |
| 2 | `value-pillars.tsx` | Light cards (3-col) | White cards, thin orange line icons, hover lift. |
| 3 | `solar-feature-block.tsx` + `service-cards.tsx` | **3 Interactive showcase** | Hotspots on our own photos for Solar & Battery, EV Charger, Electrical. Each hotspot's glass card uses our existing titles, taglines, descriptions and links. See Q6 for the hotspot-position question. |
| 4 | `service-cards.tsx` | **4 Services grid (light)** | Numbered eyebrow, two-line heading, 3 image cards with 01/02/03 badges. Currently the homepage shows 2 cards (EV, Electrical); `SERVICES` holds 3, so Solar & Battery is added as the first card using existing copy. See Q3. |
| 5 | *(no content yet)* | **5 Logo strip (dark)** | Marquee of tiles marked “PLACEHOLDER — supplier logo”, as you asked. Easy to drop out. See Q5. |
| 6 | `calculator-teaser.tsx` | **6 Savings (dark)** | Two-line heading left, existing text right, glass panel. Today this is a teaser that links to `/calculator`; the real calculator is a separate page. See Q2. |
| 7 | `process-steps.tsx` data (4 steps) | **7 Timeline (dark)** | 4 numbered circles on a glowing curve, using our existing 4 steps. Added to the homepage; today it only appears on service pages. |
| 8 | `case-study-preview.tsx` | **8 Gallery carousel (light)** | 3 cards per view with overlay, pill tag, title, arrow, orange-pill pagination dots, and a modal with our existing title, location, description, “Explore Case Study” link and an orange button. |
| 9 | `testimonial-slider.tsx` | Dark glass slider | Restyled only. Still shows the existing **[PLACEHOLDER REVIEW]** text. I will not invent reviews. |
| 10 | `featured-products.tsx` | Light product cards | Same cards, new card, button and badge styles. Keeps `[Product Photo]` placeholders. |
| 11 | `licence-trust-bar.tsx` | **9 CTA band** | Photo background with navy overlay, heading left, glass card right with three icon rows. Content: our existing licence, insured and Master Electricians items. See Q7 for the heading. |
| 12 | `ServiceCTA` / quote prompt | **10 Final CTA (dark)** | Eyebrow, large heading, glowing orange pill, gradient divider. Reuses existing CTA copy. |

## 4. Other areas (by file)
| Area | Files | Plan |
|---|---|---|
| Header (**1**) | `layout/site-header.tsx`, `lib/constants.ts` (nav only if approved) | Dark translucent sticky, centred nav, orange underline on active item (via `usePathname`), orange “Get a Free Quote ↗” (same text and href), top info bar kept. Dropdowns kept. See Q8. |
| Footer (**11**) | `layout/site-footer.tsx` | 4 columns as specified: contact column with orange icons and location pill; services; company/quick links; service areas in two sub-columns plus “All service areas →”; bottom bar with “Back to top ↑”. All link targets and text unchanged. |
| Mobile bar | `layout/mobile-floating-bar.tsx` | Restyle to match. |
| Service pages | `services/service-hero.tsx`, `service-features.tsx`, `process-steps.tsx`, `service-faq.tsx`, `service-cta.tsx`, `related-services.tsx` | Dark hero, light features, dark process, light FAQ accordion, dark final CTA. These are shared, so `/solar-battery`, `/ev-chargers`, `/electrical` and `/areas/*` restyle together. |
| Catalogue | `app/products/**`, `app/packages/**`, `lib/catalogue-data.ts` (untouched) | Card, button, filter-chip and badge styles. Product detail gets a glass spec panel. |
| Forms | `forms/multi-step-quote-form.tsx`, `forms/contact-form.tsx`, booking page | Inputs, selection tiles, progress bar and success state use the shared styles. Validation, honeypot and `/api/quote` untouched. |
| Remaining | `about`, `contact`, `gallery` (also gets the modal), `faq`, `blog/**`, `rebates`, `calculator`, `ev-selector`, `testimonials`, legal pages | Hero band plus card and button restyle. Calculator logic untouched; only its container gets the glass panel. |
| Admin | `app/admin/**` | **Not touched.** Admin is internal and is not part of the public redesign. |
| Layout shell | `app/layout.tsx` | Only the font loading changes (`next/font`). Metadata, JSON-LD and schema untouched. |

## 5. Implementation order, checks and commits
1. Tokens and globals → 2. Header and footer → 3. Homepage → 4. Service pages → 5. Catalogue → 6. Forms → 7. Remaining pages.

After each area: run the dev server, check at 375 / 768 / 1280 widths, check keyboard focus and reduced motion, run Lighthouse mobile, check contrast, then write a short summary. One commit per area, so each is easy to roll back.

**Constraints I will follow:** no new dependencies (flagged above: none planned); no copy, price, stat or review invented; no layout shift (explicit image sizes and aspect ratios, `next/font`, `next/image` where it is already allowed by `next.config.ts`).

---

## 6. Questions I need answered before coding

1. **Button text colour.** The brand orange `#E8751A` with white text is about 3:1, which fails WCAG AA. Choose:
   - (a, recommended) Button fill `#B84E08` with white text (about 5:1). A slightly deeper orange, with the bright orange kept for glows and borders.
   - (b) Bright `#E8751A` with navy text (about 6:1).
   - (c) Bright orange with white text anyway (fails AA).
2. **Calculator (pattern 6).** Your “existing solar savings calculator” is on `/calculator`; the homepage only has a teaser. Do you want (a) the teaser restyled as the glass panel linking to the calculator (recommended, no functional change), or (b) the real calculator embedded on the homepage (functional/layout change)?
3. **Services grid.** Add Solar & Battery as a third card so there are 3 cards in a row? (Recommended; uses existing copy.)
4. **Dancing Script taglines.** The script font is used for taglines (“Powering your Home & Business with Confidence.”). The new style is a single clean sans. Replace it with Manrope italic/medium for the same tagline text? (Recommended.)
5. **Logo strip.** Include the placeholder tiles now, or skip the section until you supply the brands?
6. **Showcase hotspots.** Hotspot positions on the photos are a layout choice, and the text is ours. OK for me to place them, with you adjusting later?
7. **CTA band heading (pattern 9).** We have no existing heading for this band. Use existing copy, e.g. “Ready to Upgrade Your Energy System?” from `ServiceCTA`, and the three licence/insured/Master Electricians items in the glass card?
8. **Header nav.** You asked for dropdowns for “Services” and “Service areas”. Today the nav has Services, Sectors (removed earlier), Products, Tools, Gallery, Blog, Contact, and the service areas are only in the footer. May I add a “Service areas” dropdown linking to the existing `/areas/*` routes? It is a nav-structure change, so I'm asking first. I would keep all other items.
9. **Hero trust row.** It still contains “Domestic · Commercial · Industrial”, left over from the sector content you asked me to remove. The pattern calls for licence, Licensed & Insured and Master Electricians Australia. May I replace that item?
10. **Commits.** The terminal sandbox in this environment has been failing for plain commands such as `git`, so commits need to run outside it. OK for me to run `git` commands that way? Also confirm the project is already a git repository (I could not check).

