const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// Register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Missing fields');

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, password_hash: hashedPassword }])
            .select();

        if (error) throw error;

        res.status(201).send({ id: data[0].id, username });
    } catch (err) {
        console.error(err);
        res.status(400).send('User already exists or error creating user');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
    res.send({ token, user: { id: user.id, username: user.username } });
});

module.exports = router;
