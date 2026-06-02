"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient-primary">
            MomentsAI
          </span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-premium p-8 md:p-10 rounded-[32px] border shadow-2xl space-y-8 relative z-10">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
            <p className="text-muted-foreground text-sm">
              Recover access to your creator dashboard
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex gap-2.5 items-center">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-400">Email Sent!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                If an account exists for this email, we have sent a secure password reset link to your inbox.
              </p>
              <Link 
                href="/login" 
                className="w-full block py-3 rounded-2xl bg-secondary text-sm font-semibold hover:bg-secondary/80 transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glowing-button w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Sending Link...' : 'Send Recovery Link'}
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Remember your password?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
