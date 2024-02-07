const express = require("express");
const {
  logIn,
  editUser,
  createUser,
  editUsers,
  getUsers,
  getUser,
  logOut,
  deleteUser,
  changePassword,
  getUserById,
  getAllUsers,
  getUserByUserName,
} = require("../controllers/userController");

// Import the validateToken middleware
const { validateToken } = require("../middleware/auth");

// Create a new Router instance
const router = express.Router();

/**
 * POST /logIn
 * Route for user login
 */
router.post("/logIn", logIn);

/**
 * GET /
 * Route for getting the authenticated user
 * Requires a valid token to access
 */
router.get("/", validateToken, getUser);

/**
 * PATCH /
 * Route for updating the authenticated user
 * Requires a valid token to access
 */
router.patch("/", validateToken, editUser);

/**
 * POST /admin/createUser
 * Route for creating a new user
 * Requires a valid token with admin privileges to access
 */
router.post("/admin/createUser", validateToken, createUser);

/**
 * PATCH /admin/editUser/:id
 * Route for updating an existing user
 * Requires a valid token with admin privileges to access
 */
router.patch("/admin/editUser/:id", validateToken, editUsers);

/**
 * GET /admin/getUsers
 * Route for getting all users
 * Requires a valid token with admin privileges to access
 */
router.get("/admin/getUsers", validateToken, getUsers);

/**
 * GET /logOut
 * Route for user logout
 */
router.get("/logOut", logOut);

/**
 * DELETE /admin/delete/:id
 * Route for deleting a user
 * Requires a valid token with admin privileges to access
 */
router.delete("/admin/delete/:id", validateToken, deleteUser);

/**
 * PATCH /changePassword
 * Route for changing the authenticated user's password
 * Requires a valid token to access
 */
router.patch("/changePassword", validateToken, changePassword);

/**
 * GET /admin/:id
 * Route for getting a user by ID
 * Requires a valid token with admin privileges to access
 */
router.get("/admin/:id", validateToken, getUserById);

/**
 * GET /admin/get/:username
 * Route for getting a user by username
 * Requires a valid token with admin privileges to access
 */
router.get("/admin/get/:username", validateToken, getUserByUserName);

/**
 * GET /getAllUsers
 * Route for getting all users
 * Requires a valid token with admin privileges to access
 */
router.get("/getAllUsers", validateToken, getAllUsers);

/**
 * POST /logOut
 * Route for user logout
 */
router.post("/logOut", logOut);

// Export the router
module.exports = router;
