"use client";

import { Check, Sparkles, Receipt } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-8 max-w-3xl text-foreground">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Billing & Subscriptions</h1>
        <p className="text-muted-foreground text-sm font-semibold mt-1.5">
          View your current plan, check billing periods, and review your payment invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Active plan card - takes 2 cols */}
        <div className="md:col-span-2 bg-card p-8 rounded-[32px] border border-border shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 text-primary border border-violet-100 dark:border-violet-900/50 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Pro Plan Active
            </span>
            <div>
              <h3 className="text-2xl font-black text-foreground">Lifetime Pro Membership</h3>
              <p className="text-muted-foreground text-xs font-semibold mt-1 leading-relaxed">
                Congratulations! You have been granted lifetime early-adopter access, completely unlocking all premium generators and themes.
              </p>
            </div>
          </div>

          <div className="py-5 border-y border-border grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Subscription Cost</span>
              <p className="text-lg font-black text-foreground">₹0 <span className="text-xs text-muted-foreground font-bold line-through">₹999</span></p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Renewal Cycle</span>
              <p className="text-lg font-black text-foreground">Lifetime Access</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <Check className="w-4 h-4" />
            <span>Lifetime Pro benefits applied (Early Access Promo Code)</span>
          </div>
        </div>

        {/* Invoice Summary panel */}
        <div className="p-6 rounded-[32px] border border-border bg-card flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-muted-foreground uppercase font-black text-[10px] pl-0.5 tracking-wider">
              <Receipt className="w-4 h-4" />
              <span>Invoice Recapitulation</span>
            </div>
            
            <ul className="space-y-3.5 text-xs text-foreground/80 font-semibold">
              <li className="flex justify-between">
                <span>Lifetime Pro Licence</span>
                <span className="text-muted-foreground line-through">₹999</span>
              </li>
              <li className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Early Access Discount</span>
                <span>-₹999</span>
              </li>
              <li className="border-t border-border pt-3 flex justify-between font-black text-foreground text-sm">
                <span>Total Amount Paid</span>
                <span>₹0</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border text-[10px] text-muted-foreground leading-normal font-semibold">
            All transactional hooks are pre-authorized. No future credit card drafts will be processed for this licence.
          </div>
        </div>
      </div>

      {/* Plan Features Grid */}
      <div className="p-7.5 rounded-[32px] border border-border bg-card shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Included Premium Privileges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-foreground/80 leading-relaxed">
          {[
            "Create unlimited dynamic moment websites",
            "Unlimited AWS Bedrock Claude AI content drafts",
            "Full styling suites: Romantic, Cosmic, Slate, Luxury, Cute",
            "High-fidelity media file uploads & grids",
            "Pre-integrated Spotify, YouTube & Apple Music embeds",
            "Wax-sealed personal scroll letters & secret reveals",
            "Interactive guestbook signing & animated reactions",
            "Personalized QR code creation & plaque downloads",
            "Passcode-lock protection & date scheduled releases"
          ].map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

