const sequelize = require("../config/database");
const statusLog = require("../models/statusLog");
const ticket = require("../models/tickets");
const users = require("../models/users");
const commentLog = require("../models/commentLog");
const { dataRestructure } = require("../utils/data-restructure");
const { Op, literal } = require("sequelize");
const logger = require("../utils/logger");
/**
 * Retrieves all tickets along with associated user data and pagination.
 * @async
 * @function
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The number of records to retrieve per page.
 * @returns {(Object|boolean)} Returns an object with ticket data and total count, or false on error.
 */
exports.getAllTicketsService = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const getTickets = await ticket.findAll({
      offset,
      limit,
      include: {
        model: users,
      },
      where: { del: "0" },
      order: [["updatedAt", "DESC"]],
    });
    const count = await ticket.count({
      where: { del: "0" },
    });
    return { data: dataRestructure(await getTickets), count: await count };
  } catch (error) {
    return false;
  }
};

/**
 * Creates a new ticket and associated status log.
 * @async
 * @function
 * @param {Object} data - The ticket data to create.
 * @param {string} userName - The username of the user creating the ticket.
 * @returns {boolean} Returns true on success, false on error.
 */
exports.createTicketService = async (data, userName) => {
  logger.debug("Creating new ticket", { data, userName });
  try {
    const result = await sequelize.transaction(async (t) => {
      const getAssignee = await users.findOne({
        where: { username: data.assignee },
      });

      const ticketResponse = await ticket.create(
        {
          parent_ticket_id: data.parent_ticket_id,
          ticket_type: data.ticket_type,
          summary: data.summary,
          description: data.description,
          status: data.status,
          reporter: userName,
          assignee: getAssignee.user_id,
          del: 0,
          last_updated_by: userName,
        },
        { transaction: t }
      );

      const statusResponse = await statusLog.create(
        {
          current_status: "Open",
          updated_by: userName,
          ticket_id: ticketResponse.ticket_id,
        },
        { transaction: t }
      );
    });
    return true;
  } catch (error) {
    logger.error("Error creating ticket", { error: error.message, stack: error.stack });
    return false;
  }
};

/**
 * Changes the status of a ticket and logs the status change in the status log table.
 * @async
 * @function changeStatusService
 * @param {Object} body - The request body containing the new status.
 * @param {number} id - The ID of the ticket to be updated.
 * @param {string} userName - The username of the user who initiated the status change.
 * @returns {Promise<boolean>} A promise that resolves to true if the status change is successful and false otherwise.
 */
exports.changeStatusService = async (body, id, userName) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      const updateStatus = await ticket.update(
        {
          status: body.status,
        },
        {
          where: { ticket_id: id },
        },
        { transaction: t }
      );
      const status = await statusLog.create(
        {
          current_status: body.change_status,
          updated_by: userName,
          ticket_id: id,
        },
        { transaction: t }
      );
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Retrieves all the details of a ticket, including its status log and comment log.
 * @async
 * @function getTicketService
 * @param {number} id - The ID of the ticket to be retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of the following objects:
 * - The ticket object
 * - The user object of the ticket assignee
 * - An array of status log objects sorted in descending order by their creation date
 * - An array of comment log objects sorted in descending order by their creation date
 * If the ticket ID is invalid or no ticket is found, the promise resolves to an empty array.
 */
exports.getTicketService = async (id) => {
  const ticketResponse = await ticket.findAll({ where: { ticket_id: id } });
  const userResponse = await users.findAll({
    where: { user_id: await ticketResponse[0].assignee },
  });
  const status_logResponse = await statusLog.findAll({
    where: { ticket_id: id },
    order: [["created_at", "DESC"]],
  });
  const commentLogResponse = await commentLog.findAll({
    where: { ticket_id: id },
    order: [["commented_at", "DESC"]],
  });
  if (ticketResponse === null) {
    return [];
  } else {
    return [
      ticketResponse,
      userResponse,
      status_logResponse,
      commentLogResponse,
    ];
  }
};
/**
 * Edit a ticket's information and log any changes in status.
 * @async
 * @function
 * @param {object} body - The request body containing the new ticket information.
 * @param {number} id - The id of the ticket to be edited.
 * @param {string} userName - The username of the user editing the ticket.
 * @returns {Promise<boolean>} A Promise that resolves to `true` if the ticket was successfully edited, or `false` otherwise.
 */
