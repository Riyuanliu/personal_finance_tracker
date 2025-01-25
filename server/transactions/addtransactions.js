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

router.post('/', authenticateToken, async (req, res) => {
    const { type, amount, date, category, note } = req.body;
    const user_id = req.user.id; // Use the user ID from the JWT

    if (!amount || !date || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if the category exists in the 'category' table
        const categoryResult = await pool.query(
            'SELECT id FROM categories WHERE name = $1 LIMIT 1',
            [category]
        );

        if (categoryResult.rows.length === 0) {
            // Category not found, return an error or create it
            return res.status(400).json({ message: 'Category not found' });
            // OR if you want to create the category:
            // const createCategoryResult = await pool.query(
            //     'INSERT INTO category (name) VALUES ($1) RETURNING id',
            //     [category]
            // );
            // const categoryId = createCategoryResult.rows[0].id;
        } else {
            // Category found, use its ID
            const categoryId = categoryResult.rows[0].id;

            // Insert transaction data into the database
            const result = await pool.query(
                'INSERT INTO transactions (user_id, amount, date, category_id, note) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [user_id, amount, date, categoryId, note]
            );

            // Respond with the inserted transaction data
            const transaction = result.rows[0];
            return res.status(201).json({
                message: 'Transaction added successfully',
                transaction,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


module.exports = router;
