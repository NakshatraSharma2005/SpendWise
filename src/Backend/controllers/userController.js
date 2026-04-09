const User = require('../models/User');

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
      userType: userType || user.quizData.userType,
      monthlyIncome: monthlyIncome || user.quizData.monthlyIncome,
      monthlyBudget: monthlyBudget || user.quizData.monthlyBudget,
      savingGoal: savingGoal || user.quizData.savingGoal,
    };

    await user.save();

    res.status(200).json({
      message: 'Quiz data saved successfully',
      quizData: user.quizData,
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

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveQuizData,
  getUserProfile,
};
