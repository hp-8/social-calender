# Deployment Guide

## Deploying to Vercel

### Prerequisites
- Vercel account (free tier available)
- GitHub account (for connecting repository)

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)

3. **Update Supabase Settings**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add your Vercel URL to "Redirect URLs"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `your-project.vercel.app`

## Environment Variables

Make sure to set these in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., https://your-app.vercel.app)

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test user signup/login
- [ ] Test calendar generation
- [ ] Test calendar export
- [ ] Verify Supabase redirect URLs are configured
- [ ] Test on mobile devices

