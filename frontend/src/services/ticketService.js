const URL = "http://localhost:8000/ticket";

const getAllTicketsService = async (page) => {
  try {
    const response = await fetch(`${URL}/?limit=7&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const createTicketService = async (
  parentTicketId,
  ticketType,
  summary,
  description,
  assignee
) => {
  try {
    const response = await fetch(`${URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        parent_ticket_id: parentTicketId || "",
        ticket_type: ticketType,
        summary: summary,
        description: description,
        status: "Open",
        assignee: assignee,
      }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return error;
  }
};
const viewTicketService = async (id) => {
  try {
    const response = await fetch(`${URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const editTicketService = async (id, data) => {
  try {
    const response = await fetch(`${URL}/editTicket/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        parent_ticket_id: data.parent_ticket_id,
        ticket_type: data.ticket_type,
        summary: data.summary,
        description: data.description,
        status: data.status,
        assignee: data.assignee,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const searchTicketService = async (field, searchValue) => {
  try {
    const response = await fetch(
      `${URL}/searchByField/?field=${field}&keywords=${searchValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          auth: JSON.parse(localStorage.getItem("userData")).auth,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};
const deleteTicketService = async (id) => {
  try {
    const response = await fetch(`${URL}/admin/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
export {
  editTicketService,
  getAllTicketsService,
  createTicketService,
  viewTicketService,
  searchTicketService,
  deleteTicketService,
};
