"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 bg-background/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient-primary">
            MomentsAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#preview" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">
            Preview
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">
            How it Works
          </Link>
          <Link href="#templates" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">
            Templates
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">
            Features
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground">
            FAQ
          </Link>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/80 transition-all"
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="glowing-button flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white text-sm font-medium shadow-md hover:shadow-xl hover:scale-102 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 border-b border-white/10 bg-background/95 backdrop-blur-lg flex flex-col p-6 gap-6 shadow-2xl animate-in slide-in-from-top-5 duration-300">
          <Link 
            href="#preview" 
            className="text-lg font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Preview
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-lg font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            How it Works
          </Link>
          <Link 
            href="#templates" 
            className="text-lg font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Templates
          </Link>
          <Link 
            href="#features" 
            className="text-lg font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link 
            href="#faq" 
            className="text-lg font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </Link>
          <hr className="border-white/10" />
          {user ? (
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 py-3 rounded-full bg-secondary font-medium"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-5 h-5" />
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
              <Link 
                href="/login" 
                className="text-center py-3 rounded-full border border-white/10 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="text-center py-3 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-medium shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
