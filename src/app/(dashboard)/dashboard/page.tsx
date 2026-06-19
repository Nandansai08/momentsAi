"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

  const handleDeleteMoment = async (id: string) => {
    if (!confirm("Are you absolutely sure you want to delete this website? This action is irreversible.")) return;

    try {
      const { error } = await supabase
        .from('moments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMoments(moments.filter(m => m.id !== id));
    } catch {
      alert("Failed to delete moment. Please try again.");
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
          <h1 className="text-3.5xl font-black tracking-tight text-zinc-950">Creator Studio Dashboard</h1>
          <p className="text-zinc-500 text-sm font-semibold">
            Track analytics, edit settings, and manage generated websites.
          </p>
        </div>
        <Link 
          href="/generator" 
          className="glowing-button flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold shadow-md hover:shadow-lg transition-all text-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          Create New Moment
        </Link>
      </div>

      {/* Dynamic Analytics KPI Aggregates Card Deck */}
      {!loading && moments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[28px] border border-zinc-200/70 bg-white shadow-sm shadow-zinc-100 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Total Tributes Created</span>
              <p className="text-3.5xl font-black text-zinc-950">{totalTributes}</p>
              <span className="text-[10px] text-emerald-600 font-bold block">100% active deployment</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-inner">
              <Compass className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="p-6 rounded-[28px] border border-zinc-200/70 bg-white shadow-sm shadow-zinc-100 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Accumulated Page Views</span>
              <p className="text-3.5xl font-black text-zinc-950">{totalViews}</p>
              <span className="text-[10px] text-violet-600 font-bold block">+12.4% traffic this week</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100 shadow-inner">
              <Eye className="w-5.5 h-5.5" />
            </div>
          </div>

          <div className="p-6 rounded-[28px] border border-zinc-200/70 bg-white shadow-sm shadow-zinc-100 flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Unique Visitors Reach</span>
              <p className="text-3.5xl font-black text-zinc-950">{totalVisitors}</p>
              <span className="text-[10px] text-amber-600 font-bold block">High engagement rate</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-inner">
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
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-5 rounded-[24px] border border-zinc-200 bg-white shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by recipient or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <span className="text-xs font-bold text-zinc-400 uppercase select-none">Filter Occasion:</span>
            <select
              value={occasionFilter}
              onChange={(e) => setOccasionFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-72 rounded-[32px] border border-zinc-200 bg-white animate-pulse" />
          ))}
        </div>
      ) : moments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center rounded-[36px] border border-zinc-200 bg-white shadow-xl max-w-xl mx-auto mt-6 space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto border border-violet-100 shadow-inner">
            <Sparkles className="w-8 h-8 text-violet-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-zinc-950">No Websites Created Yet</h3>
            <p className="text-zinc-500 text-sm font-semibold max-w-sm mx-auto leading-relaxed">
              Create a personalized, interactive tribute site for an anniversary, proposal, or birthday in under 10 seconds!
            </p>
          </div>
          <Link 
            href="/generator" 
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8b5cf6] text-white font-bold text-sm shadow-md hover:scale-102 hover:shadow-lg transition-all"
          >
            Create Your First Tribute
            <Plus className="w-4.5 h-4.5" />
          </Link>
        </motion.div>
      ) : filteredMoments.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] border border-dashed border-zinc-200 text-zinc-400 text-sm font-bold bg-white">
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
                className="p-6.5 rounded-[32px] border border-zinc-200/80 bg-white hover:border-violet-200 hover:shadow-xl hover:shadow-zinc-200/30 transition-all duration-300 flex flex-col justify-between h-[300px] relative overflow-hidden"
              >
                <div>
                  {/* Occasion tag & views analytics */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-100 text-[10px] font-black uppercase tracking-wider">
                      {moment.occasion === 'mothers_day' ? "Mother's Day" : moment.occasion === 'fathers_day' ? "Father's Day" : moment.occasion}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                      <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-lg">
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{views} Views</span>
                      </span>
                    </div>
                  </div>

                  {/* Recipient Header */}
                  <h3 className="text-xl font-black mt-4.5 leading-snug text-zinc-950 truncate">
                    {moment.custom_title || `To ${moment.recipient_name}`}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1 text-[11px] font-semibold text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Event Date: {moment.event_date ? formatDate(moment.event_date) : 'No Milestone Date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Created: {formatDate(moment.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Slug display & lock tags */}
                <div className="flex flex-wrap gap-2 py-3.5 border-y border-zinc-100 text-[11px] font-bold text-zinc-500">
                  <span className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-150 px-2.5 py-1 rounded-lg">
                    <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate max-w-[200px]">/m/{moment.slug}</span>
                  </span>
                  {moment.is_password_protected && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/5 text-amber-600 border border-amber-500/10">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                  {moment.theme_slug && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 capitalize">
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
                      className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="View Live Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Preview</span>
                    </Link>
                    <button 
                      onClick={() => handleCopyLink(moment.slug)}
                      className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
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
                    onClick={() => handleDeleteMoment(moment.id)}
                    className="p-2.5 rounded-xl text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
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
    </div>
  );
}
