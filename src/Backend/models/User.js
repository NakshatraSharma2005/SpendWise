const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // Not required because Google login users won't have a password
    },
    googleId: {
      type: String,
    },
    quizData: {
      userType: { type: String, enum: ['student', 'working', ''] },
      monthlyIncome: { type: Number, default: 0 },
      monthlyBudget: { type: Number, default: 0 },
      savingGoal: { type: Number, default: 0 },
    },
    categories: { 
      type: Array, 
      default: [] 
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
