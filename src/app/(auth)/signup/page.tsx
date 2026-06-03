"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function SignupContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const errorParam = searchParams.get('error');
  const error = submitError || (
    errorParam === 'auth-callback-failed'
      ? 'Google authentication failed. Please check that Google Sign-in is enabled in your Supabase project (Authentication > Providers > Google) and that your Google OAuth Credentials are correct.'
      : errorParam ? decodeURIComponent(errorParam) : null
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      setSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to authenticate with Google.');
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
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground text-sm">
              Join MomentsAI and build special visual showcases
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
              <h3 className="text-lg font-bold text-emerald-400">Signup Successful!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Please check your email inbox to verify your account and activate your Creator dashboard.
              </p>
              <Link 
                href="/login" 
                className="w-full block py-3 rounded-2xl bg-secondary text-sm font-semibold hover:bg-secondary/80 transition-all"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      placeholder="•••••••• (Min 6 characters)"
                      value={password}
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="glowing-button w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Get Started Free'}
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase font-bold tracking-widest">or</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full py-3.5 rounded-2xl border border-border hover:bg-secondary/80 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign Up with Google
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
