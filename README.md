# Social Calendar AI - MVP

An AI-powered social media content calendar generator that creates personalized 30-day content strategies based on your business goals and situation.

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI GPT-4 to generate comprehensive content calendars
- 📊 **Funnel-Based Strategy**: Content distributed across awareness, nurturing, and conversion stages
- 📅 **Interactive Calendar View**: Visual month view with post previews and virality indicators
- 📤 **Export Functionality**: Export calendars to Google Calendar or iCal format
- 🔐 **User Authentication**: Secure authentication with Supabase
- 📱 **Mobile-First Design**: Responsive design optimized for mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI API (GPT-4)
- **Calendar Export**: ical-generator

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier)
- OpenAI API key

### 2. Clone and Install

```bash
# Install dependencies
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your:
   - Project URL
   - Anon/public key
3. Go to SQL Editor and run the SQL from `supabase-schema.sql` to create the database schema

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api              # API routes
  /auth             # Authentication pages
  /dashboard        # Main dashboard
  /generate         # Calendar generation page
/components         # React components
/lib                # Utility libraries
/types              # TypeScript types
```

## Database Schema

The application uses the following main tables:

- `user_profiles`: Extended user information
- `calendars`: Generated content calendars
- `posts`: Individual post ideas within calendars
- `canva_designs`: Linked Canva designs (for future integration)

## Usage

1. **Sign Up**: Create an account
2. **Generate Calendar**: Describe your business, goals, and situation
3. **View Calendar**: Browse your generated 30-day content calendar
4. **Export**: Download as iCal file for Google Calendar or other calendar apps

## Canva Integration

The app includes Canva integration for exporting calendars and individual days to Canva. See [CANVA_SETUP.md](./CANVA_SETUP.md) for detailed setup instructions.

**Quick Setup:**
1. Register your app at https://www.canva.dev/
2. Add credentials to `.env.local`:
   ```env
   CANVA_CLIENT_ID=your_client_id
   CANVA_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_CANVA_CLIENT_ID=your_client_id
   ```
3. Update Supabase schema (add `canva_access_token` column)
4. Configure redirect URI in Canva app settings

## Future Enhancements

- Advanced analytics and insights
- Template library
- Multi-calendar management
- Team collaboration features

## License

Private - All rights reserved
