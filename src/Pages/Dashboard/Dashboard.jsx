import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Wallet,
    DollarSign,
    TrendingUp,
    Target,
    Edit2,
    AlertCircle,
    Plus,
    Trash2,
    X,
    CheckSquare,
    FastForward,
    CheckCircle2,
    PieChart as PieIcon,
    AlertTriangle,
    Calendar,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import Onboarding from "../../Components/Onboarding.jsx";
import { useNavigate } from "react-router-dom";

// HELPER FUNCTION (REQUIRED)
const buildAutoCategories = (budget) => {
    const distribution = [
        { name: "Food", percent: 0.3 },
        { name: "Transportation", percent: 0.15 },
        { name: "Entertainment", percent: 0.1 },
        { name: "Shopping", percent: 0.15 },
        { name: "Bills", percent: 0.25 },
        { name: "Healthcare", percent: 0.03 },
        { name: "others", percent: 0.02 },
    ];

    let total = 0;

    const categories = distribution.map((item, index) => {
        const value = Math.round(budget * item.percent);
        total += value;

        return {
            id: index + 1,
            name: item.name,
            budget: value,
            spent: 0,
        };
    });

    const diff = budget - total;
    if (diff !== 0) {
        categories[categories.length - 1].budget += diff;
    }

    return categories;
};

const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const duration = 500; // ms
        const startValue = displayValue;
        const endValue = value;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
                (timestamp - startTimestamp) / duration,
                1,
            );
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(
                Math.floor(easeOut * (endValue - startValue) + startValue),
            );
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};

