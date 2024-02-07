const bcrypt = require("bcrypt");
const blacklistedTokens = require("../models/blacklistedTokens");
const users = require("../models/users");
const { Op } = require("sequelize");

/**
 * Logs in a user with the given username and password.
 * @param {string} userName - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} - An object indicating whether the login was successful, whether it's the user's first login, and the user's role and username (if the login was successful).
 */
exports.logInUserService = async (userName, password) => {
  const user = await users.findOne({
    where: {
      username: userName,
      del: "0",
    },
  });

  if (!user) {
    return { success: false, firstLogIn: false };
  }

  const { password: userPassword, is_first_login, role, username } = user;

  const passwordMatches = bcrypt.compareSync(password, userPassword);

  return {
    success: passwordMatches,
    firstLogIn: is_first_login,
    role,
    userName: username,
  };
};
/**
 * Retrieves the data for a user with the given username.
 * @param {string} userName - The username of the user.
 * @returns {Object|boolean} - An object containing the user data, or false if the user does not exist.
 */
exports.getUserService = async (userName) => {
  const userData = await users.findOne({
    where: {
      username: userName,
    },
  });
  if ((await userData) === null) {
    return false;
  } else {
    return userData;
  }
};

/**
 * Updates the data for a user with the given username.
 * @param {string} userName - The username of the user.
 * @param {Object} userData - An object containing the updated user data.
 * @returns {boolean} - A boolean indicating whether the update was successful.
 */
exports.editUserDataService = async (userName, userData) => {
  const updateUser = await users.update(
    {
      name: userData.name,
      contact_number: userData.contactNumber,
      updated_by: userName,
      email: userData.email,
      lastname: userData.lastname,
    },
    { where: { username: `${userName}` } }
  );
  if ((await updateUser) === null) {
    return false;
  } else {
    return true;
  }
};
/**
 * Creates a new user with the provided data.
 *
 * @param {Object} data - User data.
 * @param {string} data.name - User's first name.
 * @param {string} data.lastname - User's last name.
 * @param {string} data.contact_number - User's contact number.
 * @param {string} data.email - User's email address.
 * @param {string} data.password - User's password.
 * @param {string} data.username - User's username.
 * @param {string} username - The username of the user creating the new user.
 *
 * @returns {boolean} - Returns true if user is created successfully, false otherwise.
 */
exports.createUserService = async (data, username) => {
  try {
    const hash = bcrypt.hashSync(data.password, 10);
    data.password = hash;
    const addUser = await users.create({
      name: data.name,
      lastname: data.lastname,
      contact_number: data.contact_number,
      email: data.email,
      password: data.password,
      username: data.username,
      created_by: username,
      updated_by: username,
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Updates an existing user's data.
 *
 * @param {string} userName - User's username.
 * @param {Object} data - User data to update.
 * @param {string} data.name - User's first name.
 * @param {string} data.lastname - User's last name.
 * @param {string} data.email - User's email address.
 * @param {string} data.userName - User's username.
 * @param {string} data.contact_number - User's contact number.
 * @param {string} id - ID of the user to update.
 *
 * @returns {boolean} - Returns true if user is updated successfully, false otherwise.
 */
exports.editUsersDataService = async (userName, data, id) => {
  try {
    const updateData = await users.update(
      {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        userName: data.userName,
        contact_number: data.contact_number,
        updated_by: userName,
      },
      { where: { user_id: `${id}` } }
    );
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Gets all users that have not been deleted.
 *
 * @returns {(Array.<Object>|boolean)} - Returns an array of user objects if successful, false otherwise.
 */
exports.getAllUsersService = async () => {
  try {
    const getUsers = await users.findAll({
      where: { del: "0" },
      order: [["user_id", "ASC"]],
      attributes: ["username"],
    });

    return await getUsers;
  } catch (error) {
    return false;
  }
};
/**
 * Gets a paginated list of all users that have not been deleted.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The maximum number of records to fetch per page.
 *
 * @returns {(Object|boolean)} - Returns an object with user data and count of all records if successful, false otherwise.
 */
exports.getUsersService = async (page, limit) => {
  const offset = (page - 1) * limit;
  try {
    const getUsers = await users.findAll({
      offset,
      limit,
      where: { del: "0" },
      order: [["user_id", "ASC"]],
    });
    const count = await users.count({
      where: { del: "0" },
    });

    return { data: await getUsers, count: await count };
  } catch (error) {
    return false;
  }
};

/**
 * Soft deletes a user by setting their "del" flag to "1".
 *
 * @param {string} id - ID of the user to delete.
 *
 * @returns {Object} - Returns the updated user data.
 */
exports.deleteUserService = async (id) => {
  const userData = await users.update(
    { del: "1" },
    {
      where: {
        user_id: `${id}`,
      },
    }
  );
  return userData;
};
/**
 * Changes the password for a user.
 *
 * @param {Object} data - The data object containing the new password.
 * @param {string} userName - The username of the user whose password is being changed.
 *
 * @returns {boolean} - Returns true if password is changed successfully, false otherwise.
 */
exports.changePasswordService = async (data, userName) => {
  try {
    let hash = bcrypt.hashSync(data.newPassword, 10);
    const response = await users.update(
      { password: hash, updated_by: userName },
      { where: { username: userName } }
    );
    if (response == []) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Gets user data by ID.
 *
 * @param {number} id - The ID of the user to fetch.
 *
 * @returns {(Object|boolean)} - Returns user data if successful, false otherwise.
 */
exports.getDataByIdService = async (id) => {
  try {
    const userData = await users.findOne({
      where: {
        user_id: id,
        del: "0",
      },
    });

    if ((await userData) === null) {
      return false;
    } else {
      return await userData;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Logs out a user by adding their authentication token to the blacklist.
 *
 * @param {Object} data - The data object containing the user's authentication token.
 *
 * @returns {boolean} - Returns true if user is logged out successfully, false otherwise.
 */
exports.logOutUserService = async (data) => {
  try {
    if (data.length !== 0) {
      const token = await blacklistedTokens.create({ token: data.token });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
/**
 * Retrieves user data based on email id.
 * @async
 * @function
 * @param {string} emailId - The email id to search for.
 * @returns {(Object[]|boolean)} Returns an array of user data if found, false otherwise.
 */
exports.getUsersByEmailService = async (emailId) => {
  try {
    const userData = await users.findAll({
      where: {
        email: {
          [Op.like]: `%${emailId}%`,
        },
        del: "0",
      },
    });

    if ((await userData) === null) {
      return false;
    } else {
      return await userData;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves user data based on username.
 * @async
 * @function
 * @param {string} username - The username to search for.
 * @returns {(Object[]|boolean)} Returns an array of user data if found, false otherwise.
 */
exports.getUserByUserNameService = async (username) => {
  try {
    const result = await users.findAll({
      where: {
        [Op.and]: [
          {
            del: {
              [Op.eq]: "0",
            },
          },
          {
            email: {
              [Op.iLike]: `%${username}%`,
            },
          },
        ],
      },
    });
    return result;
  } catch (error) {
    return false;
  }
};
