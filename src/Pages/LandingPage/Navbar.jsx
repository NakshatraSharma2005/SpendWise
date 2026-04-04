import React from 'react';
import { Wallet } from 'lucide-react';


const Navbar = () => {
  return (
      <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/90 backdrop-blur border-b border-white/10 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                  {/* Logo */}
                  <div className="flex items-center gap-2 cursor-pointer">
                      <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                          <Wallet
                              className="w-8 h-8 text-[#00E5A8] relative z-10"
                              strokeWidth={2}
                          />
                          {/* <span className="text-white text-xl">✨</span> Placeholder for actual logo */}
                      </div>
                      <span className="font-semibold text-xl tracking-tight">
                          SpendWise
                      </span>
                  </div>

                  {/* Links */}
                  <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                      <a
                          href="#features"
                          className="hover:text-white transition-colors">
                          Features
                      </a>
                      <a
                          href="#how-it-works"
                          className="hover:text-white transition-colors">
                          How it Works
                      </a>
                      <a
                          href="#contact"
                          className="hover:text-white transition-colors">
                          Contact
                      </a>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-4">
                      <button className="px-5 py-2 text-sm font-medium rounded-full border border-slate-600 hover:bg-slate-800 transition-colors">
                          Login
                      </button>
                      <button className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-white rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:-translate-y-0.5">
                          Get Started
                      </button>
                  </div>
              </div>
          </div>
      </nav>
  );
};

export default Navbar;
