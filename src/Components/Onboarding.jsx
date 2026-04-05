import React, { useState, useEffect } from "react";
import { Wallet, IndianRupee, Target, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward (if needed)

    // Form State
    const [role, setRole] = useState(null); // 'student' | 'working'
    const [income, setIncome] = useState("");
    const [budget, setBudget] = useState("");
    const [category, setCategory] = useState(null); // 'food' | 'shopping' | 'travel' | 'entertainment'
    const [savings, setSavings] = useState("");

    // Animation State
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [renderStep, setRenderStep] = useState(1);

    const handleNext = () => {
        if (step === 6) return; // Final screen

        setIsTransitioning(true);
        setTimeout(() => {
            setRenderStep(step + 1);
            setStep(step + 1);
            setIsTransitioning(false);
        }, 400); // Wait 400ms for out transition
    };

    const isStepValid = () => {
        switch (renderStep) {
            case 1:
                return role !== null;
            case 2:
                return income !== "" && Number(income) > 0;
            case 3:
                return budget !== "" && Number(budget) > 0;
            case 4:
                return category !== null;
            case 5:
                return savings !== "" && Number(savings) > 0;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B1C2C] to-[#0F2A3F] flex flex-col items-center justify-center relative overflow-hidden font-sans">
            <style>{`
        @keyframes slideOutTop {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes slideInBottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .step-exit {
          animation: slideOutTop 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .step-enter {
          animation: slideInBottom 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        /* Webkit specific tweaks to remove number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>

            {/* Background Radial Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(0,229,168,0.08), transparent 70%)",
                    filter: "blur(120px)",
                }}></div>

            {/* Header Logo */}
            <header className="absolute top-0 w-full p-8 flex justify-center items-center z-10 select-none">
                <Wallet className="text-[#00E5A8] w-6 h-6 mr-3" />
                <span className="text-white font-bold text-2xl tracking-wide">
                    SpendWise
                </span>
            </header>

            {/* Main Content Container */}
            <div className="w-full max-w-2xl px-6 z-10 flex flex-col items-center mt-12">
                {/* Progress System (Hidden on Step 6) */}
                {renderStep <= 5 && (
                    <div className="w-full max-w-xl mb-12">
                        <div className="flex justify-between items-center text-sm mb-3">
                            <span className="text-[#94A3B8]">
                                Step {renderStep} of 5
                            </span>
                            <span className="text-[#00E5A8] font-bold">
                                {renderStep * 20}%
                            </span>
                        </div>
                        <div className="w-full h-[6px] bg-white/10 rounded-full">
                            <div
                                className="h-full bg-[#00E5A8] ease-[cubic-bezier(0.4,0,0.2,1)] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(0,229,168,0.5)]"
                                style={{ width: `${renderStep * 20}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Form Card Container */}
                <div className="w-full relative">
                    <div
                        className={`w-full ${isTransitioning ? "step-exit" : "step-enter"}`}>
                        {/* Steps Rendering */}
                        {renderStep === 1 && (
                            <Card>
                                <StepHeader title="Are you a student or a working professional?" />
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <OptionBox
                                        icon="🎓"
                                        label="Student"
                                        selected={role === "student"}
                                        onClick={() => setRole("student")}
                                    />
                                    <OptionBox
                                        icon="💼"
                                        label="Working"
                                        selected={role === "working"}
                                        onClick={() => setRole("working")}
                                    />
                                </div>
                            </Card>
                        )}

                        {renderStep === 2 && (
                            <Card>
                                <StepHeader title="What is your monthly income?" />
                                <div className="mt-8">
                                    <InputBox
                                        icon={
                                            <IndianRupee className="w-5 h-5 text-[#94A3B8]" />
                                        }
                                        placeholder="5000"
                                        value={income}
                                        onChange={(e) =>
                                            setIncome(e.target.value)
                                        }
                                        subtitle="Enter your estimated monthly income in INR"
                                    />
                                </div>
                            </Card>
                        )}

                        {renderStep === 3 && (
                            <Card>
                                <StepHeader title="What is your monthly budget?" />
                                <div className="mt-8">
                                    <InputBox
                                        icon={
                                            <Wallet className="w-5 h-5 text-[#94A3B8]" />
                                        }
                                        placeholder="3000"
                                        value={budget}
                                        onChange={(e) =>
                                            setBudget(e.target.value)
                                        }
                                        subtitle="How much do you plan to spend each month?"
                                    />
                                </div>
                            </Card>
                        )}

                        {renderStep === 4 && (
                            <Card>
                                <StepHeader title="What do you spend the most on?" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                                    <OptionBox
                                        icon="🍔"
                                        label="Food"
                                        compact
                                        selected={category === "food"}
                                        onClick={() => setCategory("food")}
                                    />
                                    <OptionBox
                                        icon="🛍️"
                                        label="Shopping"
                                        compact
                                        selected={category === "shopping"}
                                        onClick={() => setCategory("shopping")}
                                    />
                                    <OptionBox
                                        icon="✈️"
                                        label="Travel"
                                        compact
                                        selected={category === "travel"}
                                        onClick={() => setCategory("travel")}
                                    />
                                    <OptionBox
                                        icon="🎮"
                                        label="Entertainment"
                                        compact
                                        selected={category === "entertainment"}
                                        onClick={() =>
                                            setCategory("entertainment")
                                        }
                                    />
                                </div>
                            </Card>
                        )}

                        {renderStep === 5 && (
                            <Card>
                                <StepHeader title="What is your monthly savings goal?" />
                                <div className="mt-8">
                                    <InputBox
                                        icon={
                                            <Target className="w-5 h-5 text-[#94A3B8]" />
                                        }
                                        placeholder="1000"
                                        value={savings}
                                        onChange={(e) =>
                                            setSavings(e.target.value)
                                        }
                                        subtitle="How much would you like to save each month?"
                                        hasSpinners
                                    />
                                </div>
                            </Card>
                        )}

                        {renderStep === 6 && (
                            <AnalyzingScreen
                                navigate={navigate}
                                income={income}
                                role={role}
                                budget={budget}
                                category={category}
                                savings={savings}
                            />
                        )}

                        {/* Continue Button */}
                        {renderStep <= 5 && (
                            <div className="mt-8">
                                <button
                                    disabled={!isStepValid()}
                                    onClick={handleNext}
                                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                                        isStepValid()
                                            ? "bg-gradient-to-r from-[#00E5A8] to-[#00c993] text-[#0f2a3f] shadow-[0_0_20px_rgba(0,229,168,0.4)] hover:shadow-[0_0_40px_rgba(0,229,168,0.6)] hover:scale-[1.02] active:scale-98 opacity-100 cursor-pointer"
                                            : "bg-white/10 text-white opacity-40 cursor-not-allowed"
                                    }`}>
                                    Continue
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Question mark bottom right */}
            <button className="absolute bottom-6 right-6 w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center text-[#94A3B8] hover:bg-white/10 transition-colors">
                ?
            </button>
        </div>
    );
}

function Card({ children }) {
    return (
        <div className="w-full max-w-[600px] mx-auto bg-[#0f2a3f]/50 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5),_0_0_40px_rgba(0,229,168,0.05)]">
            {children}
        </div>
    );
}

function StepHeader({ title }) {
    return (
        <div>
            <p className="text-[#00E5A8] text-sm font-medium mb-3 tracking-wide">
                Let's personalize your experience
            </p>
            <h1 className="text-white font-bold text-3xl sm:text-4xl leading-tight">
                {title}
            </h1>
        </div>
    );
}

function OptionBox({ icon, label, selected, onClick, compact }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center rounded-xl border transition-all cursor-pointer h-full min-h-[140px] bg-transparent
      ${compact ? "sm:min-h-[130px] min-h-[110px]" : ""}
      ${
          selected
              ? "border-[#00E5A8] shadow-[0_0_0_1px_rgba(0,229,168,0.3),_0_0_20px_rgba(0,229,168,0.4),_0_0_40px_rgba(0,229,168,0.2),_inset_0_0_20px_rgba(0,229,168,0.05)] scale-[1.03] opacity-100 duration-[300ms] ease-in-out"
              : "border-white/10 opacity-60 hover:opacity-100 hover:scale-[1.03] hover:border-white/20 hover:shadow-[0_0_15px_rgba(0,229,168,0.2)] duration-[250ms] ease-out"
      }
      `}>
            <span
                className={`${compact ? "text-3xl" : "text-5xl"} mb-3 drop-shadow-lg`}>
                {icon}
            </span>
            <span className="text-white font-medium text-sm sm:text-base">
                {label}
            </span>
        </button>
    );
}

function InputBox({
    icon,
    placeholder,
    value,
    onChange,
    subtitle,
    hasSpinners,
}) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div>
            <div
                className={`flex items-center px-5 py-4 rounded-xl border transition-all duration-300 bg-transparent ${
                    isFocused
                        ? "border-[#00E5A8] shadow-[0_0_0_4px_rgba(0,229,168,0.15)] ring-1 ring-[#00E5A8]"
                        : "border-white/10 hover:border-white/20"
                }`}>
                <div className="shrink-0 mr-3">{icon}</div>
                <input
                    type="number"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-[#94A3B8]/50 w-full"
                />
                {hasSpinners && (
                    <div className="flex flex-col ml-3 shrink-0 text-[#94A3B8]">
                        <button
                            className="hover:text-white transition-colors"
                            onClick={() =>
                                onChange({
                                    target: {
                                        value: String(Number(value || 0) + 100),
                                    },
                                })
                            }>
                            ▲
                        </button>
                        <button
                            className="hover:text-white transition-colors mt-1"
                            onClick={() =>
                                onChange({
                                    target: {
                                        value: Math.max(
                                            0,
                                            Number(value || 0) - 100,
                                        ),
                                    },
                                })
                            }>
                            ▼
                        </button>
                    </div>
                )}
            </div>
            <p className="text-[#94A3B8] text-xs sm:text-sm mt-4 font-medium">
                {subtitle}
            </p>
        </div>
    );
}

