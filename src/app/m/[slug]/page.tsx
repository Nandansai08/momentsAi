import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import MomentRenderClient from './MomentRenderClient';

interface Props {
  params: Promise<{ slug: string }>;
}

// SEO Meta Tags compilation dynamic header
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient(); // Use admin bypass to load for SEO even if private
  
  const { data: moment } = await supabase
    .from('moments')
    .select('custom_title, recipient_name, occasion, ai_story_narrative')
    .eq('slug', slug)
    .single();

  if (!moment) {
    return {
      title: 'Moment Not Found - MomentsAI',
    };
  }

  const title = moment.custom_title || `A Beautiful ${moment.occasion} Showcase for ${moment.recipient_name}`;
  const description = moment.ai_story_narrative || `Explore this gorgeous digital memories tribute page created on MomentsAI.`;

  return {
    title: `${title} | MomentsAI`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function MomentPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient(); // Admin client ensures loading works flawlessly for visitors
  
  // Fetch moment with joined theme configuration
  const { data: moment, error } = await supabase
    .from('moments')
    .select('*, themes(*)')
    .eq('slug', slug)
    .single();

  if (error || !moment) {
    notFound();
  }

  // Fetch associated media uploads
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('moment_id', moment.id);

  // Fetch approved guestbook signings
  const { data: guestbook } = await supabase
    .from('guestbook_entries')
    .select('*')
    .eq('moment_id', moment.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  return (
    <MomentRenderClient 
      initialMoment={moment} 
      initialMedia={media || []} 
      initialGuestbook={guestbook || []} 
    />
  );
}
