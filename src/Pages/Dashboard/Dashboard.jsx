import React, { useState, useEffect } from "react";
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
    PieChart,
} from "lucide-react";
import Onboarding from "../../Components/Onboarding.jsx";
import { useNavigate } from "react-router-dom";

// HELPER FUNCTION (REQUIRED)
const buildAutoCategories = (budget) => {
    const distribution = [
        { name: "Food", percent: 0.30 },
        { name: "Transportation", percent: 0.15 },
        { name: "Entertainment", percent: 0.10 },
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
            spent: 0
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Edit Modals State
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
    const [profileEditForm, setProfileEditForm] = useState({
        monthlyIncome: 0,
        monthlyBudget: 0,
        savingGoal: 0,
        userType: "working"
    });
    const [profileEditErrors, setProfileEditErrors] = useState({});

    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryEditError, setCategoryEditError] = useState("");

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
                const profileRes = await fetch("http://localhost:5000/api/user/profile", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (profileRes.status === 401) {
                    localStorage.removeItem("spendwise_token");
                    navigate("/login");
                    return;
                }

                if (profileRes.ok) {
                    const profileData = await profileRes.json();

                    const q = profileData.quizData;
                    if (!q || !q.monthlyIncome || !q.monthlyBudget || !q.savingGoal) {
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
                    if (profileData.categories && profileData.categories.length > 0) {
                        fetchedCategories = profileData.categories.map((c, i) => ({
                             id: c._id || i + 1,
                             name: c.name,
                             budget: c.budget,
                             spent: 0
                        }));
                    }
                }

                // Fetch Expenses
                const expensesRes = await fetch("http://localhost:5000/api/expenses/get", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (expensesRes.status === 401) {
                    localStorage.removeItem("spendwise_token");
                    navigate("/login");
                    return;
                }

                if (expensesRes.ok) {
                    const expensesData = await expensesRes.json();
                    
                    const formattedExpenses = expensesData.map(e => ({
                        id: e._id,
                        category: e.category,
                        amount: e.amount,
                        description: e.title,
                        date: e.date
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
                       const newCategories = base.map(cat => ({ ...cat, spent: 0 }));
                       formattedExpenses.forEach(exp => {
                           const cat = newCategories.find(c => c.name === exp.category);
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

    // Modal Form State
    const [newExpense, setNewExpense] = useState({
        category: "Food",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [formErrors, setFormErrors] = useState({});

    // Derived values
    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const spendingPercentage =
        budget === 0 ? 0 : (totalSpent / budget) * 100;

    const topCategory = categories.reduce((prev, current) => {
        return prev && prev.spent > current.spent ? prev : current;
    }, null);

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
            const response = await fetch("http://localhost:5000/api/expenses/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newExpense.description,
                    amount: amount,
                    category: newExpense.category,
                    date: newExpense.date
                })
            });

            if (response.ok) {
                const addedExpenseData = await response.json();
                
                const expenseToAdd = {
                    id: addedExpenseData._id,
                    description: addedExpenseData.title,
                    amount: addedExpenseData.amount,
                    category: addedExpenseData.category,
                    date: addedExpenseData.date,
                };

                setExpenses([expenseToAdd, ...expenses]);

                setCategories(
                    categories.map((cat) =>
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
            const response = await fetch(`http://localhost:5000/api/expenses/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const expenseToDelete = expenses.find((e) => e.id === id);
                if (expenseToDelete) {
                    setExpenses(expenses.filter((e) => e.id !== id));
                    setCategories(
                        categories.map((cat) =>
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
            userType: role || "working"
        });
        setProfileEditErrors({});
        setIsProfileEditOpen(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        
        if (profileEditForm.monthlyIncome < 0 || profileEditForm.monthlyBudget < 0 || profileEditForm.savingGoal < 0 ||
            profileEditForm.monthlyIncome === "" || profileEditForm.monthlyBudget === "" || profileEditForm.savingGoal === "") {
            setProfileEditErrors({ general: "Please enter valid positive values." });
            return;
        }

        try {
            const token = localStorage.getItem("spendwise_token");
            const response = await fetch("http://localhost:5000/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(profileEditForm)
            });

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
                setProfileEditErrors({ general: "Failed to update. Please try again." });
            }
        } catch (err) {
             console.error("Failed to update profile", err);
             setProfileEditErrors({ general: "Failed to update. Please try again." });
        }
    };

    const openCategoryEdit = (cat) => {
        setEditingCategory({
             id: cat.id,
             name: cat.name,
             budget: cat.budget
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
            const response = await fetch("http://localhost:5000/api/user/category-budget", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ name: editingCategory.name, budget: amt })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    const updatedCategories = categories.map(c => 
                        c.name === editingCategory.name ? { ...c, budget: amt } : c
                    );
                    setCategories(updatedCategories);
                    setEditingCategory(null);
                } else {
                    setCategoryEditError(data.message || "Failed to update. Please try again.");
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-[#0B1C2C]/5 text-slate-900 font-sans w-[100vw] overflow-x-hidden absolute top-0 left-0 z-50">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-[#0B1C2C]/10 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                            SpendWise
                        </h1>
                        <p className="text-sm text-slate-500">
                            Smart Budget Tracking
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="border border-red-500/30 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm">
                        Logout
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_10px_rgba(0,229,168,0.2)] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:shadow-lg active:scale-95">
                        <Plus size={18} />
                        Add Expense
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-8 py-8 space-y-6">
                {/* Profile Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-[#0B1C2C]/10 shadow-sm flex justify-between items-center group transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                {role === "student"
                                    ? "Student Mode"
                                    : "Working Professional Mode"}
                            </p>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Monthly Income: ₹
                                <AnimatedNumber value={income || 0} />
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={openProfileEdit}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                        Edit
                    </button>
                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Budget */}
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-[#0B1C2C]/10 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-500">
                                Total Budget
                            </p>
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <Wallet size={16} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            ₹<AnimatedNumber value={budget} />
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            Across {categories.length} categories
                        </p>
                    </div>

                    {/* Budget vs Spent */}
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-[#0B1C2C]/10 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-500">
                                Budget vs Spent
                            </p>
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                <DollarSign size={16} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            ₹<AnimatedNumber value={totalSpent} />{" "}
                            <span className="text-lg text-slate-400 font-medium">
                                / ₹{budget.toLocaleString()}
                            </span>
                        </h3>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 shadow-[0_0_6px_rgba(0,229,168,0.15)] rounded-full transition-all duration-700 ease-in-out"
                                style={{
                                    width: `${Math.min(spendingPercentage, 100)}%`,
                                }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            {totalSpent > 0
                                ? `${spendingPercentage.toFixed(1)}% of budget used`
                                : "No expenses added yet"}
                        </p>
                    </div>

                    {/* Remaining */}
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-[#0B1C2C]/10 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-slate-500">
                                Remaining
                            </p>
                            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                            ₹<AnimatedNumber value={budget - totalSpent} />
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            {totalSpent > 0
                                ? "All within budget"
                                : "Full budget available"}
                        </p>
                    </div>
                </div>

                {/* Goals & Top Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-[#0B1C2C]/10 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-lg group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className="text-emerald-500">
                                    <Target size={20} />
                                </div>
                                <h3 className="font-semibold text-slate-900">
                                    Monthly Savings Goal
                                </h3>
                            </div>
                            <button className="text-slate-300 hover:text-slate-500 transition-colors">
                                <Edit2 size={16} />
                            </button>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight mt-1 mb-2">
                            ₹
                            <AnimatedNumber
                                value={
                                    totalSpent > 0
                                        ? income - totalSpent
                                        : savings
                                }
                            />
                            {totalSpent > 0 && savings > 0 && (
                                <span className="text-sm font-medium text-slate-400 ml-1">
                                    of ₹{savings.toLocaleString()}
                                </span>
                            )}
                        </h4>

                        {totalSpent > 0 && savings > 0 ? (
                            <>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4">
                                    <div
                                        className="h-full bg-emerald-500 shadow-[0_0_6px_rgba(0,229,168,0.15)] rounded-full transition-all duration-700 ease-in-out"
                                        style={{
                                            width: `${Math.min(((income - totalSpent) / savings) * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-emerald-600 font-medium mt-2">
                                    <span>
                                        {Math.round(
                                            ((income - totalSpent) / savings) *
                                                100,
                                        )}
                                        % saved
                                    </span>
                                    <span className="text-slate-400">
                                        ₹
                                        {Math.max(0, (income - totalSpent - savings)).toLocaleString()}{" "}
                                        over goal
                                    </span>
                                </div>
                                <div className="mt-4 bg-emerald-50 rounded-lg p-2 text-center text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2">
                                    <span className="text-sm">🎉</span> Goal
                                    achieved! Great job!
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4" />
                                <p className="text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
                                    Potential savings based on your income
                                </p>
                            </>
                        )}
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-[#0B1C2C]/10 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex items-center gap-2 mb-4 text-orange-500">
                            <TrendingUp size={20} />
                            <h3 className="font-semibold text-slate-900">
                                Top Spending Category
                            </h3>
                        </div>

                        {totalSpent === 0 ? (
                            <div className="flex items-center gap-4 mt-6">
                                <div className="text-4xl opacity-50">💰</div>
                                <div>
                                    <h4 className="text-lg font-semibold text-slate-600">
                                        Not yet tracked
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Add expenses to see your top spending
                                        category
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4 mt-4">
                                <div className="text-4xl">📊</div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-500 mb-1">
                                        {topCategory?.name || "N/A"}
                                    </h4>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-orange-600">
                                            ₹
                                            <AnimatedNumber
                                                value={topCategory?.spent || 0}
                                            />
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">
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
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Smart Alerts
                    </h3>
                    {totalSpent === 0 ? (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center gap-3 text-blue-700 text-sm font-medium">
                                <AlertCircle size={16} />
                                👋 Welcome! Start by adding your first expense
                                to begin tracking your spending.
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in zoom-in duration-500 text-emerald-700 text-sm font-medium">
                            <CheckCircle2 size={16} />
                            Great job! All expenses are within budget
                        </div>
                    )}

                    {totalSpent === 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_10px_rgba(0,229,168,0.2)] text-white rounded-xl py-3 font-medium transition-all flex items-center justify-center gap-2">
                            <Plus size={18} />
                            Add Your First Expense
                        </button>
                    )}
                </div>

                {/* Spending Overview Chart */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Spending Overview
                    </h3>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#0B1C2C]/10 shadow-sm p-8 pb-4 relative overflow-hidden h-[300px]">
                        {/* Chart Grid Lines */}
                        <div className="absolute inset-0 px-12 py-8 pointer-events-none flex flex-col justify-between">
                            {[10000, 7500, 5000, 2500, 0].map((val, i) => (
                                <div
                                    key={i}
                                    className="flex items-center w-full">
                                    <span className="text-[10px] text-slate-400 w-8 pr-2 text-right">
                                        {val}-
                                    </span>
                                    <div className="flex-1 border-b border-dashed border-slate-300/40"></div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Bars Container */}
                        <div className="absolute inset-0 px-12 pb-8 pt-8 flex items-end justify-between pl-20 pr-12">
                            {categories.map((cat, i) => {
                                const budgetHeightPct =
                                    (cat.budget / (Math.max(...categories.map(c => c.budget)) || 10000)) * 100;
                                const spentHeightPct =
                                    (cat.spent / (Math.max(...categories.map(c => c.budget)) || 10000)) * 100;

                                return (
                                    <div
                                        key={cat.id}
                                        className="relative w-16 h-full flex items-end group">
                                        {/* Hover tooltip */}
                                        {totalSpent > 0 && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-xl rounded-lg p-2 text-xs z-10 whitespace-nowrap pointer-events-none">
                                                <div className="font-semibold text-slate-700 mb-1">
                                                    {cat.name}
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-blue-500">
                                                        Spent: ₹{cat.spent}
                                                    </span>
                                                </div>
                                                <div className="text-slate-400 mt-0.5">
                                                    Budget: ₹{cat.budget}
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className="w-full relative flex items-end"
                                            style={{ height: "100%" }}>
                                            <div
                                                className="absolute bottom-0 w-full bg-slate-200 rounded-t-sm transition-all duration-700 delay-100"
                                                style={{
                                                    height: `${budgetHeightPct}%`,
                                                    zIndex: 1,
                                                }}
                                            />
                                            <div
                                                className={`absolute bottom-0 w-full ${cat.spent > cat.budget ? "bg-red-500" : "bg-blue-500"} rounded-t-sm transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]`}
                                                style={{
                                                    height:
                                                        totalSpent === 0
                                                            ? "0%"
                                                            : `${spentHeightPct}%`,
                                                    zIndex: 2,
                                                    transitionDelay: `${i * 100}ms`,
                                                }}
                                            />
                                        </div>
                                        <div className="absolute -bottom-6 w-full text-center text-[10px] text-slate-500 font-medium">
                                            {cat.name}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {totalSpent === 0 && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 animate-in fade-in duration-700">
                                <div className="bg-white/95 px-6 py-4 rounded-xl shadow-sm border border-slate-300/60 text-center flex flex-col items-center">
                                    <TrendingUp
                                        size={24}
                                        className="text-slate-300 mb-2"
                                    />
                                    <h4 className="font-semibold text-slate-700">
                                        No data yet
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Add expenses to see your spending trends
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    {totalSpent > 0 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pb-4 text-xs font-medium text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>{" "}
                                Spent
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>{" "}
                                Budget
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Budgets */}
                <div>
                    <div className="flex flex-col gap-2 mb-4 mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">
                                Category Budgets
                            </h3>
                        </div>
                        {categories.reduce((s, c) => s + c.budget, 0) > budget && (
                            <div className="text-xs font-semibold text-red-600 bg-red-50/80 p-3 rounded-xl flex items-center gap-2 border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={18} className="shrink-0" />
                                <div>
                                    <p>Your category budgets exceed your total monthly budget.</p>
                                    <p className="opacity-90 font-medium">Remaining to allocate: -₹{(categories.reduce((s, c) => s + c.budget, 0) - budget).toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {categories.length === 0 ? (
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-[#0B1C2C]/10 p-8 text-center shadow-sm animate-in fade-in">
                             <div className="flex justify-center mb-3 text-emerald-500">
                                <PieChart size={32} />
                             </div>
                             <h4 className="font-semibold text-slate-700 mb-2">Budgets Auto-Allocating...</h4>
                             <p className="text-sm text-slate-500 max-w-sm mx-auto">Budgets are auto-distributed based on your income. You can customize anytime.</p>
                        </div>
                    ) : (
                        <>
                             {/* ✅ BANNER CONDITION (REQUIRED - ONLY isAutoDistributed) */}
                             {isAutoDistributed && (
                                <div className="text-xs font-semibold text-blue-700 bg-blue-50/80 p-3 rounded-xl flex items-center gap-2 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-1 mb-4">
                                    <PieChart size={16} className="shrink-0" />
                                    <p>Budgets are automatically distributed based on your monthly budget. You can edit them anytime.</p>
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat) => {
                            const usedPct = (cat.spent / cat.budget) * 100;
                            const isExceeded = cat.spent > cat.budget;
                            const isTotalOverBudget = categories.reduce((s, c) => s + c.budget, 0) > budget;

                            return (
                                <div
                                    key={cat.id}
                                    className={`bg-white/95 backdrop-blur-sm rounded-xl border ${isTotalOverBudget ? "border-red-200" : "border-[#0B1C2C]/10"} shadow-sm p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-semibold ${isTotalOverBudget ? "text-red-700" : "text-slate-900"}`}>
                                            {cat.name}
                                        </h4>
                                        <button
                                            onClick={() =>
                                                openCategoryEdit(cat)
                                            }
                                            className="text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-lg font-bold text-slate-900">
                                            ₹
                                            <AnimatedNumber value={cat.spent} />
                                        </span>
                                        <span className={`text-xs font-medium ${isTotalOverBudget ? "text-red-500" : "text-slate-500"}`}>
                                            of ₹{cat.budget.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isExceeded ? "bg-red-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_6px_rgba(0,229,168,0.15)]"}`}
                                            style={{
                                                width: `${Math.min(usedPct, 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span
                                            className={`text-[10px] font-semibold ${isExceeded ? "text-red-600" : "text-emerald-600"}`}>
                                            {Math.round(usedPct)}% used
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-400">
                                            ₹
                                            {Math.max(
                                                0,
                                                cat.budget - cat.spent,
                                            ).toLocaleString()}{" "}
                                            remaining
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
                <div className="pb-16">
                    <div className="flex justify-between items-center mb-3 mt-6">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Recent Expenses
                        </h3>
                        {expenses.length > 0 && (
                            <select className="text-xs font-medium text-slate-600 border border-slate-300/60 rounded-lg px-2 py-1 outline-none bg-white/95">
                                <option>All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id}>{c.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#0B1C2C]/10 shadow-sm overflow-hidden min-h-[150px]">
                        {expenses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center h-full animate-in fade-in duration-500">
                                <h4 className="text-sm font-semibold text-slate-600">
                                    No expenses recorded
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 mb-4">
                                    Your expense history will appear here
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_10px_rgba(0,229,168,0.2)] text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors">
                                    + Add Expense
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {expenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="p-4 flex items-center justify-between animate-in slide-in-from-top-4 fade-in duration-500 group hover:bg-slate-100/60 transition-colors">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-900 text-sm">
                                                    {expense.description}
                                                </span>
                                                <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                                    {expense.category}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                🗓️{" "}
                                                {new Date(
                                                    expense.date,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-slate-900">
                                                ₹
                                                {expense.amount.toLocaleString()}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleDeleteExpense(
                                                        expense.id,
                                                    )
                                                }
                                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-md m-4 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-300/60">
                            <h2 className="text-lg font-bold text-slate-900">
                                Add Expense
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddExpense}
                            className="p-6 space-y-5">
                            {/* Category Select */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">
                                    Category
                                </label>
                                <select
                                    value={newExpense.category}
                                    onChange={(e) =>
                                        setNewExpense({
                                            ...newExpense,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300/60 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none bg-white/95 font-medium">
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-semibold text-slate-600">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
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
                                        className={`w-full border ${formErrors.amount ? "border-red-400 focus:ring-red-100 animate-[shake_0.2s_ease-in-out_0s_2]" : "border-slate-300/60 focus:border-blue-500 focus:ring-blue-100"} rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:ring-2 transition-all font-medium text-slate-900 placeholder:font-normal`}
                                    />
                                    <div className="absolute right-3 top-[3px] bottom-[3px] w-6 bg-slate-100 rounded-md flex flex-col pointer-events-none">
                                        <div className="h-1/2 flex items-end justify-center pb-0.5">
                                            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[5px] border-transparent border-b-slate-600"></div>
                                        </div>
                                        <div className="h-1/2 flex items-start justify-center pt-0.5">
                                            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-transparent border-t-slate-600"></div>
                                        </div>
                                    </div>
                                </div>
                                {formErrors.amount && (
                                    <p className="text-[10px] text-red-500 font-medium absolute -bottom-5">
                                        {formErrors.amount}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 relative group">
                                <label className="text-xs font-semibold text-slate-600">
                                    Description
                                </label>

                                {formErrors.description && (
                                    <div className="absolute -top-7 right-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-bottom-1 z-10 font-medium">
                                        Please fill out this field.
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-800"></div>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Enter description"
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
                                    className={`w-full border ${formErrors.description ? "border-red-400 focus:ring-red-100" : "border-slate-300/60 focus:border-blue-500 focus:ring-blue-100"} rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 transition-all font-medium text-slate-900 placeholder:font-normal`}
                                />
                            </div>

                            {/* Date */}
                            <div className="space-y-1.5 pb-2">
                                <label className="text-xs font-semibold text-slate-600">
                                    Date
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
                                    className="w-full border border-slate-300/60 rounded-xl px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium bg-white/95"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 border border-slate-300/60 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-emerald-500 shadow-[0_0_10px_rgba(0,229,168,0.2)] text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <Plus size={16} />
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Profile Edit Modal */}
            {isProfileEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsProfileEditOpen(false)}
                    />
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-md m-4 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-300/60">
                            <h2 className="text-lg font-bold text-slate-900">
                                Edit Profile
                            </h2>
                            <button
                                onClick={() => setIsProfileEditOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSaveProfile}
                            className="p-6 space-y-5">
                            {profileEditErrors.general && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium animate-in fade-in">
                                    <AlertCircle
                                        size={16}
                                        className="inline mr-2"
                                    />
                                    {profileEditErrors.general}
                                </div>
                            )}
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-semibold text-slate-600">
                                    Monthly Income
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
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
                                        className="w-full border border-slate-300/60 focus:border-blue-500 focus:ring-blue-100 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:ring-2 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-semibold text-slate-600">
                                    Monthly Budget
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
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
                                        className="w-full border border-slate-300/60 focus:border-blue-500 focus:ring-blue-100 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:ring-2 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-xs font-semibold text-slate-600">
                                    Savings Goal
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
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
                                        className="w-full border border-slate-300/60 focus:border-blue-500 focus:ring-blue-100 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:ring-2 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">
                                    User Type
                                </label>
                                <select
                                    value={profileEditForm.userType}
                                    onChange={(e) =>
                                        setProfileEditForm({
                                            ...profileEditForm,
                                            userType: e.target.value,
                                        })
                                    }
                                    className="w-full border border-slate-300/60 focus:border-blue-500 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 transition-all bg-white/95 font-medium text-slate-900">
                                    <option value="student">Student</option>
                                    <option value="working">
                                        Working Professional
                                    </option>
                                </select>
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileEditOpen(false)}
                                    className="flex-1 py-3 border border-slate-300/60 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-emerald-500 shadow-[0_0_10px_rgba(0,229,168,0.2)] text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setEditingCategory(null)}
                    />
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-sm m-4 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-300/60">
                            <h2 className="text-lg font-bold text-slate-900">
                                Edit Budget
                            </h2>
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSaveCategory}
                            className="p-6 space-y-5">
                            {categoryEditError && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium animate-in fade-in">
                                    <AlertCircle
                                        size={16}
                                        className="inline mr-2"
                                    />
                                    {categoryEditError}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={editingCategory.name}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1.5 relative px-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Budget Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
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
                                        className="w-full border border-slate-300/60 focus:border-blue-500 focus:ring-blue-100 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none focus:ring-2 transition-all font-medium text-slate-900"
                                    />
                                </div>
                                {(() => {
                                    const currentAmt = parseFloat(editingCategory.budget) || 0;
                                    const otherTotals = categories.reduce((sum, c) => sum + (c.name === editingCategory.name ? 0 : c.budget), 0);
                                    return (otherTotals + currentAmt) > budget && (
                                        <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mt-1.5 animate-in fade-in">
                                            <AlertCircle size={12} />
                                            This exceeds your total budget
                                        </p>
                                    );
                                })()}
                            </div>
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="flex-1 py-3 border border-slate-300/60 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-emerald-500 shadow-[0_0_10px_rgba(0,229,168,0.2)] text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
