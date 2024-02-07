const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const users = require("./users");
// Define the Tickets model
const ticket = sequelize.define("tickets", {
  ticket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parent_ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ticket_type: {
    type: DataTypes.ENUM("Ticket", "Bug", "Feature"),
    allowNull: false,
    defaultValue: "Ticket",
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("Open", "In Progress", "Resolved", "Closed"),
    allowNull: false,
    defaultValue: "Open",
  },
  reporter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: "user_id",
    },
  },
  del: {
    type: DataTypes.ENUM("0", "1"),
    defaultValue: "0",
    allowNull: false,
  },
  last_updated_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// Define associations for the Tickets model
ticket.belongsTo(users, { foreignKey: "assignee" });
// Export the Tickets model
module.exports = ticket;
