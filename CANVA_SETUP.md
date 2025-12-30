# Canva Integration Setup Guide

This guide will walk you through setting up Canva integration for the Social Calendar app.

## Step 1: Register Your App with Canva

1. **Go to Canva Developer Portal**
   - Visit: https://www.canva.dev/
   - Sign in with your Canva account (or create one if you don't have it)

2. **Create a New App**
   - Click "Create App" or "New App"
   - Fill in the app details:
     - **App Name**: Social Calendar AI (or your preferred name)
     - **Description**: AI-powered social media content calendar with Canva integration
     - **App Type**: Select "Web App" or "Integration"

3. **Configure OAuth Settings**
   - Go to your app's settings/configuration page
   - Add **Redirect URI**:
     ```
     http://localhost:3000/api/canva/oauth
     ```
   - For production, also add:
     ```
     https://your-domain.com/api/canva/oauth
     ```
   - **Scopes**: Request these permissions:
     - `design:read` - Read user's designs
     - `design:write` - Create and edit designs
     - `design:content:read` - Read design content
     - `design:content:write` - Write design content

4. **Get Your Credentials**
   - After creating the app, you'll receive:
     - **Client ID** (also called App ID)
     - **Client Secret** (keep this secure!)

## Step 2: Update Environment Variables

1. **Add to `.env.local`** (for local development):
   ```env
   # Canva Integration
   CANVA_CLIENT_ID=your_client_id_here
   CANVA_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_CANVA_CLIENT_ID=your_client_id_here
   ```

2. **For Production (Vercel)**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add the same three variables:
     - `CANVA_CLIENT_ID`
     - `CANVA_CLIENT_SECRET`
     - `NEXT_PUBLIC_CANVA_CLIENT_ID`

   **Important**: 
   - `CANVA_CLIENT_SECRET` should NOT have `NEXT_PUBLIC_` prefix (server-side only)
   - `NEXT_PUBLIC_CANVA_CLIENT_ID` is needed for client-side OAuth redirect

## Step 3: Update Supabase Database

Run this SQL in your Supabase SQL Editor to add the Canva access token column:

```sql
-- Add Canva access token column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS canva_access_token TEXT;
```

Or if you haven't run the full schema yet, the `supabase-schema.sql` file already includes this column.

## Step 4: Update Production Redirect URI

1. **Get Your Production URL**
   - After deploying to Vercel, note your app URL (e.g., `https://your-app.vercel.app`)

2. **Update Canva App Settings**
   - Go back to https://www.canva.dev/
   - Navigate to your app's settings
   - Add your production redirect URI:
     ```
     https://your-app.vercel.app/api/canva/oauth
     ```

## Step 5: Test the Integration

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test the Flow**:
   - Sign in to your app
   - Generate a calendar
   - Click "Connect Canva" button
   - You should be redirected to Canva's OAuth page
   - Authorize the app
   - You'll be redirected back to your app
   - Try exporting a calendar or day to Canva

## Troubleshooting

### Issue: "Canva integration not configured"
- **Solution**: Make sure `NEXT_PUBLIC_CANVA_CLIENT_ID` is set in your `.env.local` file
- Restart your dev server after adding environment variables

### Issue: "Redirect URI mismatch"
- **Solution**: Ensure the redirect URI in Canva app settings exactly matches:
  - Local: `http://localhost:3000/api/canva/oauth`
  - Production: `https://your-domain.com/api/canva/oauth`

### Issue: "Canva not connected" after OAuth
- **Solution**: 
  1. Check that the `canva_access_token` column exists in `user_profiles` table
  2. Check browser console for errors
  3. Verify `CANVA_CLIENT_SECRET` is set correctly (server-side only)

### Issue: OAuth redirects but doesn't save token
- **Solution**: 
  1. Check Supabase RLS policies allow updates to `user_profiles`
  2. Verify the OAuth callback route is working: `/api/canva/oauth`
  3. Check server logs for errors

## Current Implementation Status

The current implementation provides:
- ✅ OAuth flow for connecting Canva accounts
- ✅ Storing Canva access tokens securely
- ✅ UI buttons for exporting to Canva
- ✅ API endpoints for calendar and day exports

**Note**: The current implementation creates Canva design URLs with pre-filled content. For full programmatic design creation, you'll need to implement Canva's Connect API endpoints. See: https://www.canva.dev/docs/connect/

## Next Steps (Advanced)

For full programmatic design creation:

1. **Implement Canva Connect API**
   - Use the stored `canva_access_token` to make API calls
   - Create designs programmatically using Canva's API
   - See: https://www.canva.dev/docs/connect/api-reference/

2. **Design Templates**
   - Create Canva templates for social media posts
   - Use the API to populate templates with calendar content
   - Customize based on post type (entertaining, educational, etc.)

3. **Batch Operations**
   - Create multiple designs at once
   - Schedule design creation
   - Sync with calendar updates

## Support Resources

- **Canva Developer Docs**: https://www.canva.dev/docs/
- **Canva Connect API**: https://www.canva.dev/docs/connect/
- **Canva Developer Community**: Check Canva's developer forums

