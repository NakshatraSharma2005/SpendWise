const express = require('express');
const router = express.Router();
const { saveQuizData, updateUserProfile, getUserProfile, updateCategoryBudget } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/quiz', protect, saveQuizData);
router.put('/profile', protect, updateUserProfile);
router.put('/category-budget', protect, updateCategoryBudget);
router.get('/profile', protect, getUserProfile);

module.exports = router;
