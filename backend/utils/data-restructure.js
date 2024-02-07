/**
 * Restructures the data by combining user and ticket data.
 * @param {Array} data - An array of objects containing ticket and user data.
 * @returns {Array} - An array of objects containing combined ticket and user data.
 */
exports.dataRestructure = (data) => {
  const result = [];
  for (let index = 0; index < data.length; index++) {
    const userData = data[index].user;
    const ticketData = data[index];
    const res = {
      ticket_id: ticketData.ticket_id,
      parent_ticket_id: ticketData.parent_ticket_id,
      ticket_type: ticketData.ticket_type,
      summary: ticketData.summary,
      description: ticketData.description,
      status: ticketData.status,
      reporter: ticketData.reporter,
      assignee: ticketData.assignee,
      createdAt: ticketData.createdAt,
      updatedAt: ticketData.updatedAt,
      user_id: userData.u_id,
      username: userData.username,
    };
    result.push(res);
  }
  return result;
};
