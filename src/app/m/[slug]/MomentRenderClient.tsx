"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Music, 
  Play, 
  Clock, 
  Share2, 
  Lock, 
  Send, 
  Maximize2, 
  X, 
  Copy, 
  Check, 
  Mail,
  LoaderCircle,
  Volume
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';

interface MomentData {
  id: string;
  slug: string;
  occasion: string;
  recipient_name: string;
  sender_name: string;
  relationship?: string | null;
  event_date?: string | null;
  custom_title?: string | null;
  personal_message?: string | null;
  favorite_memories?: string[] | null;
  special_moments?: string[] | null;
  theme_slug?: string | null;
  selected_sections: {
    music?: boolean;
    gallery?: boolean;
    timeline?: boolean;
    letter?: boolean;
    guestbook?: boolean;
    quotes?: boolean;
    dreams?: boolean;
    countdown?: boolean;
    reactions?: boolean;
    qr_code?: boolean;
    share?: boolean;
  };
  effects?: string[] | null;
  is_password_protected?: boolean | null;
  password_hash?: string | null;
  secret_message?: string | null;
  music_url?: string | null;
  is_published?: boolean | null;
  unlock_date?: string | null;
  created_at: string;
  ai_title?: string | null;
  ai_story_narrative?: string | null;
  ai_letter?: string | null;
  ai_timeline?: Array<{ date?: string; title: string; description: string; icon?: string }> | null;
  ai_quotes?: Array<{ quote: string; author: string }> | null;
  ai_poem?: string | null;
  themes?: { slug: string } | null;
}

interface MediaItem {
  id: string;
  url: string;
  type?: string;
  created_at?: string;
}

interface GuestbookItem {
  id: string;
  name: string;
  message: string;
  created_at: string;
  is_approved?: boolean;
}

interface Props {
  initialMoment: MomentData;
  initialMedia: MediaItem[];
  initialGuestbook: GuestbookItem[];
}

const themeStyles = {
  romantic: {
    bg: "from-rose-50 via-pink-50 to-rose-100",
    text: "text-rose-950",
    subText: "text-rose-600 font-bold",
    accent: "bg-gradient-to-r from-rose-500 to-pink-600 text-white",
    cardBg: "bg-white/75 backdrop-blur-xl border border-rose-100 shadow-sm",
    font: "font-serif",
    accentBorder: "border-rose-200/60",
    glowingGlow: "shadow-rose-500/10",
    glowColor: "rgba(225, 29, 72, 0.15)",
    neonText: "text-rose-600 font-black"
  },
  cosmic: {
    bg: "from-indigo-50 via-purple-50 to-pink-100",
    text: "text-indigo-950",
    subText: "text-indigo-600 font-bold",
    accent: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white",
    cardBg: "bg-white/80 backdrop-blur-2xl border border-indigo-100 shadow-sm",
    font: "font-sans",
    accentBorder: "border-indigo-200/50",
    glowingGlow: "shadow-indigo-500/10",
    glowColor: "rgba(79, 70, 229, 0.15)",
    neonText: "text-indigo-600 font-black"
  },
  minimal: {
    bg: "from-zinc-50 via-zinc-100 to-zinc-150",
    text: "text-zinc-900",
    subText: "text-zinc-500 font-bold",
    accent: "bg-zinc-900 text-white",
    cardBg: "bg-white/90 backdrop-blur-lg border border-zinc-200 shadow-sm",
    font: "font-mono",
    accentBorder: "border-zinc-300/60",
    glowingGlow: "shadow-zinc-500/5",
    glowColor: "rgba(113, 113, 122, 0.1)",
    neonText: "text-zinc-700 font-black"
  },
  luxury: {
    bg: "from-[#fdfcfa] via-[#f7f5f0] to-[#f0ede6]",
    text: "text-[#3f3b33]",
    subText: "text-[#c29b38] font-bold",
    accent: "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-white",
    cardBg: "bg-white/85 backdrop-blur-2xl border border-[#e5dfd3] shadow-sm",
    font: "font-serif",
    accentBorder: "border-[#dcd7cd]",
    glowingGlow: "shadow-[#d4af37]/10",
    glowColor: "rgba(212, 175, 55, 0.15)",
    neonText: "text-[#aa7c11] font-black"
  },
  cute: {
    bg: "from-pink-50 via-yellow-50 to-cyan-50",
    text: "text-pink-950",
    subText: "text-pink-500 font-bold",
    accent: "bg-gradient-to-r from-pink-400 to-purple-400 text-white",
    cardBg: "bg-white/80 backdrop-blur-xl border border-pink-100 shadow-sm",
    font: "font-sans",
    accentBorder: "border-pink-200/60",
    glowingGlow: "shadow-pink-400/10",
    glowColor: "rgba(244, 114, 182, 0.15)",
    neonText: "text-pink-600 font-black"
  }
};

