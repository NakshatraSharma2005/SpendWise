import React from 'react';

const featuresList = [
    {
        icon: "₹",
        title: "Expense Tracking",
        description:
            "Effortlessly log and categorize all your expenses with smart auto-detection and receipt scanning.",
    },
    {
        icon: "📊",
        title: "Smart Analytics",
        description:
            "Visualize your spending patterns with beautiful charts and comprehensive financial reports.",
    },
    {
        icon: "🧠",
        title: "Personalized  Insights",
        description:
            "Get personalized recommendations powered by personalized Insights to optimize your spending and increase savings.",
    },
    {
        icon: "⏱",
        title: "Budget Management",
        description:
            "Set custom budgets for different categories and get alerts when you're close to limits.",
    },
    {
        icon: "🎛",
        title: "Personalized Dashboard",
        description:
            "View all your financial data at a glance with a customizable dashboard tailored to your needs.",
    },
    {
        icon: "✨",
        title: "Smart Goals",
        description:
            "Set savings goals and track your progress with personalized suggestions to reach them faster.",
    },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose SpendWise?</h2>
          <p className="text-slate-400 text-lg">Everything you need to master your finances in one powerful platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((feature, index) => (
            <div key={index} className="bg-[#1e293b]/50 p-8 rounded-2xl border border-white/5 hover:bg-[#1e293b] transition-all group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
