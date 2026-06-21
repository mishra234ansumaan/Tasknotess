const dotenv = require('dotenv');
const connectDB = require('../../config/db');
const app = require('../../app');
const logger = require('../logger');
const cors = require('cors');

const corsOptions = {
  origin: 'https://your-frontend-domain.com', // Replace with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));

dotenv.config();

try {
  connectDB();
  logger.info("Database connected successfully");
} catch (error) {
  logger.error("Database connection failed:", error);
}

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
module.exports = app;
