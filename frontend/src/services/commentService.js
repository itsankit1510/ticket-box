const addCommentService = async (comment, ticket_id) => {
  try {
    console.log(comment);
    const response = await fetch(`http://localhost:8000/comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        comment: comment,
        ticket_id: ticket_id,
      }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteCommentService = async (ticket_id) => {
  try {
    const response = await fetch(`http://localhost:8000/comment/${ticket_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
export { addCommentService, deleteCommentService };
