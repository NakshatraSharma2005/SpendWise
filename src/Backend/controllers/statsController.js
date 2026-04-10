const User = require('../models/User');
const Expense = require('../models/Expense');

// 1. getUserCount
const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ success: true, data: { totalUsers: count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. getTotalExpenses
const getTotalExpenses = async (req, res) => {
    try {
        const count = await Expense.countDocuments();
        res.json({ success: true, data: { totalExpenses: count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. getTotalAmount
const getTotalAmount = async (req, res) => {
    try {
        const result = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalAmount = result.length > 0 ? result[0].total : 0;
        res.json({ success: true, data: { totalAmount } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. getAvgSaving
const getAvgSaving = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) return res.json({ success: true, data: { avgSaving: 0 } });

        const incomeResult = await User.aggregate([
            { $group: { _id: null, totalIncome: { $sum: "$quizData.monthlyIncome" } } }
        ]);
        const totalIncome = incomeResult.length > 0 ? incomeResult[0].totalIncome : 0;

        const expenseResult = await Expense.aggregate([
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: "$amount" },
                    minDate: { $min: "$date" },
                    maxDate: { $max: "$date" }
                }
            }
        ]);

        if (expenseResult.length === 0) {
            return res.json({ success: true, data: { avgSaving: Math.round(totalIncome / userCount) } });
        }

        const { totalSpent, minDate, maxDate } = expenseResult[0];
        const start = new Date(minDate);
        const end = new Date(maxDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

        const monthlyAvgExpenseCombined = totalSpent / months;
        const avgSaving = (totalIncome - monthlyAvgExpenseCombined) / userCount;

        res.json({ success: true, data: { avgSaving: Math.round(avgSaving) } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUserCount,
    getTotalExpenses,
    getTotalAmount,
    getAvgSaving
};
