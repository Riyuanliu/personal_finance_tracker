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

router.get('/daily', authenticateToken, async (req, res) => {
    const user_id = req.user.id; // Get user ID from JWT
    const centerDate = new Date(); // This will be the "center" of the week, like today's date or a specified date

    // Calculate the 7-day range: center date ± 3 days
    const startDate = new Date(centerDate);
    startDate.setDate(centerDate.getDate() - 3); // 3 days before the center date
    const endDate = new Date(centerDate);
    endDate.setDate(centerDate.getDate() + 3); // 3 days after the center date

    try {
        // Add parameters for the range
        const params = [user_id, startDate.toISOString(), endDate.toISOString()];

        // Query to get the daily expenses, grouped by day and transaction type (income vs expense)
        const query = `
            SELECT
                to_char(t.date, 'Dy') AS label,  -- Day of the week as label (e.g., Mon, Tue)
                SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) AS total_income,  -- Sum for income transactions
                SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense  -- Sum for expense transactions
            FROM transactions t
                     JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = $1
              AND t.date >= $2
              AND t.date <= $3
            GROUP BY to_char(t.date, 'Dy'), t.date  -- Group by day and date to get accurate totals for each day
            ORDER BY t.date;  -- Sort by date
        `;

        // Execute the query
        const result = await pool.query(query, params);

        // Check if data is found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No data found for the given range' });
        }

        // Transform the data into the required format
        const transformedData = result.rows.map(row => ({
            label: row.label,  // Day of the week (e.g., "Mon", "Tue")
            total_income: row.total_income || 0,  // Total income for the day, or 0 if no income
            total_expense: row.total_expense || 0,  // Total expense for the day, or 0 if no expense
        }));

        // Return the transformed data
        res.json(transformedData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/monthly', authenticateToken, async (req, res) => {
    const user_id = req.user.id; // Get user ID from JWT
    const currentYear = new Date().getFullYear(); // Get current year

    // Generate start and end dates for the current year dynamically
    const startOfYear = `${currentYear}-01-01`;
    const endOfYear = `${currentYear}-12-31`;

    try {
        // Add parameters for the range
        const params = [user_id, startOfYear, endOfYear];

        // Query to get the monthly income and expenses
        const query = `
            SELECT
                TO_CHAR(t.date, 'YYYY-MM') AS month,  -- Format the date as year-month
                SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END) AS total_income,  -- Sum for income transactions
                SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense  -- Sum for expense transactions
            FROM transactions t
                JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = $1
              AND t.date >= $2  -- Ensure within the range for the given year
              AND t.date <= $3
            GROUP BY TO_CHAR(t.date, 'YYYY-MM')  -- Group by year-month
            ORDER BY month;  -- Sort by month
        `;

        // Execute the query
        const result = await pool.query(query, params);

        // Check if data is found
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No data found for the given year' });
        }

        // Calculate net income for each month
        const monthlyData = result.rows.map(row => ({
            month: row.month,
            net_income: row.total_income - row.total_expense,  // Subtract expense from income
            total_income: row.total_income,
            total_expense: row.total_expense
        }));

        // Return the monthly data
        res.json(monthlyData);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});





module.exports = router;
