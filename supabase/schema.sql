-- ==============================================================================
-- St George Electrical Energy Solutions - Complete Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE TABLES
-- 2.1 Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('solar_battery', 'ev_charger', 'electrical')),
    description TEXT,
    sector TEXT NOT NULL CHECK (sector IN ('domestic', 'commercial', 'industrial')),
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    suburb TEXT,
    service_type TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
);

-- 2.6 Admin Users Table (Links to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 Keepalive Table (For pinging to prevent Supabase Free-Tier pausing)
CREATE TABLE IF NOT EXISTS public.keepalive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pinged_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_sector ON public.services(sector);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_sort_order ON public.gallery(sort_order ASC);

-- 4. SECURITY (ROW LEVEL SECURITY)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keepalive ENABLE ROW LEVEL SECURITY;

-- 4.1 Helper Function: Check if caller is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- 4.2 Services Policies
-- Public can read active services
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

-- Admin full access on services
DROP POLICY IF EXISTS "Admin full access services" ON public.services;
CREATE POLICY "Admin full access services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.3 Enquiries Policies
-- Public (anon & authenticated) can only INSERT with basic length validation
DROP POLICY IF EXISTS "Public can insert enquiries" ON public.enquiries;
CREATE POLICY "Public can insert enquiries"
  ON public.enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) >= 2 AND
    length(email) >= 5 AND
    length(phone) >= 6 AND
    length(message) >= 3
  );

-- Admin can SELECT, UPDATE, DELETE enquiries
DROP POLICY IF EXISTS "Admin full access enquiries" ON public.enquiries;
CREATE POLICY "Admin full access enquiries"
  ON public.enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.4 Testimonials Policies
-- Public can view published testimonials
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

-- Admin full access on testimonials
DROP POLICY IF EXISTS "Admin full access testimonials" ON public.testimonials;
CREATE POLICY "Admin full access testimonials"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.5 Gallery Policies
-- Public can view gallery items
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
CREATE POLICY "Public can view gallery"
  ON public.gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full access on gallery
DROP POLICY IF EXISTS "Admin full access gallery" ON public.gallery;
CREATE POLICY "Admin full access gallery"
  ON public.gallery
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.6 Site Settings Policies
-- Public can view site settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full access on site settings
DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
CREATE POLICY "Admin full access site_settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.7 Admin Users Policies
DROP POLICY IF EXISTS "Users can check own admin status" ON public.admin_users;
CREATE POLICY "Users can check own admin status"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admin can manage admin_users" ON public.admin_users;
CREATE POLICY "Admin can manage admin_users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4.8 Keepalive Policies
-- Public anon role can read the keepalive table (used by GitHub Actions cron)
DROP POLICY IF EXISTS "Anon can read keepalive" ON public.keepalive;
CREATE POLICY "Anon can read keepalive"
  ON public.keepalive
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admin full access keepalive" ON public.keepalive;
CREATE POLICY "Admin full access keepalive"
  ON public.keepalive
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. STORAGE BUCKET CONFIGURATION
-- Creates the public 'site-assets' bucket for gallery and service photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read storage files in site-assets
DROP POLICY IF EXISTS "Public can view site-assets" ON storage.objects;
CREATE POLICY "Public can view site-assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

-- Admin can upload files to site-assets
DROP POLICY IF EXISTS "Admin can upload site-assets" ON storage.objects;
CREATE POLICY "Admin can upload site-assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());

-- Admin can update files in site-assets
DROP POLICY IF EXISTS "Admin can update site-assets" ON storage.objects;
CREATE POLICY "Admin can update site-assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin());

-- Admin can delete files in site-assets
DROP POLICY IF EXISTS "Admin can delete site-assets" ON storage.objects;
CREATE POLICY "Admin can delete site-assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND public.is_admin());

-- 6. SEED INITIAL DATA
-- Initial Keepalive record
INSERT INTO public.keepalive (id, pinged_at)
VALUES ('00000000-0000-0000-0000-000000000001', timezone('utc'::text, now()))
ON CONFLICT (id) DO NOTHING;

-- Initial Site Settings
INSERT INTO public.site_settings (key, value)
VALUES
    ('phone', '0423 209 113'),
    ('email', 'info@stgeorgeelectrical.com.au'),
    ('licence', 'ACT: 20221303 | NSW: 387814C'),
    ('business_name', 'St George Electrical Energy Solutions'),
    ('abn', '53 661 581 645'),
    ('operating_hours', 'Monday - Friday: 7:00 AM - 5:00 PM (24/7 Emergency Service)'),
    ('service_area', 'Canberra, ACT, Queanbeyan, Yass & Capital Region'),
    ('badge_text', 'CEC Accredited Solar & Battery Installer | Licensed ACT & NSW')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Initial Services
INSERT INTO public.services (title, slug, category, sector, description, sort_order, is_active)
VALUES
    ('Residential Solar & Battery Systems', 'residential-solar-battery', 'solar_battery', 'domestic', 'High-efficiency rooftop solar arrays paired with Tier 1 home battery storage systems tailored for ACT & NSW homes.', 1, true),
    ('Commercial Solar Systems', 'commercial-solar', 'solar_battery', 'commercial', 'Turnkey 30kW - 100kW+ commercial PV solar installations designed to slash corporate daytime energy bills.', 2, true),
    ('Home EV Charger Installation', 'home-ev-charger', 'ev_charger', 'domestic', '7.4kW single-phase and 22kW three-phase smart EV wallbox chargers for Tesla, BYD, Kia, Hyundai & all Type-2 vehicles.', 3, true),
    ('Commercial EV Fleet Charging', 'commercial-ev-fleet', 'ev_charger', 'commercial', 'Multi-bay fleet and workplace charging infrastructure with smart load management and OCPP billing compatibility.', 4, true),
    ('Switchboard Upgrades & RCBOs', 'switchboard-upgrades', 'electrical', 'domestic', 'Modern safety switchboard replacements, RCBO retrofits, and smart meter ready boards compliant with AS/NZS 3000.', 5, true),
    ('Industrial Power & Automation', 'industrial-power', 'electrical', 'industrial', 'Heavy industrial switchboards, three-phase sub-mains, factory machine power feeds, and fault isolation.', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Initial Testimonials
INSERT INTO public.testimonials (name, text, rating, is_published)
VALUES
    ('David M. - Gungahlin, ACT', 'Justin and the team installed a 9.6kW solar array and Sigenergy battery at our home. Flawless workmanship, clean cabling, and our power bills are practically zero.', 5, true),
    ('Sarah & Andrew P. - Belconnen', 'Fast quote, prompt turnaround, and they handled all the ACT rebate paperwork seamlessly. Best electricians in Canberra hands down.', 5, true),
    ('Robert T. - Commercial Warehouse Fyshwick', 'Three-phase switchboard replacement and high bay LED retrofit done over the weekend with zero downtime for our staff. Highly recommended.', 5, true)
ON CONFLICT DO NOTHING;
