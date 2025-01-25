const express = require("express");
const cors = require('cors');
const bcrypt = require("bcrypt");
const db = require('./db');
const jwt = require('jsonwebtoken');
const axios = require("axios"); // Make sure axios is required
const app = express();

// Import routes
const registerRoute = require('./register/register');
const loginRoute = require('./login/login');
const getCategoryRoute = require('./category/getcategory');
const addCategoryRoute = require('./category/addcategory');
const addTransactionsRoute = require('./transactions/addtransactions');
const incomeExpenseRoute = require('./income_expense/income_expense');
const transactionsRoute = require('./transactions/gettransactions');
const reportRoute = require('./report/report');

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files (CSS, JS, images, etc.)
app.use(express.static("public"));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views'); // Assuming your views are stored in a `views` directory

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

// Home route - Render EJS
app.get('/', async (req, res) => {
    try {
        // Fetch a message from your backend API
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/home`);
        const message = response.data.message;

        // Render the `index.ejs` template with the message
        res.render('index', { message });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('index', { message: 'Failed to load message' });
    }
});

app.get('/api/home', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            // No token provided
            const message = "You are not logged in.";
            return res.render('home', { message });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification failed:", err);
                const message = "You are not logged in.";
                return res.render('home', { message });
            }

            // Token is valid; user is logged in
            const message = `Welcome back, user ID: ${decoded.id}! You are logged in.`;
            res.render('home', { message });
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.render('home', { message: "An error occurred while processing your request." });
    }
});


// Protected route (can only be accessed if logged in)
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.email}. This is a protected route.` });
});

// API routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/categories', getCategoryRoute);
app.use('/api/categories/add', addCategoryRoute);
app.use('/api/transactions/add', addTransactionsRoute);
app.use('/api/income-expenses', incomeExpenseRoute);
app.use('/api/history', transactionsRoute);
app.use('/api/report', reportRoute);

// Server startup
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

module.exports = app;
