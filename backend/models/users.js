const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
// Define the Tickets model
const users = sequelize.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\+[0-9]{12}$/,
    },
  },
  del: {
    type: DataTypes.ENUM("0", "1"),
    defaultValue: "0",
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("User", "Admin"),
    allowNull: false,
    defaultValue: "User",
  },
  is_first_login: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
// Export the Users model
module.exports = users;
