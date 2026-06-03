"use client";

import { useEffect, useState } from 'react';
import { User, Mail, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfileData {
  id?: string;
  full_name: string | null;
  avatar_url: string | null;
  plan_type?: string;
  created_at?: string;
  updated_at?: string;
}

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfileData>({ full_name: '', avatar_url: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    async function loadAccountDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setEmail(user.email || '');

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountDetails();
  }, [supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      setFeedback({ type: 'error', message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Customize your personal details, configure your branding, and manage integrations.
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl border border-border bg-card/20 animate-pulse" />
      ) : (
        <div className="glass-premium p-8 rounded-[32px] border space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Profile
          </h3>

          {feedback && (
            <div className={`p-4 rounded-2xl text-sm flex gap-2.5 items-center border ${
              feedback.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}>
              {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/30 border border-border text-muted-foreground/70 text-sm cursor-not-allowed"
                />
              </div>
              <span className="text-[10px] text-muted-foreground pl-1">Email address cannot be changed. Please contact support to update login credentials.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Full Display Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Avatar Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://example.com/avatar.jpg"
                value={profile.avatar_url || ''}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="glowing-button flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-sm shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
