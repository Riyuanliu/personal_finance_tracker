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

router.get('/', authenticateToken, async (req, res) => {
    const user_id = req.user.id; // Get user ID from JWT

    try {
        // Query to get transactions for the user with category details
        const transactionResult = await pool.query(
            `SELECT
                 t.transaction_id AS id, t.amount, t.note, t.date, c.name as category, c.type as category_type
             FROM transactions t
                      JOIN categories c ON t.category_id = c.id
             WHERE t.user_id = $1
             ORDER BY t.date DESC`,
            [user_id]
        );

        // Modify the amount for expenses (make it negative)
        const transactions = transactionResult.rows.map(transaction => {
            if (transaction.category_type === 'expense') {
                transaction.amount = -Math.abs(transaction.amount); // Make expense amount negative
            }
            return transaction;
        });

        // Respond with transaction data
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;

