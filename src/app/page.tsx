"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Heart, 
  GraduationCap, 
  Users, 
  Smile, 
  Music, 
  Shield, 
  MessageSquare, 
  Share2, 
  Check, 
  HelpCircle,
  Sparkle
} from 'lucide-react';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';
import LivePreview from '@/components/marketing/LivePreview';

const occasions = [
  { name: 'Birthdays', desc: 'Make them feel on top of the world with digital memories.', icon: Gift, color: 'text-pink-600 bg-pink-50 border-pink-100/80' },
  { name: 'Anniversaries', desc: 'Celebrate years of beautiful connection and love.', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-100/80' },
  { name: 'Friendships', desc: 'A gorgeous virtual monument to your favorite partner-in-crime.', icon: Users, color: 'text-amber-600 bg-amber-50 border-amber-100/80' },
  { name: 'Proposals', desc: 'The most romantic request, crafted with digital elegance.', icon: Sparkle, color: 'text-violet-600 bg-violet-50 border-violet-100/80' },
  { name: 'Graduations', desc: 'Toast to their major accomplishments and bright future.', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-100/80' },
  { name: 'Custom Moments', desc: 'Any milestone, achievement, or reason to smile.', icon: Smile, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/80' },
];

const features = [
  { title: 'Generative Storytelling Engine', desc: 'AI crafts bespoke letter outlines, romantic storylines, and milestone highlights based on your details.', icon: Sparkles },
  { title: 'Dynamic Music Synthesizer', desc: 'Paste standard music tracks from YouTube, Spotify, or Apple Music for native widget embedding.', icon: Music },
  { title: 'Frosted Guestbook & Reactions', desc: 'Guests leave real-time messages with virtual heart, confetti, or fireworks animations.', icon: MessageSquare },
  { title: 'Cinematic Particles Engine', desc: 'Breathe life into tributes with full-screen floating hearts, sparkling dust, or party confetti.', icon: Sparkle },
  { title: 'Privacy Lock & Revelations', desc: 'Inject secret messages and apply passcode lock systems for customized, secure viewing.', icon: Shield },
  { title: 'Instant QR & Viral Sharing', desc: 'Distribute beautiful share links, download custom QR plaques, and generate graphics instantly.', icon: Share2 }
];

const steps = [
  { step: '01', title: 'Choose Occasion', desc: 'Select from Birthday, Anniversary, Wedding, Proposal, or Custom.' },
  { step: '02', title: 'Detail the Magic', desc: 'Provide shared jokes, favorite dates, letters, and timelines.' },
  { step: '03', title: 'Select Custom Theme', desc: 'Choose a bespoke layout: Romantic, Cosmic, Slate, Luxury, or Cute.' },
  { step: '04', title: 'Compile & Share', desc: 'Deploy an emotional, shareable digital treasure in under 10 seconds.' }
];

const faqs = [
  { q: "How long does it take to compile a moment website?", a: "Under 10 seconds! Fill in the wizard details, select a theme, and click compile. Our engine designs, styles, and deploys the page instantly." },
  { q: "Is the generated website mobile-optimized?", a: "Absolutely. Every visual template is built mobile-first, ensuring an incredibly beautiful and fluid scrolling experience on any smartphone." },
  { q: "Can friends sign the guestbook or send custom wishes?", a: "Yes! Visitors can leave beautiful messages in the interactive guestbook card and trigger interactive confetti/heart bursts." },
  { q: "Is this free during early access?", a: "Yes! We are running an early access campaign where all premium visual themes, unlimited moments, and AI templates are 100% free." }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pt-20 selection:bg-violet-100 selection:text-violet-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#fdfcfa] via-[#faf9f6] to-[#f4f3f0]">
        {/* Fine-lined light grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        
        {/* Soft, warm ambient light blobs */}
        <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[550px] h-[300px] bg-gradient-to-r from-violet-200/50 to-pink-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-5 right-1/4 w-[400px] h-[250px] bg-gradient-to-r from-amber-100/40 to-rose-100/40 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200/85 bg-white shadow-sm text-xs font-bold tracking-wider uppercase text-violet-600"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-violet-500" /> Early Access Unlocked &bull; 100% Free
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7.5xl font-black tracking-tight max-w-5xl mx-auto leading-[1.08] text-zinc-900"
          >
            Turn Your Memories Into <br />
            <span className="text-gradient-primary">Beautiful Websites</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-600 text-lg md:text-xl max-w-2.5xl mx-auto leading-relaxed font-medium"
          >
            Create personalized, interactive tribute websites for the people you love. Perfect for birthdays, proposals, anniversaries, and graduation milestones.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              href="/signup" 
              className="glowing-button w-full sm:w-auto flex items-center justify-center gap-2.5 px-9 py-4.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#preview" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-200/80 bg-white hover:bg-zinc-50 font-semibold text-zinc-800 shadow-sm transition-all"
            >
              Watch Live Preview
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Preview Section */}
      <LivePreview />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white border-y border-zinc-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3.5 py-1 rounded-full">Simple Process</span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950">How It Works</h2>
            <p className="text-zinc-600 text-lg font-medium">
              Simple, intuitive, and lightning fast. Crafting custom websites has never been this emotional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-[32px] border border-zinc-100 bg-[#faf9f6]/40 backdrop-blur-sm space-y-4 hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/30 transition-all duration-300 group"
              >
                <span className="text-4xl font-black text-gradient-primary opacity-60 block group-hover:scale-105 transition-transform duration-300">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasion Templates */}
      <section id="templates" className="py-24 bg-[#faf9f6]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3.5 py-1 rounded-full">Bespoke Layouts</span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950">Templates for Every Moment</h2>
            <p className="text-zinc-600 text-lg font-medium">
              Curated storytelling flows and interaction systems designed for your specific milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {occasions.map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-[32px] border border-zinc-200/50 bg-white hover:border-violet-200 hover:shadow-xl hover:shadow-zinc-200/30 transition-all flex flex-col justify-between h-60 duration-300"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">{item.name}</h3>
                    <p className="text-sm text-zinc-600 font-medium mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary group cursor-pointer pt-2">
                  <span>Explore Template</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3.5 py-1 rounded-full">Feature Rich</span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950">Dynamic Emotional Features</h2>
            <p className="text-zinc-600 text-lg font-medium">
              Add beautiful widgets that turn simple static pages into deeply moving memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-[32px] border border-zinc-100 bg-[#faf9f6]/40 hover:bg-white hover:border-violet-200 hover:shadow-xl hover:shadow-zinc-200/30 transition-all duration-300 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Marked as early access campaign */}
      <section id="pricing" className="py-24 bg-[#faf9f6]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3.5 py-1 rounded-full">Early Launch</span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950">Lifetime Pro Special Campaign</h2>
            <p className="text-zinc-600 text-lg font-medium">
              Join during our initial launch window! Secure lifetime premium Pro status, completely free.
            </p>
          </div>

          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-500 rounded-[36px] blur opacity-15 group-hover:opacity-25 transition duration-1000" />
            <div className="relative p-10 rounded-[36px] border border-zinc-200 bg-white shadow-xl flex flex-col justify-between text-center space-y-8">
              <div className="space-y-2">
                <span className="px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-xs font-bold text-violet-600 uppercase tracking-widest">
                  Early Adopter Special
                </span>
                <h3 className="text-2xl font-black text-zinc-900 pt-2">Lifetime Pro Membership</h3>
                <p className="text-zinc-500 text-xs font-semibold">Everything unlocked at ₹0 (Early Adopter Price)</p>
              </div>

              <div className="space-y-1">
                <span className="text-5xl font-black text-zinc-950">₹0</span>
                <span className="text-zinc-500 text-sm font-bold"> / lifetime access</span>
              </div>

              <ul className="space-y-4 text-left text-sm text-zinc-600 font-semibold mx-auto max-w-xs">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Create unlimited moment websites</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Full AI storytelling & letter drafting</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>All premium styles (Romantic, Cosmic)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>High-fidelity media photo uploads</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Interactive Music embeds & guestbook</span>
                </li>
              </ul>

              <Link 
                href="/signup" 
                className="glowing-button py-4 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md text-sm text-center"
              >
                Claim Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Parallax / Flowing Carousel Inspiration */}
      <section className="py-24 bg-white border-y border-zinc-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3.5 py-1 rounded-full">Shared Joy</span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950">Loved by Creators & Recipients</h2>
            <p className="text-zinc-600 text-lg font-medium">
              Read how MomentsAI helped weave beautiful, unforgettable milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] border border-zinc-100 bg-[#faf9f6]/40 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/20 transition-all duration-300 flex flex-col justify-between">
              <p className="text-sm leading-relaxed text-zinc-700 font-medium italic">
                &quot;I generated a surprise tribute for my parents&apos; 30th anniversary. Seeing their reaction to the compiled memories timeline and old photos was completely priceless. The best surprise ever!&quot;
              </p>
              <div className="flex items-center gap-3.5 pt-6 border-t border-zinc-100 mt-6">
                <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-black border border-violet-100">R</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Rhea Shah</h4>
                  <span className="text-xs text-zinc-500 font-semibold">Created for Parents</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] border border-zinc-100 bg-[#faf9f6]/40 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/20 transition-all duration-300 flex flex-col justify-between">
              <p className="text-sm leading-relaxed text-zinc-700 font-medium italic">
                &quot;My fiancée cried when I sent her this proposal website. The Cosmic theme with the countdown timer, embedded music track, and letter timeline of our story was absolutely magical.&quot;
              </p>
              <div className="flex items-center gap-3.5 pt-6 border-t border-zinc-100 mt-6">
                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-black border border-pink-100">M</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Maya & Kabir</h4>
                  <span className="text-xs text-zinc-500 font-semibold">Created Proposal Site</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] border border-zinc-100 bg-[#faf9f6]/40 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/20 transition-all duration-300 flex flex-col justify-between">
              <p className="text-sm leading-relaxed text-zinc-700 font-medium italic">
                &quot;We made a collaborative farewell wall for our college group using the guestbook reactions. It was incredibly clean, easy to load on mobile, and brought back all our inside jokes.&quot;
              </p>
              <div className="flex items-center gap-3.5 pt-6 border-t border-zinc-100 mt-6">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-black border border-amber-100">N</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Nikhil Sharma</h4>
                  <span className="text-xs text-zinc-500 font-semibold">Created for Farewell</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#faf9f6]/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 px-3.5 py-1 rounded-full">Common Queries</span>
            <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-zinc-950">Frequently Asked Questions</h2>
            <p className="text-zinc-600 text-lg font-medium">Everything you need to know about crafting your moment.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-zinc-200 bg-white flex gap-4 text-left shadow-sm"
              >
                <HelpCircle className="w-6 h-6 text-violet-500 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h3 className="font-bold text-zinc-900 text-base">{item.q}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#faf9f6] to-[#f4f3f0] border-t border-zinc-100 relative overflow-hidden text-center">
        {/* Soft atmospheric light radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5.5xl font-black tracking-tight leading-tight text-zinc-950">
            Ready to Turn Your Memories <br />
            Into a Stunning Web Showcase?
          </h2>
          <p className="text-zinc-600 text-base max-w-xl mx-auto leading-relaxed font-medium">
            Create an emotional, shareable digital treasure in under a minute. No coding required, absolute simplicity, premium design results.
          </p>
          <div className="pt-4">
            <Link 
              href="/signup" 
              className="glowing-button inline-flex items-center gap-2.5 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 font-bold text-white shadow-xl hover:scale-102 transition-transform"
            >
              Generate Your Moment Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
