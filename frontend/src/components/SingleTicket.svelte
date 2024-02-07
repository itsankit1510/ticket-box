<script>
  import { createEventDispatcher } from "svelte";
  import { Confirm } from "svelte-confirm";
  import dateRest from "../utils/date-rest.js";
  let statusList = ["Open", "In Progress", "Completed", "Closed"];
  let typeList = ["Ticket", "Bug", "Task"];

  export let assigneeList;
  export let updatedEditMode;
  export let ticketData;
  export let logData;
  export let userData;
  export let commentData;

  const dispatch = createEventDispatcher();
  let comment = "";

  const editButtonHandler = () => {
    updatedEditMode = true;
  };

  const addCommentHandler = async () => {
    if (comment.trim().length !== 0) {
      dispatch("addComment", comment);
      comment = "";
    } else {
      comment = "";
    }
  };

  const deleteCommentHandler = async (comment_id) => {
    dispatch("deleteComment", comment_id);
  };

  const turnOffEditMode = () => {
    updatedEditMode = false;
  };

  const submitButtonHandler = async () => {
    const data = {
      parent_ticket_id: ticketData[0].parent_ticket_id,
      ticket_type: ticketData[0].ticket_type,
      summary: ticketData[0].summary,
      description: ticketData[0].description,
      status: ticketData[0].status,
      reporter: userData[0].reporter,
      assignee: userData[0].username,
    };
    dispatch("editedData", data);
    turnOffEditMode();
  };

  const deleteTicketHandler = async () => {
    dispatch("deleteTicket", ticketData[0].ticket_id);
  };
</script>

{#if ticketData}
  <div class="container mt-3 overflow-auto">
    <div class="row">
      <div class="col-12 d-flex flex-row">
        <h2 class="align-self-start">
          Ticket #{ticketData[0].ticket_id}: {ticketData[0].summary}
        </h2>

        <div class="ml-auto">
          {#if updatedEditMode}
            <Confirm
              confirmTitle="Submit"
              cancelTitle="Cancel"
              let:confirm={confirmThis}
            >
              <button
                class="btn btn-primary btn-sm"
                on:click={() => {
                  confirmThis(submitButtonHandler);
                }}
                type="button">Submit</button
              >
              <span slot="title"> Submit the changes? </span>
            </Confirm>
          {:else}
            <button
              class="btn btn-primary btn-sm"
              on:click={editButtonHandler}
              type="button">Edit Ticket</button
            >
          {/if}
          {#if JSON.parse(localStorage.getItem("userData")).role === "Admin"}<Confirm
              confirmTitle="Delete"
              cancelTitle="Cancel"
              let:confirm={confirmThis}
            >
              <button
                class="btn btn-sm btn-outline-danger"
                on:click={() => {
                  confirmThis(deleteTicketHandler, ticketData[0].ticket_id);
                }}>Delete</button
              ></Confirm
            >
          {/if}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-lg-6">
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Ticket Details</h5>
            <p class="card-text">
              <strong>Ticket Type:</strong>
              {#if updatedEditMode}
                <select
                  id="inputState"
                  bind:value={ticketData[0].ticket_type}
                  class="input-box"
                >
                  {#each typeList as tL}<option {tL}>{tL}</option>{/each}
                </select>
              {:else}
                {ticketData[0].ticket_type}
              {/if}
            </p>
            <p class="card-text">
              <strong>Ticket ID:</strong>
              {ticketData[0].ticket_id}
            </p>
            <p class="card-text">
              <strong>Parent Ticket ID:</strong>
              {#if updatedEditMode}
                <input
                  type="text"
                  class="input-box"
                  id="parentTicketId"
                  bind:value={ticketData[0].parent_ticket_id}
                />
              {:else}
                {ticketData[0].parent_ticket_id}
              {/if}
            </p>
            <p class="card-text">
              <strong>Current Status:</strong>
              {#if updatedEditMode}
                <select
                  id="inputState"
                  bind:value={ticketData[0].status}
                  class="input-box"
                >
                  {#if ticketData[0].status === "Open"}
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  {/if}
                  {#if ticketData[0].status === "In Progress"}
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  {/if}
                  {#if ticketData[0].status === "Resolved"}
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  {/if}
                  {#if ticketData[0].status === "Closed"}
                    <option value="Closed">Closed</option>
                    <option value="Open">Open</option>
                  {/if}
                </select>
              {:else}
                {ticketData[0].status}
              {/if}
            </p>

            <p class="card-text">
              <strong>Assignee:</strong>
              {#if updatedEditMode}
                <select
                  id="inputState"
                  bind:value={userData[0].username}
                  class="input-box"
                >
                  {#each assigneeList as aL}<option>{aL.username}</option
                    >{/each}
                </select>
              {:else}
                {userData[0].username}
              {/if}
            </p>
            <p class="card-text">
              <strong>Reporter:</strong>

              {ticketData[0].reporter}
            </p>
            <p class="card-text">
              <strong>Created At:</strong>
              {dateRest.dateRestructure(ticketData[0].createdAt)}
            </p>
            <p class="card-text">
              <strong>Updated At:</strong>
              {dateRest.dateRestructure(ticketData[0].updatedAt)}
            </p>
            <p class="card-text">
              <strong>Last Updated By:</strong>
              {ticketData[0].last_updated_by}
            </p>
            <hr />
            <h5 class="card-title">Description</h5>
            {#if updatedEditMode}
              <textarea
                class="form-control flex-grow-1 mr-2"
                id="comment"
                rows="3"
                bind:value={ticketData[0].description}
              />
            {:else}
              <p class="card-text">{ticketData[0].description}</p>
            {/if}
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card mt-3">
          <div class="card-header">Transitions</div>
          <ul class="list-group list-group-flush">
            {#each logData as status}
              <li class="list-group-item">
                <div class="d-flex justify-content-between">
                  <span>{status.current_status}</span>
                  <span
                    >{dateRest.dateRestructure(status.created_at)} by {status.updated_by}</span
                  >
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>
      <div class="comment-card col-12 col-lg-12">
        <div class="card mt-3">
          <div class="card-header">Comments</div>
          <div class="card-body">
            <div class="form-group d-flex">
              <textarea
                bind:value={comment}
                class="form-control flex-grow-1 mr-2"
                id="comment"
                rows="3"
              />
              <button
                class="btn btn-primary {comment.length === 0 ||
                comment.trim() === ''
                  ? 'disabled'
                  : ''}"
                type="button"
                id="add-comment-btn"
                on:click={addCommentHandler}>Add</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    {#if commentData}
      {#each commentData as comment}
        <div class="card mb-3">
          <div class="card-body">
            <p class="card-text">{comment.comment}</p>
            <p class="card-text">
              <small class="text-muted"
                >{dateRest.dateRestructure(comment.commented_at)} by {comment.commented_by}</small
              >
            </p>
            {#if JSON.parse(localStorage.getItem("userData")).role === "Admin"}<Confirm
                confirmTitle="Delete"
                cancelTitle="Cancel"
                let:confirm={confirmThis}
              >
                <button
                  class="btn btn-sm btn-outline-danger"
                  on:click={() => {
                    confirmThis(deleteCommentHandler, comment.comment_id);
                  }}>Delete</button
                ></Confirm
              >
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}

<style>
  .comment-card {
    padding-bottom: 10px;
  }
  #add-comment-btn {
    height: calc(100% - 6px);
  }
  #add-comment-btn {
    background-color: #1f5081;
    border: #1f5081;
    color: white;
  }
  #add-comment-btn:hover {
    background-color: #6284a6;
    border: #6284a6;
    color: white;
  }
</style>
