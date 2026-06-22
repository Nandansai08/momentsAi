import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateMomentContent } from '@/lib/bedrock/client';

// Generate human-friendly random short strings for URLs
function generateShortID() {
  return Math.random().toString(36).substring(2, 7);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Auth validation check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Session missing.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      occasion,
      recipient_name,
      sender_name,
      relationship,
      event_date,
      custom_title,
      personal_message,
      favorite_memories,
      favorite_memories_icons,
      special_moments,
      theme_slug,
      selected_sections,
      effects,
      is_password_protected,
      password_string,
      secret_message,
      media_urls,
      music_url,
      custom_colors
    } = body;

    if (!occasion || !recipient_name || !sender_name) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    type LegacyMemory = string | { description?: string; icon?: string };

    const parsedMemories: string[] = Array.isArray(favorite_memories)
      ? (favorite_memories as LegacyMemory[]).map((m) => typeof m === 'string' ? m : (m?.description || ''))
      : [];

    const parsedIcons: string[] = Array.isArray(favorite_memories_icons)
      ? favorite_memories_icons
      : Array.isArray(favorite_memories)
        ? (favorite_memories as LegacyMemory[]).map((m) => typeof m === 'object' && m?.icon ? m.icon : 'Heart')
        : [];

    // Call Bedrock (or its sandbox generator) to obtain Claude 3.5 Sonnet content!
    const aiData = await generateMomentContent({
      occasion,
      recipientName: recipient_name,
      senderName: sender_name,
      relationship,
      personalMessage: personal_message,
      favoriteMemories: parsedMemories,
      specialMoments: special_moments
    });

    interface TimelineItem {
      title: string;
      date: string;
      description: string;
      icon: string;
    }

    // Override each timeline item's icon with the user-selected icon by index
    const customTimeline = aiData.ai_timeline?.map((item: TimelineItem, index: number) => {
      const icon = parsedIcons[index];
      return {
        ...item,
        icon: icon || item.icon,
      };
    });

    // Create a unique clean URL slug
    const cleanRecipient = recipient_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanOccasion = occasion.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${cleanRecipient}-${cleanOccasion}-${generateShortID()}`;

    // Get matching theme record if it exists
    const { data: themeRecord } = await supabase
      .from('themes')
      .select('id')
      .eq('slug', theme_slug || 'romantic')
      .single();

    // Prepare password hash (simplified for sandbox demo, but fully relational)
    const passwordHash = is_password_protected ? password_string : null;

    // Insert database record
    const { data: momentRecord, error: momentError } = await supabase
      .from('moments')
      .insert({
        user_id: user.id,
        slug,
        occasion,
        recipient_name,
        sender_name,
        relationship,
        event_date,
        custom_title: custom_title || aiData.ai_title,
        personal_message,
        favorite_memories,
        special_moments,
        theme_id: themeRecord?.id || null,
        
        // AI compilation results
        ai_title: aiData.ai_title,
        ai_story_narrative: aiData.ai_story_narrative,
        ai_letter: aiData.ai_letter,
        ai_timeline: customTimeline || aiData.ai_timeline,
        ai_quotes: aiData.ai_quotes,
        ai_poem: aiData.ai_poem,

        // Settings toggles
        selected_sections,
        effects,
        is_password_protected,
        password_hash: passwordHash,
        secret_message,
        music_url,
        is_published: true,
        custom_colors: (() => {
          const VALID_SLATE_VARIANTS = [
            'cool_gray',
            'warm_white',
            'cream',
          ] as const;

          return custom_colors?.slateVariant &&
            VALID_SLATE_VARIANTS.includes(
              custom_colors.slateVariant as typeof VALID_SLATE_VARIANTS[number]
            )
              ? { slateVariant: custom_colors.slateVariant }
              : null;
        })()
      })
      .select()
      .single();

    if (momentError) {
      console.error("Supabase insert error:", momentError);
      return NextResponse.json({ error: momentError.message }, { status: 500 });
    }

    // Insert analytical container
    const { error: analyticsError } = await supabase
      .from('analytics')
      .insert({
        moment_id: momentRecord.id,
        views: 0,
        unique_visitors: 0,
        shares: 0,
        device_types: { mobile: 0, desktop: 0, tablet: 0 },
        traffic_sources: { direct: 0, whatsapp: 0, social: 0 }
      });

    if (analyticsError) {
      console.error("Failed to seed analytics:", analyticsError);
    }

    // Insert uploaded media references
    if (media_urls && media_urls.length > 0) {
      const mediaInserts = media_urls.map((url: string) => ({
        moment_id: momentRecord.id,
        user_id: user.id,
        type: 'image',
        url
      }));

      const { error: mediaError } = await supabase
        .from('media')
        .insert(mediaInserts);

      if (mediaError) {
        console.error("Failed to link media assets:", mediaError);
      }
    }

    return NextResponse.json({ success: true, slug: momentRecord.slug });
  } catch (err: unknown) {
    console.error("Generator endpoint failed:", err);
    const message = err instanceof Error ? err.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
