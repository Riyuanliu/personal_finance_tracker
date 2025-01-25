const express = require('express');
const pool = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer scheme
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Ensure the user_id is available in the decoded token
        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: 'Invalid token payload' });
        }

        req.user = decoded; // Assign decoded token to req.user
        next();
    });
};


// Get categories for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const id = req.user.id; // Access user_id from the decoded token
        // console.log('User ID:', id);

        // Fetch categories for the authenticated user (including default categories)
        const categoriesQuery = `
            SELECT name, type
            FROM categories
            WHERE user_id = $1 OR user_id IS NULL
        `;
        const categories = await pool.query(categoriesQuery, [id]);
        // console.log('Categories:', categories.rows);

        // Organize categories into income and expense
        const categorizedData = {
            income: [],
            expense: []
        };

        categories.rows.forEach(cat => {
            categorizedData[cat.type].push(cat.name);
        });

        // console.log('Categorized Data:', categorizedData);

        // Send the categorized data as the response
        res.json(categorizedData);

    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
