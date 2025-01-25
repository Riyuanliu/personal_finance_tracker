const express = require('express');
const pool = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer scheme

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

// Route to add a new category
router.post('/', authenticateToken, async (req, res) => {
    const { type, category } = req.body;
    const userId = req.user.id; // Extracted from the token

    // Validate input
    if (!type || !category) {
        return res.status(400).json({ message: 'Type and category are required' });
    }

    try {
        // Insert new category into the database
        const query = `
            INSERT INTO categories (user_id, type, name)
            VALUES ($1, $2, $3)
            RETURNING id, type, name;
        `;
        const values = [userId, type, category];
        const result = await pool.query(query, values);

        // Return the newly created category
        res.status(201).json({
            message: 'Category added successfully',
            category: result.rows[0]
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
