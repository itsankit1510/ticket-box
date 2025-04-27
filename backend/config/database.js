const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './config/config.env' });

// Import the logger
const logger = require('../utils/logger');

// Custom SQL query logger function
const sqlLogger = (sql, timing) => {
  logger.debug(sql, { 
    component: 'sequelize', 
    executionTimeMs: timing
  });
};

// Create a Sequelize instance for PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name
  process.env.DB_USER,      // Database user
  process.env.DB_PASSWORD,  // Database password
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: process.env.NODE_ENV === 'development' ? sqlLogger : false,
    pool: {
      max: 5,        // Maximum number of connection in pool
      min: 0,        // Minimum number of connection in pool
      acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000    // Maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
);

module.exports = sequelize;