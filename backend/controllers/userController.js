const { createAccessTokens } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {
  logInUserService,
  getUserService,
  editUserDataService,
  createUserService,
  editUsersDataService,
  getUsersService,
  logOutUserService,
  deleteUserService,
  changePasswordService,
  getDataByIdService,
  getUserByUserNameService,
  getAllUsersService,
} = require("../services/userServices");
const {
  checkContactNumber,
  isEmailExists,
  isAlpha,
  isValidEmail,
  isAdmin,
  isUserNameExists,
  isIdExists,
} = require("../utils/validations");
const users = require("../models/users");
const { where } = require("sequelize");
/**
 * Logs in the user with the provided credentials.
 *
 * @param {object} req - The request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.userName - The username of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {object} res - The response object.
 * @returns {object} The response object with the status and result of the login.
 */
exports.logIn = async (req, res) => {
  const { userName, password } = req.body;

  // Check if username and password are present
  if (!userName || !password) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Incorrect email or password",
    });
  }

  try {
    // Check if user credentials are valid
    const isCredentialTrue = await logInUserService(userName, password);

    if (!isCredentialTrue.success) {
      // If credentials are not valid, return error message
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Incorrect email or password",
      });
    } else {
      // If credentials are valid, return success message and access token
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Login Successful",
        token: createAccessTokens(userName),
        firstLogIn: isCredentialTrue.firstLogIn,
        role: isCredentialTrue.role,
        userName: isCredentialTrue.userName,
      });
    }
  } catch (error) {
    // Return error message if something goes wrong
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Get user data of logged in user.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} Returns user data of logged in user.
 * @throws {Object} Returns an error message with stack trace in case of an error.
 */
