const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, deleteExpense, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addExpense);
router.get('/get', protect, getExpenses);
router.delete('/delete/:id', protect, deleteExpense);
router.put('/update/:id', protect, updateExpense);

module.exports = router;
