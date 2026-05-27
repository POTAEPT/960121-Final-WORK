require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDb, seedDb } = require('./db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const classesRoutes = require('./routes/classes');
const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/bookings', bookingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  initDb();
  seedDb();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
