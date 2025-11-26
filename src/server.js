const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
const crypto = require('crypto');
const db = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Generate a random session secret if not provided
function getSessionSecret() {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️  WARNING: SESSION_SECRET not set in production. Generating random secret.');
    console.warn('⚠️  Sessions will be invalidated on server restart. Set SESSION_SECRET env var.');
  }
  return crypto.randomBytes(32).toString('hex');
}

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 create requests per hour
  message: { success: false, error: 'Too many posts created, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: getSessionSecret(),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// API Routes with additional rate limiting for create operations
app.post('/api/posts', createLimiter);
app.post('/api/contact', createLimiter);
app.use('/api', apiRoutes);

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Initialize database and start server
db.initialize();

app.listen(PORT, () => {
  console.log(`🚀 Ultra Website is running at http://localhost:${PORT}`);
  console.log(`✨ Ready to serve ultra-cool content!`);
});

module.exports = app;
