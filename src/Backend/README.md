# SpendWise Backend Integration Guide

This directory contains the full Node.js, Express, and MongoDB backed complete backend API for your React application.

## Prerequisites
- Node.js installed locally
- A valid MongoDB connection string (currently templated for Atlas)

## How to Set Up and Run
1. Open up your terminal inside this `src/Backend` folder.
2. Run `npm install` to install all necessary packages (`express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `google-auth-library`, `cors`, `dotenv`).
3. Replace the `<username>:<password>` in the `.env` file with your actual MongoDB Atlas cluster credentials.
4. Run `npm start` or `npm run dev`. Your backend will start on `http://localhost:5000`.

---

## 🔥 Frontend Integration Help

### 1. Connecting the API from React
Your React app will now talk to the backend using `fetch` or `axios`.
Example base URL: `http://localhost:5000/api`

### 2. Standard Login / Signup
When the user Signs Up:
```javascript
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
});
const data = await response.json();
// data includes { _id, name, email, token }
```

When the promise resolves successfully, you **MUST save the token to `localStorage`** so that the user stays logged in!
```javascript
localStorage.setItem('spendwise_token', data.token);
```

### 3. Google Login Integration
Since you are using a Google Button on the frontend (like `@react-oauth/google`), the onSuccess callback gives you a `credential`. Send this credential to your new endpoint!
```javascript
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    // 1. Send Google credential to the backend
    const res = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential })
    });
    
    const data = await res.json();
    
    // 2. Save your new SpendWise backend token
    localStorage.setItem('spendwise_token', data.token);
    
    // 3. Redirect to dashboard!
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
```
*(Make sure to use the `<GoogleOAuthProvider clientId="830937277332-ufi6vp35p4ka53eukgm4nun5sc8rlo3s.apps.googleusercontent.com">` wrapped around your app).*

### 4. How to call PROTECTED API Routes (e.g., getting expenses, submitting quiz)
When the user goes to the Onboarding Quiz or Dashboard, you must include the token in the Headers `Authorization: Bearer <token>`

Example - Saving Quiz Data:
```javascript
const token = localStorage.getItem('spendwise_token');

const saveQuiz = async () => {
  const response = await fetch('http://localhost:5000/api/user/quiz', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ userType: 'student', monthlyIncome: 1200 })
  });
  
  const data = await response.json();
};
```

Example - Fetching Expenses in Dashboard:
```javascript
const token = localStorage.getItem('spendwise_token');

const getExpenses = async () => {
  const response = await fetch('http://localhost:5000/api/expenses/get', {
     method: 'GET',
     headers: {
        'Authorization': `Bearer ${token}`
     }
  });
  
  const expenses = await response.json();
  // expenses is an Array! [{ _id, title: "Groceries", amount: 150, category: "Food" }, ...]
};
```
