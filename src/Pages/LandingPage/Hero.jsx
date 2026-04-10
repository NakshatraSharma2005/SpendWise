import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExpenses: 0,
    totalAmount: 0,
    avgSaving: 0
  });

  const BASE_URL = "https://spendwise-backend-e7xj.onrender.com";

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response: Expected JSON (likely received HTML redirect)");
    }

    const json = await res.json();
    return json.success ? json.data : null;
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const endpoints = [
          "user-count",
          "total-expenses",
          "total-amount",
          "avg-saving"
        ];
        
        const [users, expenses, amount, saving] = await Promise.all(
          endpoints.map(ep => fetchJSON(`${BASE_URL}/api/stats/${ep}`))
        );

        setStats({
          totalUsers: users?.totalUsers || 0,
          totalExpenses: expenses?.totalExpenses || 0,
          totalAmount: amount?.totalAmount || 0,
          avgSaving: saving?.avgSaving || 0
        });
      } catch (err) {
        console.error("Critical Stats Fetch Error:", err.message);
      }
    };
    fetchAllStats();
  }, []);

  const formatValue = (val) => {
    if (!val) return "0";
    if (val >= 10000000) return (val / 10000000).toFixed(1) + "Cr";
    if (val >= 100000) return (val / 100000).toFixed(1) + "L";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toLocaleString();
  };

  return (
      <section className="relative w-full bg-[#0f172a] text-white pt-24 pb-20 overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
              {/* Badges Container */}
              <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                      <span>⚡</span>
                      <span>Personalized Expense Tracking</span>
                  </div>
                  {stats.totalUsers > 0 && (
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-slate-300 text-[12px] font-bold animate-in fade-in slide-in-from-top-2 duration-700">
                              <span className="text-emerald-400">💡</span>
                              <span>
                                  {stats.totalUsers}+ users managing money
                                  smarter
                              </span>
                          </div>
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-[11px] font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-4 duration-1000">
                              <span>
                                  Avg saving ₹{stats.avgSaving.toLocaleString()}
                              </span>
                          </div>
                      </div>
                  )}
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                  Take Control of Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                      Money, Smartly
                  </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                  Track your expenses, understand your spending habits, and get
                  personalized insights to save more every month.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
                  <button
                      className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white font-medium rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:-translate-y-0.5"
                      onClick={() => navigate("/signup")}>
                      <span>Get Started</span>
                      <span>→</span>
                  </button>
                  <button
                      className="px-8 py-3.5 border border-slate-600 hover:bg-slate-800 text-white font-medium rounded-full transition-all"
                      onClick={() => navigate("/login")}>
                      <span>Login</span>
                  </button>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center gap-12 md:gap-24 pt-8 border-t border-white/5 w-full">
                  <div className="flex flex-col gap-1 items-center">
                      <div className="text-3xl font-bold flex items-center gap-1">
                          <span className="text-emerald-400">📈</span>{" "}
                          {stats.totalUsers > 0
                              ? `${stats.totalUsers}+`
                              : "10K+"}{" "}
                      </div>
                      <div className="text-sm text-slate-400">Active Users</div>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                      <div className="text-3xl font-bold text-white">
                          <span className="text-emerald-500">₹</span>
                          {stats.totalAmount > 0
                              ? formatValue(stats.totalAmount)
                              : "50Cr"}
                          +
                      </div>
                      <div className="text-sm text-slate-400">
                          Expenses Tracked
                      </div>
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
