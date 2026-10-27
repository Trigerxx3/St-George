# St George Electrical Energy Solutions — Supabase Backend Setup Guide

This guide walks you through setting up Supabase as the backend for the St George Electrical Energy Solutions website, creating database tables with Row Level Security (RLS), setting up the storage bucket, establishing your first admin user, and configuring the automated keepalive GitHub Action.

---

## 1. Create Your Supabase Project

1. Go to [https://database.new](https://database.new) (or log in to [supabase.com](https://supabase.com)).
2. Click **New Project** and choose an organization.
3. Configure your project:
   - **Name:** `st-george-electrical`
   - **Database Password:** Generate a secure password and save it in a password manager.
   - **Region:** Choose `Oceania (Sydney)` (closest to Canberra / ACT).
   - **Plan:** Free tier is supported.
4. Click **Create new project** and wait 1–2 minutes for provisioning to finish.

---

## 2. Run the SQL Migration

All tables, indexes, Row Level Security policies, storage bucket policies, and seed data are contained in [`supabase/schema.sql`](./supabase/schema.sql).

1. In the Supabase Dashboard, click on **SQL Editor** in the left sidebar (or press `CMD + K` / `CTRL + K` and type `SQL`).
2. Click **+ New Query**.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) in your code editor, copy the entire file contents, and paste them into the SQL Editor.
4. Click **Run** (green button).
5. You should see `Success. No rows returned` or a list of created tables:
   - `services`
   - `enquiries`
   - `testimonials`
   - `gallery`
   - `site_settings`
   - `admin_users`
   - `keepalive`
   - `storage.buckets` (`site-assets` bucket)

---

## 3. Verify Storage Bucket & RLS

1. In the Supabase sidebar, go to **Storage** -> **Buckets**.
2. Confirm the `site-assets` bucket exists and is marked **Public**.
3. Storage policies are automatically configured by the migration:
   - **Public (anon):** Can view images in `site-assets`.
   - **Admin users:** Can upload, update, and delete images in `site-assets`.

---

## 4. Create the First Admin User

Public signup is disabled for the admin panel. Administrators are created in Supabase Auth and authorized via the `admin_users` table.

### Step 4.1: Create User in Supabase Auth
1. In the Supabase sidebar, click on **Authentication** -> **Users**.
2. Click **Add User** -> **Create user**.
3. Enter:
   - **Email:** e.g. `admin@stgeorgeelectrical.com.au` (or your personal admin email)
   - **Password:** A strong password
   - **Auto Confirm User:** Toggle **ON** (checked)
4. Click **Create user**.
5. Once created, locate the new user in the list and copy their **User UID** (a UUID like `e3b0c442-98fc-1c14-9afb-4c8996fb9242`).

### Step 4.2: Grant Admin Rights
1. Go back to the **SQL Editor**.
2. Run this command (replace with your copied user UUID):

```sql
INSERT INTO public.admin_users (user_id, role)
VALUES ('PASTE_USER_UID_HERE', 'admin')
ON CONFLICT (user_id) DO NOTHING;
```

3. Click **Run**. Your user is now verified as an administrator.

---

## 5. Configure Local Environment Variables

1. In your project directory, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. In Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
3. Copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys (`anon` / `public`)** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Paste them into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key-here
   NEXT_PUBLIC_SITE_URL=https://stgeorgeelectrical.com.au
   ```
5. *(Optional)* Add the same variables to your Vercel or hosting platform settings.

---

## 6. Prevent Free-Tier Pausing (GitHub Actions Keep-Alive)

Supabase free tier projects pause after 7 days of database inactivity. A pre-configured GitHub Actions workflow at [`.github/workflows/keepalive.yml`](./.github/workflows/keepalive.yml) runs every 3 days to perform a read request on the `keepalive` table.

To activate the keepalive workflow:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: setup Supabase backend, RLS, admin panel, and keepalive workflow"
   git push origin main
   ```
2. Go to your GitHub repository:
   - Click **Settings** -> **Secrets and variables** -> **Actions**.
3. Under **Repository secrets**, click **New repository secret**:
   - Secret 1:
     - **Name:** `SUPABASE_URL`
     - **Value:** Your Supabase project URL (e.g. `https://xyz.supabase.co`)
   - Secret 2:
     - **Name:** `SUPABASE_ANON_KEY`
     - **Value:** Your Supabase `anon` public key
4. Test the workflow:
   - In GitHub, go to the **Actions** tab.
   - Click **Supabase Keep-Alive Ping** in the left sidebar.
   - Click **Run workflow** -> **Run workflow**.
   - Verify that the action passes with a green checkmark.

---

## 7. Test Admin Panel & Features

1. Start your local server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000/admin`.
3. You will be automatically redirected to `http://localhost:3000/admin/login`.
4. Enter your admin email and password created in Step 4.
5. Features available in the Admin Portal:
   - **Overview (`/admin`):** Live counts of new inquiries, services, testimonials, and gallery photos.
   - **Enquiries (`/admin/enquiries`):** Review quote and contact leads, change status (`new` -> `contacted` -> `quoted` -> `closed`), search by name, suburb, or email.
   - **Services (`/admin/services`):** Edit service details, sort orders, and upload images to Supabase Storage.
   - **Testimonials (`/admin/testimonials`):** Publish, edit, and curate client reviews with star ratings.
   - **Gallery (`/admin/gallery`):** Upload photos of completed solar and electrical installations with captions.
   - **Site Settings (`/admin/settings`):** Update business phone numbers, email, licence text, and operating hours in real time.
   - **Sign Out:** Secure session destruction and redirect to login.

---

## Security & Architectural Notes

- **Zero Secret Leaks:** Only `anon` public keys are used in frontend and client-side code. The `service_role` key is **never** bundled or exposed.
- **Row Level Security:** Strict database-level policies prevent anonymous users from viewing leads or modifying data.
- **Bot & Rate Limiting Protection:** `/admin/login` enforces a 5-attempt limit with a 15-minute lockout timer to protect against brute-force attacks.
- **SEO & Stealth:** `/admin` is excluded in `robots.ts`, omitted from `sitemap.ts`, and carries `noindex, nofollow` metadata.
