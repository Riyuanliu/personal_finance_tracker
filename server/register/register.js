const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Registration API Route
router.post('/', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if email or username already exists
        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const checkUsernameQuery = 'SELECT * FROM users WHERE username = $1';

        const emailCheck = await db.query(checkEmailQuery, [email]);
        const usernameCheck = await db.query(checkUsernameQuery, [username]);

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        if (usernameCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the users table
        const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id';
        const userResult = await db.query(insertUserQuery, [email, username, hashedPassword]);
        const userId = userResult.rows[0].id; // Changed from user_id to id

        res.status(201).json({ message: 'User registered successfully', userId });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'An error occurred during registration', error: error.message });
    }
});

module.exports = router;
