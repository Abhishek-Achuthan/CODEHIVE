import { useState } from 'react';
import { Check, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFetchPublicPlans } from '../hooks/useFetchPublicPlans';
import { BillingToggle } from './BillingToggle';
import type { PlanBillingInterval } from '../../../shared/types/api/subscription';
import { formatPrice, getPlanFeatureSection, getPricingGridClass } from '../utils/pricingUtils';

const PricingPreview = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<PlanBillingInterval>('monthly');
  const { plans, loading, error } = useFetchPublicPlans();

  const handlePlanClick = () => {
    navigate('/pricing');
  };

  const popularIndex = Math.floor(plans.length / 2);

  return (
    <section className="py-24 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-8">
            Start for free, upgrade when you need more power and advanced mentor features.
          </p>
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <p className="text-center text-zinc-500 py-8">{error}</p>
        ) : plans.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">No public plans available right now.</p>
        ) : (
          <div className={getPricingGridClass(plans.length)}>
            {plans.map((plan, i) => {
              const previousPlan = i > 0 ? plans[i - 1]! : null;
              const isPopular = i === popularIndex && plans.length > 1;
              const { symbol, value, period } = formatPrice(plan, billing);
              const { items: featureItems } = getPlanFeatureSection(plan, previousPlan);
              const price = billing === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly;
              const isFree = price === 0;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all border ${
                    isPopular
                      ? 'bg-gradient-to-b from-indigo-900/20 to-zinc-900/50 border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-bl-xl rounded-tr-3xl flex items-center gap-1">
                      <Zap className="w-3 h-3" /> POPULAR
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                    <p className="text-zinc-400 mb-6 text-sm min-h-[2.5rem]">
                      {plan.description || (isFree ? 'Perfect for learners and side-projects.' : 'For serious developers and mentors.')}
                    </p>

                    <div className="mb-8">
                      <span className="text-5xl font-bold text-white">
                        {symbol}{value}
                      </span>
                      <span className="text-zinc-500">{period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {featureItems.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-zinc-300 text-sm">
                          <Check className={`w-5 h-5 flex-shrink-0 ${isPopular ? 'text-indigo-400' : 'text-blue-500'}`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={handlePlanClick}
                    className={`w-full py-4 rounded-xl font-semibold transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    {isFree ? 'Get Started' : `Get ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPreview;
