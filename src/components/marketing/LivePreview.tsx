"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, Calendar, Music, Gift, Send } from 'lucide-react';

interface PreviewOccasion {
  name: string;
  recipient: string;
  sender: string;
  relationship: string;
  date: string;
  title: string;
  message: string;
  timeline: Array<{ title: string; desc: string; emoji: string }>;
  quote: string;
  author: string;
}

const previewData: Record<string, PreviewOccasion> = {
  birthday: {
    name: "Sarah",
    recipient: "Sarah",
    sender: "Alex",
    relationship: "best friend",
    date: "June 15",
    title: "To my favorite person in the universe! ✨",
    message: "Thank you for the late night laughs, coffee runs, and endless support. You make the world brighter just by being in it. Happy Birthday!",
    timeline: [
      { title: "First Met in High School", desc: "Bonded over a spilled coffee", emoji: "☕" },
      { title: "Our Road Trip to Goa", desc: "Screaming songs at midnight", emoji: "🚗" },
      { title: "Moving to the City", desc: "First roommates and flat warming", emoji: "🔑" },
      { title: "Celebrating You Today!", desc: "Cheers to another amazing year", emoji: "🎉" }
    ],
    quote: "A single rose can be my garden... a single friend, my world.",
    author: "Leo Buscaglia"
  },
  anniversary: {
    name: "Mom & Dad",
    recipient: "Mom & Dad",
    sender: "Rohan",
    relationship: "parents",
    date: "December 28",
    title: "Celebrating 30 Years of Pure Love ❤️",
    message: "Thank you for showing us what unconditional love, patience, and partnership truly looks like. Happy 30th Anniversary!",
    timeline: [
      { title: "The Wedding Day (1996)", desc: "A beautiful winter wedding", emoji: "💒" },
      { title: "Starting Our Family", desc: "Unwavering support through early years", emoji: "🏡" },
      { title: "30 Years Strong", desc: "Countless adventures and endless devotion", emoji: "💍" }
    ],
    quote: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn"
  },
  proposal: {
    name: "Maya",
    recipient: "Maya",
    sender: "Kabir",
    relationship: "soulmate",
    date: "Today",
    title: "My favorite story is the one we write together 💍",
    message: "From our very first date to this exact moment, I knew I wanted to spend every single chapter of my life by your side. Will you marry me?",
    timeline: [
      { title: "The Coffee Date", desc: "We talked for 4 hours straight", emoji: "☕" },
      { title: "First Vacation Together", desc: "Chasing sunsets in Himachal", emoji: "🏔️" },
      { title: "Adopting Coco", desc: "Our little family grew by four paws", emoji: "🐾" }
    ],
    quote: "Whatever our souls are made of, his and mine are the same.",
    author: "Emily Brontë"
  }
};

const themes = {
  romantic: {
    name: "Romantic Rose",
    bg: "bg-gradient-to-b from-rose-50 to-pink-100",
    cardBg: "bg-white/85 border-rose-100 shadow-sm",
    text: "text-rose-950",
    subText: "text-rose-600",
    accent: "bg-rose-500 text-white",
    font: "font-serif",
    iconColor: "text-rose-500"
  },
  cosmic: {
    name: "Cosmic Dream",
    bg: "bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950",
    cardBg: "bg-white/10 backdrop-blur-md border-white/10",
    text: "text-white",
    subText: "text-indigo-200",
    accent: "bg-indigo-500 text-white",
    font: "font-sans",
    iconColor: "text-indigo-400"
  },
  modern: {
    name: "Modern Minimal",
    bg: "bg-gradient-to-b from-zinc-50 to-zinc-200",
    cardBg: "bg-white/90 border-zinc-200 shadow-sm",
    text: "text-zinc-900",
    subText: "text-zinc-500",
    accent: "bg-zinc-800 text-white",
    font: "font-mono",
    iconColor: "text-zinc-600"
  }
};

type OccasionKey = 'birthday' | 'anniversary' | 'proposal';
type ThemeKey = 'romantic' | 'cosmic' | 'modern';

