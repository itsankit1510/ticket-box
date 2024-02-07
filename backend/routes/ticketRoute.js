const express = require("express");
const {
  getAllTickets,
  createTicket,
  changeStatus,
  viewTicket,
  editTicket,
  deleteTicket,
  getTicketByField,
} = require("../controllers/ticketController");

// Import the validateToken middleware
const { validateToken } = require("../middleware/auth");

// Create a new Router instance
const router = express.Router();

/**
 * GET /
 * Route for getting all tickets
 * Requires a valid token to access
 */
router.get("/", validateToken, getAllTickets);

/**
 * POST /
 * Route for creating a new ticket
 * Requires a valid token to access
 */
router.post("/", validateToken, createTicket);

/**
 * GET /searchByField/
 * Route for searching for tickets by field value
 * Requires a valid token to access
 */
router.get("/searchByField/", validateToken, getTicketByField);

/**
 * PATCH /:id
 * Route for changing the status of a ticket
 * Requires a valid token to access
 */
router.patch("/:id", validateToken, changeStatus);

/**
 * GET /:id
 * Route for viewing a single ticket
 * Requires a valid token to access
 */
router.get("/:id", validateToken, viewTicket);

/**
 * PATCH /editTicket/:id
 * Route for editing a ticket
 * Requires a valid token to access
 */
router.patch("/editTicket/:id", validateToken, editTicket);

/**
 * DELETE /admin/:id
 * Route for deleting a ticket
 * Requires a valid token with admin privileges to access
 */
router.delete("/admin/:id", validateToken, deleteTicket);

// Export the router
module.exports = router;
