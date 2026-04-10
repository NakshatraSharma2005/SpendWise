const express = require("express");
const router = express.Router();

const {
    getUserCount,
    getTotalExpenses,
    getTotalAmount,
    getAvgSaving
} = require("../controllers/statsController");

router.get("/user-count", getUserCount);
router.get("/total-expenses", getTotalExpenses);
router.get("/total-amount", getTotalAmount);
router.get("/avg-saving", getAvgSaving);

module.exports = router;