export default function LivePreview() {
  const [occasion, setOccasion] = useState<OccasionKey>('birthday');
  const [themeName, setThemeName] = useState<ThemeKey>('romantic');

  const activeOccasion = previewData[occasion];
  const activeTheme = themes[themeName];

  return (
    <section id="preview" className="py-24 relative overflow-hidden bg-white border-y border-zinc-100">
      {/* Delicate background gradients */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-violet-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-pink-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-xs font-bold tracking-wider uppercase text-violet-600">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Studio Preview
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
            See the Magic In Action
          </h2>
          <p className="text-zinc-600 text-lg font-medium">
            Toggle milestones and visual styles to watch the dynamically generated website adapt in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Controls - Left side */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 pl-1">1. Choose Occasion</h3>
              <div className="flex flex-col gap-3">
                {(Object.keys(previewData) as OccasionKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setOccasion(key)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      occasion === key
                        ? 'bg-violet-500/5 border-violet-500 shadow-lg shadow-violet-500/5 text-violet-950 font-bold'
                        : 'border-zinc-200/85 bg-[#faf9f6]/40 hover:bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-semibold capitalize">{key}</span>
                      <p className="text-[10px] opacity-75 mt-0.5 font-medium">Tribute page for {previewData[key].name}</p>
                    </div>
                    {occasion === key && <Star className="w-4 h-4 text-violet-600 fill-violet-600" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 pl-1">2. Toggle Theme Styles</h3>
              <div className="flex flex-col gap-3">
                {(Object.keys(themes) as ThemeKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setThemeName(key)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      themeName === key
                        ? 'bg-pink-500/5 border-pink-500 shadow-lg shadow-pink-500/5 text-pink-950 font-bold'
                        : 'border-zinc-200/85 bg-[#faf9f6]/40 hover:bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-semibold">{themes[key].name}</span>
                      <p className="text-[10px] opacity-75 mt-0.5 font-medium">Premium visual template preset</p>
                    </div>
                    {themeName === key && <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Device Mockup - Right side */}
          <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
            <div className="relative w-[340px] h-[670px] rounded-[52px] border-[12px] border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col ring-8 ring-zinc-100">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6.5 bg-zinc-900 rounded-b-2xl z-40 flex items-center justify-center">
                <div className="w-14 h-1 bg-zinc-950 rounded-full" />
              </div>

              {/* Dynamic Simulated Website Inside Phone Viewport */}
              <div className={`flex-1 overflow-y-auto ${activeTheme.bg} ${activeTheme.font} pt-12 pb-8 scrollbar-none relative`}>
                
                {/* Simulated Floating Background Particles */}
                {themeName === 'romantic' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
                    <Heart className="absolute w-4 h-4 text-rose-400 top-1/4 left-1/4 animate-float" />
                    <Heart className="absolute w-3 h-3 text-pink-400 top-1/2 right-1/4 animate-float-slow" />
                  </div>
                )}
                {themeName === 'cosmic' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-0">
                    <Sparkles className="absolute w-4 h-4 text-amber-200 top-1/3 right-1/3 animate-pulse" />
                    <Star className="absolute w-3 h-3 text-indigo-300 bottom-1/4 left-1/3 animate-sparkle" />
                  </div>
                )}

                <div className="relative z-10 px-5 space-y-6">
                  {/* Hero Block */}
                  <motion.div 
                    layout
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    className="text-center pt-6 pb-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center mb-3.5 border border-white/20 shadow-inner">
                      {occasion === 'birthday' ? <Gift className={`w-5 h-5 ${activeTheme.iconColor}`} /> : <Heart className={`w-5 h-5 ${activeTheme.iconColor} fill-current`} />}
                    </div>
                    <span className={`text-[10px] uppercase tracking-widest font-black ${activeTheme.subText}`}>
                      {occasion === 'birthday' ? 'Happy Birthday' : occasion === 'anniversary' ? 'Happy Anniversary' : 'Special Tribute'}
                    </span>
                    <h1 className={`text-2xl font-black tracking-tight mt-1 leading-tight ${activeTheme.text}`}>
                      {activeOccasion.title}
                    </h1>
                    <div className={`mt-3.5 flex items-center justify-center gap-1.5 text-[10px] font-bold ${activeTheme.subText}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{activeOccasion.date}</span>
                    </div>
                  </motion.div>

                  {/* Narrative Block */}
                  <motion.div 
                    layout
                    className={`p-5 rounded-3xl ${activeTheme.cardBg} border space-y-2`}
                  >
                    <h3 className={`text-[10px] uppercase tracking-widest font-black ${activeTheme.subText}`}>Our Story</h3>
                    <p className={`text-xs leading-relaxed opacity-95 font-medium ${activeTheme.text}`}>
                      {activeOccasion.message}
                    </p>
                  </motion.div>

                  {/* Timeline Block */}
                  <motion.div 
                    layout
                    className={`p-5 rounded-3xl ${activeTheme.cardBg} border space-y-4`}
                  >
                    <h3 className={`text-[10px] uppercase tracking-widest font-black ${activeTheme.subText}`}>Memory Road</h3>
                    <div className="relative pl-4 border-l border-zinc-200/50 space-y-5">
                      {activeOccasion.timeline.map((item, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline bullet */}
                          <div className="absolute -left-[23px] top-0.5 w-[14px] h-[14px] rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[8px] shadow-sm">
                            {item.emoji}
                          </div>
                          <span className={`text-[10px] font-bold block ${activeTheme.text}`}>{item.title}</span>
                          <p className={`text-[9px] opacity-75 mt-0.5 font-medium ${activeTheme.text}`}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quotes Card */}
                  <motion.div 
                    layout
                    className={`p-5 rounded-3xl ${activeTheme.cardBg} border text-center space-y-2.5 relative overflow-hidden`}
                  >
                    <div className={`absolute -right-2 -bottom-2 text-6xl font-serif font-black opacity-5 ${activeTheme.text}`}>“</div>
                    <p className={`text-xs italic leading-relaxed font-serif relative z-10 ${activeTheme.text}`}>
                      &quot;{activeOccasion.quote}&quot;
                    </p>
                    <p className={`text-[9px] font-bold tracking-widest relative z-10 uppercase ${activeTheme.subText}`}>
                      — {activeOccasion.author}
                    </p>
                  </motion.div>

                  {/* Music Floating Disk Widget */}
                  <div className={`flex items-center justify-between p-3.5 rounded-2xl ${activeTheme.cardBg} border`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center animate-spin-slow shadow-lg border border-white/10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fdfcfa]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold truncate max-w-[120px]">Background Music</p>
                        <p className="text-[8px] opacity-60 font-medium">Click to Play</p>
                      </div>
                    </div>
                    <button className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors">
                      <Music className="w-3.5 h-3.5 text-zinc-600" />
                    </button>
                  </div>

                  {/* Guestbook Card */}
                  <motion.div 
                    layout
                    className={`p-5 rounded-3xl ${activeTheme.cardBg} border space-y-3.5`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className={`text-[10px] uppercase tracking-widest font-black ${activeTheme.subText}`}>Guestbook</h3>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">Live</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-black/5 border border-black/5 flex gap-2.5 items-start text-left">
                        <div 
                          className="w-6.5 h-6.5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border shadow-sm bg-pink-500/10 text-pink-600 border-pink-200/30 backdrop-blur-md dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/30"
                          aria-label="Rhea's Avatar"
                        >
                          <span aria-hidden="true">R</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-zinc-900 dark:text-white truncate">Rhea</span>
                            <span className="text-[8px] opacity-50 font-medium shrink-0 pl-2">Just now</span>
                          </div>
                          <p className="text-[9px] opacity-80 font-medium leading-relaxed">This is absolutely beautiful! Crying so much, love you!</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 pt-1">
                      <input 
                        type="text" 
                        disabled 
                        placeholder="Leave a wish..." 
                        className="flex-1 bg-black/5 border border-transparent text-[9px] px-3 py-1.5 rounded-lg focus:outline-none placeholder-zinc-400 font-medium"
                      />
                      <button disabled className="p-1.5 rounded-lg bg-[#8b5cf6] text-white cursor-not-allowed">
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
