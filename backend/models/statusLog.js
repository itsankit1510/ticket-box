const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const ticket = require("./tickets.js");
// Define the StatusLog model
const statusLog = sequelize.define(
  "status_log",
  {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    current_status: {
      type: DataTypes.ENUM("Open", "In Progress", "Resolved", "Closed"),
      allowNull: false,
      defaultValue: "Open",
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ticket,
        key: "ticket_id",
      },
    },
  },
  {
    timestamps: false,
  }
);
// Define associations for the StatusLog model
statusLog.belongsTo(ticket, { foreignKey: "ticket_id" });

// Export the StatusLog model
module.exports = statusLog;
