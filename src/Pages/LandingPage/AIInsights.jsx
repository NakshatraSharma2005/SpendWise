import React from 'react';

const AIInsights = () => {
  return (
    <section className="py-24 bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            <span>🤖</span>
            <span>Powered by Advanced AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">AI-Powered Insights</h2>
          <p className="text-slate-400 text-lg">
            Get intelligent recommendations that help you save more and spend smarter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Notifications */}
          <div className="space-y-4">
            
            {/* Notification 1 */}
            <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex justify-center items-center text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  🤖
                </div>
                <div>
                  <div className="font-semibold text-emerald-400">SpendWise AI <span className="text-slate-500 text-xs font-normal ml-2">Just now</span></div>
                </div>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 ml-12">
                <div className="flex items-center gap-2 text-yellow-500 font-medium mb-2">
                  <span>⚠️</span> Spending Alert
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You are spending too much on entertainment this month. You've spent ₹8,500 compared to your usual ₹4,000.
                </p>
              </div>
            </div>

            {/* Notification 2 */}
            <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex justify-center items-center text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  🤖
                </div>
                <div>
                  <div className="font-semibold text-emerald-400">SpendWise AI <span className="text-slate-500 text-xs font-normal ml-2">2 hours ago</span></div>
                </div>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 ml-12">
                <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2">
                  <span>📉</span> Savings Tip
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Try reducing food delivery orders to save ₹2,000/month. Consider meal prepping on weekends!
                </p>
              </div>
            </div>

            {/* Notification 3 */}
            <div className="bg-[#1e293b]/80 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex justify-center items-center text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  🤖
                </div>
                <div>
                  <div className="font-semibold text-emerald-400">SpendWise AI <span className="text-slate-500 text-xs font-normal ml-2">Yesterday</span></div>
                </div>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 ml-12">
                <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2">
                  <span>✅</span> Great Progress!
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You've saved ₹5,200 this month compared to last month. Keep up the good work!
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Prediction Cards */}
          <div className="space-y-6">
            
            <div className="bg-[#091520] border border-teal-900/50 rounded-3xl p-8 h-full shadow-[0_0_30px_rgba(20,184,166,0.05)]">
              <h3 className="text-2xl font-bold mb-4">Smart Predictions</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Our AI analyzes your spending patterns to provide actionable insights and help you make better financial decisions.
              </p>
              
              <ul className="space-y-5">
                {[
                  'Personalized savings recommendations',
                  'Real-time spending alerts',
                  'Budget optimization suggestions',
                  'Category-wise analysis'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                      ✓
                    </div>
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1e293b]/80 border border-white/5 rounded-3xl p-8">
              <h4 className="text-lg font-semibold mb-2 text-slate-200">Monthly Savings Potential</h4>
              <div className="text-5xl font-bold text-emerald-400 mb-3 block items-center flex-wrap">
                ₹3,500 <span className="text-lg font-medium text-slate-500 ml-2">per month</span>
              </div>
              <div className="text-emerald-500 text-sm flex items-center gap-2">
                <span>↓</span> Based on your spending patterns
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AIInsights;