exports.editTicketService = async (body, id, userName) => {
  try {
    const getAssignee = await users.findOne({
      where: { username: body.assignee },
    });
    let currentStatus = await ticket.findOne({
      where: {
        ticket_id: id,
      },
      attributes: ["status"],
    });
    currentStatus = await currentStatus.status;
    const queryResult = await ticket.update(
      {
        parent_ticket_id: body.parent_ticket_id,
        ticket_type: body.ticket_type,
        summary: body.summary,
        description: body.description,
        status: body.status,
        assignee: getAssignee.user_id,
        last_updated_by: userName,
      },
      { where: { ticket_id: id } }
    );
    if (currentStatus !== body.status) {
      if (
        (currentStatus === "Open" && body.status === "In Progress") ||
        (currentStatus === "In Progress" && body.status === "Resolved") ||
        (currentStatus === "Resolved" && body.status === "Closed") ||
        (currentStatus === "Closed" && body.status === "Open")
      ) {
        const status = await statusLog.create({
          current_status: body.status,
          updated_by: userName,
          ticket_id: id,
        });
      }
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Soft delete a ticket from the database by setting the `del` column to "1".
 * @async
 * @function
 * @param {number} id - The id of the ticket to be deleted.
 * @returns {Promise<boolean>} A Promise that resolves to `true` if the ticket was successfully deleted, or `false` otherwise.
 */
exports.deleteTicketService = async (id) => {
  try {
    const ticketResult = await ticket.update(
      {
        del: "1",
      },
      { where: { ticket_id: id } }
    );

    if (!ticketResult) {
      return;
    }
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * Retrieve ticket data based on a specified field and search keywords.
 * @async
 * @function getTicketByFieldService
 * @param {string} field - The field to search for the specified keywords.
 * @param {string} keywords - The search keywords.
 * @returns {Promise<Array>} An array of ticket data objects.
 * @throws {Error} An error occurred while retrieving ticket data.
 */
exports.getTicketByFieldService = async (field, keywords) => {
  try {
    let data = [];
    if (field === "summary") {
      const result = await ticket.findAll({
        include: {
          model: users,
        },
        where: {
          [Op.and]: [
            {
              del: {
                [Op.eq]: "0",
              },
            },
            {
              summary: {
                [Op.iLike]: `%${keywords}%`,
              },
            },
          ],
        },
      });
      data = dataRestructure(result);
    } else if (field === "reporter") {
      const result = await ticket.findAll({
        include: {
          model: users,
        },
        where: {
          [Op.and]: [
            {
              del: {
                [Op.eq]: "0",
              },
            },
            {
              reporter: {
                [Op.iLike]: `%${keywords}%`,
              },
            },
          ],
        },
      });
      data = dataRestructure(result);
    } else if (field === "assignee") {
      const result = await ticket.findAll({
        include: {
          model: users,
        },
        where: {
          [Op.and]: [
            {
              del: {
                [Op.eq]: "0",
              },
            },
            {
              "$user.username$": {
                [Op.iLike]: `%${keywords}%`,
              },
            },
          ],
        },
      });
      data = dataRestructure(result);
    } else if (field === "status") {
      const result = await ticket.findAll({
        include: {
          model: users,
        },
        where: {
          [Op.and]: [
            {
              del: {
                [Op.eq]: "0",
              },
            },
            {
              status: keywords,
            },
          ],
        },
      });
      data = dataRestructure(result);
    } else if (field === "ticket_type") {
      const result = await ticket.findAll({
        include: {
          model: users,
        },
        where: {
          [Op.and]: [
            {
              del: {
                [Op.eq]: "0",
              },
            },
            {
              ticket_type: keywords,
            },
          ],
        },
      });
      data = dataRestructure(result);
    } else if (field === "ticketId") {
      const result = await ticket.findAll({
        include: {
          model: users,
        },
        where: {
          [Op.and]: [
            {
              del: {
                [Op.eq]: "0",
              },
            },
            {
              ticket_id: {
                [Op.eq]: parseInt(keywords),
              },
            },
          ],
        },
      });
      data = dataRestructure(result);
    }
    return data;
  } catch (error) {
    return false;
  }
};
