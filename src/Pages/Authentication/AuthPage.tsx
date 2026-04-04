import React, { useState, useRef, useEffect, use } from "react";
import {
    TrendingUp,
    PieChart,
    Target,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Height animation refs
    const containerRef = useRef<HTMLDivElement>(null);
    const signUpRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    // Measure content to animate container height
    useEffect(() => {
        if (isLogin && loginRef.current) {
            setContainerHeight(loginRef.current.offsetHeight);
        } else if (!isLogin && signUpRef.current) {
            setContainerHeight(signUpRef.current.offsetHeight);
        }
    }, [isLogin]);
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!Name.trim()) {
            alert("Please enter your first name");
            return;
        }

        if (!Email.includes("@")) {
            alert("Enter a valid email");
            return;
        }

        if (Password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        navigate("/onboarding");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 lg:p-12 font-sans bg-gradient-to-br from-[#0B1C2C] to-[#0F2A3F] relative overflow-hidden">
            {/* Background radial green glow */}
            <div className="absolute top-1/2 left-1/4 w-[30rem] h-[30rem] bg-[#00E5A8] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[20rem] h-[20rem] bg-[#00E5A8] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.05] pointer-events-none"></div>

            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10 mx-auto">
                {/* Left Side: Hero */}
                <div className="flex flex-col text-left text-white max-w-lg mx-auto lg:mx-0">
                    <div className="flex items-center gap-3 mb-10 lg:mb-16">
                        <div className="w-10 h-10 rounded-xl bg-[#00E5A8]/20 flex items-center justify-center border border-[#00E5A8]/30 shadow-[0_0_15px_rgba(0,229,168,0.2)]">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#00E5A8"
                                className="w-6 h-6 stroke-2">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 12h5"
                                />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            SpendWise
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                        Take Control of Your <br />
                        <span className="text-[#00E5A8] drop-shadow-[0_0_20px_rgba(0,229,168,0.3)]">
                            Money
                        </span>
                    </h1>

                    <p className="text-[#94A3B8] text-lg lg:text-xl mb-10 max-w-md leading-relaxed font-light">
                        Smart expense tracking with AI-powered insights tailored
                        for your lifestyle.
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-3 mb-12">
                        <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2.5 text-sm font-medium text-gray-300 shadow-sm transition-all hover:bg-white/10">
                            <TrendingUp className="w-4 h-4 text-[#00E5A8]" />
                            Real-time Analytics
                        </div>
                        <div className="px-5 py-2.5 rounded-full border border-[#00E5A8]/40 bg-[#00E5A8]/10 backdrop-blur-md flex items-center gap-2.5 text-sm font-medium text-white shadow-[0_0_15px_rgba(0,229,168,0.1)] transition-all hover:bg-[#00E5A8]/20">
                            <PieChart className="w-4 h-4 text-[#00E5A8]" />
                            Smart Budgeting
                        </div>
                        <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2.5 text-sm font-medium text-gray-300 shadow-sm transition-all hover:bg-white/10">
                            <Target className="w-4 h-4 text-[#00E5A8]" />
                            Goal Tracking
                        </div>
                    </div>

                    {/* Stats Card Mockup */}
                    <div className="bg-[#0b172a]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-7 max-w-sm flex flex-col gap-5 shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                        <div className="flex justify-between items-end">
                            <div className="text-sm font-medium text-[#94A3B8]">
                                Total Balance
                            </div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                $24,532.00
                            </div>
                        </div>
                        {/* Custom Progress bar */}
                        <div className="w-full h-2.5 bg-gray-800/80 rounded-full overflow-hidden mt-1 shadow-inner relative">
                            <div className="absolute top-0 left-0 w-[82%] h-full bg-[#00E5A8] rounded-full shadow-[0_0_10px_rgba(0,229,168,0.5)]"></div>
                        </div>
                        <div className="flex gap-5 text-sm mt-1 font-medium">
                            <span className="text-[#94A3B8]">
                                Income:{" "}
                                <span className="text-white">$30,000</span>
                            </span>
                            <span className="text-[#94A3B8]">
                                Expenses:{" "}
                                <span className="text-white">$5,468</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto">
                    <div className="bg-[#0F2A3F]/50 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        {/* Top toggle (Sign Up / Login) */}
                        <div className="flex relative bg-black/40 rounded-xl p-1.5 mb-8 shadow-inner">
                            {/* Sliding green background highlight */}
                            <div
                                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#00E5A8] rounded-lg transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) shadow-[0_4px_12px_rgba(0,229,168,0.2)]"
                                style={{
                                    transform: isLogin
                                        ? "translateX(calc(100% + 12px))"
                                        : "translateX(0)",
                                }}></div>

                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ${!isLogin ? "text-[#0B1C2C]" : "text-[#94A3B8] hover:text-white"}`}>
                                Sign Up
                            </button>
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 relative z-10 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ${isLogin ? "text-[#0B1C2C]" : "text-[#94A3B8] hover:text-white"}`}>
                                Login
                            </button>
                        </div>

                        {/* Form Container (Smooth Auto Height) */}
                        <div
                            ref={containerRef}
                            className="relative transition-all duration-500 ease-in-out"
                            style={{
                                height: containerHeight
                                    ? `${containerHeight}px`
                                    : "auto",
                            }}>
                            {/* --- SIGN UP FORM --- */}
                            <div
                                ref={signUpRef}
                                className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${isLogin ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0 "}`}>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#94A3B8]">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00E5A8] transition-colors">
                                                <User className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={Name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="w-full bg-black/20 border border-white/5 text-white text-[15px] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8]/30 transition-all placeholder-gray-600 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#94A3B8]">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00E5A8] transition-colors">
                                                <Mail className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={Email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                className="w-full bg-black/20 border border-white/5 text-white text-[15px] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8]/30 transition-all placeholder-gray-600 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#94A3B8]">
                                            Password
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00E5A8] transition-colors">
                                                <Lock className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={Password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="••••••••"
                                                className="w-full bg-black/20 border border-white/5 text-white text-[15px] rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8]/30 transition-all placeholder-gray-600 shadow-inner"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-3.5 flex items-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }>
                                                {showPassword ? (
                                                    <EyeOff className="w-4.5 h-4.5" />
                                                ) : (
                                                    <Eye className="w-4.5 h-4.5" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#00E5A8] hover:bg-[#00D49B] hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] text-[#0B1C2C] text-[15px] font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,229,168,0.4)] mt-2">
                                        Create Account
                                    </button>

                                    <p className="text-[13px] text-center text-[#94A3B8] mt-2 mb-2 font-medium">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            className="text-[#00E5A8] font-bold hover:underline transition-all hover:brightness-110"
                                            onClick={() => setIsLogin(true)}>
                                            Login
                                        </button>
                                    </p>

                                    {/* Social Login Separator */}
                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-white/10"></div>
                                        <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            or continue with
                                        </span>
                                        <div className="flex-grow border-t border-white/10"></div>
                                    </div>

                                    {/* Social Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-black/20 border border-white/5 text-gray-300 text-[14px] font-bold hover:bg-white/5 hover:text-white transition-all group">
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="group-hover:scale-110 transition-transform">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            Google
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-black/20 border border-white/5 text-gray-300 text-[14px] font-bold hover:bg-white/5 hover:text-white transition-all group">
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                className="group-hover:scale-110 transition-transform">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                                />
                                            </svg>
                                            GitHub
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* --- LOGIN FORM --- */}
                            <div
                                ref={loginRef}
                                className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${!isLogin ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0 "}`}>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-[#94A3B8]">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00E5A8] transition-colors">
                                                <Mail className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                className="w-full bg-black/20 border border-white/5 text-white text-[15px] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8]/30 transition-all placeholder-gray-600 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[13px] font-semibold text-[#94A3B8]">
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                className="text-[12px] font-bold text-[#00E5A8] hover:underline hover:brightness-110 transition-colors">
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00E5A8] transition-colors">
                                                <Lock className="w-4.5 h-4.5" />
                                            </div>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                className="w-full bg-black/20 border border-white/5 text-white text-[15px] rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8]/30 transition-all placeholder-gray-600 shadow-inner"
                                            />
                                            <div
                                                className="absolute inset-y-0 right-3.5 flex items-center cursor-pointer text-gray-500 hover:text-white transition-colors"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }>
                                                {showPassword ? (
                                                    <EyeOff className="w-4.5 h-4.5" />
                                                ) : (
                                                    <Eye className="w-4.5 h-4.5" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#00E5A8] hover:bg-[#00D49B] hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] text-[#0B1C2C] text-[15px] font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,229,168,0.4)] mt-4">
                                        Login
                                    </button>

                                    <p className="text-[13px] text-center text-[#94A3B8] mt-2 mb-2 font-medium">
                                        Don't have an account?{" "}
                                        <button
                                            type="button"
                                            className="text-[#00E5A8] font-bold hover:underline transition-all hover:brightness-110"
                                            onClick={() => setIsLogin(false)}>
                                            Sign Up
                                        </button>
                                    </p>

                                    {/* Social Login Separator */}
                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-white/10"></div>
                                        <span className="flex-shrink-0 mx-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            or continue with
                                        </span>
                                        <div className="flex-grow border-t border-white/10"></div>
                                    </div>

                                    {/* Social Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-black/20 border border-white/5 text-gray-300 text-[14px] font-bold hover:bg-white/5 hover:text-white transition-all group">
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="group-hover:scale-110 transition-transform">
                                                <path
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    fill="#4285F4"
                                                />
                                                <path
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    fill="#34A853"
                                                />
                                                <path
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    fill="#FBBC05"
                                                />
                                                <path
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    fill="#EA4335"
                                                />
                                            </svg>
                                            Google
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-black/20 border border-white/5 text-gray-300 text-[14px] font-bold hover:bg-white/5 hover:text-white transition-all group">
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                className="group-hover:scale-110 transition-transform">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                                />
                                            </svg>
                                            GitHub
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
