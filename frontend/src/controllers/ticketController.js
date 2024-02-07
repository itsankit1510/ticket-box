import {
  createTicketService,
  getAllTicketsService,
  viewTicketService,
  editTicketService,
  searchTicketService,
  deleteTicketService,
} from "../services/ticketService";

class TicketController {
  constructor() {
    if (TicketController.instance) {
      return TicketController.instance;
    }
    TicketController.instance = this;
  }
  async getAllTickets(page) {
    if (!JSON.parse(localStorage.getItem("userData")).auth) {
      return {
        status: 401,
        success: false,
        message: error,
      };
    }
    try {
      const getAllTicketResponse = await getAllTicketsService(page);
      return getAllTicketResponse;
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
  async createTicket(
    parentTicketId,
    ticketType,
    summary,
    description,
    assignee
  ) {
    try {
      if (parentTicketId.length === 0) {
        parentTicketId = null;
      }
      const createTicketResponse = await createTicketService(
        parentTicketId,
        ticketType,
        summary,
        description,
        assignee
      );
      return await createTicketResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async viewTicket(id) {
    try {
      const viewTicketResponse = await viewTicketService(id);

      return await viewTicketResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async editTicket(id, data) {
    try {
      const editTicketResponse = await editTicketService(id, data);
      return await editTicketResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async searchTicket(field, searchValue) {
    try {
      const searchResponse = await searchTicketService(field, searchValue);
      return await searchResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async deleteTicket(id) {
    try {
      const deleteResponse = await deleteTicketService(id);
      return await deleteResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
}
const ticketControllerInstance = new TicketController();
export default ticketControllerInstance;
