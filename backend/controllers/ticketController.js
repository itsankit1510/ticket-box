const ticket = require("../models/tickets");
const {
  getAllTicketsService,
  changeStatusService,
  getTicketService,
  createTicketService,
  editTicketService,
  deleteTicketService,
  getTicketByFieldService,
} = require("../services/ticketService");
const {
  isAdmin,
  isTicketIdExist,
  isIdExists,
} = require("../utils/validations");
/**
 * Retrieves all the tickets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Returns a JSON object containing the status code, success flag, message, data and count
 */
exports.getAllTickets = async (req, res) => {
  try {
    let page = req.query.page;
    let limit = req.query.limit;
    // Call the service method to get all the tickets
    const response = await getAllTicketsService(page, limit);

    if (response) {
      // If tickets are retrieved successfully, send a success response
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Success",
        payload: response.data,
        count: response.count,
      });
    } else {
      // If tickets retrieval failed, send a failure response
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Failed",
        payload: [],
      });
    }
  } catch (error) {
    // If an error occurs, send an error response
    return res.status(500).json({
      status: 500,
      success: false,
      message: error || "Something went wrong",
      error: error,
    });
  }
};
exports.createTicket = async (req, res) => {
  // Validate ticket data before creating a new ticket
  if (
    !["Ticket", "Bug", "Task"].includes(req.body.ticket_type) ||
    !req.body.summary ||
    !req.body.description ||
    req.body.status !== "Open"
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  }

  try {
    const userName = res.locals.userName;
    // Convert empty string to null for parent_ticket_id
    if (req.body.parent_ticket_id === "") {
      req.body.parent_ticket_id = null;
    }
    // Create new ticket using ticket data and current user's username
    const createTicketResponse = await createTicketService(req.body, userName);

    // Return success message if ticket created successfully
    if (createTicketResponse) {
      return res.status(201).json({
        status: 201,
        success: true,
        message: "Ticket Created Successfully",
      });
    }
    // Return error message if ticket creation failed
    else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Ticket Creation Failed",
      });
    }
  } catch (error) {
    // Return error message if any other error occurred
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
exports.changeStatus = async (req, res) => {
  const userName = res.locals.userName; // get the username from the authenticated user
  try {
    const changeStatus = await changeStatusService(
      req.body,
      req.params.id,
      userName
    ); // call the service function to change the status of the ticket
    if (changeStatus) {
      // if status change is successful
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Status updated successfully",
      }); // return success response
    } else {
      return res.status(401).json({
        status: 401,
        success: true,
        message: "Id not found",
      }); // return error response if ticket id not found
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    }); // return error response for any other errors
  }
};
exports.viewTicket = async (req, res) => {
  const id = req.params.id; // Get the id of the ticket from the request parameters
  try {
    const getTicket = await getTicketService(id); // Call the getTicketService with the ticket id to retrieve the ticket data
    if (getTicket.length > 0) {
      // If the service returns a non-empty array of ticket data
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Data Found",
        payload: await getTicket, // Send the ticket data as the payload
      });
    } else {
      return res.status(401).json({
        status: 200,
        success: true,
        message: "Id not found", // If no data was found for the given id, return an error message
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack, // If an error occurred, return a generic error message and the stack trace
    });
  }
};
exports.editTicket = async (req, res) => {
  // Check if the input data is valid
  if (
    !["Ticket", "Bug", "Task"].includes(req.body.ticket_type) ||
    !req.body.summary ||
    !req.body.description ||
    !["Open", "In Progress", "Resolved", "Closed"].includes(req.body.status)
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  }

  // Get the current status of the ticket to be edited
  let getCurrentStatus = await ticket.findOne({
    where: { ticket_id: req.params.id },
  });
  getCurrentStatus = await getCurrentStatus.status;

  try {
    // Check if the status transition is valid or not
    if (
      (getCurrentStatus === "Open" && req.body.status === "In Progress") ||
      (getCurrentStatus === "In Progress" && req.body.status === "Resolved") ||
      (getCurrentStatus === "Resolved" && req.body.status === "Closed") ||
      (getCurrentStatus === "Closed" && req.body.status === "Open") ||
      getCurrentStatus === req.body.status
    ) {
      // If the status transition is valid, proceed with editing the ticket
      const userName = res.locals.userName;
      const editTicketData = await editTicketService(
        req.body,
        req.params.id,
        userName
      );

      if (editTicketData) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Ticket edited successfully",
        });
      } else {
        return res.status(401).json({
          status: 401,
          success: true,
          message: "Id not found",
        });
      }
    } else {
      // If the status transition is not valid, return an error message
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Ticket Lifecycle Bypassing Not Allowed",
      });
    }
  } catch (error) {
    // If an error occurs, return a 500 error message with the error details
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Deletes a ticket by ID
 *
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Object} HTTP response object
 */
exports.deleteTicket = async (req, res) => {
  // Extract the username from res.locals
  const userName = res.locals.userName;

  // Extract the ID from the request parameters
  const id = req.params.id;

  // Check if the user is an admin
  if (!(await isAdmin(userName))) {
    return res.status(400).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  }

  // Check if the ticket ID exists
  if (!(await isTicketIdExist(id))) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Id doesn't exists",
    });
  }

  try {
    // Delete the ticket using the deleteTicketService function
    const result = await deleteTicketService(req.params.id);

    // Check if the deletion was successful and return a success response
    if (result) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Ticket deleted successfully",
      });
    } else {
      // If the ticket was not found, return a 404 error
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Id not found",
      });
    }
  } catch (error) {
    // If there was an error during the deletion process, return a 500 error
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};

/**
 * Get tickets by field and keywords
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Returns the ticket data or an error message
 */
exports.getTicketByField = async (req, res) => {
  // Define valid fields to search for
  const validFields = [
    "summary",
    "status",
    "reporter",
    "assignee",
    "ticketId",
    "ticket_type",
  ];
  const field = req.query.field;
  const keywords = req.query.keywords;

  // If the field parameter is not valid, return an error
  if (!validFields.includes(field)) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: "Invalid Field",
    });
  }

  try {
    // Call the getTicketByFieldService function to get the ticket data
    const ticketResult = await getTicketByFieldService(field, keywords);

    // If the ticket data is found, return it
    if (ticketResult) {
      return res.status(200).json({
        status: 200,
        success: true,
        data: ticketResult,
      });
    } else {
      // If the ticket data is not found, return an error
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Not Found",
        data: [],
      });
    }
  } catch (error) {
    // If an error occurs, return an error message
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
