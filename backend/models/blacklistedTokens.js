const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Define the BlacklistedToken model
const blacklistedTokens = sequelize.define(
  "blacklistedtokens",
  {
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING(350),
      allowNull: false,
    },
  },
  { timestamps: false }
);

// Export the BlacklistedToken model
module.exports = blacklistedTokens;
