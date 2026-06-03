"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  interface DashboardUserProfile {
    full_name: string | null;
    plan_type: string;
    avatar_url?: string | null;
  }

  const [profile, setProfile] = useState<DashboardUserProfile | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data || { full_name: user.email?.split('@')[0], plan_type: 'free' });
      }
    }
    loadProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'My Tributes', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Moment', href: '/generator', icon: PlusCircle },
    { name: 'Analytics Board', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Pro Subscriptions', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Studio Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6]/40 flex flex-col md:flex-row text-zinc-900 selection:bg-violet-100 selection:text-violet-900">
      {/* Mobile top bar */}
      <header className="md:hidden h-18 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-gradient-primary">MomentsAI</span>
        </Link>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-76 border-r border-zinc-200/60 flex-col bg-white backdrop-blur-md justify-between p-6 shrink-0 relative">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2 group px-2 pt-2">
            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-md group-hover:scale-103 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gradient-primary">MomentsAI</span>
          </Link>

          <nav className="space-y-1.5 pt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 relative group ${
                    isActive 
                      ? 'bg-[#8b5cf6] text-white shadow-md shadow-[#8b5cf6]/20' 
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sandbox Promotion Info */}
        <div className="space-y-4 pt-6 border-t border-zinc-100">
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-wider">Early-Access Mode</span>
            </div>
            <p className="text-[9px] leading-normal text-zinc-500 font-semibold">
              Your lifetime Pro membership is fully active and synchronized!
            </p>
          </div>

          {profile && (
            <div className="flex items-center gap-3 px-1.5">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-black border border-violet-100 shrink-0 shadow-sm">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-zinc-800 truncate leading-snug">{profile.full_name || 'Creator'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black uppercase tracking-widest leading-none">
                    Pro Member
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black z-40"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-18 left-0 bottom-0 w-72 bg-white border-r border-zinc-200 z-50 p-6 flex flex-col justify-between"
            >
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-4.5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                        isActive 
                          ? 'bg-[#8b5cf6] text-white shadow-md' 
                          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="space-y-4 pt-6 border-t border-zinc-200">
                {profile && (
                  <div className="flex items-center gap-3 px-1.5">
                    <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-black border border-violet-100 shrink-0">
                      {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 truncate">{profile.full_name || 'Creator'}</p>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black uppercase">Pro Member</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-4.5 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-500/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Dashboard Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
