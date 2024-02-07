const ticket = require("../models/tickets");
const users = require("../models/users");
const comment = require("../models/commentLog");
/**
 * Checks if the given contact number is valid or not
 *
 * @param {string} contact - The contact number to be checked
 * @returns {boolean} Returns true if the contact number is valid, else false
 */
exports.checkContactNumber = (contact) => {
  const pattern = /^\+[0-9]{12}$/;
  return pattern.test(contact);
};

/**
 * Checks if the given email already exists in the database
 *
 * @async
 * @param {string} email - The email to be checked
 * @returns {Promise<boolean>} Returns a promise that resolves to true if the email exists, else false
 */
exports.isEmailExists = async (email) => {
  let isEmailExists = await users.findAll({
    where: { email: `${email}` },
  });
  if ((await isEmailExists.length) === 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * Checks if the given string contains only alphabets
 *
 * @param {string} str - The string to be checked
 * @returns {boolean} Returns true if the string contains only alphabets, else false
 */
exports.isAlpha = (str) => {
  return /^[a-zA-Z]+$/.test(str);
};

/**
 * Checks if the given email is valid or not
 *
 * @param {string} email - The email to be checked
 * @returns {RegExpMatchArray|null} Returns a RegExpMatchArray if the email is valid, else null
 */
exports.isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

/**
 * Checks if the given user is an admin or not
 *
 * @async
 * @param {string} userName - The username to be checked
 * @returns {Promise<boolean>} Returns a promise that resolves to true if the user is an admin, else false
 */
exports.isAdmin = async (userName) => {
  const admin = await users.findAll({
    where: { username: userName },
  });
  if ((await admin[0].role) === "Admin") {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if the given username already exists in the database
 *
 * @async
 * @param {string} userName - The username to be checked
 * @returns {Promise<boolean>} Returns a promise that resolves to true if the username exists, else false
 */
exports.isUserNameExists = async (userName) => {
  let findUserName = await users.findAll({
    where: { username: userName },
  });
  findUserName = await findUserName.username;
  console.log(findUserName);
  if ((await findUserName) === userName) {
    return true;
  } else {
    return false;
  }
};
/**
 * Checks if a user with the given ID exists in the database.
 * @async
 * @param {number} id - The ID of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the user exists or not.
 */
exports.isIdExists = async (id) => {
  const findId = await users.findAll({
    where: { user_id: id },
  });
  if ((await findId.length) > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a ticket with the given ID exists in the database.
 * @async
 * @param {number} id - The ID of the ticket to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the ticket exists or not.
 */
exports.isTicketIdExist = async (id) => {
  const findId = await ticket.findAll({
    where: { ticket_id: id },
  });
  if ((await findId.length) > 0) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a comment with the given ID exists in the database.
 * @async
 * @param {number} id - The ID of the comment to check.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean value indicating whether the comment exists or not.
 */
exports.isCommentIdExist = async (id) => {
  const findId = await comment.findAll({
    where: { comment_id: id },
  });
  if ((await findId.length) > 0) {
    return true;
  } else {
    return false;
  }
};
