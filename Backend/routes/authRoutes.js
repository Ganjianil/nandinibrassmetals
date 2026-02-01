const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Goes back one folder to find db.js

// SIGNUP: http://localhost:5000/api/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed. Email might exist." });
    }
});

// LOGIN: http://localhost:5000/api/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            const match = await bcrypt.compare(password, users[0].password);
            if (match) {
                res.json({ message: "Welcome back!", user: { id: users[0].id, name: users[0].username } });
            } else {
                res.status(401).json({ error: "Incorrect password" });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;