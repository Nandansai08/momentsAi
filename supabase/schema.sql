-- Production-Ready Database Schema for MomentsAI
-- To be run in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, plan_type)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    new.raw_user_meta_data->>'avatar_url',
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =========================================================================
-- 2. THEMES TABLE
-- =========================================================================
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  config JSONB NOT NULL, -- { colors: { primary, secondary, bg, accent, text }, fonts: { title, body }, particles: string, animationStyle: string }
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Themes are viewable by everyone" ON public.themes
  FOR SELECT USING (true);


-- =========================================================================
-- 3. MOMENTS TABLE
-- =========================================================================
CREATE TABLE public.moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  occasion TEXT NOT NULL CHECK (occasion IN ('birthday', 'anniversary', 'proposal', 'friendship', 'graduation', 'farewell', 'wedding', 'mothers_day', 'fathers_day', 'custom')),
  
  -- Details entered by user
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  relationship TEXT,
  event_date DATE,
  custom_title TEXT,
  personal_message TEXT,
  favorite_memories TEXT[],
  special_moments TEXT[],
  future_goals TEXT[],
  quotes TEXT[],
  custom_notes TEXT,
  
  -- Theme config
  theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL,
  custom_colors JSONB, -- Custom colors for Pro
  custom_fonts JSONB,  -- Custom fonts for Pro
  
  -- AI Generated Content
  ai_title TEXT,
  ai_story_narrative TEXT,
  ai_letter TEXT,
  ai_timeline JSONB, -- Array of { title, date, description, icon }
  ai_quotes JSONB, -- Array of personalized quotes
  ai_poem TEXT,
  
  -- Special Toggle Configs
  selected_sections JSONB DEFAULT '{"music": true, "gallery": true, "timeline": true, "letter": true, "guestbook": true, "quotes": true, "dreams": true, "countdown": true, "reactions": true, "qr_code": true, "share": true}'::jsonb,
  is_password_protected BOOLEAN DEFAULT false,
  password_hash TEXT, -- Hashed password if protected
  unlock_date TIMESTAMP WITH TIME ZONE,
  music_url TEXT,
  effects JSONB DEFAULT '{"confetti": true, "fireworks": false, "floating_hearts": false, "background_particles": true}'::jsonb,
  secret_message TEXT,
  
  -- Metadata
  meta_title TEXT,
  meta_description TEXT,
  custom_domain TEXT UNIQUE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.moments ENABLE ROW LEVEL SECURITY;

-- Policies for moments
CREATE POLICY "Published moments are viewable by everyone" ON public.moments
  FOR SELECT USING (is_published = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own moments" ON public.moments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own moments" ON public.moments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own moments" ON public.moments
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_moments_user_id ON public.moments(user_id);
CREATE INDEX idx_moments_slug ON public.moments(slug);
CREATE INDEX idx_moments_custom_domain ON public.moments(custom_domain) WHERE custom_domain IS NOT NULL;


-- =========================================================================
-- 4. MEDIA / GALLERY TABLE
-- =========================================================================
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id UUID REFERENCES public.moments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('image', 'video', 'audio')) NOT NULL,
  url TEXT NOT NULL,
  public_id TEXT, -- Cloudinary public_id (if using Cloudinary)
  caption TEXT,
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Policies for media
CREATE POLICY "Media associated with published moments is viewable by everyone" ON public.media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = media.moment_id AND (moments.is_published = true OR moments.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert media into their own moments" ON public.media
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = media.moment_id AND moments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete media from their own moments" ON public.media
  FOR DELETE USING (
    auth.uid() = user_id AND 
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = media.moment_id AND moments.user_id = auth.uid()
    )
  );

CREATE INDEX idx_media_moment_id ON public.media(moment_id);


-- =========================================================================
-- 5. GUESTBOOK ENTRIES TABLE
-- =========================================================================
CREATE TABLE public.guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id UUID REFERENCES public.moments(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  reactions JSONB DEFAULT '{"heart": 0, "like": 0, "confetti": 0}'::jsonb,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Policies for guestbook_entries
CREATE POLICY "Approved guestbook entries are viewable by everyone" ON public.guestbook_entries
  FOR SELECT USING (
    is_approved = true OR 
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = guestbook_entries.moment_id AND moments.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can add a guestbook entry to a published moment" ON public.guestbook_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = guestbook_entries.moment_id AND moments.is_published = true
    )
  );

CREATE POLICY "Moment owners can moderate guestbook entries" ON public.guestbook_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = guestbook_entries.moment_id AND moments.user_id = auth.uid()
    )
  );

CREATE POLICY "Moment owners can delete guestbook entries" ON public.guestbook_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = guestbook_entries.moment_id AND moments.user_id = auth.uid()
    )
  );

CREATE INDEX idx_guestbook_moment_id ON public.guestbook_entries(moment_id);


-- =========================================================================
-- 6. ANALYTICS TABLE (Aggregated view count per moment)
-- =========================================================================
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moment_id UUID REFERENCES public.moments(id) ON DELETE CASCADE UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  device_types JSONB DEFAULT '{"mobile": 0, "desktop": 0, "tablet": 0}'::jsonb,
  traffic_sources JSONB DEFAULT '{"direct": 0, "whatsapp": 0, "social": 0}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Policies for analytics
CREATE POLICY "Moment owners can view their analytics" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.moments
      WHERE moments.id = analytics.moment_id AND moments.user_id = auth.uid()
    )
  );

