import React from 'react';
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-12 pb-24 bg-[#0f172a] text-white relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-[100%] blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-12">
          <span>✨</span> Join 10,000+ Smart Savers
        </div>

        <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Start Your Smart <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Financial Journey Today
          </span>
        </h2>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Take control of your money with Personalized insights. Sign up now and start tracking your expenses smarter, not harder.
        </p>

        <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white text-lg font-medium rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 mb-8"
        onClick={() => navigate("/signup")}
        >
          Get Started for Free <span>→</span>
        </button>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> No credit card required
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Free forever plan
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Cancel anytime
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTA;