exports.getUser = async (req, res) => {
  try {
    const userName = res.locals.userName;
    if (userName) {
      const getUserData = await getUserService(userName);
      if (!getUserData) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "User doesn't exists",
        });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          payload: await getUserData,
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Incorrect email or password",
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
 * Edit user data with given user name and data from request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.editUser = async (req, res) => {
  // Get the user name from local variables of response object
  const userName = res.locals.userName;
  // Get the user data from the request body
  const userData = req.body;
  // Check if all required fields are present and valid
  if (
    !userName ||
    !userData ||
    !validator.isAlpha(userData.name) ||
    !validator.isAlpha(userData.lastname) ||
    !checkContactNumber(userData.contact_number) ||
    !validator.isEmail(userData.email) ||
    userData.username === ""
  ) {
    // Return error response if any of the required fields are invalid or missing
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  }
  /* 
  // Optional check for existing email
  else if (isEmailExists(userData.email)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Email already exists",
    });
  }
  */
  try {
    // Call the editUserDataService to update user data
    const editUserData = editUserDataService(userName, userData);
    // Check if user data was successfully updated
    if (editUserData) {
      // Return success response if user data was updated successfully
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Data Successfully Updated",
      });
    } else {
      // Return error response if user data was not updated
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Data update failed",
      });
    }
  } catch (error) {
    // Return error response if any error occurred during user data update
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Create a new user with given data in request body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  // Get the user name from local variables of response object
  const userName = res.locals.userName;
  // Check if the user is an admin
  if (!(await isAdmin(userName))) {
    // Return error response if user is not authorized (not an admin)
    return res.status(400).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  } else if (
    // Check if all required fields are present and valid
    isAlpha(req.body.name) &&
    isAlpha(req.body.lastname) &&
    checkContactNumber(req.body.contact_number) &&
    !isValidEmail(req.body.email) &&
    req.body.password !== "" &&
    req.body.password.password.length > 8 &&
    req.body.username === ""
  ) {
    // Return error response if any of the required fields are invalid or missing
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  } else if (await isEmailExists(req.body.email)) {
    // Return error response if email already exists
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Email already exists",
    });
  } else if (await isUserNameExists(req.body.username)) {
    // Return error response if username already exists
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Username Exists",
    });
  }
  try {
    // Call the createUserService to create a new user
    const createUser = await createUserService(req.body, userName);
    // Check if user was created successfully
    if (createUser) {
      // Return success response if user was created successfully
      return res.status(201).json({
        status: 201,
        success: true,
        message: "User created successfully",
      });
    } else {
      // Return error response if user creation failed
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide valid data",
      });
    }
  } catch (error) {
    // Return error response if any error occurred during user creation
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Updates user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Express response object with appropriate status code and message
 */
exports.editUsers = async (req, res) => {
  const id = req.params.id;
  const userName = res.locals.userName;

  // Check if user is an admin
  if (!(await isAdmin(userName))) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  }
  // Check if ID exists
  else if (!(await isIdExists(id))) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Id doesn't exists",
    });
  }
  // Validate input data
  else if (
    isAlpha(req.body.name) &&
    isAlpha(req.body.lastname) &&
    checkContactNumber(req.body.contact_number) &&
    !isValidEmail(req.body.email) &&
    req.body.password !== "" &&
    req.body.password.password.length > 8 &&
    req.body.username !== ""
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Please enter valid data",
    });
  }
  try {
    const editUsersData = await editUsersDataService(userName, req.body, id);
    if (editUsersData) {
      return res.status(202).json({
        status: 202,
        success: true,
        message: "Successfully updated",
      });
    } else {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please enter valid data",
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
 * Retrieves all users.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns the response object with status code 200 and an array of all users, or an error object if an error occurred.
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Call the getAllUsersService function to retrieve all users
    const getUsers = await getAllUsersService();
    // Return the response object with status code 200 and the array of all users
    return res.status(200).json({
      status: 200,
      success: true,
      payload: await getUsers,
    });
  } catch (error) {
    // Return the response object with status code 500 and an error message if an error occurred
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};

/**
 * Retrieves a paginated list of users.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Returns the response object with status code 200 and a paginated list of users, or an error object if an error occurred.
 */
exports.getUsers = async (req, res) => {
  // Get the page and limit query parameters from the request object
  var page = req.query.page;
  var limit = req.query.limit;
  try {
    // Call the getUsersService function to retrieve a paginated list of users
    const getUsers = await getUsersService(page, limit);
    // Return the response object with status code 200, the paginated list of users, and the total count of users
    return res.status(200).json({
      status: 200,
      success: true,
      payload: await getUsers.data,
      count: await getUsers.count,
    });
  } catch (error) {
    // Return the response object with status code 500 and an error message if an error occurred
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Logs out the user associated with the provided auth token
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Returns a JSON response containing the status of the request and a success message
 */
exports.logOut = async (req, res) => {
  if (!req.headers.auth) {
    // If auth token is missing, send success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Successfully logged out",
    });
  }
  try {
    const result = logOutUserService(req.headers.auth);
    if (result) {
      // If user is successfully logged out, send success response
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Successfully logged out",
      });
    } else {
      // If there was an error logging out the user, send error response
      return res.status(400).json({
        status: 200,
        success: true,
        message: "Logout error",
      });
    }
  } catch (error) {
    // If there was a server error, send error response
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Deletes a user
 * @function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 */
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const userName = res.locals.userName;

  // Check if user is an admin
  if (!(await isAdmin(userName))) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  }

  // Check if ID exists
  if (!(await isIdExists(id))) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Id doesn't exists",
    });
  }

  try {
    const deleteUserData = await deleteUserService(req.params.id);

    // Check if user was deleted
    if (!deleteUserData) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "User doesn't exists",
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "User deleted successfully",
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
 * Change the password of the logged-in user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Returns response object with success message or error message with status code
 */
exports.changePassword = async (req, res) => {
  const userName = res.locals.userName;

  // Check if all required fields are present
  if (
    !req.body.oldPassword ||
    !req.body.newPassword ||
    !req.body.confirmNewPassword
  ) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "All fields are required",
    });
  }

  // Check if old password and new password are not same
  if (req.body.oldPassword === req.body.newPassword) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Old Password & New Password cannot be same",
    });
  }

  // Check if new password and confirm new password match
  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "New password and confirm new password do not match",
    });
  }

  // Check if old password matches with the password in the database
  const getOldPassword = await users.findOne({
    attribute: ["password"],
    where: { username: userName },
  });
  if (
    !bcrypt.compareSync(req.body.oldPassword, await getOldPassword.password)
  ) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Please enter correct old password",
    });
  }

  try {
    // Call the change password service with new password and username
    const changePasswordResponse = await changePasswordService(
      req.body,
      userName
    );

    // If password is changed successfully, update the is_first_login flag to false
    if (changePasswordResponse) {
      const updateUser = await users.update(
        {
          is_first_login: false,
        },
        { where: { username: userName } }
      );
      return res.status(200).send({
        success: true,
        statusCode: 200,
        message: "Password updated successfully",
      });
    } else {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        data: null,
        message: "Password not updated",
      });
    }
  } catch (error) {
    // Catch and handle any errors
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
exports.getUserById = async (req, res) => {
  const userName = res.locals.userName;

  // Check if the user is authorized to access user data
  if (!(await isAdmin(userName))) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Not Authorized For Users",
    });
  }

  try {
    // Retrieve user data by ID
    const getDataById = await getDataByIdService(req.params.id);

    if (getDataById) {
      // Return success response with user data
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: await getDataById,
      });
    } else {
      // Return error response if no user data found
      return res.status(400).send({
        success: false,
        statusCode: 400,
        data: null,
        message: "No Data Found",
      });
    }
  } catch (error) {
    // Return error response if there was an issue retrieving user data
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
/**
 * Logs out a user and blacklists the token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and success properties.
 */
exports.logOut = async (req, res) => {
  try {
    const result = logOutUserService(req.body);
    if (result) {
      return res.status(200).send({
        success: true,
        status: 200,
        message: "User logged out, Token blacklisted",
      });
    } else {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Token Not Found",
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
 * Retrieves users by email address.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with status and success properties.
 */
exports.getUsersByEmail = async (req, res) => {
  const userName = res.locals.userName;

  // Check if user is an admin.
  if (!(await isAdmin(userName))) {
    return res.status(400).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  }

  try {
    const getEmail = await getUsersByEmailService(req.params.email);
    if (getEmail) {
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: getEmail,
      });
    } else {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        data: null,
        message: "No Data Found",
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
// This controller function gets user information by username and requires admin privileges
exports.getUserByUserName = async (req, res) => {
  const userName = res.locals.userName;
  // Check if the user making the request has admin privileges
  if (!(await isAdmin(userName))) {
    return res.status(400).json({
      status: 401,
      success: false,
      message: "Not Authorized",
    });
  }
  try {
    // Call the getUserByUserNameService function to get user information by username
    const getUserEmail = await getUserByUserNameService(req.params.username);
    if (getUserEmail) {
      // Return the user information if it exists
      return res.status(200).send({
        success: true,
        statusCode: 200,
        data: await getUserEmail,
      });
    } else {
      // Return an error message if user information cannot be found
      return res.status(400).send({
        success: false,
        statusCode: 400,
        data: null,
        message: "No Data Found",
      });
    }
  } catch (error) {
    // Return a server error if there is an issue with the server
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
      error: error.stack,
    });
  }
};
