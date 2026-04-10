const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Expense = require('./models/Expense');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

const FIRST_NAMES = [
    "Aarav", "Advait", "Akash", "Ananya", "Arjun", "Anika", "Aryan", "Bhavya", "Chaitanya", "Dev",
    "Dhruv", "Esha", "Gaurav", "Isha", "Ishaan", "Jiya", "Kabir", "Kavya", "Kiara", "Kunal",
    "Manav", "Mehak", "Nikhil", "Nisha", "Ojas", "Palak", "Pranav", "Priya", "Rohan", "Riya",
    "Sahil", "Sana", "Shlok", "Sneha", "Tushar", "Tanvi", "Uday", "Vanya", "Varun", "Zoya",
    "Aditya", "Ishita", "Rahul", "Pooja", "Vikram", "Shreya", "Karan", "Sanya", "Neil", "Myra"
];

const LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Malhotra", "Kapoor", "Singh", "Reddy", "Patel", "Mehta", "Iyer",
    "Nair", "Das", "Chatterjee", "Mishra", "Jain", "Aggarwal", "Bakshi", "Chopra", "Desai", "Goel",
    "Hegde", "Joshi", "Kulkarni", "Luthra", "Puri", "Rao", "Sarin", "Taneja", "Vohra", "Yadav"
];

const CATEGORIES = [
    { name: "Food", range: [100, 800], frequency: 0.4 },
    { name: "Transportation", range: [50, 500], frequency: 0.2 },
    { name: "Entertainment", range: [200, 2000], frequency: 0.1 },
    { name: "Shopping", range: [500, 5000], frequency: 0.1 },
    { name: "Bills", range: [1500, 6000], frequency: 0.1 },
    { name: "Healthcare", range: [300, 3000], frequency: 0.05 },
    { name: "others", range: [100, 1000], frequency: 0.05 }
];

const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
    try {
        console.log("🚀 Starting Database Seed...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Wipe existing data
        console.log("🧹 Wiping existing users and expenses...");
        await User.deleteMany({});
        await Expense.deleteMany({});
        console.log("✨ database clean");

        const hashedPassword = await bcrypt.hash("password123", 10);
        const usersToInsert = [];
        const expensesToInsert = [];

        console.log("👤 Generating 250 realistic users...");
        for (let i = 0; i < 250; i++) {
            const firstName = pickRandom(FIRST_NAMES);
            const lastName = pickRandom(LAST_NAMES);
            const fullName = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandom(10, 999)}@example.com`;
            
            const isWorking = Math.random() > 0.4;
            const income = isWorking ? getRandom(35000, 120000) : getRandom(5000, 15000);
            const budget = Math.floor(income * (isWorking ? 0.6 : 0.8));
            const savingGoal = income - budget;

            const user = {
                name: fullName,
                email: email,
                password: hashedPassword,
                quizData: {
                    userType: isWorking ? 'working' : 'student',
                    monthlyIncome: income,
                    monthlyBudget: budget,
                    savingGoal: savingGoal
                },
                categories: [
                    { name: "Food", budget: Math.floor(budget * 0.3) },
                    { name: "Transportation", budget: Math.floor(budget * 0.15) },
                    { name: "Bills", budget: Math.floor(budget * 0.25) },
                    { name: "Entertainment", budget: Math.floor(budget * 0.1) },
                    { name: "Shopping", budget: Math.floor(budget * 0.15) },
                    { name: "Healthcare", budget: Math.floor(budget * 0.03) },
                    { name: "others", budget: Math.floor(budget * 0.02) }
                ]
            };
            usersToInsert.push(user);
        }

        const createdUsers = await User.insertMany(usersToInsert);
        console.log(`✅ ${createdUsers.length} users created`);

        console.log("💸 Generating realistic historical expenses (4-month spread)...");
        for (const user of createdUsers) {
            const expenseCount = getRandom(25, 45);
            
            for (let j = 0; j < expenseCount; j++) {
                // Spread dates over last 4 months
                const date = new Date();
                date.setMonth(date.getMonth() - getRandom(0, 3));
                date.setDate(getRandom(1, 28));

                const catWeight = Math.random();
                let selectedCat = CATEGORIES[0];
                let cumulative = 0;
                for (const cat of CATEGORIES) {
                    cumulative += cat.frequency;
                    if (catWeight <= cumulative) {
                        selectedCat = cat;
                        break;
                    }
                }

                const amount = getRandom(selectedCat.range[0], selectedCat.range[1]);
                const titles = {
                    "Food": ["Lunch at Office", "Grocery Run", "Swiggy Order", "Zomato", "Dinner Out", "Coffee", "Fruit Sunday"],
                    "Transportation": ["Uber Ride", "Fuel", "Metro Recharge", "Bus Fare", "Auto Rickshaw"],
                    "Entertainment": ["Netflix Subscription", "Movie Ticket", "Bowling", "Concert", "Gaming Center"],
                    "Shopping": ["Amazon Order", "New Shirt", "Sneakers", "Myntra Sale", "Gifts"],
                    "Bills": ["Electricity Bill", "Mobile Recharge", "WiFi Bill", "Rent", "Gas Cylinder"],
                    "Healthcare": ["Pharmacy", "Doctor Consultation", "Vitamins", "Gym Membership"],
                    "others": ["Misc", "Pet Supplies", "Laundry", "Stationery"]
                };

                expensesToInsert.push({
                    userId: user._id,
                    title: pickRandom(titles[selectedCat.name]),
                    amount: amount,
                    category: selectedCat.name,
                    date: date
                });
            }
        }

        await Expense.insertMany(expensesToInsert);
        console.log(`✅ ${expensesToInsert.length} realistic expenses generated`);

        console.log("\n🎉 SEEDING COMPLETE!");
        console.log(`Total Users: ${createdUsers.length}`);
        console.log(`Typical Working professional: ${createdUsers[0].name} - ₹${createdUsers[0].quizData.monthlyIncome.toLocaleString()}`);
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
}

seed();
