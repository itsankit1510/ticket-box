// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Create an express application
const app = express();

// Enable CORS for the client at http://localhost:8080
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// Set up body parser to parse incoming request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load environment variables from the config file
dotenv.config({ path: "./config/config.env" });

// Import routes
const userRoute = require("./routes/userRoute");
const ticketRoute = require("./routes/ticketRoute");
const commentRoute = require("./routes/commentRoute");

// Import and authenticate with the database
const sequelize = require("./config/database");
sequelize.authenticate().then(() => {
  console.log("online");
});

// Synchronize database models with the schema
sequelize.sync({});

// Mount routes on the application
app.use("/user", userRoute);
app.use("/ticket", ticketRoute);
app.use("/comment", commentRoute);

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log(`Server is online on http://localhost:${process.env.PORT}`);
});
