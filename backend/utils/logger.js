

const { createLogger, format, transports, combine, timestamp, colorize } = require('winston');

// 1. Create a logger that ONLY has Console transport
const logger = createLogger({
  format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  transports: [new transports.Console()],
});

// 2. Add file transports ONLY if we are NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
  const fs = require('fs');
  const path = require('path');
  
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }
  
  logger.add(new transports.File({ filename: path.join('./logs', 'error.log'), level: 'error' }));
  logger.add(new transports.File({ filename: path.join('./logs', 'combined.log') }));
}

logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;