function parseMusicEmbed(url: string | null | undefined) {
  if (!url) return null;

  // Extract URL from iframe if pasted
  let targetUrl = url.trim();
  if (targetUrl.startsWith('<iframe')) {
    const srcMatch = targetUrl.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      targetUrl = srcMatch[1];
    }
  }

  // Spotify Track/Album/Playlist
  if (targetUrl.includes('spotify.com')) {
    const trackMatch = targetUrl.match(/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return {
        type: 'spotify',
        embedUrl: `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator`
      };
    }
    const albumMatch = targetUrl.match(/album\/([a-zA-Z0-9]+)/);
    if (albumMatch) {
      return {
        type: 'spotify',
        embedUrl: `https://open.spotify.com/embed/album/${albumMatch[1]}?utm_source=generator`
      };
    }
    const playlistMatch = targetUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) {
      return {
        type: 'spotify',
        embedUrl: `https://open.spotify.com/embed/playlist/${playlistMatch[1]}?utm_source=generator`
      };
    }
  }

  // YouTube Video
  if (targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be')) {
    let videoId = '';
    if (targetUrl.includes('youtu.be/')) {
      videoId = targetUrl.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else {
      videoId = targetUrl.match(/[?&]v=([^&#]+)/)?.[1] || '';
    }
    if (videoId) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`
      };
    }
  }

  // Apple Music
  if (targetUrl.includes('music.apple.com')) {
    const embedUrl = targetUrl.replace('music.apple.com', 'embed.music.apple.com');
    return {
      type: 'apple',
      embedUrl
    };
  }

  return {
    type: 'audio',
    embedUrl: targetUrl
  };
}

export default function MomentRenderClient({ initialMoment, initialMedia, initialGuestbook }: Props) {
  const supabase = createClient();
  const themeSlug = (initialMoment.themes?.slug || 'romantic') as keyof typeof themeStyles;
  const style = themeStyles[themeSlug] || themeStyles.romantic;
  const embedData = parseMusicEmbed(initialMoment.music_url);
  const letterText = initialMoment.ai_letter || initialMoment.personal_message;

  // View state triggers
  const [unlocked, setUnlocked] = useState(!initialMoment.is_password_protected);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Time reveal logic
  const [timeUnlocked, setTimeUnlocked] = useState(true);

  useEffect(() => {
    if (!initialMoment.unlock_date) return;
    const isLocked = new Date(initialMoment.unlock_date).getTime() > Date.now();
    setTimeout(() => {
      setTimeUnlocked(!isLocked);
    }, 0);
  }, [initialMoment.unlock_date]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Music player state
const [volume, setVolume] = useState<number>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('player_volume') : null;
    return stored ? parseFloat(stored) : 0.7;
  });
const [playing, setPlaying] = useState<boolean>(false);
const [isMobile, setIsMobile] = useState<boolean>(false);
const [showVolume, setShowVolume] = useState<boolean>(false);
const [isMuted, setIsMuted] = useState<boolean>(false);
const audioRef = useRef<HTMLAudioElement>(new Audio(initialMoment.music_url ?? ''));

// Detect mobile/desktop on mount and resize
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);



  // Persist volume changes
  useEffect(() => {
    localStorage.setItem('player_volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Sync mute state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Interactive details
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [secretRevealed, setSecretRevealed] = useState(false);

  // Guestbook & Reactions lists
  const [guestbook, setGuestbook] = useState(initialGuestbook);
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestMsg, setGuestMsg] = useState('');
  const guestbookSubmitInFlight = useRef(false);
  const [reactionCounts, setReactionCounts] = useState({ heart: 14, like: 21, confetti: 9 });

  // Share Dialog state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile Quick Share state
  const [quickCopied, setQuickCopied] = useState(false);
  const quickCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up copy timeouts on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (quickCopyTimeoutRef.current) {
        clearTimeout(quickCopyTimeoutRef.current);
      }
    };
  }, []);

  // Dynamic Milestone Counters
  const [milestoneDays, setMilestoneDays] = useState(0);

  useEffect(() => {
    if (!initialMoment.event_date) return;
    const days = Math.floor(Math.abs(Date.now() - new Date(initialMoment.event_date).getTime()) / (1000 * 60 * 60 * 24));
    setTimeout(() => {
      setMilestoneDays(days);
    }, 0);
  }, [initialMoment.event_date]);

  // Fire view analytics increment once on load
  useEffect(() => {
    async function recordView() {
      try {
        const isUnique = !localStorage.getItem(`visited_${initialMoment.slug}`);
        if (isUnique) {
          localStorage.setItem(`visited_${initialMoment.slug}`, 'true');
        }
        
        const device = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
        let source = 'direct';
        if (document.referrer.includes('wa.me') || document.referrer.includes('whatsapp')) {
          source = 'whatsapp';
        } else if (document.referrer.includes('t.co') || document.referrer.includes('instagram')) {
          source = 'social';
        }

        // Call our analytical increment function
        await supabase.rpc('increment_moment_views', {
          moment_slug: initialMoment.slug,
          is_unique: isUnique,
          device,
          source
        });
      } catch (err) {
        console.error("Failed to increment analytics:", err);
      }
    }
    
    recordView();
  }, [initialMoment.slug, supabase]);

  // Calculate unlock date countdown
  useEffect(() => {
    const unlockDate = initialMoment.unlock_date;
    if (!unlockDate) return;

    function updateTimer() {
      const targetDate = initialMoment.unlock_date;
      if (!targetDate) return;
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeUnlocked(prev => !prev ? true : prev);
        confetti({ particleCount: 150, spread: 80 });
        return;
      }

      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }

    const interval = setInterval(updateTimer, 1000);
    const timer = setTimeout(updateTimer, 0);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [initialMoment.unlock_date]);



  // Spark confetti cascade on unlock
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === initialMoment.password_hash) {
      setUnlocked(true);
      confetti({ particleCount: 100, spread: 60 });
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  // Music Vinyl Player control
  const togglePlayMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser:", err));
    }
    setPlaying(!playing);
  };

  // Add guestbook message
  const handleAddGuestbookMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guestbookSubmitInFlight.current || !guestName.trim() || !guestMsg.trim()) return;

    guestbookSubmitInFlight.current = true;
    setIsSubmittingGuestbook(true);

    const newEntry = {
      id: Math.random().toString(),
      name: guestName.trim(),
      message: guestMsg.trim(),
      created_at: new Date().toISOString()
    };

    setGuestbook([newEntry, ...guestbook]);
    setGuestName('');
    setGuestMsg('');
    confetti({ particleCount: 40, spread: 50 });

    try {
      await supabase
        .from('guestbook_entries')
        .insert({
          moment_id: initialMoment.id,
          name: newEntry.name,
          message: newEntry.message,
          is_approved: true
        });
    } catch (err) {
      console.error("Failed to post message to Supabase:", err);
    } finally {
      guestbookSubmitInFlight.current = false;
      setIsSubmittingGuestbook(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (typeof window === 'undefined' || !window.isSecureContext || !navigator.clipboard) {
      console.warn("Clipboard access not available in this context.");
      return;
    }

    const url = `${window.location.origin}/m/${initialMoment.slug}`;
    
    try {
      await navigator.clipboard.writeText(url);
      
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      
      setCopiedLink(true);
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedLink(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy link to clipboard:", err);
    }
  };

  const handleQuickShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const shareData = {
      title: initialMoment.custom_title || `To ${initialMoment.recipient_name}`,
      text: "Explore this gorgeous digital memories page on MomentsAI!",
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // user cancelled share sheet
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
        console.error("Native share failed:", error);
      }
    }

    // Clipboard fallback
    if (typeof window !== 'undefined' && window.isSecureContext && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        
        if (quickCopyTimeoutRef.current) {
          clearTimeout(quickCopyTimeoutRef.current);
        }
        
        setQuickCopied(true);
        quickCopyTimeoutRef.current = setTimeout(() => {
          setQuickCopied(false);
        }, 1500);
      } catch (err) {
        console.error("Clipboard fallback copy failed:", err);
      }
    }
  };

  // Heart emoji reaction click trigger
  const triggerReaction = (type: 'heart' | 'like' | 'confetti') => {
    setReactionCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    
    if (type === 'heart') {
      confetti({ particleCount: 20, spread: 30, colors: ['#ec4899', '#f43f5e'] });
    } else if (type === 'confetti') {
      confetti({ particleCount: 45, spread: 60 });
    } else {
      confetti({ particleCount: 15, spread: 20, colors: ['#eab308'] });
    }
  };

  // Layout blocker: Password lock
  if (!unlocked) {
    return (
      <div className={`min-h-screen ${style.bg} ${style.font} flex items-center justify-center p-6 text-center`}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`glass-premium p-8 max-w-sm w-full rounded-[32px] border space-y-6 ${passwordError ? 'animate-bounce border-destructive' : ''}`}
          style={{ boxShadow: `0 20px 50px -10px ${style.glowColor}` }}
        >
          <div className="w-14 h-14 bg-violet-600/10 text-primary border border-primary/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold">This Moment is Private</h3>
            <p className="text-xs text-muted-foreground">Enter the access password to unlock this beautifully personalized webpage.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-secondary/50 border border-border text-center text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="glowing-button w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow"
            >
              <span>Unlock Moment</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Layout blocker: Time lock countdown
  if (!timeUnlocked) {
    return (
      <div className={`min-h-screen ${style.bg} ${style.font} flex items-center justify-center p-6 text-center`}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-premium p-10 max-w-md w-full rounded-[32px] border space-y-6"
          style={{ boxShadow: `0 20px 50px -10px ${style.glowColor}` }}
        >
          <div className="w-14 h-14 bg-indigo-600/10 text-indigo-400 border border-indigo-400/20 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold">Secrets Unlock Soon!</h3>
            <p className="text-xs text-muted-foreground">This personalized digital surprise compiles and unlocks exactly on the scheduled date.</p>
          </div>

          {/* Countdown Clock Grid */}
          <div className="grid grid-cols-4 gap-2.5 pt-2 text-center">
            {[
              { unit: 'Days', val: countdown.days },
              { unit: 'Hrs', val: countdown.hours },
              { unit: 'Min', val: countdown.minutes },
              { unit: 'Sec', val: countdown.seconds }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-secondary/60 border border-border/80 rounded-2xl">
                <span className="text-2xl font-black block tracking-tight">{item.val}</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">{item.unit}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold pt-2">
            Target Date: {formatDate(initialMoment.unlock_date)}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${style.bg} ${style.font} pb-24 relative overflow-x-hidden ${style.text}`}>
      
      {/* Floating Particles system */}
      {themeSlug === 'romantic' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25 z-0">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Heart key={i} className={`absolute text-rose-400 fill-rose-300 animate-float`} style={{
              left: `${i * 14}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 1.5}s`,
              width: `${12 + i * 4}px`,
              height: `${12 + i * 4}px`,
            }} />
          ))}
        </div>
      )}
      {themeSlug === 'cosmic' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Sparkles key={i} className={`absolute text-amber-200 animate-sparkle`} style={{
              left: `${i * 15}%`,
              top: `${12 + i * 11}%`,
              animationDelay: `${i * 1.2}s`,
              width: `${14 + i * 3}px`,
              height: `${14 + i * 3}px`,
            }} />
          ))}
        </div>
      )}

      {/* Floating Header Actions */}
      <header className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-background/30">
        <span className="text-sm font-black uppercase tracking-wider text-gradient-primary">MomentsAI</span>
        <button 
          onClick={() => setIsShareOpen(true)}
          className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/10 shadow-sm transition-all"
        >
          <Share2 className="w-4.5 h-4.5" />
        </button>
      </header>

      {/* Fullscreen Photo Lightbox View */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white">
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={activePhoto} 
              alt="Expanded Memory" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-6 space-y-16 pt-12 relative z-10">

        {/* 1. HERO SECTION (Apple Styled Reveal) */}
        <section className="text-center py-10 space-y-8 relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 mx-auto rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 shadow-inner"
          >
            <Sparkles className="w-9 h-9 text-primary animate-pulse" />
          </motion.div>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className={`text-xs uppercase font-black tracking-widest px-3.5 py-1 rounded-full border bg-secondary/50 ${style.accentBorder} ${style.subText}`}>
              A beautiful {initialMoment.occasion} tribute
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-gradient-primary">
              {initialMoment.custom_title || `To ${initialMoment.recipient_name}`}
            </h1>
            <p className="text-xs opacity-75 font-semibold">
              Lovingly compiled by {initialMoment.sender_name} {initialMoment.relationship ? `(${initialMoment.relationship})` : ''}
            </p>
          </div>

          {/* Premium turntable vintage vinyl disc widget */}
          {initialMoment.selected_sections.music && (
            <motion.div 
              onClick={() => {
                if (embedData && embedData.type !== 'audio') {
                  document.getElementById('music-embed')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  togglePlayMusic();
                }
              }}
              onMouseEnter={() => !isMobile && setShowVolume(true)}
              onMouseLeave={() => !isMobile && setShowVolume(false)}
              className={`inline-flex items-center gap-4 pl-4 pr-6 py-3.5 rounded-full ${style.cardBg} backdrop-blur-xl border shadow-xl cursor-pointer hover:scale-102 hover:-translate-y-0.5 transition-all mx-auto relative overflow-hidden`}
              style={{ boxShadow: `0 10px 30px -5px ${style.glowColor}` }}
            >
              {/* Volume slider (desktop hover) */}
              {showVolume && (
                <div className="absolute bottom-2 left-2 right-2 flex items-center space-x-2 bg-black/30 backdrop-blur-sm p-1 rounded">
                  <Volume
                    className="w-4 h-4 text-white cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      const newMuted = !isMuted;
                      setIsMuted(newMuted);
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => setVolume(parseFloat(e.target.value))}
                    aria-label="Volume"
                    className="flex-1"
                  />
                </div>
              )}
              {/* Mobile volume toggle button */}
              {isMobile && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setShowVolume(prev => !prev);
                    // Also toggle mute on tap
                    const newMuted = !isMuted;
                    setIsMuted(newMuted);
                  }}
                  className="absolute top-1 right-1 p-1 bg-black/30 rounded-full"
                >
                  <Volume className="w-4 h-4 text-white" />
                </button>
              )}
              {/* Spinning record disc */}
              <div className="relative shrink-0">
                <div className={`w-10 h-10 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center shadow-md relative ${playing || (embedData && embedData.type !== 'audio') ? 'animate-spin-slow' : ''}`}>
                  <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                    <Heart className="w-1.5 h-1.5 text-rose-500 fill-rose-500" />
                  </div>
                  <div className="absolute inset-1 rounded-full border border-dashed border-white/5" />
                </div>
                {/* Turntable needle armature arm */}
                <div className={`absolute -right-1 -top-1 w-4 h-4 bg-zinc-400/80 rounded-full origin-top-left transition-transform duration-500 ${playing || (embedData && embedData.type !== 'audio') ? 'rotate-12' : 'rotate-0'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 30% 100%, 0 100%)' }} />
              </div>

              <div className="text-left space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider block">Background Audio</span>
                <span className="text-[9px] opacity-75 block truncate max-w-[120px]">
                  {embedData && embedData.type !== 'audio' ? `${embedData.type.toUpperCase()} Track` : 'Acoustic Soundtrack.mp3'}
                </span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center shrink-0">
                {embedData && embedData.type !== 'audio' ? (
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                ) : playing ? (
                  // Animated audio equalizer bars
                  <div className="flex gap-0.5 items-end h-3">
                    {[1.5, 3, 2, 3.5].map((h, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ height: [3, 12, 3] }} 
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} 
                        className="w-0.5 bg-primary rounded-full" 
                        style={{ height: `${h * 4}px` }} 
                      />
                    ))}
                  </div>
                ) : (
                  <Play className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
            </motion.div>
          )}
        </section>

        {/* 2. STORY SECTION */}
        {initialMoment.ai_story_narrative && (
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-[32px] blur-xl opacity-30 pointer-events-none" />
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-8 md:p-10 rounded-[32px] ${style.cardBg} border shadow-lg text-center space-y-4 relative overflow-hidden`}
              style={{ boxShadow: `0 15px 35px -10px ${style.glowColor}` }}
            >
              <h3 className={`text-xs uppercase tracking-widest font-black ${style.subText}`}>Our Story Journey</h3>
              <p className="text-sm md:text-base leading-relaxed opacity-95">
                {initialMoment.ai_story_narrative}
              </p>
            </motion.div>
          </section>
        )}

        {/* 3. MILESTONE COUNTER */}
        {initialMoment.selected_sections.countdown && initialMoment.event_date && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`p-8 rounded-[32px] ${style.cardBg} border shadow-lg text-center space-y-2 relative overflow-hidden`}
          >
            <span className={`text-[10px] uppercase font-black tracking-widest ${style.subText}`}>Milestone of connection</span>
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-6xl font-black tracking-tight text-gradient-primary">{milestoneDays}</span>
              <span className="text-sm font-bold uppercase tracking-wider text-left leading-tight">Days<br/>Together</span>
            </div>
            <p className="text-[10px] opacity-60">Calculated from {formatDate(initialMoment.event_date)}</p>
          </motion.section>
        )}

        {/* Dynamic Music Embed Player Card */}
        {initialMoment.selected_sections.music && embedData && embedData.type !== 'audio' && (
          <motion.div 
            id="music-embed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-6 rounded-[32px] ${style.cardBg} border shadow-lg text-center space-y-4`}
            style={{ boxShadow: `0 15px 35px -10px ${style.glowColor}` }}
          >
            <div className="flex items-center justify-between text-xs font-bold border-b border-border/40 pb-3">
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-primary" />
                <span className="uppercase tracking-wider">Milestone Soundtrack</span>
              </span>
              <span className="opacity-60 capitalize">{embedData.type} Player</span>
            </div>
            <div className={`relative rounded-2xl overflow-hidden shadow-inner border border-white/5 mx-auto ${
              embedData.type === 'youtube' ? 'aspect-video w-full max-w-md' : 'w-full'
            }`}>
              <iframe
                src={embedData.embedUrl}
                width="100%"
                height={embedData.type === 'spotify' ? '152' : embedData.type === 'apple' ? '175' : '100%'}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-2xl"
              />
            </div>
          </motion.div>
        )}

        {initialMoment.selected_sections.letter && letterText && (
          <section className="space-y-4">
            <h3 className={`text-xs uppercase tracking-widest font-black text-center ${style.subText}`}>Personal Letter</h3>
            
            <AnimatePresence mode="wait">
              {!isLetterOpen ? (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  exit={{ opacity: 0, y: -12 }}
                  onClick={() => setIsLetterOpen(true)}
                  className={`p-10 rounded-[36px] bg-gradient-to-br from-[#fffdfc] to-[#faf7f2] border border-zinc-200 shadow-xl hover:shadow-2xl hover:scale-101 hover:border-rose-300 transition-all flex flex-col items-center justify-center space-y-6 cursor-pointer text-center relative overflow-hidden group`}
                  style={{ boxShadow: `0 15px 35px -10px rgba(225, 29, 72, 0.1)` }}
                >
                  {/* Subtle envelope layout overlay decoration */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400/40" />

                  {/* Virtual glass envelope seal with wax stamp */}
                  <div className="relative select-none">
                    <div className="w-18 h-18 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                      <Mail className="w-7 h-7 text-rose-500/25 fill-current" />
                    </div>
                    {/* Wax Stamp Seal */}
                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-rose-600 border-2 border-rose-700 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500 animate-pulse">
                      <Heart className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="space-y-1.5 z-10">
                    <h4 className="font-black text-zinc-900 text-lg">You have a personal wax-sealed letter!</h4>
                    <p className="text-xs text-zinc-500 font-semibold max-w-sm leading-normal">
                      Click directly on this virtual envelope to break the seal and read your customized tribute scroll.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.96, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="p-8 md:p-14 rounded-[36px] border border-[#e8e2d5] bg-gradient-to-br from-[#fffdfa] via-[#fffcf6] to-[#faf6ec] shadow-2xl relative overflow-hidden text-zinc-900"
                  style={{ boxShadow: `0 30px 70px -15px rgba(225, 29, 72, 0.15)` }}
                >
                  {/* Decorative golden filigree scroll accents */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400" />
                  
                  {/* Filigree corner SVG decorations */}
                  <svg className="absolute top-5 left-5 w-8 h-8 text-amber-500/20 fill-none stroke-current" viewBox="0 0 100 100">
                    <path d="M 0,0 L 30,0 C 15,15 15,30 0,30 L 0,0 Z" strokeWidth="3" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                  <svg className="absolute top-5 right-5 w-8 h-8 text-amber-500/20 fill-none stroke-current rotate-90" viewBox="0 0 100 100">
                    <path d="M 0,0 L 30,0 C 15,15 15,30 0,30 L 0,0 Z" strokeWidth="3" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>

                  <button 
                    onClick={() => setIsLetterOpen(false)}
                    className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-zinc-900/5 hover:bg-zinc-900/10 border border-zinc-200/60 text-zinc-600 hover:text-zinc-900 text-xs font-bold transition-all cursor-pointer shadow-sm z-10"
                  >
                    Fold Envelope
                  </button>

                  {/* Letter calligraphy body */}
                  <div className="space-y-6 text-base md:text-lg leading-relaxed text-left text-zinc-800 font-serif italic pt-8 whitespace-pre-line">
                    {letterText}
                  </div>
                  
                  {/* Signature row */}
                  <div className="text-right font-black text-zinc-950 text-xl border-t border-zinc-200/50 pt-5 mt-8 flex flex-col items-end">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block pb-1">Signed with devotion</span>
                    <span>— {initialMoment.sender_name}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* 5. MEMORY TIMELINE (Glowing vertical node journey) */}
        {initialMoment.selected_sections.timeline && initialMoment.ai_timeline && (
          <section className="space-y-8">
            <h3 className={`text-xs uppercase tracking-widest font-black text-center ${style.subText}`}>Memory Journey</h3>
            
            <div className="relative pl-7 border-l-2 border-primary/20 space-y-10 max-w-xl mx-auto">
              {/* Dynamic vertical glowing gradient track line */}
              <div className="absolute -left-[2px] top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-primary via-pink-500 to-amber-400" />

              {initialMoment.ai_timeline.map((item: { date?: string; title: string; description: string; icon?: string }, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Glowing pulsing node */}
                  <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs shadow-md transition-all group-hover:scale-110">
                    {item.icon}
                  </div>
                  
                  <div 
                    className={`p-6 rounded-[24px] ${style.cardBg} border shadow-md space-y-2 group-hover:-translate-y-1 transition-all duration-300`}
                    style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--color-primary)' }}
                  >
                    <span className={`text-[10px] font-black tracking-wider uppercase ${style.subText}`}>{item.date}</span>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs leading-relaxed opacity-85">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PHOTO GALLERY (Premium Masonry grid + Hover Polaroid overlays) */}
        {initialMoment.selected_sections.gallery && initialMedia.length > 0 && (
          <section className="space-y-6">
            <h3 className={`text-xs uppercase tracking-widest font-black text-center ${style.subText}`}>Masonry Gallery</h3>
            
            {/* Elegant multi-column masonry grid spacing */}
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {initialMedia.map((photo) => (
                <div 
                  key={photo.id}
                  onClick={() => setActivePhoto(photo.url)}
                  className="relative rounded-2xl border overflow-hidden bg-background break-inside-avoid shadow group cursor-zoom-in border-border/60 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <img src={photo.url} alt="Collage Photo" className="object-cover w-full h-auto" />
                  {/* Polaroid hover action */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. POEM SECTION */}
        {initialMoment.selected_sections.quotes && initialMoment.ai_poem && (
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-[32px] blur-xl opacity-30 pointer-events-none" />
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-8 md:p-12 rounded-[32px] ${style.cardBg} border shadow-lg text-center space-y-6 relative overflow-hidden`}
              style={{ boxShadow: `0 15px 35px -10px ${style.glowColor}` }}
            >
              <h3 className={`text-xs uppercase tracking-widest font-black ${style.subText}`}>A Custom Poem for You</h3>
              <p className="text-sm md:text-base leading-relaxed italic whitespace-pre-line font-serif leading-relaxed text-gradient-primary opacity-95">
                {initialMoment.ai_poem}
              </p>
            </motion.div>
          </section>
        )}

        {/* 8. QUOTES SECTION */}
        {initialMoment.selected_sections.quotes && initialMoment.ai_quotes && (
          <section className="space-y-6">
            <h3 className={`text-xs uppercase tracking-widest font-black text-center ${style.subText}`}>Meaningful Quotes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {initialMoment.ai_quotes.map((quote: { quote: string; author: string }, i: number) => (
                <div key={i} className={`p-6 rounded-2xl ${style.cardBg} border text-center space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-300 shadow-sm`}>
                  <p className="text-xs italic leading-relaxed">&quot;{quote.quote}&quot;</p>
                  <span className={`text-[9px] font-black uppercase tracking-wider block ${style.subText}`}>— {quote.author}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. SECRET MESSAGE REVEAL */}
        {initialMoment.secret_message && (
          <section className="text-center">
            <AnimatePresence mode="wait">
              {!secretRevealed ? (
                <button
                  onClick={() => {
                    setSecretRevealed(true);
                    confetti({ particleCount: 80, spread: 50 });
                  }}
                  className="px-6 py-3.5 rounded-full bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 mx-auto glowing-button"
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  Reveal Secret Message
                </button>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 max-w-md mx-auto`}
                >
                  <span className="text-[9px] uppercase font-bold text-rose-500 block mb-1">Secret Message</span>
                  <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{initialMoment.secret_message}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* 10. GUESTBOOK WIDGET */}
        {initialMoment.selected_sections.guestbook && (
          <section className={`p-6 md:p-8 rounded-[32px] ${style.cardBg} border shadow-lg space-y-6`} style={{ boxShadow: `0 15px 35px -10px ${style.glowColor}` }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <h3 className="text-lg font-bold">Wishes & Guestbook</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Leave your congratulations or sign the digital memory wall.</p>
              </div>
              
              {/* Reactions clicks */}
              <div className="flex gap-2">
                {[
                  { emoji: '❤️', type: 'heart', count: reactionCounts.heart },
                  { emoji: '👍', type: 'like', count: reactionCounts.like },
                  { emoji: '🎉', type: 'confetti', count: reactionCounts.confetti }
                ].map((react) => (
                  <button 
                    key={react.type}
                    onClick={() => triggerReaction(react.type as 'heart' | 'like' | 'confetti')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary border text-xs font-semibold hover:scale-102 transition-transform"
                  >
                    <span>{react.emoji}</span>
                    <span className="opacity-80">{react.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddGuestbookMessage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Leave a wish..."
                    value={guestMsg}
                    onChange={(e) => setGuestMsg(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingGuestbook}
                    aria-busy={isSubmittingGuestbook}
                    className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center shrink-0 transition-transform disabled:cursor-not-allowed disabled:opacity-70 hover:enabled:scale-102"
                  >
                    {isSubmittingGuestbook ? (
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* List entries styled as note lists */}
            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-2 scrollbar-none">
              {guestbook.map((entry: GuestbookItem, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-1 text-left relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{entry.name}</span>
                    <span className="opacity-55 text-[10px]">{formatDate(entry.created_at)}</span>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed text-left">{entry.message}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Share Modals Dialog Sheet */}
      <AnimatePresence>
        {isShareOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card rounded-t-[32px] p-8 z-50 border-t border-border space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Share Showcase</h3>
                <button onClick={() => setIsShareOpen(false)} className="p-1 rounded-full hover:bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Mock QR code container */}
                <div className="p-4 bg-white rounded-2xl w-40 h-40 flex items-center justify-center border border-border mx-auto shadow-sm">
                  <div className="w-full h-full bg-[radial-gradient(#000_30%,transparent_35%)] bg-[size:10px_10px] opacity-80" />
                </div>
                
                <p className="text-xs text-muted-foreground text-center">Scan QR code or click actions below to send your special webpage link.</p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled
                    value={`${window.location.origin}/m/${initialMoment.slug}`}
                    className="flex-1 bg-secondary text-xs px-4 py-3.5 rounded-2xl border text-muted-foreground truncate"
                  />
                  <div className="relative">
                    <AnimatePresence>
                      {copiedLink && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, x: "-50%", scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                          exit={{ opacity: 0, y: 8, x: "-50%", scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute bottom-full left-1/2 mb-2 px-2.5 py-1 rounded-md bg-zinc-950 text-white text-[11px] font-bold shadow-md whitespace-nowrap pointer-events-none z-50 flex items-center justify-center"
                          role="status"
                          aria-live="polite"
                        >
                          Copied!
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={handleCopyShareLink}
                      className="px-5 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Floating Quick-Share Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <div className="relative">
          <AnimatePresence>
            {quickCopied && (
              <motion.div
                initial={{ opacity: 0, y: 8, x: "-50%", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 8, x: "-50%", scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-full left-1/2 mb-3 px-2.5 py-1.5 rounded-md bg-zinc-950 text-white text-[11px] font-bold shadow-xl whitespace-nowrap pointer-events-none z-50 flex items-center justify-center"
                role="status"
                aria-live="polite"
              >
                Copied!
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950" />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={handleQuickShare}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/10 shadow-lg flex items-center justify-center transition-transform active:scale-95 text-foreground"
            aria-label="Share this moment"
          >
            <Share2 className="w-5.5 h-5.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
