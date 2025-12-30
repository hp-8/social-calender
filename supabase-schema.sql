-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  business_type TEXT,
  industry TEXT,
  business_size TEXT,
  goals TEXT[],
  target_audience TEXT,
  canva_access_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Calendars table
CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  input_text TEXT NOT NULL,
  business_type TEXT,
  target_audience TEXT,
  platforms TEXT[] DEFAULT '{}' CHECK (platforms <@ ARRAY['whatsapp', 'instagram', 'facebook', 'linkedin', 'x']::TEXT[]),
  content_pillars TEXT[] DEFAULT '{}',
  funnel_distribution JSONB DEFAULT '{"top": 100, "middle": 10, "bottom": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('entertaining', 'inspiring', 'educational', 'connect', 'promotional')),
  category TEXT NOT NULL,
  topic TEXT NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('awareness', 'nurturing', 'converting')),
  funnel_stage TEXT NOT NULL CHECK (funnel_stage IN ('top', 'middle', 'bottom')),
  virality INTEGER NOT NULL CHECK (virality >= 0 AND virality <= 100),
  platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'instagram', 'facebook', 'linkedin', 'x')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Canva designs table (for future integration)
CREATE TABLE IF NOT EXISTS public.canva_designs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  canva_design_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON public.calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_calendar_id ON public.posts(calendar_id);
CREATE INDEX IF NOT EXISTS idx_posts_date ON public.posts(date);
CREATE INDEX IF NOT EXISTS idx_canva_designs_post_id ON public.canva_designs(post_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canva_designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for calendars
CREATE POLICY "Users can view own calendars"
  ON public.calendars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calendars"
  ON public.calendars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendars"
  ON public.calendars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendars"
  ON public.calendars FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for posts
CREATE POLICY "Users can view posts from own calendars"
  ON public.posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.calendars
      WHERE calendars.id = posts.calendar_id
      AND calendars.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create posts in own calendars"
  ON public.posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calendars
      WHERE calendars.id = posts.calendar_id
      AND calendars.user_id = auth.uid()
    )
  );

-- RLS Policies for canva_designs
CREATE POLICY "Users can view canva designs from own posts"
  ON public.canva_designs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts
      JOIN public.calendars ON calendars.id = posts.calendar_id
      WHERE posts.id = canva_designs.post_id
      AND calendars.user_id = auth.uid()
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

