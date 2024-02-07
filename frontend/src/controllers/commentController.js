import {
  addCommentService,
  deleteCommentService,
} from "../services/commentService";

class CommentController {
  constructor() {
    if (CommentController.instance) {
      return CommentController.instance;
    }
    CommentController.instance = this;
  }

  async addComment(comment, ticket_id) {
    try {
      const response = await addCommentService(comment, ticket_id);

      return await response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        error: error.stack,
      };
    }
  }

  async deleteComment(ticket_id) {
    try {
      const response = await deleteCommentService(ticket_id);
      return await response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        error: error.stack,
      };
    }
  }
}

const commentController = new CommentController();
export default commentController;
