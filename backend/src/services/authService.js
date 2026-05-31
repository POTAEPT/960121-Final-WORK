const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { get, run } = require('../config/db');

const createUser = async ({ name, email, password }) => {
    const existing = await get('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        error.publicMessage = 'Email already in use';
        throw error;
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await run(
        'INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email, passwordHash]
    );

    return { id: result.lastID, name, email };
};

const loginUser = async ({ email, password }) => {
    const user = await get(
        'SELECT id, name, email, password_hash FROM Users WHERE email = ?',
        [email]
    );

    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        error.publicMessage = 'Invalid credentials';
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        error.publicMessage = 'Invalid credentials';
        throw error;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        const error = new Error('JWT secret not configured');
        error.statusCode = 500;
        error.publicMessage = 'Server Error';
        throw error;
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email, name: user.name },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
};

module.exports = { createUser, loginUser };
