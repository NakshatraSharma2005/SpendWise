require('dotenv').config();
console.log("🔥 VERSION 1000 - STATS FIX");

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const statsRoutes = require("./routes/statsRoutes");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to communicate with backend

// Connect to Database
connectDB();

// 1. HARD TEST ROUTE (VERY IMPORTANT - AT THE TOP)
app.get("/api/stats/test", (req, res) => {
  res.json({ success: true, message: "Stats route working" });
});

// 2. MOUNT STATS ROUTER (CRITICAL PRIORITY)
app.use("/api/stats", statsRoutes);

// 3. OTHER API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Base route test
app.get('/', (req, res) => {
  res.send('SpendWise API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Stats route registered at /api/stats");
});
