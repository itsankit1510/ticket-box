const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const ticket = require("./tickets");
const users = require("./users");

// Define the CommentLog model
const commentLog = sequelize.define(
  "comment_log",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commented_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commented_at: {
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

// Define associations for the CommentLog model
commentLog.belongsTo(ticket, { foreignKey: "ticket_id" });

// Export the CommentLog model
module.exports = commentLog;
