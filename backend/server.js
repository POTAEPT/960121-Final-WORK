
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Middlewares
// ==========================================
app.use(cors());
app.use(express.json());

// ==========================================
// 2. Routes 
// ==========================================
const classRoutes = require('./src/routes/classRoutes');
const authRoutes = require('./src/routes/authRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
app.use('/api/classes', classRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);



app.get('/api/health', (req, res) => {
    res.json({ message: "Skill-Share Backend is running! 🚀" });
});

// ==========================================
// 3. 404 Catch-All
// ==========================================
app.use((req, res, next) => {
    const error = new Error(`Route ${req.method}:${req.originalUrl} not found`);
    error.statusCode = 404;
    error.publicMessage = 'Not Found';
    next(error);
});

// ==========================================
// 4. Error Handler
// ==========================================
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.publicMessage || 'Server Error';

    console.error(err);
    res.status(statusCode).json({ success: false, message });
});

// ==========================================
// 5. Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});