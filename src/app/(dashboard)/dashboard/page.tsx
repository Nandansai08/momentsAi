"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsChart from '@/components/AnalyticsChart';
import { 
  Plus, 
  ExternalLink, 
  Trash2, 
  Eye, 
  Sparkles,
  Copy,
  Check,
  Globe,
  Search,
  Users,
  Compass,
  Lock,
  Calendar,
  Clock
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const DASHBOARD_TOUR_STORAGE_KEY = "momentsai_dashboard_tour_dismissed";

export default function MyWebsitesPage() {
  const supabase = createClient();
  interface MomentItem {
    id: string;
    occasion: string;
    slug: string;
    recipient_name: string;
    sender_name: string;
    custom_title?: string;
    event_date?: string;
    created_at: string;
    is_password_protected?: boolean;
    theme_slug?: string;
    analytics?: Array<{
      views: number;
      unique_visitors: number;
    }>;
  }

  const [moments, setMoments] = useState<MomentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [occasionFilter, setOccasionFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; slug: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DASHBOARD_TOUR_STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTour = () => {
    localStorage.setItem(DASHBOARD_TOUR_STORAGE_KEY, "true");
    setShowTour(false);
  };

  useEffect(() => {
    async function loadUserMoments() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch moments and count joins or views from analytics
        const { data, error } = await supabase
          .from('moments')
          .select('*, analytics(views, unique_visitors)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMoments(data || []);
      } catch (err) {
        console.error("Error loading moments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserMoments();
  }, [supabase]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deleteTarget && !isDeleting) {
        setDeleteTarget(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteTarget, isDeleting]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('moments')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;
      setMoments(prev => prev.filter(m => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete moment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/m/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Calculate executive KPI aggregates
  const totalTributes = moments.length;
  const totalViews = moments.reduce((sum, m) => sum + (m.analytics?.[0]?.views || 0), 0);
  const totalVisitors = moments.reduce((sum, m) => sum + (m.analytics?.[0]?.unique_visitors || 0), 0);

  // Filter moments list
  const filteredMoments = moments.filter(m => {
    const matchesSearch = 
      (m.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.custom_title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.slug?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = occasionFilter === 'all' || m.occasion === occasionFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-3.5xl font-black tracking-tight text-foreground">Creator Studio Dashboard</h1>
          <p className="text-muted-foreground text-sm font-semibold">
            Track analytics, edit settings, and manage generated websites.
          </p>
        </div>
        <div className="relative inline-block">
          <Link 
            href="/generator" 
            className="glowing-button flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md hover:shadow-lg transition-all text-sm shrink-0 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Create New Moment
          </Link>
          
          <AnimatePresence>
            {showTour && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                role="status"
                aria-live="polite"
                className="absolute top-full mt-3 right-0 z-30 w-72 rounded-3xl border border-zinc-200/80 bg-white/95 backdrop-blur-md shadow-xl p-4 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto"
              >
                <div className="space-y-3 text-left">
                  <h3 className="font-black text-zinc-950 text-base leading-snug">
                    Welcome to MomentsAI 👋
                  </h3>
                  <p className="text-zinc-500 text-xs font-semibold leading-relaxed">
                    Start by clicking Create New Moment to launch the guided wizard and build a personalized memory website.
                  </p>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      onClick={dismissTour}
                      className="text-zinc-500 hover:text-zinc-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Skip Tour
                    </button>
                    <button
                      onClick={dismissTour}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Analytics KPI Aggregates Card Deck */}
      {!loading && moments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[28px] border border-border/70 bg-card shadow-sm shadow-border/50 dark:shadow-none flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Total Tributes Created</span>
              <p className="text-3.5xl font-black text-foreground">{totalTributes}</p>
              <span className="text-[10px] text-emerald-600 font-bold block">100% active deployment</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900/50 shadow-inner">
              <Compass className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="p-6 rounded-[28px] border border-border/70 bg-card shadow-sm shadow-border/50 dark:shadow-none flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Accumulated Page Views</span>
              <p className="text-3.5xl font-black text-foreground">{totalViews}</p>
              <span className="text-[10px] text-violet-600 font-bold block">+12.4% traffic this week</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 flex items-center justify-center border border-pink-100 dark:border-pink-900/50 shadow-inner">
              <Eye className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="p-6 rounded-[28px] border border-border/70 bg-card shadow-sm shadow-border/50 dark:shadow-none flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Unique Visitors Reach</span>
              <p className="text-3.5xl font-black text-foreground">{totalVisitors}</p>
              <span className="text-[10px] text-amber-600 font-bold block">High engagement rate</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/50 shadow-inner">
              <Users className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>
      )}
{/* Visit Trends (Last 7 Days) */}
<h2 className="text-2xl font-bold mt-6 mb-2 text-zinc-900">Visit Trends (Last 7 Days)</h2>
<AnalyticsChart />

      {/* Filter and Search Bar Workspace */}
      {!loading && moments.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-5 rounded-[24px] border border-border bg-card shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4.5 h-4.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by recipient or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium text-foreground"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <span className="text-xs font-bold text-muted-foreground uppercase select-none">Filter Occasion:</span>
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-muted border border-border/80 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
            >
              <option value="all">All Occasions</option>
              <option value="birthday">Birthdays</option>
              <option value="anniversary">Anniversaries</option>
              <option value="proposal">Proposals</option>
              <option value="friendship">Friendships</option>
              <option value="graduation">Graduations</option>
              <option value="farewell">Farewells</option>
              <option value="wedding">Weddings</option>
              <option value="mothers_day">Mother&apos;s Day</option>
              <option value="fathers_day">Father&apos;s Day</option>
              <option value="custom">Custom Moments</option>
            </select>
          </div>
        </div>
      )}

      {/* Main Workspace Contents */}
      {loading ? (
        <DashboardSkeleton />
      ) : moments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 text-center rounded-[36px] border border-border/50 bg-card/45 dark:bg-zinc-900/35 shadow-xl shadow-border/5 dark:shadow-none backdrop-blur-md max-w-xl mx-auto mt-6 space-y-6 relative overflow-hidden"
        >
          {/* Ambient blurred gradient glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none select-none" aria-hidden="true" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none select-none" aria-hidden="true" />

          {/* Decorative floating icons */}
          <div className="absolute top-6 left-8 text-violet-500/10 dark:text-violet-400/10 pointer-events-none select-none" aria-hidden="true">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-10 right-10 text-pink-500/10 dark:text-pink-400/10 pointer-events-none select-none" aria-hidden="true">
            <Sparkles className="w-10 h-10" />
          </div>

          {/* Upgraded focal point icon container */}
          <div className="w-20 h-20 rounded-3xl bg-violet-600/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20 dark:border-violet-400/20 shadow-lg relative z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-pink-500/20 rounded-3xl blur-md opacity-50 pointer-events-none select-none" aria-hidden="true" />
            <Sparkles className="w-10 h-10 text-violet-500 relative z-10" aria-hidden="true" />
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black text-foreground">No Moments Created Yet</h3>
            <p className="text-muted-foreground text-sm font-semibold max-w-sm mx-auto leading-relaxed">
              Start creating beautiful memory websites for birthdays, anniversaries, proposals, and life&apos;s most meaningful milestones.
            </p>
          </div>

          <Link 
            href="/generator" 
            className="glowing-button inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md hover:shadow-lg hover:scale-102 transition-all text-sm shrink-0 cursor-pointer relative z-10"
          >
            Create New Moment
            <Plus className="w-4.5 h-4.5" />
          </Link>
        </motion.div>
      ) : filteredMoments.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] border border-dashed border-border text-muted-foreground text-sm font-bold bg-card">
          No websites matched your search filter parameters.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredMoments.map((moment) => {
            const views = moment.analytics?.[0]?.views || 0;
            
            return (
              <motion.div 
                key={moment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6.5 rounded-[32px] border border-border/80 bg-card hover:border-violet-500/40 hover:shadow-xl hover:shadow-border/10 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col justify-between h-[300px] relative overflow-hidden"
              >
                <div>
                  {/* Occasion tag & views analytics */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50 text-[10px] font-black uppercase tracking-wider">
                      {moment.occasion === 'mothers_day' ? "Mother's Day" : moment.occasion === 'fathers_day' ? "Father's Day" : moment.occasion}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1 bg-muted border border-border px-2.5 py-1 rounded-lg">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <span>{views} Views</span>
                      </span>
                    </div>
                  </div>

                  {/* Recipient Header */}
                  <h3 className="text-xl font-black mt-4.5 leading-snug text-foreground truncate">
                    {moment.custom_title || `To ${moment.recipient_name}`}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1 text-[11px] font-semibold text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                      <span>Event Date: {moment.event_date ? formatDate(moment.event_date) : 'No Milestone Date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                      <span>Created: {formatDate(moment.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Slug display & lock tags */}
                <div className="flex flex-wrap gap-2 py-3.5 border-y border-border/60 text-[11px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-muted border border-border px-2.5 py-1 rounded-lg">
                    <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate max-w-[200px] text-foreground">/m/{moment.slug}</span>
                  </span>
                  {moment.is_password_protected && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 dark:border-amber-500/20">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                  {moment.theme_slug && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 capitalize">
                      Theme: {moment.theme_slug}
                    </span>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/m/${moment.slug}`}
                      target="_blank"
                      className="p-2.5 rounded-xl border border-border hover:bg-secondary hover:border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="View Live Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Preview</span>
                    </Link>
                    <button 
                      onClick={() => handleCopyLink(moment.slug)}
                      className="p-2.5 rounded-xl border border-border hover:bg-secondary hover:border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                      title="Copy Shareable Link"
                    >
                      {copiedSlug === moment.slug ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button 
                    onClick={() => setDeleteTarget({ id: moment.id, slug: moment.slug })}
                    className="p-2.5 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Website"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isDeleting) setDeleteTarget(null);
              }}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/50 bg-card/75 p-6 shadow-2xl backdrop-blur-md z-10 text-foreground"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-inner">
                  <Trash2 className="w-6 h-6" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-foreground">Delete Moment?</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Are you sure you want to delete this moment? This action is irreversible and will permanently delete the website at:
                  </p>
                  <div className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-bold text-foreground">
                    /m/{deleteTarget.slug}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full pt-2">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-secondary hover:border-border text-muted-foreground hover:text-foreground transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleConfirmDelete}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
