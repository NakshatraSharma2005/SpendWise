import React from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    const socialLinks = [
        {
            icon: FaInstagram,
            name: "Instagram",
            url: "https://www.instagram.com/nakshatra_sharma_07",
        },
        {
            icon: FaLinkedin,
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/nakshatra-sharma-5b2765337/",
        },
        {
            icon: FaGithub,
            name: "GitHub",
            url: "https://github.com/NakshatraSharma2005",
        },
        {
            icon: MdEmail,
            name: "Email",
            url: "mailto:kinshu.nakshatra@gmail.com",
        },
    ];

    const footerSections = [
        {
            title: "Product",
            links: [
                { name: "Features", href: "#features", type: "scroll" },
                { name: "Dashboard", href: "/dashboard", type: "navigate" },
                { name: "Get Started", href: "/signup", type: "navigate" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About", href: "#", type: "scroll" },
                { name: "Contact", href: "#contact", type: "scroll" },
            ],
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", href: "#", type: "static" },
                { name: "Terms", href: "#", type: "static" },
            ],
        },
    ];

    const handleLinkClick = (e, link) => {
        if (link.type === "navigate") {
            e.preventDefault();
            navigate(link.href);
            window.scrollTo(0, 0);
        } else if (link.type === "scroll" && link.href.startsWith("#")) {
            // Standard anchor behavior or smooth scroll if needed
        }
    };

    return (
        <footer className="bg-[#090e1a] text-white pt-20 pb-8 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Logo & Description Column */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate("/")}>
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                <span className="text-white text-xl">✨</span>
                            </div>
                            <span className="font-semibold text-xl tracking-tight">
                                SpendWise
                            </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-8 pr-4 text-sm max-w-sm">
                            Your smart companion for managing expenses, tracking budgets, and achieving financial goals with personalized insights. Built for real users managing real money.
                        </p>
                        
                        {/* Social Icons (The "5 Boxes") */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    target={social.url.startsWith("mailto") ? "_self" : "_blank"}
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-[#1e293b] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 group shadow-lg"
                                    title={social.name}
                                >
                                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        {footerSections.map((section, index) => (
                            <div key={index}>
                                <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-slate-200">
                                    {section.title}
                                </h4>
                                <ul className="space-y-4">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleLinkClick(e, link)}
                                                className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Area (Strict mailto requirement) */}
                <div id="contact" className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-slate-400 text-sm">
                        Have questions? Reach out to us at{" "}
                        <a 
                            href="mailto:support@spendwise.com"
                            className="text-emerald-400 hover:underline font-medium ml-1"
                        >
                            support@spendwise.com
                        </a>
                    </div>
                    
                    {/* Bottom Credits */}
                    <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-slate-500">
                        <div>© 2026 SpendWise. All rights reserved.</div>
                        <div className="hidden md:block w-px h-3 bg-white/10"></div>
                        <div>
                            Made with <span className="text-red-500 animate-pulse">❤️</span> by Nakshatra
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
