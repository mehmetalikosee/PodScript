# Deploy PodScript – do these 3 things

Your repo is ready (Git initialized, first commit done). **You** need to do the following in your browser and one terminal command.

---

## Step 1: Create a GitHub repo and push

1. Go to **https://github.com/new**
2. Repository name: e.g. **PodScript** (or any name).
3. Leave it **empty** (no README, no .gitignore).
4. Click **Create repository**.
5. In your project folder, run (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

   If GitHub shows you a different URL (e.g. SSH), use that instead of the `https://...` above.

---

## Step 2: Deploy on Vercel

1. Go to **https://vercel.com** and sign in (e.g. with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** the repo you just pushed (e.g. PodScript). Click **Import**.
4. **Before clicking Deploy**, open **Environment Variables** and add every variable from your `.env.local`:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `NEWSLETTER_SEND_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRO_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET` (create a **new** webhook in Stripe for production and paste the new signing secret here)

5. Click **Deploy**. Wait for the build. You’ll get a URL like `https://podscript-xxx.vercel.app`.

---

## Step 3: Point Supabase to your live URL

1. In **Supabase** → **Authentication** → **URL configuration**:
   - **Site URL:** `https://your-vercel-url.vercel.app` (the URL Vercel gave you).
   - **Redirect URLs:** add:
     - `https://your-vercel-url.vercel.app/**`
     - `https://your-vercel-url.vercel.app/reset-password`
2. Save. Sign-in and password reset will now work on your live site.

---

## Optional: Fix Git identity

If you want your commits to show your name/email:

```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
```

(For this repo only, we set a placeholder so the first commit could be made.)

---

That’s it. Open your Vercel URL and test sign-up, login, and forgot password.
