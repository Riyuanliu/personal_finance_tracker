const express = require('express');
const pool = require('../db'); // Ensure your pool is correctly set up for database access
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate token (you already have this)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }

        req.user = decoded; // Assign decoded token to req.user
        next();
    });
};

// Backend route to get user income and expenses for the current month with category names, excluding 0 totals
router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.id; // Get user ID from JWT

    try {
        // Get the current month and year
        const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
        const currentYear = new Date().getFullYear();

        // Step 1: Query to get categories for the user (including default categories)
        const categoryResult = await pool.query(
            'SELECT id, name, type FROM categories WHERE user_id = $1 OR user_id IS NULL',
            [user_id]
        );

        const incomeCategories = categoryResult.rows.filter(category => category.type === 'income');
        const expenseCategories = categoryResult.rows.filter(category => category.type === 'expense');

        // Step 2: Fetch income transactions for the current month
        const incomePromises = incomeCategories.map(async (category) => {
            const incomeResult = await pool.query(
                `SELECT category_id, SUM(amount) AS total 
                 FROM transactions 
                 WHERE user_id = $1 
                 AND category_id = $2
                 AND EXTRACT(MONTH FROM date) = $3
                 AND EXTRACT(YEAR FROM date) = $4
                 GROUP BY category_id`,
                [user_id, category.id, currentMonth, currentYear]
            );
            // Only return if total is greater than 0
            const total = incomeResult.rows[0]?.total || 0;
            return total > 0 ? { category: category.name, total } : null;
        });

        // Step 3: Fetch expense transactions for the current month
        const expensePromises = expenseCategories.map(async (category) => {
            const expenseResult = await pool.query(
                `SELECT category_id, SUM(amount) AS total 
                 FROM transactions 
                 WHERE user_id = $1 
                 AND category_id = $2
                 AND EXTRACT(MONTH FROM date) = $3
                 AND EXTRACT(YEAR FROM date) = $4
                 GROUP BY category_id`,
                [user_id, category.id, currentMonth, currentYear]
            );
            // Only return if total is greater than 0
            const total = expenseResult.rows[0]?.total || 0;
            return total > 0 ? { category: category.name, total } : null;
        });

        // Wait for all promises to resolve and filter out null values
        const incomeData = (await Promise.all(incomePromises)).filter(item => item !== null);
        const expenseData = (await Promise.all(expensePromises)).filter(item => item !== null);

        // Step 4: Return the grouped data excluding 0 totals
        res.json({
            income: incomeData,
            expenses: expenseData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
