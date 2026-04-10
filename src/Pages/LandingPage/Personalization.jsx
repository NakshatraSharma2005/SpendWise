import React from 'react';

const Personalization = () => {
  return (
      <section className="py-24 bg-[#0f172a] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Personalized for Your Lifestyle
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Built for students and professionals with tailored insights
                  that match your unique financial situation
              </p>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side: Text and Cards */}
              <div className="space-y-6">
                  <div className="mb-8">
                      <h3 className="text-3xl font-bold mb-4">
                          Smart Personalization
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                          SpendWise adapts to your unique lifestyle. Whether
                          you're a student managing a tight budget or a working
                          professional planning investments, our personalized
                          tailors insights specifically for you.
                      </p>
                  </div>

                  <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 flex gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
                          🎓
                      </div>
                      <div>
                          <h4 className="text-lg font-semibold mb-2">
                              For Students
                          </h4>
                          <p className="text-slate-400 text-sm leading-relaxed">
                              Track hostel expenses, manage monthly allowances,
                              and get tips on saving for that next trip or
                              gadget.
                          </p>
                      </div>
                  </div>

                  <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5 flex gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl">
                          💼
                      </div>
                      <div>
                          <h4 className="text-lg font-semibold mb-2">
                              For Professionals
                          </h4>
                          <p className="text-slate-400 text-sm leading-relaxed">
                              Analyze salary breakdowns, optimize tax savings,
                              and plan investments with advanced financial
                              tools.
                          </p>
                      </div>
                  </div>
              </div>

              {/* Right Side: Mock Dashboard */}
              <div className="bg-[#1e293b] rounded-3xl p-8 border border-white/10 shadow-2xl relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

                  <div className="flex justify-between items-end mb-6">
                      <div>
                          <div className="text-sm text-slate-400 mb-1">
                              Monthly Overview
                          </div>
                          <div className="text-3xl font-bold">₹45,230</div>
                      </div>
                      <div className="text-emerald-400 text-sm">March 2026</div>
                  </div>

                  <div className="space-y-2 mb-8">
                      <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Budget</span>
                          <span className="text-slate-400">₹50,000</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[90%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      </div>
                  </div>

                  <div>
                      <h4 className="font-semibold mb-4 text-slate-200">
                          Top Categories
                      </h4>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                  <span className="text-slate-300">
                                      Food & Dining
                                  </span>
                              </div>
                              <span className="font-medium">₹12,500</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                                  <span className="text-slate-300">
                                      Transport
                                  </span>
                              </div>
                              <span className="font-medium">₹8,300</span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                  <span className="text-slate-300">
                                      Shopping
                                  </span>
                              </div>
                              <span className="font-medium">₹15,400</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
  );
};

export default Personalization;
