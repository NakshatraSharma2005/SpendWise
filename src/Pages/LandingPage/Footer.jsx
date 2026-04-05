import React from "react";
// import { twitter, facebook, instagram, linkedin, github } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#090e1a] text-white pt-20 pb-8 border-t border-white/5">
            <section
                id="contact"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                        {/* Logo & Description Column */}
                        <div className="md:col-span-4 lg:col-span-4">
                            <div className="flex items-center gap-2 mb-6 cursor-pointer">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xl">
                                        ✨
                                    </span>
                                </div>
                                <span className="font-semibold text-xl tracking-tight">
                                    SpendWise
                                </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-8 pr-4">
                                Your smart companion for managing expenses,
                                tracking budgets, and achieving financial goals
                                with AI-powered insights.
                            </p>
                            <div className="flex items-center gap-4">
                                {[
                                    "twitter",
                                    "facebook",
                                    "instagram",
                                    "linkedin",
                                    "github",
                                ].map((social, i) => (
                                    <button
                                        key={i}
                                        className="w-10 h-10 rounded-xl bg-[#1e293b] border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                                        {/* Placeholder for social icons */}
                                        <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="md:col-span-8 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                            {/* Product */}
                            <div>
                                <h4 className="font-semibold mb-6 text-lg">
                                    Product
                                </h4>
                                <ul className="space-y-4 text-slate-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Mobile App
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Integrations
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Company */}
                            <div>
                                <h4 className="font-semibold mb-6 text-lg">
                                    Company
                                </h4>
                                <ul className="space-y-4 text-slate-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Careers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Press Kit
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="font-semibold mb-6 text-lg">
                                    Legal
                                </h4>
                                <ul className="space-y-4 text-slate-400">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-emerald-400 transition-colors">
                                            Cookie Policy
                                        </a>
                                    </li>
                                    <li className="pt-2">
                                        <a
                                            href="#"
                                            className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                            ✉ Contact Us
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <div>© 2026 SpendWise. All rights reserved.</div>
                        <div>
                            Made with <span className="text-red-500">❤️</span>{" "}
                            by Nakshatra Sharma
                        </div>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;
