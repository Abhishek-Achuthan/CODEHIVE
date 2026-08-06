import { Check } from 'lucide-react';

const PricingPreview = () => {
  return (
    <section className="py-24 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Start for free, upgrade when you need more power and advanced mentor features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-700 transition-colors">
            <h3 className="text-2xl font-semibold text-white mb-2">Community</h3>
            <p className="text-zinc-400 mb-6">Perfect for learners and side-projects.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$0</span>
              <span className="text-zinc-500">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Unlimited public rooms', 'Basic real-time collaboration', 'Community Q&A access', 'Book mentorship sessions (pay-per-session)'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl font-semibold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl bg-gradient-to-b from-blue-900/20 to-zinc-900/50 border border-blue-500/50 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-bl-xl">
              POPULAR
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Pro Mentor</h3>
            <p className="text-zinc-400 mb-6">For serious developers and mentors.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white">$15</span>
              <span className="text-zinc-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Private collaborative rooms', 'HD Video & Audio', 'Host paid mentorship sessions', 'Advanced analytics & session recordings', 'Priority support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
