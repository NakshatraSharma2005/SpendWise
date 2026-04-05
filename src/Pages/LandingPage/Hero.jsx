import React from 'react';
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full bg-[#0f172a] text-white pt-24 pb-20 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
          <span>⚡</span>
          <span>Personalized Expense Tracking</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Take Control of Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Money, Smartly</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Track your expenses, understand your spending habits, and get personalized insights to save more every month.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <button className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-medium rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:-translate-y-0.5"
          onClick={() => navigate("/signup")}>
            <span>Get Started</span>
            <span>→</span>
          </button>
          <button className="px-8 py-3.5 border border-slate-600 hover:bg-slate-800 text-white font-medium rounded-full transition-all"
          onClick={() => navigate("/login")}>
            <span>Login</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 pt-8 border-t border-white/5 w-full">
          <div className="flex flex-col gap-1 items-center">
            <div className="text-3xl font-bold flex items-center gap-1">
              <span className="text-emerald-400">📈</span> 10K+
            </div>
            <div className="text-sm text-slate-400">Active Users</div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="text-3xl font-bold">₹50Cr+</div>
            <div className="text-sm text-slate-400">Expenses Tracked</div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="text-3xl font-bold">4.9/5</div>
            <div className="text-sm text-slate-400">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
