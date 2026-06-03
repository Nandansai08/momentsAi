import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 text-zinc-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              MomentsAI
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-zinc-500">
            Create beautifully personalized, emotional websites for birthdays, anniversaries, graduations, and life&apos;s special milestones in minutes.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#preview" className="hover:text-white transition-colors">Live Preview</Link></li>
            <li><Link href="#templates" className="hover:text-white transition-colors">Occasions</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors">Advanced Toggles</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Creator Studio</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">DMCA Notice</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Platform</h4>
          <p className="text-sm leading-relaxed text-zinc-500 mb-2">
            Built with modern architecture. All moments are securely saved and lightning fast.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-4">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for beautiful memories.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
        <span>&copy; {new Date().getFullYear()} MomentsAI Inc. All rights reserved.</span>
        <span>Secure payments by Razorpay. Dynamic content by Amazon Bedrock.</span>
      </div>
    </footer>
  );
}
