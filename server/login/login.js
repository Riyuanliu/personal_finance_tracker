const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Add jwt
const db = require('../db');
const router = express.Router();

// Login API Route
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login attempt for username:', username);

        // Check if username exists
        const checkUsernameQuery = 'SELECT * FROM users WHERE username = $1';
        const usernameCheck = await db.query(checkUsernameQuery, [username]);

        if (usernameCheck.rows.length === 0) {
            console.log(`Username '${username}' not found`);
            return res.status(400).json({ message: 'Username not found' });
        }

        const user = usernameCheck.rows[0];
        console.log(`User found: ${user.username}, User ID: ${user.id}`);

        // Compare the provided password with the stored hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        console.log(`Comparing password for ${username}: ${password} (plain) vs ${user.password} (hashed)`);
        console.log(`Password comparison result: ${validPassword}`);

        if (!validPassword) {
            console.log(`Invalid password attempt for username: ${username}`);
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Successful login
        console.log(`User ${username} logged in successfully`);


        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({
            message: 'Login successful',
            userId: user.id,
            username: user.username,
            token: token,  // Send the token in the response
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login', error: error.message });
    }
});

module.exports = router;
