const express = require('express');
const router = express.Router();
const { saveQuizData, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/quiz', protect, saveQuizData);
router.get('/profile', protect, getUserProfile);

module.exports = router;
