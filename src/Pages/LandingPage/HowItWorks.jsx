import React from 'react';

const steps = [
  {
    number: '01',
    icon: '👤',
    title: 'Sign Up',
    description: 'Create your free account in less than a minute. No credit card required.',
  },
  {
    number: '02',
    icon: '📝',
    title: 'Answer Quick Quiz',
    description: 'Tell us about your lifestyle and financial goals for personalized insights.',
  },
  {
    number: '03',
    icon: '📊',
    title: 'Track Expenses',
    description: 'Start logging your expenses manually or connect your bank for automatic tracking.',
  },
  {
    number: '04',
    icon: '💡',
    title: 'Get Smart Insights',
    description: 'Receive AI-powered recommendations to save money and reach your goals faster.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400 text-lg">Get started with SpendWise in four simple steps</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-0.5 bg-emerald-900 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-[#0f172a] border-4 border-emerald-500/20 flex flex-col items-center justify-center mb-6 text-emerald-400">
                  <span className="text-lg font-bold mb-1">{step.number}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
