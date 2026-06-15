// app.js
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean'); // Not installed yet, will add later if needed.
const hpp = require('hpp'); // Not installed yet, will add later if needed.
const mongoSanitize = require('express-mongo-sanitize'); // Not installed yet, will add later if needed.
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(mongoSanitize()); // Prevent NoSQL Injection attacks
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution attacks

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 minutes per IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Logger
app.use(morgan('combined', { stream: logger.stream }));

// Mount routers
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/notes', require('./routes/noteRoutes'));

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;

