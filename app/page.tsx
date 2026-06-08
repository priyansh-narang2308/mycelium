import Link from "next/link";
import { Leaf, BarChart2, Globe, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-body font-sans selection:bg-brand-pink selection:text-white flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full h-16 bg-canvas border-b border-hairline flex items-center justify-between px-6 md:px-12 fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold text-sm">
            C
          </span>
          <span className="font-semibold text-ink text-[18px] tracking-tight">
            Carbon Pulse
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-[15px] text-muted">
          <Link href="#features" className="hover:text-ink transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-ink transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard" className="text-ink">
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:opacity-90 transition-opacity"
          >
            Try Free
          </Link>
        </div>
        {/* Mobile Nav Button (Visual only for landing page) */}
        <div className="md:hidden">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium text-[14px]"
          >
            Try Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full mt-16">
        <header className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-7/12 text-center md:text-left">
            <h1 className="text-[56px] md:text-[80px] font-medium text-ink tracking-[-2.5px] leading-[1.0] mb-6">
              Go to market with a lighter footprint.
            </h1>
            <p className="text-[18px] md:text-[20px] text-muted max-w-xl leading-relaxed mb-10 font-medium mx-auto md:mx-0">
              A playful B2B command-palette for your carbon footprint. Log your
              activities naturally, let AI calculate the impact, and discover
              high-leverage swaps to reduce your emissions.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-on-primary font-bold text-[16px] hover:opacity-90 transition-opacity"
              >
                Explore Dashboard &rarr;
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-surface-card border border-hairline text-ink font-bold text-[16px] hover:bg-surface-strong transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-5/12 flex justify-center hidden md:flex relative">
            <div className="w-[400px] h-[400px] bg-brand-pink rounded-[48px] transform rotate-3 flex items-center justify-center shadow-xl border border-ink/5">
              <Leaf className="w-40 h-40 text-ink opacity-90" />
            </div>
            {/* Decorative floating elements */}
            <div className="absolute top-10 -left-6 bg-brand-teal text-white p-4 rounded-2xl shadow-lg transform -rotate-6 border border-white/10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-peach" />
              <span className="font-semibold text-sm">AI Powered</span>
            </div>
            <div className="absolute bottom-20 -right-8 bg-surface-card text-ink p-4 rounded-2xl shadow-lg transform rotate-6 border border-hairline flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-mint" />
              <span className="font-semibold text-sm">-12.5kg CO2e</span>
            </div>
          </div>
        </header>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full bg-surface-soft py-32 px-6 border-y border-hairline"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] font-medium text-ink tracking-[-1.5px] leading-tight mb-4">
              Everything you need to track.
            </h2>
            <p className="text-[18px] text-muted max-w-2xl mx-auto font-medium">
              We built Carbon Pulse to make environmental responsibility feel
              like magic, not a spreadsheet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-canvas border border-hairline p-8 rounded-[24px] shadow-sm">
              <div className="w-12 h-12 bg-brand-teal text-white flex items-center justify-center rounded-xl mb-6">
                <BarChart2 className="w-6 h-6 text-brand-mint" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink mb-3">
                Real-time Analytics
              </h3>
              <p className="text-muted font-medium text-[15px] leading-relaxed">
                Watch your carbon footprint update instantly as you log
                activities. Understand your impact with gorgeous data
                visualizations.
              </p>
            </div>
            <div className="bg-brand-peach p-8 rounded-[24px] shadow-sm border border-ink/5">
              <div className="w-12 h-12 bg-ink text-white flex items-center justify-center rounded-xl mb-6">
                <Sparkles className="w-6 h-6 text-brand-peach" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink mb-3">
                AI Leverage Points
              </h3>
              <p className="text-ink/80 font-medium text-[15px] leading-relaxed">
                Our Gemini-powered engine finds the highest-leverage lifestyle
                swaps specifically tailored to your unique habits.
              </p>
            </div>
            <div className="bg-canvas border border-hairline p-8 rounded-[24px] shadow-sm">
              <div className="w-12 h-12 bg-brand-lavender text-ink flex items-center justify-center rounded-xl mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink mb-3">
                Global Equivalents
              </h3>
              <p className="text-muted font-medium text-[15px] leading-relaxed">
                &quot;12kg of CO2&quot; is hard to visualize. We convert your
                emissions into relatable metrics like &quot;smartphones
                charged&quot; so it clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Pre-Footer */}
      <section className="w-full bg-canvas py-32 px-6">
        <div className="max-w-4xl mx-auto bg-brand-teal rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-[40px] md:text-[56px] font-medium text-white tracking-[-1.5px] leading-tight mb-6">
              Start reducing your footprint today.
            </h2>
            <p className="text-[18px] text-white/80 max-w-xl mx-auto font-medium mb-10">
              Join thousands of individuals taking control of their
              environmental impact with the best-in-class tracking tool.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-canvas text-ink font-bold text-[18px] hover:bg-surface-soft transition-colors shadow-sm"
            >
              Get Started for Free
            </Link>
          </div>
          {/* Background decorative blob */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-mint/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-surface-soft pt-20 pb-10 px-6 border-t border-hairline">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
          <div className="md:w-1/3">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold text-sm">
                C
              </span>
              <span className="font-semibold text-ink text-[18px] tracking-tight">
                Carbon Pulse
              </span>
            </div>
            <p className="text-muted text-[15px] font-medium">
              A playful command-palette for your carbon footprint. Go to market
              with a lighter impact.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="font-bold text-ink mb-4">Product</h4>
              <ul className="space-y-3 text-[15px] text-muted font-medium">
                <li>
                  <Link href="#features" className="hover:text-ink">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-ink">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-ink">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-4">Company</h4>
              <ul className="space-y-3 text-[15px] text-muted font-medium">
                <li>
                  <Link href="#" className="hover:text-ink">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-ink">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-ink">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-hairline pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-muted font-medium">
          <p>© 2026 Carbon Pulse. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-ink">
              Twitter
            </Link>
            <Link href="#" className="hover:text-ink">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
