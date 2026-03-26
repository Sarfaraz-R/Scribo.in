import React from 'react';

const Pricing = () => {
  const tiers = [
    {
      name: 'Free',
      price: '₹0',
      features: [
        '1 Faculty account',
        'Up to 30 Students',
        'Basic code editor',
        '3 tests per month',
        'Manual result view',
      ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₹499',
      features: [
        'Unlimited students',
        'Full analytics dashboard',
        'Real-time collaboration',
        'Export grade sheets',
        'Priority support',
        'Unlimited tests',
      ],
      cta: 'Start Pro',
      highlight: true,
    },
    {
      name: 'Institution',
      price: 'Custom',
      features: [
        'Everything in Pro',
        'LMS integration',
        'Dedicated manager',
        'SLA guarantee',
        'Custom branding',
        'Onboarding assistance',
      ],
      cta: 'Contact Us',
      highlight: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative w-full bg-[#020202] py-32 px-6 overflow-hidden dot-grid"
    >
      {/* Custom Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .pricing-glass {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      {/* Reusing your signature glow */}
      <div className="glow-main absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] z-0 pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4 font-['Syne']">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-500 text-lg font-['DM_Sans']">
            Start free. Scale when you're ready.
          </p>
        </div>

        {/* Adjusted grid for better spacing to prevent text overflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch w-full">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col ${tier.highlight ? 'z-20 md:scale-105' : 'z-10'}`}
            >
              {/* Pro Card Rotating Border */}
              {tier.highlight && (
                <div className="absolute -inset-[1px] rounded-[25px] overflow-hidden">
                  <div className="absolute inset-[-400%] animate-spin-slow bg-[conic-gradient(from_0deg,#f97316,#fbbf24,#f97316)]" />
                </div>
              )}

              {/* Card Body - flex-1 and min-h-max prevents "Custom" or long lists from breaking the card */}
              <div
                className={`
                relative flex-1 flex flex-col p-8 rounded-[24px] transition-transform duration-500 hover:scale-[1.02]
                ${tier.highlight ? 'bg-[#0d0d0d]' : 'pricing-glass'}
              `}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f97316] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-gray-400 font-bold font-['DM_Sans'] text-sm uppercase tracking-widest mb-4">
                    {tier.name}
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span
                      className={`font-black font-['Syne'] tracking-tighter leading-none ${
                        tier.highlight
                          ? 'text-[#f97316] text-5xl lg:text-7xl'
                          : 'text-white text-5xl lg:text-6xl'
                      }`}
                    >
                      {tier.price}
                    </span>
                    {tier.name !== 'Institution' && (
                      <span className="text-gray-500 text-xs md:text-sm font-['DM_Sans']">
                        /month
                      </span>
                    )}
                  </div>
                </div>

                <ul className="flex-1 space-y-4 mb-10">
                  {tier.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="text-gray-300 text-sm font-['DM_Sans'] flex items-start"
                    >
                      <span className="text-gray-600 mr-3 mt-1 leading-none">
                        ·
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                  w-full py-4 mt-auto rounded-xl font-bold text-sm transition-all duration-300
                  ${
                    tier.highlight
                      ? 'bg-[#f97316] text-white hover:bg-[#fb8c00] shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)]'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }
                `}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 text-gray-600 text-sm font-['DM_Sans']">
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default Pricing;
