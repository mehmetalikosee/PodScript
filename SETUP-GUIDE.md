# PodScript – Complete setup guide (from zero)

This guide assumes you’ve never used Supabase or set up a Next.js app. Follow the steps in order.

---

## What you need before starting

- A **Supabase** account (free): [supabase.com](https://supabase.com) → Sign up.
- An **OpenAI** account (paid, for Whisper + GPT-4o): [platform.openai.com](https://platform.openai.com) → Sign up and add a payment method.
- **Node.js** on your computer (version 18 or newer).  
  Check: open a terminal and run `node -v`. If you see a number like `v20.x.x`, you’re good. If not, install from [nodejs.org](https://nodejs.org).

---

## Step 1: Open the project in a terminal

1. Open **PowerShell** or **Command Prompt** (Windows) or **Terminal** (Mac).
2. Go to the project folder. For example:
   ```bash
   cd C:\Users\memet\OneDrive\Desktop\PodScript
   ```
   (Use your real path if it’s different.)
3. Install dependencies (this can take a minute):
   ```bash
   npm install
   ```
   Wait until it finishes without errors.

---

## Step 2: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **“New project”**.
3. Choose your **organization** (or create one).
4. Set:
   - **Name**: e.g. `PodScript`
   - **Database password**: choose a strong password and **save it somewhere safe** (you need it for the DB).
   - **Region**: pick one close to you.
5. Click **“Create new project”** and wait until it’s ready (1–2 minutes).

---

## Step 3: Get your Supabase URL and key

1. In the Supabase dashboard, open your project.
2. In the left sidebar, click **“Project Settings”** (gear icon at the bottom).
3. Click **“API”** in the left menu.
4. You’ll see:
   - **Project URL** – copy it (e.g. `https://xxxxx.supabase.co`).
   - **Project API keys** – under “anon public”, click **“Reveal”** and copy the **anon** key (long string starting with `eyJ...`).
5. Keep this tab open; you’ll paste these in the next step.

---

## Step 4: Create the database tables

1. In the Supabase left sidebar, click **“SQL Editor”**.
2. Click **“New query”**.
3. Open the file **`supabase/migrations/001_initial_schema.sql`** from the PodScript folder in a text editor (e.g. Notepad, VS Code).
4. **Select all** the text in that file (Ctrl+A) and **copy** it.
5. **Paste** it into the Supabase SQL Editor.
6. Click **“Run”** (or press Ctrl+Enter).
7. At the bottom you should see something like “Success. No rows returned.” That means the tables (profiles, podcasts, content_outputs) were created.

---

## Step 5: Create the Storage bucket for audio files

1. In the Supabase left sidebar, click **“Storage”**.
2. Click **“New bucket”**.
3. Set:
   - **Name**: `podcasts`
   - **Public bucket**: **OFF** (leave unchecked).
4. Click **“Create bucket”**.
5. Click on the **`podcasts`** bucket you just created.
6. Click **“Policies”** (or “New policy”).
7. Add a policy so users can upload only to their own folder:
   - Click **“New policy”** → **“For full customization”**.
   - **Policy name**: `Users can upload own podcasts`
   - **Allowed operation**: check **INSERT** (and **SELECT** if you want them to read their files).
   - **Target roles**: leave as `authenticated`.
   - **USING expression** (for SELECT):  
     `(bucket_id = 'podcasts') AND ((storage.foldername(name))[1] = auth.uid()::text)`
   - **WITH CHECK expression** (for INSERT):  
     `(bucket_id = 'podcasts') AND ((storage.foldername(name))[1] = auth.uid()::text)`
   - Click **“Review”** then **“Save policy”**.
8. Add another policy for **SELECT** with the same **USING** expression if you didn’t already, so users can read their uploaded files.

---

## Step 6: Get your OpenAI API key

1. Go to [platform.openai.com](https://platform.openai.com) and sign in.
2. Click your profile (top right) → **“View API keys”** (or go to [API keys](https://platform.openai.com/api-keys)).
3. Click **“Create new secret key”**, name it e.g. `PodScript`, then **Create**.
4. **Copy the key** (it starts with `sk-...`). You won’t see it again; store it somewhere safe and **never share it or put it in code**.

---

## Step 7: Create the `.env.local` file in the project

1. In the PodScript folder, find the file **`.env.example`**.
2. **Copy** that file and **rename** the copy to **`.env.local`** (same folder as `package.json`).
3. Open **`.env.local`** in a text editor. It should look like:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # OpenAI (for Whisper + GPT-4o)
   OPENAI_API_KEY=sk-your-openai-api-key
   ```
4. **Replace** the placeholders with your real values:
   - **NEXT_PUBLIC_SUPABASE_URL** → paste the Supabase **Project URL** from Step 3.
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** → paste the Supabase **anon** key from Step 3.
   - **OPENAI_API_KEY** → paste your OpenAI key from Step 6.
5. Save the file.  
   **Important:** Never commit `.env.local` to Git or share it; it contains secrets.

---

## Step 8: Turn on Email auth in Supabase (so you can sign up)

1. In Supabase, go to **“Authentication”** → **“Providers”** in the left sidebar.
2. Click **“Email”**. Make sure **“Enable Email provider”** is ON.
3. (Optional) Under **“Email auth”**, you can turn **“Confirm email”** OFF for testing so you don’t have to confirm via email. For production, leave it ON.

---

## Step 9: Run the app

1. In the terminal, make sure you’re in the PodScript folder (see Step 1).
2. Run:
   ```bash
   npm run dev
   ```
3. Wait until you see something like:
   ```text
   ▲ Next.js 15.x.x
   - Local: http://localhost:3000
   ```
4. Open a browser and go to: **http://localhost:3000**

---

## Step 10: Sign up and use the app

1. On the home page, click **“Sign up”** (or go to **http://localhost:3000/signup**).
2. Enter an **email** and **password** (at least 6 characters), then click **Sign up**.
3. If you left **“Confirm email”** ON in Supabase, check your email and click the confirmation link. If you turned it OFF, you can go straight to sign in.
4. Click **“Sign in”** and enter the same email and password.
5. You should land on the **Dashboard**.
6. **Upload a podcast:**
   - Use the upload area (drag and drop or click).
   - Choose an **audio file** (MP3, WAV, or M4A). Keep it short for testing (e.g. 1–2 minutes) to avoid long waits and high OpenAI cost.
7. After upload, you’ll be redirected to the podcast page. The app will:
   - Transcribe the audio (Whisper).
   - Generate blog, tweets, and a LinkedIn post (GPT-4o).
   - Show a “Writing with AI…” state and then the result in **Blog / Twitter / LinkedIn** tabs.
8. You can **edit the blog** in the editor, **copy** each section with the copy button, and open **Dashboard** to see all your podcasts.

---

## Optional: Stripe payments (Upgrade plan)

To make **Upgrade plan** open a real Stripe Checkout session:

1. Create a [Stripe](https://stripe.com) account and get your **Secret key** from Developers → API keys.
2. In Stripe Dashboard → Products → Add product (e.g. **Pro**), add a **Recurring** price (e.g. $19/month) and copy the **Price ID** (e.g. `price_xxx`).
3. Add to `.env.local`:
   - `STRIPE_SECRET_KEY=sk_test_...` (or `sk_live_...`)
   - `STRIPE_PRO_PRICE_ID=price_xxx`
4. For **webhooks** (so the app upgrades the user after payment):
   - Stripe Dashboard → Developers → Webhooks → Add endpoint.
   - URL: `https://your-domain.com/api/webhooks/stripe` (for local testing use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
   - Event: `checkout.session.completed`.
   - Copy the **Signing secret** and add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`.
   - So the app can update the database after payment, add **Supabase Service role key** (Project Settings → API → service_role) as `SUPABASE_SERVICE_ROLE_KEY=eyJ...` in `.env.local` (keep this secret; never expose in the browser).

Without these env vars, **Upgrade plan** will show a “Payment is not configured” message.

- **If you already paid but your profile still shows Trial:** Open **Profile** and click **“Refresh subscription”**. That calls Stripe, finds your active subscription, and updates your plan to Pro (requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`).

- **Newsletter popup:** To store signups, run **`supabase/migrations/006_newsletter.sql`** in the SQL Editor once. The popup appears on the landing page after a few seconds.

---

## Optional: Email and newsletter sending

To send emails (e.g. “processing complete” or newsletter campaigns):

1. Sign up at [Resend](https://resend.com), create an API key, and add to `.env.local`:
   - `RESEND_API_KEY=re_xxxx`
   - (Optional) `EMAIL_FROM=PodScript <noreply@yourdomain.com>` – otherwise uses Resend’s onboarding address.
2. To **send a newsletter** to all subscribers, call **POST** `/api/newsletter/send` with:
   - Header: `x-newsletter-secret: your-secret` or `Authorization: Bearer your-secret`
   - Body: `{ "subject": "Your subject", "body": "Plain text body" }` (or use `html` instead of `body` for HTML).
   Add to `.env.local`: `NEWSLETTER_SEND_SECRET=your-secret` and use that value in the header. Without this secret, the send endpoint returns 401.

---

## Going live (deploy)

### 1. Push your code to Git

1. Create a repo on **GitHub** (or GitLab / Bitbucket).
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   (Replace the URL with your repo. If you use GitHub CLI: `gh repo create` then `git push`.)

**Important:** Do **not** commit `.env.local`. It should already be in `.gitignore`. All secrets go in the hosting dashboard instead.

---

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **“Add New…”** → **“Project”**.
3. **Import** your Git repository (e.g. PodScript). Click **Import**.
4. **Environment variables:** Before deploying, add every variable from your `.env.local`:
   - **Key** = name (e.g. `NEXT_PUBLIC_SUPABASE_URL`).
   - **Value** = the same value you use locally.
   - Add them for **Production** (and optionally Preview if you want).
5. Required / recommended variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM` (optional)
   - `NEWSLETTER_SEND_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRO_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET` (use a **new** webhook for production in Stripe, pointing to `https://your-domain.com/api/webhooks/stripe`)
6. Click **Deploy**. Wait for the build to finish. You’ll get a URL like `https://podscript-xxx.vercel.app`.

---

### 3. Configure Supabase for production

1. In **Supabase** → **Authentication** → **URL configuration**:
   - **Site URL:** set to your live URL, e.g. `https://podscript-xxx.vercel.app` or `https://yourdomain.com`.
   - **Redirect URLs:** add:
     - `https://your-vercel-url.vercel.app/**`
     - `https://your-vercel-url.vercel.app/reset-password`
     - `https://your-vercel-url.vercel.app/login`
     - (If you add a custom domain later, add the same paths for that domain.)
2. This makes sign-in, sign-up, and **password reset** work on the live site.

---

### 4. Stripe webhook (if you use payments)

1. In **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**.
2. **URL:** `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. **Events:** e.g. `checkout.session.completed`.
4. Copy the **Signing secret** (`whsec_...`) and add it in **Vercel** → your project → **Settings** → **Environment Variables** as `STRIPE_WEBHOOK_SECRET` for **Production**.

---

### 5. (Optional) Custom domain

1. In **Vercel** → your project → **Settings** → **Domains**, add your domain (e.g. `podscript.com`).
2. Follow Vercel’s instructions to add the DNS records at your registrar.
3. After the domain is active, update **Supabase** → **Authentication** → **URL configuration**: set **Site URL** and **Redirect URLs** to use `https://podscript.com` (and `https://podscript.com/**`) so auth and password reset work on your domain.

---

### After going live – what to test

- Sign up / sign in on the live URL.
- **Forgot password** → reset link should open your live site’s `/reset-password`.
- **Profile** → set phone, save.
- **Upload a podcast** → wait for completion → check **notifications** (bell).
- **Newsletter:** call `POST https://your-domain.com/api/newsletter/send` with header `x-newsletter-secret: YOUR_SECRET` and body `{ "subject": "...", "body": "..." }` to confirm sending works.

---

### Why you might see an old version

- **Browser cache:** Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R) or clear cache for the site.
- **Vercel deployment:** In Vercel → **Deployments**, confirm the latest deployment is from the latest commit on `main`. If you see an old UI, trigger a new deploy (push a commit or click **Redeploy** on the latest).
- **CDN cache:** Vercel edge cache can take a few minutes to update; wait and hard refresh.

---

### SEO (production)

- Set **`NEXT_PUBLIC_SITE_URL`** in Vercel env to your live URL (e.g. `https://pod-script.vercel.app`). This is used for canonical URLs, sitemap, and Open Graph.
- The app includes: **meta title/description**, **Open Graph** and **Twitter Card** tags, **robots.txt**, **sitemap.xml**, **JSON-LD** (WebSite + Organization), and **keywords**. Submit your sitemap in [Google Search Console](https://search.google.com/search-console) after going live.

---

### Verify Stripe & Vercel

- **Vercel:** Project is **Ready**; env vars match `.env.local` (Supabase, OpenAI, Resend, Stripe, `NEWSLETTER_SEND_SECRET`). **Deployments** use the latest commit from `main`.
- **Stripe:** In **Developers → Webhooks**, the production endpoint URL is `https://your-vercel-url.vercel.app/api/webhooks/stripe`, event **checkout.session.completed**, and the **Signing secret** is set in Vercel as `STRIPE_WEBHOOK_SECRET`.
- **Stripe checkout:** On the live site, **Dashboard → Pricing** (or **Profile → Upgrade plan**) opens Stripe Checkout. After a test payment, **Profile** should show **Plan: Pro** and **100** tokens (webhook must be receiving events).
- **Trial tokens:** New accounts and trial users should see **3 tokens** and **Limit: 3 / month**. If you see 10, run **`supabase/migrations/008_trial_tokens_three.sql`** in the Supabase SQL Editor once.

---

## If something goes wrong

- **“OPENAI_API_KEY is not set”**  
  → Check that `.env.local` exists in the project root and contains `OPENAI_API_KEY=sk-...`. Restart `npm run dev` after changing `.env.local`.

- **“Failed to get upload URL” or storage errors**  
  → Check that the bucket is named exactly `podcasts` and that the Storage policies (Step 5) are added and use the expressions given.

- **“Unauthorized” or sign-in doesn’t work**  
  → Confirm Supabase URL and anon key in `.env.local`. In Supabase, under Authentication → Users, check that the user was created.

- **Whisper or GPT errors**  
  → Check that your OpenAI account has credits and that the API key in `.env.local` is correct and not revoked.

- **Port 3000 already in use**  
  → Either close the other app using 3000, or run:  
  `npm run dev -- -p 3001`  
  and open **http://localhost:3001** instead.

---

## Quick checklist

- [ ] Node.js installed (`node -v` works)
- [ ] `npm install` run in the PodScript folder
- [ ] Supabase project created
- [ ] SQL from `001_initial_schema.sql` run in Supabase SQL Editor
- [ ] Storage bucket `podcasts` created and policies added
- [ ] `.env.local` created with Supabase URL, Supabase anon key, and OpenAI API key
- [ ] `npm run dev` running and http://localhost:3000 opens
- [ ] Signed up and signed in, then uploaded a short audio file

Once all of these are done, you’re set. If you hit a specific error message, copy it and we can fix it step by step.
