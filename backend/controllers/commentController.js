/**
 * Comment service functions for adding, editing, and deleting comments.
 * @typedef {Object} CommentServices
 * @property {function} addCommentService - Function for adding a comment to the database.
 * @property {function} editCommentService - Function for editing a comment in the database.
 * @property {function} deleteCommentService - Function for deleting a comment from the database.
 */
const {
  addCommentService,
  editCommentService,
  deleteCommentService,
} = require("../services/commentService");

/**
 * Validation functions for user and comment data.
 * @typedef {Object} ValidationFunctions
 * @property {function} isUserNameExists - Function for checking if a username exists.
 * @property {function} isCommentIdExist - Function for checking if a comment ID exists.
 * @property {function} isAdmin - Function for checking if a user is an admin.
 */
const {
  isUserNameExists,
  isCommentIdExist,
  isAdmin,
} = require("../utils/validations");

/**
 * Controller function for adding a new comment.
 * @function addComment
 * @async
 * @param {Object} req - Request object.
 * @param {Object} req.body - Request body containing the comment to add.
 * @param {string} req.body.comment - The text of the comment to add.
 * @param {Object} res - Response object.
 * @returns {Object} - Returns a JSON object with the result of the operation.
 * @throws {Error} - Throws an error if something goes wrong during the operation.
 */
exports.addComment = async (req, res) => {
  if (req.body.comment === "") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  }
  try {
    const userName = res.locals.userName;
    const result = await addCommentService(req.body, userName);
    if (result) {
      return res.status(201).json({
        status: 201,
        success: true,
        message: "Comment added Successfully",
      });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Failed to add a comment",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};

/**
 * Controller function for editing an existing comment.
 * @function editComment
 * @async
 * @param {Object} req - Request object.
 * @param {Object} req.body - Request body containing the new comment data.
 * @param {string} req.body.comment - The new text for the comment.
 * @param {string} req.body.commented_by - The username of the user who made the comment.
 * @param {Object} req.params - Request parameters containing the ID of the comment to edit.
 * @param {string} req.params.id - The ID of the comment to edit.
 * @param {Object} res - Response object.
 * @returns {Object} - Returns a JSON object with the result of the operation.
 * @throws {Error} - Throws an error if something goes wrong during the operation.
 */
exports.editComment = async (req, res) => {
  if (!req.body.comment || !req.body.commented_by) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  }
  try {
    const result = await editCommentService(req.body, req.params.id);
    if (result) {
      return res.status(201).json({
        status: 201,
        success: true,
        message: "Comment edited Successfully",
      });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Id not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Deletes a comment with given id
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object with status and message
 */
exports.deleteComment = async (req, res) => {
  const userName = res.locals.userName;
  const id = req.params.id;

  // check if the comment id exists
  if (!(await isCommentIdExist(id))) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Id doesn't exists",
    });
  }

  // check if the user is an admin
  if (!(await isAdmin(userName))) {
    return res.status(400).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  }

  try {
    // delete the comment with the given id
    const result = await deleteCommentService(req.params.id);

    if (result) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Comment deleted Successfully",
      });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Id not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
