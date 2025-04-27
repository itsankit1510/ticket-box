const bcrypt = require("bcrypt");
const sequelize = require("../config/database");
const users = require("../models/users");

/**
 * Seeds the database with an admin user
 * @async
 * @function seedAdmin
 */
async function seedAdmin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Check if admin user already exists
    const existingAdmin = await users.findOne({
      where: {
        username: "admin",
        role: "Admin"
      }
    });

    if (existingAdmin) {
      console.log("Admin user already exists. Skipping seeder.");
      process.exit(0);
    }

    // Create hashed password
    const hashedPassword = bcrypt.hashSync("admin@123", 10);

    // Create admin user
    const adminUser = await users.create({
      name: "Admin",
      lastname: "User",
      username: "admin",
      email: "admin@ticketbox.com",
      password: hashedPassword,
      contact_number: "+910000000000",
      role: "Admin",
      is_first_login: false,
      created_by: "system",
      updated_by: "system"
    });

    console.log("Admin user created successfully:", adminUser.username);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
}

// Execute the seeder function
seedAdmin();