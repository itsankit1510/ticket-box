/**
 * This module exports two functions for creating and validating JWT access tokens.
 * The 'createAccessTokens' function takes a 'userName' parameter, signs a token containing the user name, and returns the token.
 *
 * @param {string} userName - The user name to include in the token.
 * @returns {string} - The signed JWT access token.
 */
const { sign, verify } = require("jsonwebtoken");
const BlackTokens = require("../models/blacklistedTokens.js");

exports.createAccessTokens = (userName) => {
  const accessToken = sign({ userName: userName }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return accessToken;
};

/**
 * The 'validateToken' function is an Express middleware that validates JWT access tokens sent in the 'auth' header of incoming requests.
 * If the token is valid, the function attaches the user name to the response object and calls the 'next' middleware function.
 * If the token is invalid, the function sends a 401 Unauthorized response.
 * If the token has been blacklisted, the function sends a 401 Unauthorized response with the message "Token Blacklisted".
 *
 * @param {Object} req - The incoming HTTP request object.
 * @param {Object} res - The outgoing HTTP response object.
 * @param {function} next - The next middleware function to call.
 * @returns {Object} - The HTTP response object.
 */
exports.validateToken = async (req, res, next) => {
  const accessToken = req.headers.auth;

  if (!accessToken) {
    return res.json({
      status: 401,
      success: false,
      message: "Unauthorized Request",
    });
  } else {
    const checkIfTokenExists = await BlackTokens.findOne({
      where: { token: accessToken },
    });
    if (checkIfTokenExists) {
      return res.json({
        status: 401,
        success: false,
        message: "Token Blacklisted",
      });
    }
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_KEY);
    if (validToken) {
      res.locals.userName = validToken.userName;
      return next();
    }
  } catch (error) {
    res.send({
      status: 401,
      success: false,
      message: "Unauthorized Request",
    });
  }
};
