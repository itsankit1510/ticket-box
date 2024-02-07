<script>
  export let searchPlaceHolder;
  export let mode;
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let searchValue = "";
  let searchField;
  const changeHandler = () => {
    dispatch("searchValueChanged", { field: searchField, value: searchValue });
  };
</script>

<section>
  <div class="input-group col-sm-12">
    {#if mode === "ticket"}
      <div class="input-group-prepend">
        <select
          class="form-control"
          bind:value={searchField}
          on:change={() => {
            searchValue = "";
          }}
        >
          <option value="" disabled selected>Select field</option>
          <option value="summary">Summary</option>
          <option value="ticket_type">Ticket Type</option>
          <option value="status">Status</option>
          <option value="assignee">Assignee</option>
          <option value="reporter">Reporter</option>
          <option value="ticketId">Ticket ID</option>
        </select>
      </div>
    {/if}

    <input
      type="search"
      id="form1"
      bind:value={searchValue}
      class="form-control"
      placeholder="{searchPlaceHolder} + Enter"
      on:change={changeHandler}
    />
  </div>
</section>

<style>
  .form-control {
    margin-top: 10px;
    border: 1px solid #1f5081;
  }
</style>
