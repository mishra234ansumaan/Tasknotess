// server.js
const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config({ path: './config/.env' });

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
