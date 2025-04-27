const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define log format
const logFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Create Winston logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    format.colorize(),
    logFormat
  ),
  defaultMeta: { service: 'ticket-box-api' },
  transports: [
    // Console transport
    new transports.Console(),
    
    // File transports
    new transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    new transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
    new transports.File({
      filename: path.join(logDir, 'requests.log'),
      level: 'http'
    })
  ],
  exitOnError: false
});

// Create a stream object for Morgan integration (if added later)
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Add convenience methods for request logging
logger.logRequest = (req) => {
  logger.http(`${req.method} ${req.url}`, {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent') || '',
    body: process.env.NODE_ENV === 'development' ? req.body : undefined
  });
};

logger.logResponse = (req, res, responseTime) => {
  logger.http(`${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`, {
    statusCode: res.statusCode
  });
};

module.exports = logger;