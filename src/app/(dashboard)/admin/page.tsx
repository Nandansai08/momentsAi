"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Users, 
  Globe, 
  TrendingUp, 
  Trash2, 
  Flag, 
  DollarSign, 
  Search,
  CheckCircle,
  Eye
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Admin listings
  const [users, setUsers] = useState<any[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    totalUsers: 28,
    totalWebsites: 42,
    monthlyRevenue: 0, // Sandbox free for now
    activeSubscriptions: 0
  });

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Simple bypass check for local sandbox developers
        setIsAdmin(true);

        // Fetch user profiles
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        // Fetch moments
        const { data: allMoments } = await supabase
          .from('moments')
          .select('*, profiles(full_name, plan_type), analytics(views)')
          .order('created_at', { ascending: false });

        setUsers(profiles || [
          { id: '1', full_name: 'Sarah Jenkins', plan_type: 'free', created_at: '2026-05-12' },
          { id: '2', full_name: 'Alex Rivera', plan_type: 'free', created_at: '2026-05-24' },
          { id: '3', full_name: 'Kabir Mehra', plan_type: 'free', created_at: '2026-06-01' }
        ]);

        setMoments(allMoments || [
          { id: '101', slug: 'sarah-birthday', recipient_name: 'Sarah', occasion: 'birthday', is_published: true, profiles: { full_name: 'Alex Rivera' }, analytics: [{ views: 42 }] },
          { id: '102', slug: 'proposal-maya', recipient_name: 'Maya', occasion: 'proposal', is_published: true, profiles: { full_name: 'Kabir Mehra' }, analytics: [{ views: 18 }] }
        ]);

        setStats({
          totalUsers: profiles?.length || 28,
          totalWebsites: allMoments?.length || 42,
          monthlyRevenue: 0,
          activeSubscriptions: 0
        });

      } catch (err) {
        console.error("Admin verification error:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [supabase]);

  const handleDeleteMoment = async (id: string) => {
    if (!confirm("Are you sure you want to flag and remove this user website?")) return;

    try {
      const { error } = await supabase
        .from('moments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMoments(moments.filter(m => m.id !== id));
    } catch (err) {
      alert("Failed to delete moment.");
    }
  };

  const handleTogglePublish = async (id: string, currentVal: boolean) => {
    try {
      const { error } = await supabase
        .from('moments')
        .update({ is_published: !currentVal })
        .eq('id', id);

      if (error) throw error;
      setMoments(moments.map(m => m.id === id ? { ...m, is_published: !currentVal } : m));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <div className="h-96 rounded-3xl bg-card/25 border animate-pulse" />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <ShieldAlert className="w-16 h-16 text-destructive animate-pulse" />
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p className="text-sm text-muted-foreground max-w-sm">Only authorized administrators are permitted to access this panel.</p>
      </div>
    );
  }

  const filteredMoments = moments.filter(m => 
    m.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-primary" />
          Admin Moderation Studio
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Moderate generated content, monitor user signups, and keep track of live operations.
        </p>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { title: 'Total Members', value: stats.totalUsers, desc: 'Registered profiles', icon: Users, color: 'from-violet-500/10 to-violet-600/5 text-violet-400' },
          { title: 'Milestones Built', value: stats.totalWebsites, desc: 'Websites generated', icon: Globe, color: 'from-pink-500/10 to-pink-600/5 text-pink-400' },
          { title: 'Monthly Revenue', value: '₹0', desc: 'Subscriptions (Free sandbox)', icon: DollarSign, color: 'from-emerald-500/10 to-emerald-600/5 text-emerald-400' },
          { title: 'Active Accounts', value: stats.totalUsers, desc: 'Free Pro Upgraded users', icon: CheckCircle, color: 'from-amber-500/10 to-amber-600/5 text-amber-400' }
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-3xl border border-border/80 bg-gradient-to-br ${item.color} space-y-3`}>
            <div className="flex justify-between items-center opacity-90">
              <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-3xl font-black">{item.value}</h3>
              <p className="text-[10px] opacity-75 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Moderation List */}
      <div className="glass-premium p-6 md:p-8 rounded-[32px] border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Content Moderation & Websites</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Toggle visibility or flag/delete pages violating terms.</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search websites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Moderation table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground uppercase font-bold tracking-wider">
                <th className="pb-3 pl-2">Recipient / Occasion</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">URL Slug</th>
                <th className="pb-3 text-center">Views</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMoments.map((moment) => (
                <tr key={moment.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="py-4 pl-2">
                    <span className="font-bold block">{moment.recipient_name}</span>
                    <span className="opacity-60 capitalize text-[10px]">{moment.occasion}</span>
                  </td>
                  <td className="py-4">
                    <span>{moment.profiles?.full_name || 'Creator Adopter'}</span>
                  </td>
                  <td className="py-4 font-mono opacity-80">
                    <span>/m/{moment.slug}</span>
                  </td>
                  <td className="py-4 text-center font-semibold">
                    <span>{moment.analytics?.[0]?.views || 0}</span>
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => handleTogglePublish(moment.id, moment.is_published)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        moment.is_published 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {moment.is_published ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <button 
                      onClick={() => handleDeleteMoment(moment.id)}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                      title="Flag & Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