-- Increment view function (RPC)
CREATE OR REPLACE FUNCTION public.increment_moment_views(moment_slug TEXT, is_unique BOOLEAN, device TEXT, source TEXT)
RETURNS VOID AS $$
DECLARE
  v_moment_id UUID;
  current_devices JSONB;
  current_sources JSONB;
  device_key TEXT;
  source_key TEXT;
BEGIN
  -- Get moment id
  SELECT id INTO v_moment_id FROM public.moments WHERE slug = moment_slug;
  
  IF v_moment_id IS NULL THEN
    RETURN;
  END IF;

  -- Ensure analytics record exists
  INSERT INTO public.analytics (moment_id, views, unique_visitors, device_types, traffic_sources)
  VALUES (v_moment_id, 0, 0, '{"mobile":0,"desktop":0,"tablet":0}'::jsonb, '{"direct":0,"whatsapp":0,"social":0}'::jsonb)
  ON CONFLICT (moment_id) DO NOTHING;

  -- Map device
  device_key := CASE 
    WHEN device IN ('mobile', 'desktop', 'tablet') THEN device
    ELSE 'desktop'
  END;

  -- Map source
  source_key := CASE 
    WHEN source IN ('direct', 'whatsapp', 'social') THEN source
    ELSE 'direct'
  END;

  -- Update counts
  UPDATE public.analytics
  SET 
    views = views + 1,
    unique_visitors = CASE WHEN is_unique THEN unique_visitors + 1 ELSE unique_visitors END,
    device_types = jsonb_set(
      device_types, 
      array[device_key], 
      to_jsonb(COALESCE((device_types->>device_key)::int, 0) + 1)
    ),
    traffic_sources = jsonb_set(
      traffic_sources, 
      array[source_key], 
      to_jsonb(COALESCE((traffic_sources->>source_key)::int, 0) + 1)
    ),
    updated_at = now()
  WHERE moment_id = v_moment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================================
-- 7. SUBSCRIPTIONS TABLE
-- =========================================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_order_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'business')),
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'cancelled', 'expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger to sync plan_type back to profiles table on subscription changes
CREATE OR REPLACE FUNCTION public.sync_profile_plan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET plan_type = CASE
    WHEN new.status = 'active' THEN new.plan_type
    ELSE 'free'
  END
  WHERE id = new.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_subscription_updated
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_plan();

-- =========================================================================
-- Seed Data: Insert Beautiful Default Themes
-- =========================================================================
INSERT INTO public.themes (name, slug, config, is_premium)
VALUES 
(
  'Romantic Rose',
  'romantic',
  '{"colors": {"bg": "from-rose-50 to-pink-100 dark:from-zinc-950 dark:to-rose-950", "text": "text-rose-900 dark:text-rose-100", "accent": "rose-500", "primary": "from-rose-500 to-pink-600", "cardBg": "bg-white/80 dark:bg-zinc-900/80"}, "fonts": {"body": "Inter", "title": "Playfair Display"}, "particles": "floating-hearts", "animationStyle": "fade-in"}',
  false
),
(
  'Cosmic Dream',
  'cosmic',
  '{"colors": {"bg": "from-indigo-950 via-slate-900 to-purple-950 dark:from-black dark:via-zinc-950 dark:to-indigo-950", "text": "text-indigo-100 dark:text-zinc-100", "accent": "indigo-400", "primary": "from-indigo-500 via-purple-500 to-pink-500", "cardBg": "bg-white/10 dark:bg-black/40"}, "fonts": {"body": "Outfit", "title": "Space Grotesk"}, "particles": "stars", "animationStyle": "slide-up"}',
  true
),
(
  'Minimal Slate',
  'minimal',
  '{"colors": {"bg": "from-zinc-50 to-stone-100 dark:from-zinc-900 dark:to-zinc-950", "text": "text-zinc-800 dark:text-zinc-200", "accent": "zinc-600", "primary": "from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400", "cardBg": "bg-white/90 dark:bg-zinc-800/80"}, "fonts": {"body": "Inter", "title": "Outfit"}, "particles": "subtle-grid", "animationStyle": "fade-in"}',
  false
),
(
  'Luxury Gold',
  'luxury',
  '{"colors": {"bg": "from-zinc-900 via-stone-900 to-black dark:from-black dark:via-zinc-950 dark:to-stone-900", "text": "text-amber-100 dark:text-amber-200", "accent": "amber-400", "primary": "from-amber-300 via-yellow-400 to-amber-600", "cardBg": "bg-zinc-900/60 dark:bg-black/50"}, "fonts": {"body": "Outfit", "title": "Cinzel"}, "particles": "golden-dust", "animationStyle": "scale-up"}',
  true
),
(
  'Cute Pastel',
  'cute',
  '{"colors": {"bg": "from-sky-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:to-pink-950", "text": "text-purple-800 dark:text-pink-100", "accent": "pink-400", "primary": "from-pink-400 to-purple-400", "cardBg": "bg-white/80 dark:bg-zinc-900/70"}, "fonts": {"body": "Quicksand", "title": "Fredoka"}, "particles": "balloons", "animationStyle": "bounce"}',
  false
),
(
  'Vintage Sepia',
  'vintage',
  '{"colors": {"bg": "from-amber-50 to-orange-100 dark:from-zinc-950 dark:to-amber-950", "text": "text-amber-900 dark:text-amber-100", "accent": "amber-700", "primary": "from-amber-700 to-amber-900", "cardBg": "bg-white/70 dark:bg-zinc-900/60"}, "fonts": {"body": "Lora", "title": "Courier Prime"}, "particles": "scratchy-grain", "animationStyle": "fade-in"}',
  true
);
