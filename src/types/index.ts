import { SlateBgVariant } from '@/lib/utils';

export type OccasionType =
  | 'birthday'
  | 'anniversary'
  | 'proposal'
  | 'friendship'
  | 'graduation'
  | 'farewell'
  | 'wedding'
  | 'mothers_day'
  | 'fathers_day'
  | 'custom';

export type PlanType = 'free' | 'pro' | 'business';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type: PlanType;
  created_at: string;
  updated_at: string;
}

export interface ThemeConfig {
  colors: {
    bg: string;
    text: string;
    accent: string;
    primary: string;
    cardBg: string;
    slateVariant?: SlateBgVariant;
  };
  fonts: {
    title: string;
    body: string;
  };
  particles: 'floating-hearts' | 'stars' | 'subtle-grid' | 'golden-dust' | 'balloons' | 'scratchy-grain' | 'none';
  animationStyle: 'fade-in' | 'slide-up' | 'scale-up' | 'bounce';
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  config: ThemeConfig;
  is_premium: boolean;
  created_at: string;
}

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  icon: string;
}

export interface Quote {
  quote: string;
  author: string;
}

export interface SelectedSections {
  music: boolean;
  gallery: boolean;
  timeline: boolean;
  letter: boolean;
  guestbook: boolean;
  quotes: boolean;
  dreams: boolean;
  countdown: boolean;
  reactions: boolean;
  qr_code: boolean;
  share: boolean;
}

export interface EffectsConfig {
  confetti: boolean;
  fireworks: boolean;
  floating_hearts: boolean;
  background_particles: boolean;
}

export interface Moment {
  id: string;
  user_id: string;
  slug: string;
  occasion: OccasionType;
  
  // Custom metadata
  recipient_name: string;
  sender_name: string;
  relationship: string;
  event_date: string | null;
  custom_title: string | null;
  personal_message: string | null;
  favorite_memories: string[] | null;
  special_moments: string[] | null;
  future_goals: string[] | null;
  quotes: string[] | null;
  custom_notes: string | null;
  
  // Theme options
  theme_id: string | null;
  custom_colors: Partial<ThemeConfig['colors']> | null;
  custom_fonts: Partial<ThemeConfig['fonts']> | null;
  
  // AI generated options
  ai_title: string | null;
  ai_story_narrative: string | null;
  ai_letter: string | null;
  ai_timeline: TimelineEvent[] | null;
  ai_quotes: Quote[] | null;
  ai_poem: string | null;
  
  // Configs
  selected_sections: SelectedSections;
  is_password_protected: boolean;
  password_hash: string | null;
  unlock_date: string | null;
  music_url: string | null;
  effects: EffectsConfig;
  secret_message: string | null;
  
  // Deployment metadata
  meta_title: string | null;
  meta_description: string | null;
  custom_domain: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined fields if loaded
  themes?: Theme;
  media?: Media[];
}

export interface Media {
  id: string;
  moment_id: string;
  user_id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  public_id: string | null;
  caption: string | null;
  size: number | null;
  created_at: string;
}

export interface GuestbookEntry {
  id: string;
  moment_id: string;
  name: string;
  message: string;
  reactions: {
    heart: number;
    like: number;
    confetti: number;
  };
  is_approved: boolean;
  created_at: string;
}

export interface Analytics {
  id: string;
  moment_id: string;
  views: number;
  unique_visitors: number;
  shares: number;
  device_types: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  traffic_sources: {
    direct: number;
    whatsapp: number;
    social: number;
  };
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  razorpay_subscription_id: string | null;
  razorpay_order_id: string | null;
  plan_type: PlanType;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}
