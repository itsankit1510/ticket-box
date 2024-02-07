const express = require("express");
const {
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/commentController");

// Import the validateToken middleware
const { validateToken } = require("../middleware/auth");

// Create a new Router instance
const router = express.Router();

/**
 * POST /
 * Route for adding a new comment
 * Requires a valid token to access
 */
router.post("/", validateToken, addComment);

/**
 * PATCH /:id
 * Route for editing a comment
 * Requires a valid token to access
 */
router.patch("/:id", validateToken, editComment);

/**
 * DELETE /:id
 * Route for deleting a comment
 * Requires a valid token to access
 */
router.delete("/:id", validateToken, deleteComment);

// Export the router
module.exports = router;
