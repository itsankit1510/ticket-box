const commentLog = require("../models/commentLog");

/**
 * @function addCommentService
 * @description Adds a comment to a ticket.
 * @param {object} body - The body of the request containing the comment and ticket ID.
 * @param {string} userName - The username of the user who commented on the ticket.
 * @returns {Promise<boolean>} - Returns true if the comment was added successfully, false otherwise.
 */
exports.addCommentService = async (body, userName) => {
  try {
    const result = await commentLog.create({
      comment: body.comment,
      commented_by: userName,
      ticket_id: body.ticket_id,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @function editCommentService
 * @description Edits a comment on a ticket.
 * @param {object} body - The body of the request containing the new comment, author, and ticket ID.
 * @param {number} id - The ID of the comment to be edited.
 * @returns {Promise<boolean>} - Returns true if the comment was edited successfully, false otherwise.
 */
exports.editCommentService = async (body, id) => {
  try {
    const result = await commentLog.update(
      {
        comment: body.comment,
        commented_by: body.commented_by,
        ticket_id: body.ticket_id,
      },
      {
        where: { comment_id: id },
      }
    );

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * @function deleteCommentService
 * @description Deletes a comment from a ticket.
 * @param {number} id - The ID of the comment to be deleted.
 * @returns {Promise<boolean>} - Returns true if the comment was deleted successfully, false otherwise.
 */
exports.deleteCommentService = async (id) => {
  try {
    const result = await commentLog.destroy({
      where: { comment_id: id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