function AnalyzingScreen({
    navigate,
    income,
    role,
    budget,
    category,
    savings,
}) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setProgress(1), 0);
        const t2 = setTimeout(() => setProgress(2), 800);
        const t3 = setTimeout(() => setProgress(3), 1600);
        const t4 = setTimeout(() => setProgress(4), 2600); // Done state

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, []);
    useEffect(() => {
        if (progress === 4) {
            const timer = setTimeout(() => {
                navigate("/dashboard", {
                    state: { income, role, budget, category, savings },
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [progress]);

    return (
        <div className="w-full max-w-[600px] mx-auto bg-[#0f2a3f]/50 backdrop-blur-[20px] border border-white/5 rounded-[24px] p-10 sm:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.5),_0_0_40px_rgba(0,229,168,0.05)] flex flex-col items-center justify-center min-h-[400px]">
            {/* Loader */}
            <div className="mb-8 relative">
                <Loader2 className="w-16 h-16 text-[#00E5A8] animate-spin" />
                <div className="absolute inset-0 rounded-full blur-[20px] bg-[#00E5A8]/20 animate-pulse"></div>
            </div>

            {/* Headings */}
            <h2 className="text-white font-bold text-2xl mb-2 text-center">
                Analyzing your data...
            </h2>
            <p className="text-[#94A3B8] text-sm mb-10 text-center">
                Preparing your personalized dashboard...
            </p>

            {/* Steps Sequence */}
            <ul className="space-y-5 w-full max-w-sm px-6">
                <SequenceItem
                    show={progress >= 1}
                    completed={progress > 1}
                    text="Processing your financial profile"
                />
                <SequenceItem
                    show={progress >= 2}
                    completed={progress > 2}
                    text="Generating personalized insights"
                />
                <SequenceItem
                    show={progress >= 3}
                    completed={progress >= 3} // Mark completed immediately for the last one or wait till 4
                    text="Creating your dashboard"
                />
            </ul>

            {/* Final Text */}
            <div
                className={`mt-10 transition-all duration-700 transform ${progress === 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}>
                <p className="text-[#00E5A8] font-bold text-lg inline-flex items-center space-x-2 drop-shadow-[0_0_10px_rgba(0,229,168,0.5)]">
                    <span>✨</span>
                    <span>Almost ready!</span>
                    <span>✨</span>
                </p>
            </div>
        </div>
    );
}

function SequenceItem({ show, completed, text }) {
    return (
        <li
            className={`flex items-center space-x-4 transition-all duration-500 ease-out transform ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <div
                    className={`transition-all duration-300 w-full h-full rounded-full flex items-center justify-center ${completed ? "bg-[#00E5A8]/20" : "border border-white/20"}`}>
                    {completed && (
                        <CheckCircle className="text-[#00E5A8] w-4 h-4 animate-[checkPop_300ms_ease-out_forwards]" />
                    )}
                </div>
            </div>
            <span
                className={`text-sm font-medium transition-colors duration-300 ${completed ? "text-white" : "text-[#94A3B8]"}`}>
                {text}
            </span>
        </li>
    );
}
