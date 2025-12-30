# Social Calendar AI

An AI-powered social media content calendar generator that creates personalized 30-day content strategies tailored to your business. Generate comprehensive, platform-optimized content calendars with AI-driven insights, virality scoring, and seamless export capabilities.

## 🎯 What is Social Calendar AI?

Social Calendar AI is a Next.js application that leverages OpenAI's GPT-4 to generate complete 30-day social media content calendars. Simply describe your business, goals, target audience, and preferred platforms, and the AI creates a strategic content plan distributed across awareness, nurturing, and conversion funnel stages.

### Key Capabilities

- **Intelligent Content Generation**: AI analyzes your business context and creates platform-specific content ideas
- **Funnel-Based Strategy**: Automatically distributes content across top (awareness), middle (nurturing), and bottom (converting) funnel stages
- **Multi-Platform Support**: Optimizes content for Instagram, Facebook, LinkedIn, X (Twitter), and WhatsApp
- **Virality Scoring**: Each post includes an AI-calculated virality potential score (0-100%)
- **Export Ready**: Download calendars as iCal files for Google Calendar, Apple Calendar, and other calendar applications
- **User Management**: Secure authentication and profile management with Supabase

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses OpenAI GPT-4 with intelligent model fallback for reliable content generation
- 📊 **Funnel-Based Strategy**: Content strategically distributed across awareness, nurturing, and conversion stages
- 📅 **Interactive Calendar View**: Visual month view with post previews, virality indicators, and detailed post information
- 📤 **Export Functionality**: Export calendars to Google Calendar or iCal format for easy scheduling
- 🔐 **User Authentication**: Secure authentication with Supabase Auth
- 📱 **Mobile-First Design**: Responsive design optimized for mobile devices using rem and percentage-based units
- 🎨 **Modern UI**: Beautiful, animated interface with gradient backgrounds and smooth interactions

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI API (GPT-4 Turbo, GPT-4o-mini, GPT-3.5-turbo with fallback)
- **Calendar Export**: ical-generator
- **Animations**: Framer Motion
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account ([free tier available](https://supabase.com))
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Social Calender"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API to get your:
     - Project URL
     - Anon/public key
   - Go to SQL Editor and run the SQL from `supabase-schema.sql` to create the database schema

4. **Configure Environment Variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Optional: Override default model fallback order
   # OPENAI_MODELS=gpt-4-turbo,gpt-4o-mini,gpt-3.5-turbo

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Optional: Canva Integration (see setup instructions)
   # CANVA_CLIENT_ID=your_client_id
   # CANVA_CLIENT_SECRET=your_client_secret
   # NEXT_PUBLIC_CANVA_CLIENT_ID=your_client_id
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
/app
  /api              # API routes (generate-calendar, export-calendar, canva, user-profile)
  /auth             # Authentication pages (login, signup)
  /dashboard        # Main dashboard for viewing calendars
  /generate         # Calendar generation page
/components         # React components (Calendar, PostCard, DayModal, etc.)
/lib                # Utility libraries (OpenAI client, Supabase client, Canva client)
/types              # TypeScript type definitions
```

## 🗄 Database Schema

The application uses the following main tables in Supabase:

- `user_profiles`: Extended user information and preferences
- `calendars`: Generated content calendars with metadata
- `posts`: Individual post ideas within calendars
- `canva_designs`: Linked Canva designs (for future integration)

See `supabase-schema.sql` for the complete schema definition.

## 📖 How to Use

1. **Sign Up**: Create an account using email and password
2. **Generate Calendar**: 
   - Navigate to the generate page
   - Describe your business, goals, target audience, and situation
   - Select your preferred social media platforms
   - Choose your account maturity level (new or established)
   - Click "Generate Calendar"
3. **View Calendar**: Browse your generated 30-day content calendar with:
   - Post previews for each day
   - Virality indicators
   - Platform-specific content
   - Funnel stage distribution
4. **Export**: Download your calendar as an iCal file for Google Calendar or other calendar applications

## 🔒 Security

- All API keys are stored in environment variables (never hardcoded)
- Supabase Row Level Security (RLS) policies protect user data
- Server-side API routes handle sensitive operations
- Environment variables are properly scoped (NEXT_PUBLIC_* for client-side, others for server-side only)

## 🎨 Design Principles

- **Mobile-First**: All components designed with mobile devices as the primary target
- **Responsive Units**: Uses rem and percentage-based units for consistent scaling
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Performance**: Optimized animations and lazy loading where appropriate

## 🚢 Deployment

The application is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

See deployment configuration in `vercel.json`.

## 🔮 Future Enhancements

- Advanced analytics and engagement predictions
- Template library for different industries
- Multi-calendar management and organization
- Team collaboration features
- Direct Canva design creation via API
- Content scheduling and automation
- A/B testing for content ideas

## 📝 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. For questions or support, please contact the project maintainers.

---

**Built with ❤️ using Next.js, OpenAI, and Supabase**
