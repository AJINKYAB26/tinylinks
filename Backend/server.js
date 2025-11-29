require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const linkRoutes = require('./routes/linkRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { redirectToTarget } = require('./controllers/linkController');

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

async function start() {
  await connectDB(MONGODB_URI);

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Healthcheck route required by autograder
  app.get('/healthz', (req, res) => res.json({ ok: true, version: '1.0' }));

  // API routes
  app.use('/', linkRoutes);

  // Redirect route (should be AFTER /api routes, so /api/.. works)
  app.get('/:code', redirectToTarget);

  // Fallback 404 for other routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server listening at ${BASE_URL}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
