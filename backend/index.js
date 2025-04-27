// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the config file
dotenv.config({ path: "./config/config.env" });

// Import custom logger
const logger = require("./utils/logger");

// Create an express application
const app = express();

// Enable CORS for the client at http://localhost:8080
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.logRequest(req);
  
  // Capture the response
  const originalSend = res.send;
  res.send = function(data) {
    // Calculate request processing time
    const responseTime = Date.now() - startTime;
    
    // Log the response
    logger.logResponse(req, res, responseTime);
    
    // Call the original send function
    return originalSend.call(this, data);
  };
  
  next();
});

// Set up body parser to parse incoming request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const userRoute = require("./routes/userRoute");
const ticketRoute = require("./routes/ticketRoute");
const commentRoute = require("./routes/commentRoute");

// Import and authenticate with the database
const sequelize = require("./config/database");
sequelize.authenticate()
  .then(() => {
    logger.info("Database connection established successfully");
  })
  .catch(err => {
    logger.error("Unable to connect to the database:", { error: err.message });
  });

// Synchronize database models with the schema
sequelize.sync({})
  .then(() => {
    logger.info("Database models synchronized successfully");
  })
  .catch(err => {
    logger.error("Failed to synchronize database models:", { error: err.message });
  });

// Mount routes on the application
app.use("/user", userRoute);
app.use("/ticket", ticketRoute);
app.use("/comment", commentRoute);

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  logger.info(`Server is online on http://localhost:${process.env.PORT}`);
});
