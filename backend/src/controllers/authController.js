const authService = require('../services/authService');

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error('Missing required fields');
            error.statusCode = 400;
            error.publicMessage = 'Missing required fields';
            throw error;
        }

        const user = await authService.createUser({ name, email, password });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Missing required fields');
            error.statusCode = 400;
            error.publicMessage = 'Missing required fields';
            throw error;
        }

        const result = await authService.loginUser({ email, password });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };
