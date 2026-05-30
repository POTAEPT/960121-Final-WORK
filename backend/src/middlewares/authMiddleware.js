const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const [scheme, token] = header.split(' ');

        if (scheme !== 'Bearer' || !token) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.publicMessage = 'Unauthorized';
            throw error;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            const error = new Error('JWT secret not configured');
            error.statusCode = 500;
            error.publicMessage = 'Server Error';
            throw error;
        }

        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 401;
            error.publicMessage = 'Unauthorized';
        }
        next(error);
    }
};

module.exports = authMiddleware;
