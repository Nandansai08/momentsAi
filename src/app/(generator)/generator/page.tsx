"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  Heart, 
  Users, 
  Music, 
  ArrowLeft, 
  ArrowRight,
  Upload,
  Check,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  FileText,
  Eye,
  Trash2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SlateBgVariant, SLATE_BACKGROUNDS } from '@/lib/utils';

const occasionsList = [
  { id: 'birthday', label: 'Birthday', icon: Gift, color: 'from-pink-500 to-rose-500' },
  { id: 'anniversary', label: 'Anniversary', icon: Heart, color: 'from-rose-500 to-red-500' },
  { id: 'proposal', label: 'Proposal', icon: Sparkles, iconStyle: 'fill-current', color: 'from-violet-500 to-purple-500' },
  { id: 'friendship', label: 'Friendship', icon: Users, color: 'from-amber-500 to-orange-500' },
  { id: 'graduation', label: 'Graduation', icon: FileText, color: 'from-indigo-500 to-blue-500' },
  { id: 'farewell', label: 'Farewell', icon: FileText, color: 'from-stone-500 to-zinc-500' },
  { id: 'wedding', label: 'Wedding', icon: Heart, color: 'from-rose-600 to-pink-500' },
  { id: 'mothers_day', label: 'Mother\'s Day', icon: Sparkles, color: 'from-pink-400 to-rose-400' },
  { id: 'fathers_day', label: 'Father\'s Day', icon: Gift, color: 'from-blue-400 to-indigo-400' },
  { id: 'custom', label: 'Custom Moment', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
];

const occasionQuestions: Record<string, {
  recipientLabel: string;
  recipientPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  memoriesLabel: string;
  memoriesPlaceholder: string;
  milestonesLabel: string;
  milestonesPlaceholder: string;
}> = {
  birthday: {
    recipientLabel: "Name of the Birthday Person *",
    recipientPlaceholder: "e.g. Sarah, David",
    messageLabel: "Personal Birthday Wishes & Letter Text",
    messagePlaceholder: "Write your heartfelt wishes, what you love about them, and what makes them amazing...",
    memoriesLabel: "Favorite Shared Memories (Timeline Events)",
    memoriesPlaceholder: "e.g. That time we snuck out for midnight pizza; Your last birthday party...",
    milestonesLabel: "Birthday Milestone Highlights / Achievements",
    milestonesPlaceholder: "e.g. Turning 25 with a big smile; Moving into their own flat this year..."
  },
  anniversary: {
    recipientLabel: "Names of the Couple *",
    recipientPlaceholder: "e.g. Mom & Dad, Sarah & John",
    messageLabel: "Anniversary Wishes & Greeting",
    messagePlaceholder: "Write a message celebrating their/your years of partnership, love, and growth...",
    memoriesLabel: "Couples Memory Lane (Timeline Events)",
    memoriesPlaceholder: "e.g. Our first date at the beach; The trip to Himachal last winter...",
    milestonesLabel: "Relationship Milestones / Achievements",
    milestonesPlaceholder: "e.g. 5 beautiful years together; Bought our first pet Coco..."
  },
  proposal: {
    recipientLabel: "Name of your Partner *",
    recipientPlaceholder: "e.g. Maya, Aisha",
    messageLabel: "Your Proposal Love Letter",
    messagePlaceholder: "Write the romantic words you want to ask them, how they changed your life...",
    memoriesLabel: "Key Romantic Chapters (Timeline Events)",
    memoriesPlaceholder: "e.g. When I first saw you laughing; The moment I realized you were the one...",
    milestonesLabel: "Promises & Future Bucket List",
    milestonesPlaceholder: "e.g. Exploring the Northern Lights together; Building our dream home..."
  },
  friendship: {
    recipientLabel: "Name of your Best Friend *",
    recipientPlaceholder: "e.g. Nikhil, Kabir",
    messageLabel: "Letter to your Bestie",
    messagePlaceholder: "Thank them for being in your life, share what their friendship means to you...",
    memoriesLabel: "Inside Jokes & Adventures (Timeline Events)",
    memoriesPlaceholder: "e.g. Squeezing 6 people in a cab; That time we failed the math test together...",
    milestonesLabel: "Friendship Highlights / Milestones",
    milestonesPlaceholder: "e.g. 10 years of being inseparable; Completing college side-by-side..."
  },
  graduation: {
    recipientLabel: "Name of the Graduate *",
    recipientPlaceholder: "e.g. Rohan, Riya",
    messageLabel: "Congratulatory Letter",
    messagePlaceholder: "Express how proud you are of their hard work, dedication, and graduation...",
    memoriesLabel: "Late Night College Stories (Timeline Events)",
    memoriesPlaceholder: "e.g. Pulling all-nighters for finals; Celebrating the last day of exams...",
    milestonesLabel: "Academic Achievements & Career Dreams",
    milestonesPlaceholder: "e.g. Graduating with top honors; Starting their dream job in tech..."
  },
  farewell: {
    recipientLabel: "Name of the Person Leaving *",
    recipientPlaceholder: "e.g. Rohit, Chief Director",
    messageLabel: "Farewell Tribute Letter",
    messagePlaceholder: "Write your goodbye message, how they contributed, and what you will miss about them...",
    memoriesLabel: "Shared Working/College Memories (Timeline Events)",
    memoriesPlaceholder: "e.g. Cracking that project milestone at 1 AM; Lunch breaks on the terrace...",
    milestonesLabel: "Their Key Achievements & Next Chapters",
    milestonesPlaceholder: "e.g. Taking on a new leadership role; Best manager award winner..."
  },
  wedding: {
    recipientLabel: "Names of the Happy Couple *",
    recipientPlaceholder: "e.g. Sarah & Kabir",
    messageLabel: "Wedding Congratulations Letter",
    messagePlaceholder: "Write your blessing letter to the newlyweds, wishing them a lifetime of joy...",
    memoriesLabel: "How They Met / Wedding Journey (Timeline Events)",
    memoriesPlaceholder: "e.g. The first introduction at a dinner; Getting engaged in Goa...",
    milestonesLabel: "Wedding Milestones & Future Plans",
    milestonesPlaceholder: "e.g. Starting their beautiful chapter today; Planning their dream honeymoon..."
  },
  mothers_day: {
    recipientLabel: "Name of your Mother *",
    recipientPlaceholder: "e.g. Mom, Mummy",
    messageLabel: "Mother's Day Letter of Gratitude",
    messagePlaceholder: "Tell your mother how much you love her, thank her for her sacrifices, support...",
    memoriesLabel: "Favorite Memories with Mom (Timeline Events)",
    memoriesPlaceholder: "e.g. Helping me pack on my first day of college; Cooking together on Sundays...",
    milestonesLabel: "What Makes Her an Amazing Mom",
    milestonesPlaceholder: "e.g. The most patient listener; Always supportive of my decisions..."
  },
  fathers_day: {
    recipientLabel: "Name of your Father *",
    recipientPlaceholder: "e.g. Dad, Papa",
    messageLabel: "Father's Day Tribute Letter",
    messagePlaceholder: "Express your respect and love for your dad, thank him for his guidance...",
    memoriesLabel: "Favorite Memories with Dad (Timeline Events)",
    memoriesPlaceholder: "e.g. Teaching me how to ride a bicycle; Weekend road trips in the old car...",
    milestonesLabel: "His Wisdom & Key Achievements",
    milestonesPlaceholder: "e.g. The best advisor in my life; Built a beautiful family home..."
  },
  custom: {
    recipientLabel: "Recipient Name *",
    recipientPlaceholder: "e.g. Sarah, Team, Mom",
    messageLabel: "Personal Message / Tribute Letter",
    messagePlaceholder: "Write a detailed personal message, congratulations, or greeting wishes...",
    memoriesLabel: "Favorite Shared Memories (Timeline Events)",
    memoriesPlaceholder: "e.g. The first connection; A shared road trip milestone...",
    milestonesLabel: "Achievements & Future Goals",
    milestonesPlaceholder: "e.g. Celebrating this milestone; Looking forward to future dreams..."
  }
};

const themesList = [
  { id: 'romantic', name: 'Romantic Rose', desc: 'Serif fonts, rose pink overlays & floating hearts', color: 'bg-rose-50 border-rose-100 text-rose-950 hover:bg-rose-100/50' },
  { id: 'cosmic', name: 'Cosmic Dream', desc: 'Space fonts, dark violet starry gradients', color: 'bg-indigo-950 border-indigo-900 text-white hover:bg-indigo-900/40' },
  { id: 'minimal', name: 'Minimal Slate', desc: 'Monospace fonts, crisp borders & light slate layouts', color: 'bg-zinc-50 border-zinc-200 text-zinc-900 hover:bg-zinc-100/50' },
  { id: 'luxury', name: 'Luxury Gold', desc: 'Classic golden typography, dark cards & golden accents', color: 'bg-stone-900 border-stone-800 text-amber-200 hover:bg-stone-800/80' },
  { id: 'cute', name: 'Cute Pastel', desc: 'Soft rounded typography, bubble pastel colors', color: 'bg-pink-50/50 border-pink-100 text-pink-900 hover:bg-pink-100/50' },
];

function detectMusicProvider(url: string) {
  if (!url) return null;
  
  let targetUrl = url.trim();
  if (targetUrl.startsWith('<iframe')) {
    const srcMatch = targetUrl.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      targetUrl = srcMatch[1];
    }
  }

  const lowerUrl = targetUrl.toLowerCase();
  
  if (lowerUrl.includes('spotify.com')) {
    let subType = 'Track';
    if (lowerUrl.includes('/album/')) subType = 'Album';
    if (lowerUrl.includes('/playlist/')) subType = 'Playlist';
    
    const idMatch = targetUrl.match(/(?:track|album|playlist)\/([a-zA-Z0-9]+)/);
    const embedUrl = idMatch 
      ? `https://open.spotify.com/embed/${lowerUrl.includes('/album/') ? 'album' : lowerUrl.includes('/playlist/') ? 'playlist' : 'track'}/${idMatch[1]}?utm_source=generator`
      : targetUrl;

    return {
      provider: 'spotify',
      name: 'Spotify',
      color: 'text-[#1DB954] border-[#1DB954]/20 bg-[#1DB954]/5',
      description: `Detected Spotify ${subType}! Dynamic card player will render.`,
      embedUrl,
      isValid: true
    };
  }
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    let videoId = '';
    if (lowerUrl.includes('youtu.be/')) {
      videoId = targetUrl.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else {
      videoId = targetUrl.match(/[?&]v=([^&#]+)/)?.[1] || '';
    }
    
    const embedUrl = videoId 
      ? `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`
      : targetUrl;

    return {
      provider: 'youtube',
      name: 'YouTube',
      color: 'text-[#FF0000] border-[#FF0000]/20 bg-[#FF0000]/5',
      description: 'Detected YouTube Link! A responsive widescreen embed will render.',
      embedUrl,
      isValid: true
    };
  }
  
  if (lowerUrl.includes('music.apple.com')) {
    const embedUrl = targetUrl.replace('music.apple.com', 'embed.music.apple.com');
    return {
      provider: 'apple',
      name: 'Apple Music',
      color: 'text-[#FA243C] border-[#FA243C]/20 bg-[#FA243C]/5',
      description: 'Detected Apple Music! A premium glassmorphic Apple player will embed.',
      embedUrl,
      isValid: true
    };
  }
  
  if (lowerUrl.match(/\.(mp3|wav|ogg|m4a)$/) || lowerUrl.includes('soundhelix.com')) {
    return {
      provider: 'custom',
      name: 'Direct Audio Stream',
      color: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
      description: 'Direct audio stream. Played inside our spinning vinyl turntable player widget.',
      embedUrl: targetUrl,
      isValid: true
    };
  }
  
  if (lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) {
    return {
      provider: 'other',
      name: 'External Stream',
      color: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
      description: 'Unrecognized URL. We will try to embed it as an iframe player widget.',
      embedUrl: targetUrl,
      isValid: true
    };
  }

  return {
    provider: 'invalid',
    name: 'Unrecognized Link',
    color: 'text-red-500 border-red-500/20 bg-red-500/5',
    description: 'Please paste a valid URL starting with http:// or https://',
    embedUrl: null,
    isValid: false
  };
}

const MAX_CHARS = 500;

export default function GeneratorPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Analyzing your memories...");

  // Form parameters
  const [occasion, setOccasion] = useState('birthday');
  const activeQuestions = occasionQuestions[occasion] || occasionQuestions.custom;
  
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  
  // Lists
  const [memoriesInput, setMemoriesInput] = useState('');
  const [memories, setMemories] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Files
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; size: string }>>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Styling / Toggles
  const [themeId, setThemeId] = useState('romantic');
  const [slateVariant, setSlateVariant] = useState<SlateBgVariant>('cool_gray');
  const [sections] = useState({
    music: true,
    gallery: true,
    timeline: true,
    letter: true,
    guestbook: true,
    quotes: true,
    dreams: true,
    countdown: true,
    reactions: true,
    qr_code: true,
    share: true
  });
  
  const [effects] = useState({
    confetti: true,
    fireworks: false,
    floating_hearts: true,
    background_particles: true
  });

  const [passwordProtection, setPasswordProtection] = useState(false);
  const [passwordString, setPasswordString] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [musicUrl, setMusicUrl] = useState('');

  // Mobile preview layout overlay control
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Client Auto-save draft loader
  useEffect(() => {
    try {
      const draft = localStorage.getItem('momentsai_wizard_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        setTimeout(() => {
          if (parsed.occasion) setOccasion(parsed.occasion);
          if (parsed.recipientName) setRecipientName(parsed.recipientName);
          if (parsed.senderName) setSenderName(parsed.senderName);
          if (parsed.relationship) setRelationship(parsed.relationship);
          if (parsed.eventDate) setEventDate(parsed.eventDate);
          if (parsed.customTitle) setCustomTitle(parsed.customTitle);
          if (parsed.personalMessage) setPersonalMessage(parsed.personalMessage);
          if (parsed.memories) setMemories(parsed.memories);
          if (parsed.achievements) setAchievements(parsed.achievements);
          if (parsed.themeId) setThemeId(parsed.themeId);
          if (
            parsed.slateVariant &&
            parsed.slateVariant in SLATE_BACKGROUNDS
          ) {
            setSlateVariant(parsed.slateVariant);
          } else {
            setSlateVariant('cool_gray');
          }
          if (parsed.musicUrl) setMusicUrl(parsed.musicUrl);
          if (parsed.secretMessage) setSecretMessage(parsed.secretMessage);
        }, 0);
      }
    } catch (e) {
      console.warn("Failed to restore drafts", e);
    }
  }, []);

  // Auto-save triggers
  useEffect(() => {
    const draftData = {
      occasion, recipientName, senderName, relationship, eventDate,
      customTitle, personalMessage, memories, achievements, themeId,
      slateVariant, musicUrl, secretMessage
    };
    localStorage.setItem('momentsai_wizard_draft', JSON.stringify(draftData));
  }, [
    occasion, recipientName, senderName, relationship, eventDate,
    customTitle, personalMessage, memories, achievements, themeId,
    slateVariant, musicUrl, secretMessage
  ]);

  const clearDraft = () => {
    if (confirm("Reset the form and start fresh? This clears your draft.")) {
      localStorage.removeItem('momentsai_wizard_draft');
      setRecipientName('');
      setSenderName('');
      setRelationship('');
      setEventDate('');
      setCustomTitle('');
      setPersonalMessage('');
      setMemories([]);
      setAchievements([]);
      setUploadedFiles([]);
      setMusicUrl('');
      setSecretMessage('');
      setPasswordProtection(false);
      setPasswordString('');
      setThemeId('romantic');
      setSlateVariant('cool_gray');
      setStep(1);
    }
  };

  const addMemory = () => {
    if (memoriesInput.trim()) {
      setMemories([...memories, memoriesInput.trim()]);
      setMemoriesInput('');
    }
  };

  const removeMemory = (idx: number) => {
    setMemories(memories.filter((_, i) => i !== idx));
  };



  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 100;
        if (prev >= 90) {
          clearInterval(interval);
          setUploadedFiles([
            ...uploadedFiles, 
            { 
              name: file.name, 
              url: URL.createObjectURL(file),
              size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
            }
          ]);
          setUploadProgress(null);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleNextStep = () => {
    if (step === 1 && !occasion) {
      alert("Please select an occasion.");
      return;
    }
    if (step === 2 && (!recipientName || !senderName)) {
      alert("Recipient Name and Sender Name are required.");
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleCompileWebsite = async () => {
    if (personalMessage && personalMessage.length > MAX_CHARS) {
      alert(`Personal message cannot exceed ${MAX_CHARS} characters.`);
      return;
    }
    setLoading(true);
    setLoadingStatus("Connecting to Bedrock...");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in or log in to continue");

      const loadingMessages = [
        "Analyzing your prompt details...",
        "Calling AI generative engine...",
        "Drafting personalized letter blocks...",
        "Composing your customized memory timeline...",
        "Assembling interactive quotes...",
        "Seeding visual style attributes...",
        "Saving layout parameters to database...",
        "Deploying your tribute showcase live..."
      ];

      let msgIndex = 0;
      const loaderInterval = setInterval(() => {
        if (msgIndex < loadingMessages.length - 1) {
          msgIndex++;
          setLoadingStatus(loadingMessages[msgIndex]);
        }
      }, 1200);

      const payload = {
        user_id: user.id,
        occasion,
        recipient_name: recipientName,
        sender_name: senderName,
        relationship,
        event_date: eventDate || null,
        custom_title: customTitle || null,
        personal_message: personalMessage || null,
        favorite_memories: memories,
        special_moments: achievements,
        theme_slug: themeId,
        selected_sections: sections,
        effects,
        is_password_protected: passwordProtection,
        password_hash: passwordString || null,
        secret_message: secretMessage || null,
        media_urls: uploadedFiles.map(file => file.url),
        music_url: musicUrl || null,
        custom_colors: themeId === 'minimal' ? { slateVariant } : null
      };

      const response = await fetch('/api/moments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearInterval(loaderInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate website.");
      }

      const responseData = await response.json();
      localStorage.removeItem('momentsai_wizard_draft');
      router.push(`/m/${responseData.slug}`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      alert(message);
      setLoading(false);
    }
  };

  // Preview styling variables
  const getThemePreviewStyles = () => {
    switch (themeId) {
      case 'romantic':
        return {
          bg: 'bg-gradient-to-b from-rose-50 to-pink-100 font-serif',
          card: 'bg-white/80 border-rose-100 text-rose-950',
          accentText: 'text-rose-600',
          bulletColor: 'bg-rose-100 border-rose-200 text-rose-600',
          buttonClass: 'bg-rose-500 text-white'
        };
      case 'cosmic':
        return {
          bg: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 text-white font-sans',
          card: 'bg-white/10 backdrop-blur-md border-white/10 text-white',
          accentText: 'text-indigo-300',
          bulletColor: 'bg-white/20 border-white/10 text-indigo-200',
          buttonClass: 'bg-indigo-600 text-white'
        };
      case 'minimal': {
        const slateBg = SLATE_BACKGROUNDS[slateVariant] || SLATE_BACKGROUNDS.cool_gray;
        return {
          bg: `bg-gradient-to-b ${slateBg.preview} font-mono text-zinc-900`,
          card: 'bg-white/95 border-zinc-200 text-zinc-900',
          accentText: 'text-zinc-500',
          bulletColor: 'bg-zinc-100 border-zinc-200 text-zinc-600',
          buttonClass: 'bg-zinc-800 text-white'
        };
      }
      case 'luxury':
        return {
          bg: 'bg-gradient-to-b from-stone-900 to-black font-serif text-amber-100',
          card: 'bg-white/5 border-stone-800 text-amber-150',
          accentText: 'text-amber-400',
          bulletColor: 'bg-stone-850 border-stone-800 text-amber-300',
          buttonClass: 'bg-amber-500 text-stone-950'
        };
      case 'cute':
        return {
          bg: 'bg-gradient-to-b from-pink-50 to-amber-50 text-pink-900 font-sans rounded-3xl',
          card: 'bg-white/80 border-pink-100 text-pink-950',
          accentText: 'text-pink-600',
          bulletColor: 'bg-pink-100 border-pink-200 text-pink-600',
          buttonClass: 'bg-pink-400 text-white'
        };
      default:
        return {
          bg: 'bg-white font-sans text-zinc-900',
          card: 'bg-zinc-50 border-zinc-200 text-zinc-900',
          accentText: 'text-violet-600',
          bulletColor: 'bg-zinc-100 border-zinc-200 text-zinc-600',
          buttonClass: 'bg-violet-600 text-white'
        };
    }
  };

  const currentThemeStyles = getThemePreviewStyles();
  const parsedMusic = detectMusicProvider(musicUrl);

  const renderSimulatedMobileMockup = () => (
    <div className="relative w-[310px] h-[610px] rounded-[48px] border-[10px] border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col shrink-0 ring-4 ring-zinc-200/50">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5.5 bg-zinc-900 rounded-b-2xl z-45 flex items-center justify-center">
        <div className="w-12 h-1 bg-zinc-950 rounded-full" />
      </div>

      {/* Internal preview scrolling content */}
      <div className={`flex-1 overflow-y-auto ${currentThemeStyles.bg} pt-12 pb-8 scrollbar-none space-y-5 px-4 relative`}>
        {/* Floating preview badge */}
        <div className="absolute top-2.5 right-2.5 z-40 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest animate-pulse">
          Live Studio Preview
        </div>

        {/* Hero Section */}
        <div className="text-center pt-4 space-y-1">
          <div className="w-11 h-11 rounded-full bg-white/30 border border-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-sm">
            {occasion === 'birthday' ? <Gift className="w-5 h-5 text-violet-500" /> : <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />}
          </div>
          <span className={`text-[8px] uppercase tracking-widest font-black ${currentThemeStyles.accentText}`}>
            A custom {occasion || 'milestone'} tribute
          </span>
          <h1 className="text-xl font-black tracking-tight leading-snug">
            {customTitle || (recipientName ? `To ${recipientName}` : 'Tribute Recipient')}
          </h1>
          <p className="text-[9px] opacity-75 font-semibold leading-none">
            With love from {senderName || 'Your Name'} {relationship ? `(${relationship})` : ''}
          </p>
        </div>

        {/* Narrative Card */}
        {sections.letter && (
          <div className={`p-4 rounded-2.5xl ${currentThemeStyles.card} border space-y-1.5`}>
            <span className={`text-[8px] uppercase tracking-wider font-black ${currentThemeStyles.accentText}`}>Personal Wishes</span>
            <p className="text-[10px] leading-relaxed opacity-95">
              {personalMessage || 'Your heart-warming tribute narrative and AI story letter drafts will write out elegantly here...'}
            </p>
          </div>
        )}

        {/* Timeline Event Preview */}
        {sections.timeline && (
          <div className={`p-4 rounded-2.5xl ${currentThemeStyles.card} border space-y-3`}>
            <span className={`text-[8px] uppercase tracking-wider font-black ${currentThemeStyles.accentText}`}>Memory timeline</span>
            <div className="relative pl-3.5 border-l border-zinc-300/40 space-y-4">
              {memories.length === 0 ? (
                <div className="text-[9px] opacity-60">Add favorite memories to compile a custom timeline story!</div>
              ) : (
                memories.map((m, i) => (
                  <div key={i} className="relative text-[10px]">
                    <div className="absolute -left-[20px] top-0.5 w-[10px] h-[10px] rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[6px]">
                      ❤️
                    </div>
                    <span className="font-bold">Memory #{i + 1}</span>
                    <p className="text-[9px] opacity-75 leading-snug">{m}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Image Grid Preview */}
        {sections.gallery && uploadedFiles.length > 0 && (
          <div className={`p-4 rounded-2.5xl ${currentThemeStyles.card} border space-y-2`}>
            <span className={`text-[8px] uppercase tracking-wider font-black ${currentThemeStyles.accentText}`}>Gallery album ({uploadedFiles.length})</span>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="aspect-square rounded-lg border overflow-hidden bg-black/5">
                  <img src={file.url} alt="uploaded preview" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Audio embed preview */}
        {sections.music && parsedMusic && parsedMusic.isValid && parsedMusic.embedUrl && (
          <div className={`p-4 rounded-2.5xl ${currentThemeStyles.card} border space-y-2`}>
            <div className="flex items-center justify-between text-[8px] font-black uppercase">
              <span className="flex items-center gap-1"><Music className="w-3 h-3" /> Soundtrack Embed</span>
              <span className="opacity-60">{parsedMusic.name}</span>
            </div>
            <iframe
              src={parsedMusic.embedUrl}
              width="100%"
              height={parsedMusic.provider === 'spotify' ? '80' : parsedMusic.provider === 'apple' ? '83' : '150'}
              frameBorder="0"
              allowFullScreen
              className="rounded-xl border-none"
            />
          </div>
        )}

        {/* Countdown */}
        {sections.countdown && eventDate && (
          <div className={`p-4 rounded-2.5xl ${currentThemeStyles.card} border text-center space-y-1`}>
            <span className={`text-[8px] uppercase font-black tracking-widest ${currentThemeStyles.accentText}`}>Milestone Connection</span>
            <div className="text-2xl font-black">274</div>
            <p className="text-[8px] opacity-60">Days together since {eventDate}</p>
          </div>
        )}

        {/* Guestbook Wishes */}
        {sections.guestbook && (
          <div className={`p-4 rounded-2.5xl ${currentThemeStyles.card} border space-y-2`}>
            <span className={`text-[8px] uppercase tracking-wider font-black ${currentThemeStyles.accentText}`}>Signings Wall</span>
            <div className="p-2 rounded-lg bg-black/5 text-[9px] font-medium leading-relaxed">
              <strong>Alex:</strong> Celebrating this beautiful milestone! Absolute legend.
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const charCount = personalMessage?.length || 0;
  const isWarning = charCount >= MAX_CHARS * 0.8;
  const isDanger = charCount >= MAX_CHARS * 0.95;
  const counterColorClass = isDanger
    ? 'text-red-500 font-bold'
    : isWarning
    ? 'text-amber-500 font-bold'
    : 'text-zinc-400 font-medium';

  return (
    <div className="min-h-screen bg-[#faf9f6]/40 py-10 px-6">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 p-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
              <Sparkles className="w-8 h-8 text-violet-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gradient-primary">Compiling Tribute Page</h2>
              <p className="text-sm font-semibold text-zinc-500 animate-pulse">{loadingStatus}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Split Interface Container */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Side: Step Wizard Form (60% width) */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Stepper progress & reset draft */}
          <div className="flex items-center justify-between pb-2">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#8b5cf6] bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
                Tribute Studio
              </span>
              <h1 className="text-3xl font-black tracking-tight text-zinc-950 mt-2">Create Beautiful Moment</h1>
            </div>
            
            <button
              onClick={clearDraft}
              className="px-3.5 py-1.5 text-xs font-bold text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Draft
            </button>
          </div>

          {/* Steps Progress Header */}
          <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-between gap-2">
            {[
              { num: 1, label: 'Occasion' },
              { num: 2, label: 'Tribute Details' },
              { num: 3, label: 'Photo Album' },
              { num: 4, label: 'Settings & Theme' }
            ].map((s) => (
              <div 
                key={s.num} 
                className="flex items-center gap-2 flex-1 justify-center last:flex-none cursor-pointer"
                onClick={() => {
                  if (step > s.num || (s.num === 2 && occasion) || (s.num === 3 && recipientName && senderName)) {
                    setStep(s.num);
                  }
                }}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                  step === s.num 
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' 
                    : step > s.num 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-xs font-bold hidden sm:inline transition-colors ${step === s.num ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Stepper Wizard Form Box */}
          <div className="bg-white p-7.5 rounded-[32px] border border-zinc-200/80 shadow-xl shadow-zinc-200/20 relative min-h-[460px] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* STEP 1: CHOOSE OCCASION */}
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 animate-in fade-in-50 duration-200"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-zinc-950">1. Select Occasion</h3>
                    <p className="text-xs text-zinc-500 font-semibold">What beautiful life milestone or celebration is this tribute site for?</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {occasionsList.map((item) => {
                      const IconComp = item.icon;
                      const isSelected = occasion === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setOccasion(item.id)}
                          className={`relative rounded-2.5xl transition-all cursor-pointer ${
                            isSelected
                              ? 'p-0.5 bg-gradient-to-r from-violet-600 to-pink-500 ring-4 ring-primary-500/20'
                              : ''
                          }`}
                        >
                          {/* Inner card maintaining original styling */}
                          <div
                            className={`flex flex-col p-4 justify-between h-28 w-full rounded-2.5xl border transition-colors text-left ${
                              isSelected
                                ? 'bg-violet-500/5 border-transparent shadow-md shadow-violet-500/5 text-violet-950 font-black'
                                : 'bg-zinc-50/50 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700'
                            }`}
                          >
                            <div
                              className={`w-8.5 h-8.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm ${
                                isSelected ? 'text-violet-600' : 'text-zinc-500'
                              }`}
                            >
                              <IconComp className="w-4.5 h-4.5" />
                            </div>
                            <span className="text-xs font-bold">{item.label}</span>
                          </div>
                          {/* Check badge for selected card */}
                          {isSelected && (
                            <Check className="absolute top-1 right-1 w-4 h-4 text-white bg-primary-500 rounded-full p-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PERSONAL TRIBUTE DETAILS */}
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 animate-in fade-in-50 duration-200"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-zinc-950">2. Tribute Details</h3>
                    <p className="text-xs text-zinc-500 font-semibold">Enter names, milestone dates, and key memories. We customize labels for your occasion!</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="recipient-name" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">{activeQuestions.recipientLabel}</label>
                      <input
                        id="recipient-name"
                        type="text"
                        placeholder={activeQuestions.recipientPlaceholder}
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="sender-name" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">Your Name *</label>
                        <input
                          id="sender-name"
                          type="text"
                          placeholder="e.g. Alex, Rohan"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="relationship" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">Relationship</label>
                        <input
                          id="relationship"
                          type="text"
                          placeholder="e.g. best friend, partner"
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="event-date" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">Event Milestone Date</label>
                      <input
                        id="event-date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold text-zinc-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="custom-title" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">Custom Header Title (Optional)</label>
                      <input
                        id="custom-title"
                        type="text"
                        placeholder="e.g. Happy 25th Birthday Sarah!"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="personal-message" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">{activeQuestions.messageLabel}</label>
                    <textarea
                      id="personal-message"
                      aria-describedby="personal-message-counter"
                      rows={3}
                      maxLength={MAX_CHARS}
                      placeholder={activeQuestions.messagePlaceholder}
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium leading-relaxed"
                    />
                    <div className="flex justify-end pr-0.5">
                      <span id="personal-message-counter" className={`text-[10px] tracking-wider select-none ${counterColorClass}`}>
                        {charCount} / {MAX_CHARS} characters
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Memory Event Buffers */}
                  <div className="space-y-2.5">
                    <label htmlFor="memories-input" className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider block">{activeQuestions.memoriesLabel}</label>
                    <div className="flex gap-2">
                      <input
                        id="memories-input"
                        type="text"
                        placeholder={activeQuestions.memoriesPlaceholder}
                        value={memoriesInput}
                        onChange={(e) => setMemoriesInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMemory())}
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none font-semibold"
                      />
                      <button
                        type="button"
                        onClick={addMemory}
                        className="px-4 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-750 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4.5 h-4.5" /> Add
                      </button>
                    </div>

                    {memories.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1.5 max-h-36 overflow-y-auto pr-1">
                        {memories.map((m, idx) => (
                          <div 
                            key={idx} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold"
                          >
                            <span className="truncate max-w-[200px]">{m}</span>
                            <button type="button" onClick={() => removeMemory(idx)} className="text-violet-400 hover:text-red-500 shrink-0 cursor-pointer">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PHOTO UPLOADS */}
              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 animate-in fade-in-50 duration-200"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-zinc-950">3. Upload Memory Album</h3>
                    <p className="text-xs text-zinc-500 font-semibold">Upload beautiful shared photos. The live phone preview will display your layout instantly!</p>
                  </div>

                  <div className="border-2 border-dashed border-zinc-200/80 rounded-2.5xl p-10 text-center hover:border-violet-500/50 hover:bg-zinc-50/20 transition-all relative flex flex-col items-center justify-center group">
                    <label htmlFor="memory-album-upload" className="sr-only">
                      Upload memory album photos
                    </label>
                    <input 
                      id="memory-album-upload"
                      type="file" 
                      accept="image/*"
                      aria-describedby="memory-album-help"
                      onChange={handleMediaUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <Upload className="w-6 h-6 text-zinc-500 group-hover:text-violet-600 transition-colors" />
                    </div>
                    <p className="mt-4 text-sm font-bold text-zinc-900">Drag and drop images here, or <span className="text-[#8b5cf6]">browse folders</span></p>
                    <p id="memory-album-help" className="mt-1 text-[10px] text-zinc-400 font-medium">Supports JPG, PNG up to 10MB per file</p>
                  </div>

                  {uploadProgress !== null && (
                    <div className="space-y-2 p-4 border border-zinc-100 rounded-2xl bg-[#faf9f6]/40">
                      <div className="flex justify-between text-xs font-bold text-zinc-500">
                        <span>Compressing and securing memory media...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Uploaded Gallery Grid */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase pl-1 tracking-wider">Uploaded Photos ({uploadedFiles.length})</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="relative rounded-2xl border border-zinc-200 overflow-hidden bg-background aspect-square group shadow-sm">
                            <img src={file.url} alt={file.name} className="object-cover w-full h-full" />
                            <button 
                              type="button"
                              onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/45 hover:bg-red-500 text-white transition-colors cursor-pointer shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4: THEMING, WIDGETS & PRIVACY */}
              {step === 4 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 animate-in fade-in-50 duration-200"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-zinc-950">4. Themes, Soundtracks & Privacy</h3>
                    <p className="text-xs text-zinc-500 font-semibold">Select visual templates, configure soundtrack embeds, and lock pages securely.</p>
                  </div>

                  {/* Visual Theme Select Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 pl-0.5 uppercase tracking-wider">Bespoke Visual Theme Preset</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {themesList.map((t) => {
                        const isSelected = themeId === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setThemeId(t.id)}
                            className={`p-4.5 rounded-2.5xl border transition-all text-left flex flex-col justify-between h-22 cursor-pointer ${
                              isSelected 
                                ? 'bg-zinc-50 border-violet-500 shadow-md shadow-violet-500/5 text-zinc-900 font-bold' 
                                : 'bg-[#faf9f6]/40 border-zinc-200 hover:border-zinc-300 text-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm font-bold">{t.name}</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-violet-600 bg-violet-600 text-white' : 'border-zinc-300 bg-white'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                            <span className="text-[10px] opacity-75 leading-snug font-medium mt-1">{t.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {themeId === 'minimal' && (
                    <div className="space-y-3 pt-4 border-t border-zinc-200 animate-in fade-in-50 duration-200">
                      <label className="text-xs font-black text-zinc-400 pl-0.5 uppercase tracking-wider block">Slate Background Color Variant</label>
                      <div 
                        role="radiogroup"
                        aria-label="Slate background color"
                        className="grid grid-cols-3 gap-3"
                      >
                        {[
                          { id: 'cool_gray', name: 'Cool Gray', desc: 'Default gray background' },
                          { id: 'warm_white', name: 'Warm White', desc: 'Soft warm background' },
                          { id: 'cream', name: 'Cream', desc: 'Warm amber background' },
                        ].map((variant) => {
                          const isVariantSelected = slateVariant === variant.id;
                          const slateBg = SLATE_BACKGROUNDS[variant.id as SlateBgVariant];
                          return (
                            <button
                              key={variant.id}
                              type="button"
                              role="radio"
                              aria-checked={isVariantSelected}
                              tabIndex={isVariantSelected ? 0 : -1}
                              id={`slate-variant-${variant.id}`}
                              onClick={() => setSlateVariant(variant.id as SlateBgVariant)}
                              onKeyDown={(e) => {
                                const variants = ['cool_gray', 'warm_white', 'cream'] as const;
                                const currentIndex = variants.indexOf(slateVariant);
                                let targetIndex = -1;
                                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                                  targetIndex = (currentIndex + 1) % variants.length;
                                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                                  targetIndex = (currentIndex - 1 + variants.length) % variants.length;
                                }
                                if (targetIndex !== -1) {
                                  e.preventDefault();
                                  const nextVariant = variants[targetIndex];
                                  setSlateVariant(nextVariant);
                                  setTimeout(() => {
                                    document.getElementById(`slate-variant-${nextVariant}`)?.focus();
                                  }, 0);
                                }
                              }}
                              className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between h-24 cursor-pointer ${
                                isVariantSelected
                                  ? 'bg-zinc-50 border-violet-500 shadow-md shadow-violet-500/5 text-zinc-900 font-bold'
                                  : 'bg-[#faf9f6]/40 border-zinc-200 hover:border-zinc-300 text-zinc-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-bold">{variant.name}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isVariantSelected ? 'border-violet-600 bg-violet-600 text-white' : 'border-zinc-300 bg-white'}`}>
                                  {isVariantSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className={`w-6 h-6 rounded-md border border-zinc-300 bg-gradient-to-b ${slateBg.preview}`} />
                                <span className="text-[9px] opacity-75 leading-tight font-medium line-clamp-2">{variant.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Music Paste Embed Area */}
                  {sections.music && (
                    <div className="space-y-3.5 pt-4 border-t border-zinc-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-500 uppercase pl-1 tracking-wider flex items-center gap-2">
                          <Music className="w-4 h-4 text-primary" />
                          Acoustic Soundtrack Link
                        </label>
                        <div className="flex items-center gap-1.5 opacity-80">
                          {/* Brand Icons SVGs */}
                          <svg className="w-3.5 h-3.5 text-[#1DB954] fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.076-.336.135-.668.47-.743 3.856-.88 7.15-.5 9.822 1.137.295.18.387.563.205.851zm1.225-2.72c-.228.368-.713.49-1.08.262-2.717-1.67-6.863-2.15-10.067-1.18-.413.127-.85-.105-.977-.52-.128-.415.104-.85.52-.978 3.66-1.11 8.224-.57 11.343 1.348.368.228.49.712.262 1.07zm.106-2.828C14.693 8.88 9.3 8.7 6.22 9.633c-.47.142-.962-.123-1.103-.593-.142-.47.123-.962.593-1.103 3.555-1.077 9.5-0.87 13.23 1.348.423.25.563.796.313 1.22-.25.423-.796.562-1.22.312z"/></svg>
                          <svg className="w-3.5 h-3.5 text-[#FF0000] fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                          <svg className="w-3.5 h-3.5 text-[#FA243C] fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1.004 12.385c0 1.94-.853 2.94-2.313 2.94-1.272 0-2.072-.823-2.072-2.112 0-1.859 1.488-2.612 4.195-2.585l.19.002v-1.921c0-.986-.484-1.503-1.688-1.503-.996 0-1.748.36-2.146.969-.17.26-.454.349-.691.196l-.37-.243c-.279-.181-.274-.477-.075-.769.697-1.025 1.989-1.594 3.542-1.594 2.27 0 3.551 1.055 3.551 3.255v3.362z"/></svg>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Paste YouTube, Spotify, or Apple Music link..."
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner font-semibold"
                      />

                      {/* Quick preset triggers */}
                      <div className="flex flex-wrap gap-2 pt-1 items-center">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase select-none pr-1">Try Preset:</span>
                        <button
                          type="button"
                          onClick={() => setMusicUrl('https://open.spotify.com/track/4PTG3Z6ehGkBF3zI7Y1w73')}
                          className="px-2.5 py-1 text-[9px] rounded-full border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 font-black cursor-pointer transition-colors"
                        >
                          Spotify
                        </button>
                        <button
                          type="button"
                          onClick={() => setMusicUrl('https://www.youtube.com/watch?v=A66ty95f6Q8')}
                          className="px-2.5 py-1 text-[9px] rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 font-black cursor-pointer transition-colors"
                        >
                          YouTube
                        </button>
                        <button
                          type="button"
                          onClick={() => setMusicUrl('https://music.apple.com/us/album/perfect/1248712431?i=1248712433')}
                          className="px-2.5 py-1 text-[9px] rounded-full border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-pink-600 font-black cursor-pointer transition-colors"
                        >
                          Apple Music
                        </button>
                      </div>

                      {/* Rich details container parsed on type */}
                      {musicUrl && parsedMusic && (
                        <div className={`p-4.5 rounded-2xl border ${parsedMusic.color} space-y-2.5 transition-all`}>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5 capitalize">
                              <Music className="w-3.5 h-3.5 text-primary animate-pulse" />
                              {parsedMusic.name} Verified
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                              parsedMusic.isValid ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {parsedMusic.isValid ? 'Ready to Compile' : 'Invalid Link'}
                            </span>
                          </div>
                          <p className="text-[10px] leading-normal opacity-75 font-semibold pl-0.5">{parsedMusic.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Privacy protection panel */}
                  <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <label className="text-xs font-black text-zinc-400 pl-0.5 uppercase tracking-wider block">Security Settings</label>
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setPasswordProtection(!passwordProtection)}
                        className="flex items-center justify-between w-full p-4.5 rounded-2.5xl border border-zinc-200 bg-[#faf9f6]/40 text-left hover:bg-zinc-50 transition-colors cursor-pointer"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-zinc-900">Passcode Gate Lock</span>
                          <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Visitors must enter this code to unlock the tribute page.</p>
                        </div>
                        {passwordProtection ? <ToggleRight className="w-8 h-8 text-violet-600" /> : <ToggleLeft className="w-8 h-8 text-zinc-400" />}
                      </button>

                      {passwordProtection && (
                        <input
                          type="text"
                          placeholder="Set lock password (e.g. david25)"
                          value={passwordString}
                          onChange={(e) => setPasswordString(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                        />
                      )}

                      <div className="space-y-1 pt-1">
                        <label className="text-xs font-bold text-zinc-500 pl-0.5 uppercase tracking-wider">Secret Message Reveal (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Meet me at our favorite spot at 8 PM! 🤫"
                          value={secretMessage}
                          onChange={(e) => setSecretMessage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-semibold"
                        />
                        <p className="text-[9px] text-zinc-400 pl-0.5 font-medium leading-relaxed">This secret message remains masked until the recipient taps a custom button, adding a fun element of mystery.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-zinc-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:border-zinc-300"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompileWebsite}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-black text-xs hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  Compile Tribute Page <Sparkles className="w-4 h-4 animate-pulse" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: High-Fidelity Smartphone Preview Mockup (Desktop) */}
        <div className="hidden lg:block w-[310px] shrink-0 sticky top-10">
          {renderSimulatedMobileMockup()}
        </div>
      </div>

      {/* Floating Preview button for Mobile Viewports */}
      <div className="lg:hidden fixed bottom-6 right-6 z-45">
        <button
          type="button"
          onClick={() => setIsMobilePreviewOpen(true)}
          className="flex items-center gap-1.5 px-4.5 py-3 rounded-full bg-zinc-950 text-white shadow-xl hover:bg-black font-bold text-xs cursor-pointer border border-white/10"
        >
          <Eye className="w-4.5 h-4.5 text-primary" /> Live Preview
        </button>
      </div>

      {/* Mobile Preview Modal Drawer */}
      <AnimatePresence>
        {isMobilePreviewOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobilePreviewOpen(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 flex flex-col justify-center items-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="absolute -top-12 right-2 p-2 rounded-full bg-white text-zinc-900 border border-zinc-200 shadow-md font-bold text-xs flex items-center gap-1 z-50 cursor-pointer"
              >
                <X className="w-4 h-4" /> Close
              </button>
              {renderSimulatedMobileMockup()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
