"use client";

import { motion } from 'framer-motion';
import { CreditCard, Check, Sparkles, Gift } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          View your current plan, check billing periods, and explore active premium upgrades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Active plan card - takes 2 cols */}
        <div className="md:col-span-2 glass-premium p-8 rounded-[32px] border space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Active Subscription
            </span>
            <div>
              <h3 className="text-2xl font-bold">Unlimited Free Pro Sandbox</h3>
              <p className="text-muted-foreground text-xs mt-1">
                You have early adopter benefits with all premium controls completely unlocked.
              </p>
            </div>
          </div>

          <div className="py-4 border-y border-border/60 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Price Plan</span>
              <p className="text-lg font-extrabold">₹0 <span className="text-xs text-muted-foreground font-normal">/ lifetime</span></p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Next Renewal</span>
              <p className="text-lg font-extrabold">Never</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <Check className="w-4 h-4" />
            <span>All features unlocked under developer early adopter status</span>
          </div>
        </div>

        {/* Sandbox features showcase */}
        <div className="p-6 rounded-[32px] border border-border bg-card/40 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Unlocked Tools</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Unlimited websites</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Bedrock Claude writing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>All premium themes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Custom domain unlocks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Unlimited media storage</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border/40 text-[10px] text-muted-foreground leading-normal">
            We stopped credit card requirements for this launch! Build, test, and share as much as you like.
          </div>
        </div>
      </div>
    </div>
  );
}
