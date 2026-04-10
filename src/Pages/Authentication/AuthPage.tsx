import React, { useState, useRef, useEffect } from "react";
import {
    TrendingUp,
    PieChart,
    Target,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Height animation refs
    const containerRef = useRef<HTMLDivElement>(null);
    const signUpRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [globalError, setGlobalError] = useState("");

    // Measure content to animate container height
    useEffect(() => {
        if (isLogin && loginRef.current) {
            setContainerHeight(loginRef.current.offsetHeight);
        } else if (!isLogin && signUpRef.current) {
            setContainerHeight(signUpRef.current.offsetHeight);
        }
    }, [isLogin]);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setGlobalError(""); // clear previous error

        if (!isLogin) {
            if (!Name.trim()) {
                setGlobalError("Please enter your full name.");
                return;
            }

            if (!Email.includes("@")) {
                setGlobalError("Please enter a valid email address.");
                return;
            }

            if (Password.length < 6) {
                setGlobalError("Password must be at least 6 characters.");
                return;
            }

            try {
                const response = await fetch(
                    "https://spendwise-backend-e7xj.onrender.com/api/auth/signup",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: Name,
                            email: Email,
                            password: Password,
                        }),
                    },
                );
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("spendwise_token", data.token);
                    navigate("/onboarding");
                } else {
                    setGlobalError(data.message || "Signup failed.");
                }
            } catch (err) {
                setGlobalError("Something went wrong, please try again.");
            }
        } else {
            if (!Email.includes("@") || Password.length < 1) {
                setGlobalError("Invalid email or password.");
                return;
            }

            try {
                const response = await fetch(
                    "https://spendwise-backend-e7xj.onrender.com/api/auth/login",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: Email,
                            password: Password,
                        }),
                    },
                );
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("spendwise_token", data.token);
                    navigate("/dashboard");
                } else {
                    setGlobalError(data.message || "Login failed.");
                }
            } catch (err) {
                setGlobalError("Something went wrong, please try again.");
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setGlobalError("");
        try {
            const res = await fetch(
                "https://spendwise-backend-e7xj.onrender.com/api/auth/google",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        credential: credentialResponse.credential,
                    }),
                },
            );
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("spendwise_token", data.token);
                navigate("/onboarding");
            } else {
                setGlobalError(data.message || "Google Login failed.");
            }
        } catch (err) {
            setGlobalError("Something went wrong, please try again.");
        }
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
                        Smart expense tracking with personalized insights tailored
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

                        {globalError && (
                            <div className="mb-6 p-3.5 rounded-xl bg-[#ff4d4d]/10 border border-[#ff4d4d]/20 text-[#ff4d4d] text-[13px] font-semibold flex items-center gap-2.5 animate-[fadeIn_0.3s_ease-in-out]">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{globalError}</span>
                            </div>
                        )}

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
                                    <div className="flex justify-center mt-2">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => setGlobalError("Google Login Failed")}
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* --- LOGIN FORM --- */}
                            <div
                                ref={loginRef}
                                className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${!isLogin ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0 "}`}>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={handleSubmit}>
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
                                                value={Email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                                value={Password}
                                                onChange={(e) => setPassword(e.target.value)}
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
                                    <div className="flex justify-center mt-2">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => setGlobalError("Google Login Failed")}
                                        />
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
