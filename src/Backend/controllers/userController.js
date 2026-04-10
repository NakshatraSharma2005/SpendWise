const User = require('../models/User');

const getInitialCategories = (budget) => {
  const categories = [
    { name: 'Food', budget: Math.round(budget * 0.30) },
    { name: 'Transportation', budget: Math.round(budget * 0.15) },
    { name: 'Entertainment', budget: Math.round(budget * 0.10) },
    { name: 'Shopping', budget: Math.round(budget * 0.20) },
    { name: 'Bills', budget: Math.round(budget * 0.20) },
  ];
  
  const summed = categories.reduce((s, c) => s + c.budget, 0);
  categories.push({ name: 'Others', budget: Math.max(0, budget - summed) });
  
  return categories;
};

// @desc    Save user onboarding quiz data
// @route   POST /api/user/quiz
// @access  Private
const saveQuizData = async (req, res) => {
  try {
    const { userType, monthlyIncome, monthlyBudget, savingGoal } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.quizData = {
      userType: userType !== undefined ? userType : user.quizData.userType,
      monthlyIncome: monthlyIncome !== undefined ? monthlyIncome : user.quizData.monthlyIncome,
      monthlyBudget: monthlyBudget !== undefined ? monthlyBudget : user.quizData.monthlyBudget,
      savingGoal: savingGoal !== undefined ? savingGoal : user.quizData.savingGoal,
    };

    const b = user.quizData?.monthlyBudget || 0;
    const total = user.categories?.reduce((s, c) => s + c.budget, 0) || 0;

    // if categories are missing OR incorrect → regenerate properly
    if (b > 0 && (
      !user.categories ||
      user.categories.length === 0 ||
      total === 0 ||
      total !== b
    )) {
      user.categories = getInitialCategories(b);
    }

    await user.save();

    res.status(200).json({
      message: 'Quiz data saved successfully',
      quizData: user.quizData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile data
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { userType, monthlyIncome, monthlyBudget, savingGoal } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.quizData = {
      userType: userType !== undefined ? userType : user.quizData.userType,
      monthlyIncome: monthlyIncome !== undefined ? monthlyIncome : user.quizData.monthlyIncome,
      monthlyBudget: monthlyBudget !== undefined ? monthlyBudget : user.quizData.monthlyBudget,
      savingGoal: savingGoal !== undefined ? savingGoal : user.quizData.savingGoal,
    };

    const b = user.quizData?.monthlyBudget || 0;
    const total = user.categories?.reduce((s, c) => s + c.budget, 0) || 0;

    // if categories are missing OR incorrect → regenerate properly
    if (b > 0 && (
      !user.categories ||
      user.categories.length === 0 ||
      total === 0 ||
      total !== b
    )) {
      user.categories = getInitialCategories(b);
    }

    await user.save();

    const totalCategoryBudget = user.categories ? user.categories.reduce((s, c) => s + c.budget, 0) : 0;
    const isOverBudget = totalCategoryBudget > user.quizData.monthlyBudget;

    res.status(200).json({
      success: true,
      user: user,
      warning: isOverBudget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update single category budget
// @route   PUT /api/user/category-budget
// @access  Private
const updateCategoryBudget = async (req, res) => {
  try {
    const { name, budget } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const category = user.categories.find(c => c.name === name);
    if (!category) {
       return res.status(404).json({ message: 'Category not found' });
    }

    category.budget = budget;
    await user.save();

    const totalCategoryBudget = user.categories.reduce((s, c) => s + c.budget, 0);
    const isOverBudget = totalCategoryBudget > user.quizData.monthlyBudget;

    res.status(200).json({
      success: true,
      categories: user.categories,
      warning: isOverBudget
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile data including quiz
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure backwards compatibility for users without categories array
    const b = user.quizData?.monthlyBudget || 0;
    const total = user.categories?.reduce((s, c) => s + c.budget, 0) || 0;

    // if categories are missing OR incorrect → regenerate properly
    if (b > 0 && (
      !user.categories ||
      user.categories.length === 0 ||
      total === 0 ||
      total !== b
    )) {
      user.categories = getInitialCategories(b);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveQuizData,
  updateUserProfile,
  updateCategoryBudget,
  getUserProfile,
};