const Dashboard = () => {
    const navigate = useNavigate();

    // User Quiz Defaults
    const [income, setIncome] = useState(0);
    const [role, setRole] = useState("working");
    const [budget, setBudget] = useState(0);
    const [savings, setSavings] = useState(0);

    // ✅ categories initial state (REQUIRED)
    const [categories, setCategories] = useState([]);
    // ✅ ADD AUTO DISTRIBUTION FLAG (REQUIRED)
    const [isAutoDistributed, setIsAutoDistributed] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedFilterCategory, setSelectedFilterCategory] = useState("All Categories");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Edit Modals State
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const [profileEditForm, setProfileEditForm] = useState({
        monthlyIncome: 0,
        monthlyBudget: 0,
        savingGoal: 0,
        userType: "working",
    });
    const [profileEditErrors, setProfileEditErrors] = useState({});

    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryEditError, setCategoryEditError] = useState("");

    // --- SMART BUDGET LOGIC ---
    const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);
    const [isHighlightingCategories, setIsHighlightingCategories] =
        useState(false);
    const wasUnderBudgetRef = useRef(true);

    // Reset alert tracking on month change
    useEffect(() => {
        wasUnderBudgetRef.current = true;
    }, [selectedMonth]);

    const scrollToCategories = () => {
        setIsCriticalModalOpen(false);
        const element = document.getElementById("budget-allocations");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setIsHighlightingCategories(true);
            setTimeout(() => setIsHighlightingCategories(false), 3000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("spendwise_token");
        navigate("/login");
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("spendwise_token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                let fetchedCategories = null;
                let fetchedBudget = 0;

                // Fetch User Profile Dashboard Limits
                const profileRes = await fetch(
                    "https://spendwise-backend-e7xj.onrender.com/api/user/profile",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );

                if (profileRes.status === 401) {
                    localStorage.removeItem("spendwise_token");
                    navigate("/login");
                    return;
                }

                if (profileRes.ok) {
                    const profileData = await profileRes.json();

                    const q = profileData.quizData;
                    if (
                        !q ||
                        !q.monthlyIncome ||
                        !q.monthlyBudget ||
                        !q.savingGoal
                    ) {
                        navigate("/onboarding");
                        return;
                    }

                    if (profileData.quizData) {
                        setIncome(profileData.quizData.monthlyIncome || 0);
                        setRole(profileData.quizData.userType || "working");
                        // 🔴 CRITICAL FIXES: Use fetchedBudget local variable (REQUIRED)
                        fetchedBudget = profileData.quizData.monthlyBudget || 0;
                        setBudget(fetchedBudget);
                        setSavings(profileData.quizData.savingGoal || 0);
                    }
                    if (
                        profileData.categories &&
                        profileData.categories.length > 0
                    ) {
                        fetchedCategories = profileData.categories.map(
                            (c, i) => ({
                                id: c._id || i + 1,
                                name: c.name,
                                budget: c.budget,
                                spent: 0,
                            }),
                        );
                    }
                }

                // Fetch Expenses
                const expensesRes = await fetch(
                    "https://spendwise-backend-e7xj.onrender.com/api/expenses/get",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );

                if (expensesRes.status === 401) {
                    localStorage.removeItem("spendwise_token");
                    navigate("/login");
                    return;
                }

                if (expensesRes.ok) {
                    const expensesData = await expensesRes.json();

                    const formattedExpenses = expensesData.map((e) => ({
                        id: e._id,
                        category: e.category,
                        amount: e.amount,
                        description: e.title,
                        date: e.date,
                    }));
                    setExpenses(formattedExpenses);

                    // ✅ UPDATE fetchData LOGIC (CORE FIX - REQUIRED)
                    setCategories(() => {
                        let base;

                        if (fetchedCategories && fetchedCategories.length > 0) {
                            base = fetchedCategories;
                            setIsAutoDistributed(false);
                        } else if (fetchedBudget > 0) {
                            base = buildAutoCategories(fetchedBudget);
                            setIsAutoDistributed(true);
                        } else {
                            base = [];
                        }

                        // ✅ SPENT CALCULATION (REQUIRED)
                        const newCategories = base.map((cat) => ({
                            ...cat,
                            spent: 0,
                        }));
                        formattedExpenses.forEach((exp) => {
                            const cat = newCategories.find(
                                (c) => c.name === exp.category,
                            );
                            if (cat) cat.spent += exp.amount;
                        });
                        return newCategories;
                    });
                }
            } catch (err) {
                console.error("Dashboard Fetch Error", err);
            }
        };
        fetchData();
    }, [navigate]);

    // --- REACTIVE ANALYTICS ENGINE (MONTH-WISE) ---
    
    // 1. Filter expenses for the selected month
    const filteredByMonthExpenses = useMemo(() => {
        return expenses.filter(exp => {
            const d = new Date(exp.date);
            return (
                d.getMonth() === selectedMonth.getMonth() &&
                d.getFullYear() === selectedMonth.getFullYear()
            );
        });
    }, [expenses, selectedMonth]);

    // 2. Compute category spending dynamically (Reactive Source of Truth)
    const categoriesWithSpent = useMemo(() => {
        return categories.map(cat => ({
            ...cat,
            spent: filteredByMonthExpenses
                .filter(e => e.category === cat.name)
                .reduce((sum, e) => sum + e.amount, 0)
        }));
    }, [categories, filteredByMonthExpenses]);

    // 3. Derive global metrics from computed data
    const totalSpent = useMemo(() => 
        categoriesWithSpent.reduce((sum, cat) => sum + cat.spent, 0)
    , [categoriesWithSpent]);

    const spendingPercentage = useMemo(() => 
        budget === 0 ? 0 : (totalSpent / budget) * 100
    , [totalSpent, budget]);

    useEffect(() => {
        if (budget <= 0) return;

        const isCurrentlyOver = totalSpent > budget;

        // ✅ Trigger ONLY when crossing from under → over
        if (wasUnderBudgetRef.current && isCurrentlyOver) {
            setIsCriticalModalOpen(true);
        }

        // ✅ Update state for next render
        wasUnderBudgetRef.current = !isCurrentlyOver;
    }, [totalSpent, budget]);

    // Modal Form State
    const [newExpense, setNewExpense] = useState({
        category: "Food",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [formErrors, setFormErrors] = useState({});

    const topCategory = useMemo(() => {
        return categoriesWithSpent.reduce((prev, current) => {
            return (prev && prev.spent > current.spent) ? prev : current;
        }, null);
    }, [categoriesWithSpent]);

    const finalFilteredExpenses = useMemo(() => {
        return selectedFilterCategory === "All Categories"
            ? filteredByMonthExpenses
            : filteredByMonthExpenses.filter(exp => exp.category === selectedFilterCategory);
    }, [filteredByMonthExpenses, selectedFilterCategory]);

    // Generate last 6 months for selector
    const monthOptions = useMemo(() => {
        return Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setDate(1); // Set to 1st to avoid month overflow issues
            d.setMonth(d.getMonth() - i);
            return d;
        });
    }, []);

    const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

    const handleAddExpense = async (e) => {
        e.preventDefault();

        if (!newExpense.description.trim()) {
            setFormErrors({ description: "Please fill out this field." });
            return;
        }

        const amount = parseFloat(newExpense.amount);
        if (isNaN(amount) || amount <= 0) {
            setFormErrors({ amount: "Enter a valid amount." });
            return;
        }

        try {
            const token = localStorage.getItem("spendwise_token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await fetch(
                "https://spendwise-backend-e7xj.onrender.com/api/expenses/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: newExpense.description,
                        amount: amount,
                        category: newExpense.category,
                        date: newExpense.date,
                    }),
                },
            );

            if (response.ok) {
                const addedExpenseData = await response.json();

                const expenseToAdd = {
                    id: addedExpenseData._id,
                    description: addedExpenseData.title,
                    amount: addedExpenseData.amount,
                    category: addedExpenseData.category,
                    date: addedExpenseData.date,
                };

                setExpenses((prev) => [expenseToAdd, ...prev]);

                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.name === addedExpenseData.category
                            ? { ...cat, spent: cat.spent + amount }
                            : cat,
                    ),
                );

                setNewExpense({
                    category: "Food",
                    amount: "",
                    description: "",
                    date: new Date().toISOString().split("T")[0],
                });
                setFormErrors({});
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Add expense error", error);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            const token = localStorage.getItem("spendwise_token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await fetch(
                `https://spendwise-backend-e7xj.onrender.com/api/expenses/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.ok) {
                const expenseToDelete = expenses.find((e) => e.id === id);
                if (expenseToDelete) {
                    setExpenses((prev) => prev.filter((e) => e.id !== id));
                    setCategories((prev) =>
                        prev.map((cat) =>
                            cat.name === expenseToDelete.category
                                ? {
                                      ...cat,
                                      spent: Math.max(
                                          0,
                                          cat.spent - expenseToDelete.amount,
                                      ),
                                  }
                                : cat,
                        ),
                    );
                }
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const openProfileEdit = () => {
        setProfileEditForm({
            monthlyIncome: income,
            monthlyBudget: budget,
            savingGoal: savings,
            userType: role || "working",
        });
        setProfileEditErrors({});
        setIsProfileEditOpen(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        const incomeValue = Number(profileEditForm.monthlyIncome);
        const budgetValue = Number(profileEditForm.monthlyBudget);
        const savingsValue = Number(profileEditForm.savingGoal);

        if (
            profileEditForm.monthlyIncome < 0 ||
            profileEditForm.monthlyBudget < 0 ||
            profileEditForm.savingGoal < 0 ||
            profileEditForm.monthlyIncome === "" ||
            profileEditForm.monthlyBudget === "" ||
            profileEditForm.savingGoal === ""
        ) {
            setProfileEditErrors({
                general: "Please enter valid positive values.",
            });
            return;
        }
        // Budget > Income
        if (budgetValue > incomeValue) {
            setProfileEditErrors({
                general: "Budget cannot be greater than monthly income.",
            });
            return;
        }

        // Budget + Savings > Income
        if (budgetValue + savingsValue > incomeValue) {
            setProfileEditErrors({
                general:
                    "Budget + Savings cannot be greater than monthly income.",
            });
            return;
        }

        try {
            const token = localStorage.getItem("spendwise_token");
            const response = await fetch(
                "https://spendwise-backend-e7xj.onrender.com/api/user/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(profileEditForm),
                },
            );

            if (response.ok) {
                const data = await response.json();
                if (data.user && data.user.quizData) {
                    setIncome(data.user.quizData.monthlyIncome);
                    setBudget(data.user.quizData.monthlyBudget);
                    setSavings(data.user.quizData.savingGoal);
                    setRole(data.user.quizData.userType);
                } else {
                    setIncome(parseFloat(profileEditForm.monthlyIncome));
                    setBudget(parseFloat(profileEditForm.monthlyBudget));
                    setSavings(parseFloat(profileEditForm.savingGoal));
                    setRole(profileEditForm.userType);
                }
                setIsProfileEditOpen(false);
            } else {
                setProfileEditErrors({
                    general: "Failed to update. Please try again.",
                });
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            setProfileEditErrors({
                general: "Failed to update. Please try again.",
            });
        }
    };;

    const openCategoryEdit = (cat) => {
        setEditingCategory({
            id: cat.id,
            name: cat.name,
            budget: cat.budget,
        });
        setCategoryEditError("");
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        const amt = parseFloat(editingCategory.budget);
        if (isNaN(amt) || amt < 0 || editingCategory.budget === "") {
            setCategoryEditError("Enter a valid positive amount");
            return;
        }

        try {
            const token = localStorage.getItem("spendwise_token");
            const response = await fetch(
                "https://spendwise-backend-e7xj.onrender.com/api/user/category-budget",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: editingCategory.name,
                        budget: amt,
                    }),
                },
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCategories((prev) =>
                        prev.map((c) =>
                            c.name === editingCategory.name
                                ? { ...c, budget: amt }
                                : c,
                        ),
                    );
                    setEditingCategory(null);
                } else {
                    setCategoryEditError(
                        data.message || "Failed to update. Please try again.",
                    );
                }
            } else {
                setCategoryEditError("Failed to update. Please try again.");
            }
        } catch (err) {
            console.error("Failed to update category", err);
            setCategoryEditError("Failed to update. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans w-full overflow-x-hidden absolute top-0 left-0 z-50 selection:bg-emerald-500/30">
            {/* Header */}
            <header className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-40 transition-all duration-300">
                <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all duration-300">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white leading-tight tracking-tight">
                            SpendWise
                        </h1>
                        <p className="text-xs text-slate-400 font-medium">
                            Smart Budget Tracking
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300">
                        Logout
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:scale-95">
                        <Plus size={18} />
                        Add Expense
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
                {/* Profile Card */}
                <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl flex justify-between items-center group transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.07]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                                {role === "student"
                                    ? "Student Mode"
                                    : "Working Professional Mode"}
                            </p>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                Monthly Income:{" "}
                                <span className="text-emerald-400">₹</span>
                                <AnimatedNumber value={income || 0} />
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={openProfileEdit}
                        className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-400/10">
                        Edit Profile
                    </button>
                </section>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Budget */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.07] hover:shadow-emerald-500/[0.05]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-semibold text-slate-400">
                                Total Budget
                            </p>
                            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                                <Wallet size={16} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">
                            ₹<AnimatedNumber value={budget} />
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                            Across {categories.length} categories
                        </p>
                    </div>

                    {/* Budget vs Spent */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.07] hover:shadow-emerald-500/[0.05]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-semibold text-slate-400">
                                Budget vs Spent
                            </p>
                            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                                <DollarSign size={16} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">
                            ₹<AnimatedNumber value={totalSpent} />{" "}
                            <span className="text-lg text-slate-500 font-medium tracking-normal">
                                / ₹{budget.toLocaleString()}
                            </span>
                        </h3>
                        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                            <div
                                className={`h-full shadow-[0_0_12px_rgba(16,185,129,0.3)] rounded-full transition-all duration-1000 ease-out 
                                    ${spendingPercentage >= 100 ? "bg-red-500" : spendingPercentage >= 80 ? "bg-amber-500" : "bg-gradient-to-r from-emerald-500 to-teal-400"}`}
                                style={{
                                    width: `${Math.min(spendingPercentage, 100)}%`,
                                }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                            {totalSpent > 0
                                ? `${spendingPercentage.toFixed(1)}% of budget used`
                                : `No expenses for ${selectedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`}
                        </p>
                    </div>

                    {/* Remaining */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.07] hover:shadow-emerald-500/[0.05]">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-semibold text-slate-400">
                                Remaining
                            </p>
                            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">
                            ₹<AnimatedNumber value={budget - totalSpent} />
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                            {totalSpent > budget * 0.9 ? (
                                <span className="text-amber-400/80">
                                    Running low on budget
                                </span>
                            ) : totalSpent > 0 ? (
                                "Still within healthy limits"
                            ) : (
                                "Full budget available"
                            )}
                        </p>
                    </div>
                </div>

                {/* Goals & Top Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/3 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-xl transition-all duration-300 hover:border-emerald-500/10 hover:bg-white/[0.05] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="text-emerald-400">
                                    <Target size={20} />
                                </div>
                                <h3 className="font-bold text-white tracking-tight">
                                    Monthly Savings Goal
                                </h3>
                            </div>
                            <button className="text-slate-500 hover:text-slate-300 transition-colors">
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <h4 className="text-2xl font-bold text-white tracking-tight mt-1 mb-2">
                            <span className="text-emerald-400">₹</span>
                            <AnimatedNumber
                                value={
                                    totalSpent > 0
                                        ? income - totalSpent
                                        : savings
                                }
                            />
                            {totalSpent > 0 && savings > 0 && (
                                <span className="text-sm font-semibold text-slate-500 ml-2">
                                    of ₹{savings.toLocaleString()}
                                </span>
                            )}
                        </h4>

                        {totalSpent > 0 && savings > 0 ? (
                            <>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${Math.min(((income - totalSpent) / savings) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs font-bold mt-2.5">
                                    <span className="text-emerald-400">
                                        {Math.round(
                                            ((income - totalSpent) / savings) *
                                                100,
                                        )}
                                        % saved
                                    </span>
                                    <span className="text-slate-500">
                                        ₹
                                        {Math.max(
                                            0,
                                            income - totalSpent - savings,
                                        ).toLocaleString()}{" "}
                                        over goal
                                    </span>
                                </div>
                                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-500">
                                    <span className="text-sm">✨</span> Goal
                                    achieved! Keep it up!
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-4" />
                                <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                                    Track your expenses to see how much you're
                                    saving this month.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="bg-white/3 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-xl transition-all duration-300 hover:border-emerald-500/10 hover:bg-white/[0.05]">
                        <div className="flex items-center gap-2 mb-4 text-orange-400">
                            <TrendingUp size={20} />
                            <h3 className="font-bold text-white tracking-tight">
                                Top Spending Category
                            </h3>
                        </div>

                        {totalSpent === 0 ? (
                            <div className="flex items-center gap-4 mt-6 animate-pulse">
                                <div className="text-4xl opacity-20 filter grayscale">
                                    💰
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 tracking-tight">
                                        Not yet tracked
                                    </h4>
                                    <p className="text-[11px] text-slate-600 mt-1 font-medium">
                                        Add expenses to identify habits
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4 mt-4 animate-in slide-in-from-right-4 duration-500">
                                <div className="text-4xl shadow-inner p-1 bg-white/[0.03] rounded-xl">
                                    📊
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        {topCategory?.name || "N/A"}
                                    </h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-orange-400 tracking-tight">
                                            ₹
                                            <AnimatedNumber
                                                value={topCategory?.spent || 0}
                                            />
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500">
                                            (
                                            {Math.round(
                                                ((topCategory?.spent || 0) /
                                                    totalSpent) *
                                                    100,
                                            )}
                                            % of total)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Smart Alerts */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                        Smart Alerts
                    </h3>

                    {(() => {
                        if (totalSpent === 0) {
                            return (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex items-center justify-between group transition-all duration-500 hover:bg-blue-500/15 animate-in slide-in-from-left-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-tight">
                                                No data yet. Let's start
                                                tracking!
                                            </p>
                                            <p className="text-blue-400/70 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                                Strategic Initialization
                                                Required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        if (spendingPercentage < 80) {
                            return (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between group transition-all duration-500 hover:bg-emerald-500/15 animate-in slide-in-from-left-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-tight">
                                                Doing great! Your spending is
                                                well within limits.
                                            </p>
                                            <p className="text-emerald-400/70 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                                Optimal Financial Trajectory
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        if (spendingPercentage < 100) {
                            return (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between group transition-all duration-500 hover:bg-amber-500/15 animate-in slide-in-from-left-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-tight">
                                                Caution: You've used{" "}
                                                {Math.round(spendingPercentage)}
                                                % of your budget.
                                            </p>
                                            <p className="text-amber-400/70 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                                Think before your next expense
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-center justify-between group transition-all duration-500 hover:bg-red-500/15 animate-in shake-in">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] pulse-subtle">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm tracking-tight">
                                            Budget Exceeded! You are ₹
                                            {(
                                                totalSpent - budget
                                            ).toLocaleString()}{" "}
                                            over your limit.
                                        </p>
                                        <p className="text-red-400/70 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                                            Immediate action recommended
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {totalSpent === 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full mt-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-2xl py-5 font-bold transition-all flex items-center justify-center gap-3 group shadow-inner">
                            <Plus
                                size={20}
                                className="group-hover:rotate-90 transition-transform duration-300"
                            />
                            Initialize Dashboard with an Expense
                        </button>
                    )}
                </div>

                {/* Analytics Segment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Donut Chart */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8 flex flex-col h-[400px]">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-6 flex items-center gap-2">
                            <PieIcon size={14} className="text-emerald-400" />
                            Category Distribution
                        </h3>
                        {totalSpent > 0 ? (
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoriesWithSpent.filter(c => c.spent > 0).map(c => ({ name: c.name, value: c.spent }))}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoriesWithSpent.filter(c => c.spent > 0).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#111827', 
                                                border: '1px solid rgba(255,255,255,0.1)', 
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: 'bold',
                                                color: '#fff'
                                            }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <PieIcon size={40} className="text-slate-600 mb-3 opacity-20" />
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No Distribution Data</p>
                            </div>
                        )}
                    </div>

                    {/* Spending Overview Chart */}
                    <div className="flex flex-col h-[400px]">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-6">
                            Spending Overview
                        </h3>
                        <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-8 pb-4 relative overflow-hidden flex-1">
                            {/* Chart Grid Lines */}
                            <div className="absolute inset-0 px-12 py-8 pointer-events-none flex flex-col justify-between">
                                {[10000, 7500, 5000, 2500, 0].map((val, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center w-full">
                                        <span className="text-[10px] font-bold text-slate-600 w-10 pr-3 text-right">
                                            {val}
                                        </span>
                                        <div className="flex-1 border-b border-white/[0.03]"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart Bars Container */}
                            <div className="absolute inset-0 px-12 pb-10 pt-8 flex items-end justify-between pl-24 pr-12">
                                {categoriesWithSpent.map((cat, i) => {
                                    const budgetHeightPct =
                                        (cat.budget /
                                            (Math.max(
                                                ...categoriesWithSpent.map((c) => c.budget),
                                            ) || 10000)) *
                                        100;
                                    const spentHeightPct =
                                        (cat.spent /
                                            (Math.max(
                                                ...categoriesWithSpent.map((c) => c.budget),
                                            ) || 10000)) *
                                        100;
                                    const usedPct =
                                        cat.budget > 0
                                            ? (cat.spent / cat.budget) * 100
                                            : 0;

                                    return (
                                        <div
                                            key={cat.id}
                                            className="relative w-16 h-full flex items-end group">
                                            {/* Hover tooltip */}
                                            {totalSpent > 0 && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-16 left-1/2 -translate-x-1/2 bg-[#1e293b]/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-3 text-[10px] z-10 whitespace-nowrap pointer-events-none transform -translate-y-2 group-hover:translate-y-0 min-w-[120px]">
                                                    <div className="font-bold text-white mb-2 flex items-center justify-between border-b border-white/5 pb-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-1.5 h-1.5 rounded-full ${usedPct >= 100 ? "bg-red-500" : usedPct >= 80 ? "bg-amber-500" : "bg-emerald-500"}`}></div>
                                                            {cat.name}
                                                        </div>
                                                        <span
                                                            className={`px-1 rounded ${usedPct >= 100 ? "text-red-400 bg-red-500/10" : usedPct >= 80 ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
                                                            {usedPct >= 100
                                                                ? "CRITICAL"
                                                                : usedPct >= 80
                                                                  ? "WARNING"
                                                                  : "SAFE"}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between items-center text-emerald-400 font-bold">
                                                            <span>Spent:</span>
                                                            <span>
                                                                ₹
                                                                {cat.spent.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-slate-400 font-medium">
                                                            <span>Budget:</span>
                                                            <span>
                                                                ₹
                                                                {cat.budget.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-[6px] border-transparent border-t-[#1e293b]/95"></div>
                                                </div>
                                            )}

                                            <div
                                                className="w-full relative flex items-end px-2"
                                                style={{ height: "100%" }}>
                                                <div
                                                    className="absolute bottom-0 left-2 right-2 bg-white/5 rounded-t-lg transition-all duration-1000"
                                                    style={{
                                                        height: `${budgetHeightPct}%`,
                                                        zIndex: 1,
                                                    }}
                                                />
                                                <div
                                                    className={`absolute bottom-0 left-2 right-2 ${cat.spent > cat.budget ? "bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"} rounded-t-lg transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]`}
                                                    style={{
                                                        height:
                                                            totalSpent === 0
                                                                ? "0%"
                                                                : `${spentHeightPct}%`,
                                                        zIndex: 2,
                                                        transitionDelay: `${i * 50}ms`,
                                                    }}
                                                />
                                            </div>
                                            <div className="absolute -bottom-7 w-full text-center text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate px-1">
                                                {cat.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {totalSpent === 0 && (
                                <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[2px] flex items-center justify-center z-10 animate-in fade-in duration-700">
                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-6 rounded-2xl shadow-2xl text-center flex flex-col items-center transform hover:scale-105 transition-transform duration-500">
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                                            <TrendingUp
                                                size={28}
                                                className="text-emerald-500/50"
                                            />
                                        </div>
                                        <h4 className="font-bold text-white tracking-tight mb-2 text-lg">
                                            Analytics Engine Standby
                                        </h4>
                                        <p className="text-xs text-slate-400 font-medium max-w-[200px] leading-relaxed">
                                            Visualize your financial trajectory once
                                            expenses are identified.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Budgets */}
                <div
                    id="budget-allocations"
                    className={`transition-all duration-700 rounded-3xl ${isHighlightingCategories ? "ring-2 ring-emerald-500/50 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.1)] p-4 -m-4" : ""}`}>
                    <div className="flex flex-col gap-2 mb-4 mt-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                            Budget Allocations
                        </h3>
                        {categories.reduce((s, c) => s + c.budget, 0) >
                            budget && (
                            <div className="text-[11px] font-bold text-red-400 bg-red-500/10 p-3.5 rounded-xl flex items-center gap-3 border border-red-500/20 animate-in slide-in-from-top-2 duration-300">
                                <AlertCircle size={18} className="shrink-0" />
                                <div>
                                    <p>
                                        The total allocated budget (₹
                                        {categories
                                            .reduce((s, c) => s + c.budget, 0)
                                            .toLocaleString()}
                                        ) exceeds your monthly cap.
                                    </p>
                                    <span className="opacity-70">
                                        Difference: -₹
                                        {(
                                            categories.reduce(
                                                (s, c) => s + c.budget,
                                                0,
                                            ) - budget
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {categories.length === 0 ? (
                        <div className="bg-white/3 backdrop-blur-sm rounded-2xl border border-white/5 p-10 text-center shadow-xl animate-in fade-in group">
                            <div className="flex justify-center mb-4 text-emerald-500/40 group-hover:scale-110 transition-transform duration-500">
                                <PieChart size={40} />
                            </div>
                            <h4 className="font-bold text-white mb-2 leading-tight">
                                Syncing Financial Strategy...
                            </h4>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
                                Your intelligent budget distribution will be
                                ready in moments.
                            </p>
                        </div>
                    ) : (
                        <>
                            {isAutoDistributed && (
                                <div className="text-[11px] font-bold text-blue-400 bg-blue-500/10 p-3.5 rounded-xl flex items-center gap-3 border border-blue-500/20 mb-6 animate-in fade-in duration-500">
                                    <PieIcon size={18} className="shrink-0" />
                                    <p>
                                        Smart Allocation Active: Budgets were
                                        calibrated based on your income
                                        profiles.
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((cat) => {
                                    const usedPct =
                                        (cat.spent / cat.budget) * 100;
                                    const isExceeded = cat.spent >= cat.budget;
                                    const isNearLimit =
                                        usedPct >= 80 && usedPct < 100;

                                    return (
                                        <div
                                            key={cat.id}
                                            className={`bg-white/3 backdrop-blur-sm rounded-2xl border transition-all duration-500 hover:-translate-y-1.5 group overflow-hidden relative p-6 shadow-xl 
                                        ${
                                            isExceeded
                                                ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)] bg-red-500/[0.02]"
                                                : isNearLimit
                                                  ? "border-amber-500/40 bg-amber-500/[0.02]"
                                                  : "border-white/5 hover:bg-white/[0.05]"
                                        }`}>
                                            {isExceeded && (
                                                <div className="absolute top-0 right-0 p-1">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`p-1.5 rounded-lg transition-colors ${isExceeded ? "bg-red-500/20 text-red-400 animate-pulse" : isNearLimit ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                                                        {isExceeded ? (
                                                            <AlertTriangle
                                                                size={14}
                                                            />
                                                        ) : (
                                                            <PieIcon
                                                                size={14}
                                                            />
                                                        )}
                                                    </div>
                                                    <h4
                                                        className={`text-sm font-bold tracking-tight ${isExceeded ? "text-red-400" : isNearLimit ? "text-amber-400" : "text-white"}`}>
                                                        {cat.name}
                                                    </h4>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        openCategoryEdit(cat)
                                                    }
                                                    className="text-slate-600 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1">
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-baseline gap-1.5 mb-5">
                                                <span className="text-xl font-bold text-white tracking-tight">
                                                    ₹
                                                    <AnimatedNumber
                                                        value={cat.spent}
                                                    />
                                                </span>
                                                <span
                                                    className={`text-[10px] font-bold ${isExceeded ? "text-red-500/70" : "text-slate-500"}`}>
                                                    / ₹
                                                    {cat.budget.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3.5">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-[1500ms] ease-out 
                                                ${
                                                    isExceeded
                                                        ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                                                        : isNearLimit
                                                          ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                                                          : "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                                }`}
                                                    style={{
                                                        width: `${Math.min(usedPct, 100)}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider
                                                    ${
                                                        isExceeded
                                                            ? "bg-red-500/20 text-red-400"
                                                            : isNearLimit
                                                              ? "bg-amber-500/20 text-amber-400"
                                                              : "bg-emerald-500/10 text-emerald-400"
                                                    }`}>
                                                        {isExceeded
                                                            ? "Over Budget"
                                                            : isNearLimit
                                                              ? "Near Limit"
                                                              : `${Math.round(usedPct)}% used`}
                                                    </span>
                                                    {isExceeded && (
                                                        <span className="text-[9px] font-bold text-red-500 animate-pulse">
                                                            Action Required
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 tracking-tight">
                                                    ₹
                                                    {Math.max(
                                                        0,
                                                        cat.budget - cat.spent,
                                                    ).toLocaleString()}{" "}
                                                    left
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Recent Expenses List */}
                <div className="pb-16 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 px-1 gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Recent Transactions
                            </h3>
                            <div className="relative group">
                                <select 
                                    value={selectedMonth.toISOString()}
                                    onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                                    className="text-[10px] font-bold text-slate-400 border border-white/5 rounded-lg px-3 py-1.5 outline-none bg-white/5 hover:bg-white/10 transition-all appearance-none pr-8 cursor-pointer flex items-center gap-2">
                                    {monthOptions.map((date) => (
                                        <option key={date.toISOString()} value={date.toISOString()}>
                                            {date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <Calendar size={10} />
                                </div>
                            </div>
                        </div>
                        {expenses.length > 0 && (
                            <div className="relative group">
                                <select 
                                    value={selectedFilterCategory}
                                    onChange={(e) => setSelectedFilterCategory(e.target.value)}
                                    className="text-[10px] font-bold text-slate-400 border border-white/5 rounded-lg px-3 py-1.5 outline-none bg-white/5 hover:bg-white/10 transition-all appearance-none pr-8 cursor-pointer">
                                    <option value="All Categories">All Categories</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <TrendingUp
                                        size={10}
                                        className="rotate-180"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-white/3 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl overflow-hidden min-h-[160px] transition-all">
                        {expenses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center h-full animate-in fade-in duration-700">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <DollarSign
                                        size={24}
                                        className="text-slate-600"
                                    />
                                </div>
                                <h4 className="text-sm font-bold text-slate-400 tracking-tight">
                                    Transaction Ledger Empty
                                </h4>
                                <p className="text-[11px] text-slate-600 mt-1 mb-5 font-medium max-w-[180px]">
                                    Your historical expense data will populate
                                    here.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                    <Plus size={14} />
                                    Record Expense
                                </button>
                            </div>
                        ) : finalFilteredExpenses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center h-full animate-in fade-in duration-700">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle
                                        size={24}
                                        className="text-slate-600"
                                    />
                                </div>
                                <h4 className="text-sm font-bold text-slate-400 tracking-tight">
                                    No transactions found
                                </h4>
                                <p className="text-[11px] text-slate-600 mt-1 font-medium max-w-[180px]">
                                    No entries recorded for {selectedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} in this category yet.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.03]">
                                {finalFilteredExpenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="p-4 flex items-center justify-between animate-in slide-in-from-left-4 fade-in duration-500 group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                                                <DollarSign
                                                    size={18}
                                                    className="text-slate-500 group-hover:text-emerald-400 transition-colors"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="font-bold text-white text-sm tracking-tight">
                                                        {expense.description}
                                                    </span>
                                                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-500/10">
                                                        {expense.category}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 mt-1 font-bold flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                                    🗓️{" "}
                                                    {new Date(
                                                        expense.date,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="font-bold text-white text-lg tracking-tighter">
                                                <span className="text-emerald-500/50 mr-0.5">
                                                    ₹
                                                </span>
                                                {expense.amount.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleDeleteExpense(
                                                        expense.id,
                                                    )
                                                }
                                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-500/10 rounded-xl">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Add Expense Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="bg-[#111827]/95 backdrop-blur-2xl rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Record Expense
                                </h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                    Financial Entry Terminal
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddExpense}
                            className="p-8 space-y-6">
                            {/* Category Select */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Classification
                                </label>
                                <div className="relative group">
                                    <select
                                        value={newExpense.category}
                                        onChange={(e) =>
                                            setNewExpense({
                                                ...newExpense,
                                                category: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer font-bold">
                                        {categories.map((c) => (
                                            <option
                                                key={c.id}
                                                value={c.name}
                                                className="bg-[#111827] text-white">
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-emerald-400 transition-colors">
                                        <TrendingUp
                                            size={14}
                                            className="rotate-180"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Transaction Volume
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold text-lg">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newExpense.amount}
                                        onChange={(e) => {
                                            setNewExpense({
                                                ...newExpense,
                                                amount: e.target.value,
                                            });
                                            if (formErrors.amount)
                                                setFormErrors({
                                                    ...formErrors,
                                                    amount: null,
                                                });
                                        }}
                                        className={`w-full bg-white/5 border ${formErrors.amount ? "border-red-500/50 focus:ring-red-500/10" : "border-white/10 group-hover:border-white/20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"} rounded-2xl pl-10 pr-5 py-3.5 text-lg outline-none transition-all font-bold text-white placeholder:text-slate-700`}
                                    />
                                </div>
                                {formErrors.amount && (
                                    <p className="text-[10px] text-red-400 font-bold absolute -bottom-5 left-1">
                                        {formErrors.amount}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2 relative group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Narrative / Label
                                </label>

                                {formErrors.description && (
                                    <div className="absolute -top-7 right-0 bg-red-500 text-white text-[9px] px-2 py-1 rounded-md shadow-lg animate-in fade-in slide-in-from-bottom-1 z-10 font-bold tracking-tight">
                                        Required Field
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-red-500"></div>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Entity or Service name"
                                    value={newExpense.description}
                                    onChange={(e) => {
                                        setNewExpense({
                                            ...newExpense,
                                            description: e.target.value,
                                        });
                                        if (formErrors.description)
                                            setFormErrors({
                                                ...formErrors,
                                                description: null,
                                            });
                                    }}
                                    className={`w-full bg-white/5 border ${formErrors.description ? "border-red-500/50 focus:ring-red-500/10" : "border-white/10 group-hover:border-white/20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"} rounded-2xl px-5 py-3.5 text-sm outline-none transition-all font-bold text-white placeholder:text-slate-700`}
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-2 pb-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Timeline Stamp
                                </label>
                                <input
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) =>
                                        setNewExpense({
                                            ...newExpense,
                                            date: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-slate-300 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold cursor-pointer"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 border border-white/10 text-slate-400 rounded-2xl font-bold text-sm hover:bg-white/5 hover:text-white transition-all active:scale-95">
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-2xl font-bold text-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <Plus size={18} />
                                    Commit Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Profile Edit Modal */}
            {isProfileEditOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setIsProfileEditOpen(false)}
                    />
                    <div className="bg-[#111827]/95 backdrop-blur-2xl rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    Edit Profile
                                </h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                    Configuration Panel
                                </p>
                            </div>
                            <button
                                onClick={() => setIsProfileEditOpen(false)}
                                className="text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSaveProfile}
                            className="p-8 space-y-6">
                            {profileEditErrors.general && (
                                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl text-[11px] font-bold border border-red-500/20 flex items-center gap-3 animate-in shake-in duration-500">
                                    <AlertCircle
                                        size={18}
                                        className="shrink-0"
                                    />
                                    {profileEditErrors.general}
                                </div>
                            )}
                            <div className="space-y-2 relative group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Monthly Inflow
                                </label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold text-lg">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={profileEditForm.monthlyIncome}
                                        onChange={(e) =>
                                            setProfileEditForm({
                                                ...profileEditForm,
                                                monthlyIncome: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/10 group-hover:border-white/20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl pl-10 pr-5 py-3.5 text-lg outline-none transition-all font-bold text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 relative group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Allocated Budget
                                </label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold text-lg">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={profileEditForm.monthlyBudget}
                                        onChange={(e) =>
                                            setProfileEditForm({
                                                ...profileEditForm,
                                                monthlyBudget: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/10 group-hover:border-white/20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl pl-10 pr-5 py-3.5 text-lg outline-none transition-all font-bold text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 relative group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Savings Target
                                </label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold text-lg">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={profileEditForm.savingGoal}
                                        onChange={(e) =>
                                            setProfileEditForm({
                                                ...profileEditForm,
                                                savingGoal: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/10 group-hover:border-white/20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl pl-10 pr-5 py-3.5 text-lg outline-none transition-all font-bold text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Professional Tier
                                </label>
                                <div className="relative group">
                                    <select
                                        value={profileEditForm.userType}
                                        onChange={(e) =>
                                            setProfileEditForm({
                                                ...profileEditForm,
                                                userType: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-slate-200 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer font-bold">
                                        <option
                                            value="student"
                                            className="bg-[#111827]">
                                            Student
                                        </option>
                                        <option
                                            value="working"
                                            className="bg-[#111827]">
                                            Working Professional
                                        </option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-emerald-400 transition-colors">
                                        <TrendingUp
                                            size={14}
                                            className="rotate-180"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileEditOpen(false)}
                                    className="flex-1 py-4 border border-white/10 text-slate-400 rounded-2xl font-bold text-sm hover:bg-white/5 hover:text-white transition-all active:scale-95">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-2xl font-bold text-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all active:scale-95">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setEditingCategory(null)}
                    />
                    <div className="bg-[#111827]/95 backdrop-blur-2xl rounded-3xl w-full max-w-sm relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out overflow-hidden">
                        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-tight">
                                    Calibrate Budget
                                </h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                    Allocation Terminal
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSaveCategory}
                            className="p-8 space-y-6">
                            {categoryEditError && (
                                <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl text-[11px] font-bold border border-red-500/20 flex items-center gap-3 animate-in shake-in duration-500">
                                    <AlertCircle
                                        size={18}
                                        className="shrink-0"
                                    />
                                    {categoryEditError}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Category Reference
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={editingCategory.name}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2 relative group">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                    Adjusted Limit
                                </label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500/50 font-bold text-lg">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={editingCategory.budget}
                                        onChange={(e) => {
                                            setEditingCategory({
                                                ...editingCategory,
                                                budget: e.target.value,
                                            });
                                            setCategoryEditError("");
                                        }}
                                        className="w-full bg-white/5 border border-white/10 group-hover:border-white/20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl pl-10 pr-5 py-3.5 text-lg outline-none transition-all font-bold text-white"
                                    />
                                </div>
                                {(() => {
                                    const currentAmt =
                                        parseFloat(editingCategory.budget) || 0;
                                    const otherTotals = categories.reduce(
                                        (sum, c) =>
                                            sum +
                                            (c.name === editingCategory.name
                                                ? 0
                                                : c.budget),
                                        0,
                                    );
                                    return (
                                        otherTotals + currentAmt > budget && (
                                            <div className="flex items-center gap-1.5 mt-2 animate-in slide-in-from-left-2 duration-300">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                <p className="text-[10px] font-bold text-amber-500/80 uppercase">
                                                    Allocation exceeds capacity
                                                </p>
                                            </div>
                                        )
                                    );
                                })()}
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="flex-1 py-4 border border-white/10 text-slate-400 rounded-2xl font-bold text-sm hover:bg-white/5 hover:text-white transition-all active:scale-95">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-2xl font-bold text-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-1 transition-all active:scale-95">
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Critical Budget Warning Modal */}
            {isCriticalModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl animate-in fade-in duration-700"
                        onClick={() => setIsCriticalModalOpen(false)}
                    />
                    <div className="bg-red-500/10 backdrop-blur-3xl rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-[0_0_80px_rgba(239,68,68,0.2)] border border-red-500/20 animate-in fade-in zoom-in-90 duration-500 ease-out overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                                <AlertTriangle size={40} />
                            </div>

                            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                                🚨 Budget Exceeded
                            </h2>

                            <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
                                    Exposure Amount
                                </p>
                                <h3 className="text-4xl font-black text-red-500 tracking-tighter">
                                    ₹{(totalSpent - budget).toLocaleString()}
                                </h3>
                                {topCategory && (
                                    <p className="text-xs font-bold text-slate-500 mt-4 uppercase tracking-wider">
                                        Top spending area:{" "}
                                        <span className="text-slate-300">
                                            {topCategory.name}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">
                                "You're currently spending beyond your planned
                                limit. Small adjustments can get you back on
                                track."
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() =>
                                        setIsCriticalModalOpen(false)
                                    }
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold transition-all active:scale-95">
                                    Got it
                                </button>
                                <button
                                    onClick={scrollToCategories}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] active:scale-95 flex items-center justify-center gap-2">
                                    Review Spending
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};;

export default Dashboard;
