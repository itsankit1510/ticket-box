<script>
  import { createEventDispatcher, onMount } from "svelte";
  let firstLoad = false;
  let parentTicketId = "";
  let ticketType = "Ticket";
  let ticketTypeOptions = ["Ticket", "Bug", "Task"];
  let summary = "";
  let description = "";
  let assignee = "";
  export let assigneeList;
  const dispatch = createEventDispatcher();

  const submitHandler = async () => {
    firstLoad = true;
    if (
      ticketType !== "Ticket" &&
      ticketType !== "Bug" &&
      ticketType !== "Task"
    ) {
      return;
    } else if (summary.trim() === "" || !description.trim() === "") {
      return;
    } else if (assignee === "") {
      return;
    } else {
      dispatch("register", {
        parentTicketId,
        ticketType,
        summary,
        description,
        assignee,
      });
    }
  };
</script>

<section class="container-sm px-6 w-75">
  <h5 class="text-center font-weight-bold m-1 pb-1">Create Ticket</h5>
  <div class="form-row">
    <div class="form-group col-md-6">
      <label>Parent Ticket ID</label>
      <input
        type="email"
        placeholder="Creating a nested ticket ? Use this"
        bind:value={parentTicketId}
        class="form-control"
      />
    </div>
    <div class="form-group col-md-6">
      <label for="inputState"
        >Issue Type<span class="text-danger"> *</span></label
      >
      <select id="inputState" bind:value={ticketType} class="form-control">
        {#each ticketTypeOptions as ticketType}<option {ticketType}
            >{ticketType}</option
          >{/each}
      </select>
    </div>
  </div>
  <div class="form-group">
    <label for="inputAddress2">Summary<span class="text-danger"> *</span></label
    >
    <input
      type="text"
      bind:value={summary}
      class={firstLoad && summary.trim() === ""
        ? "form-control is-invalid"
        : "form-control"}
      id="inputAddress2"
      placeholder="A short idea about the issue"
    />
    <div class="invalid-feedback">Summary cannot be blank.</div>
  </div>
  <div class="form-group">
    <label for="inputAddress"
      >Description<span class="text-danger"> *</span></label
    >
    <textarea
      class={description.trim() === "" && firstLoad
        ? "form-control is-invalid"
        : "form-control"}
      placeholder="Brief explanation about the issue"
      id="exampleFormControlTextarea1"
      rows="5"
      bind:value={description}
    />
    <div class="invalid-feedback">Description cannot be blank.</div>
  </div>

  <div class="form-row">
    <div class="form-group col-md-4">
      <label for="inputState">Status</label>
      <select id="inputState" class="form-control" readonly="readonly">
        <option selected>Open</option>
      </select>
    </div>
    <div class="form-group col-md-4">
      <label for="inputZip">Assignee<span class="text-danger"> *</span></label>
      <select id="inputState" bind:value={assignee} class="form-control">
        <option value="">Select An Assignee</option>

        {#each assigneeList as aL}<option value={aL.username}
            >{aL.username}</option
          >{/each}
      </select>
      {#if assignee === "" && firstLoad}
        <p class="text-danger" style="font-size: 12.8px;">
          Please select an assignee
        </p>
      {/if}
    </div>
  </div>

  <button type="submit" class="btn" on:click={submitHandler}
    >Create Ticket</button
  >
</section>

<style>
  button {
    background-color: #1f5081;
    border: #1f5081;
    color: white;
  }
  button:hover {
    background-color: #6284a6;
    border: #6284a6;
    color: white;
  }
  h5 {
    color: #1f5081;
  }
</style>
