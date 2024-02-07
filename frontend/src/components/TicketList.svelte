<script>
  import { createEventDispatcher, onMount } from "svelte";
  import dateRest from "../utils/date-rest.js";
  export let ticketList;
  export let count;
  export let currentPage;
  export let limit;
  const dispatch = createEventDispatcher();
  const viewTicketHandler = (id) => {
    dispatch("ticketId", id);
  };
  const handlePage = (page) => {
    dispatch("page", page);
  };
  const handlePrevious = () => {
    dispatch("prev", { message: "prev" });
  };
  const handleNext = () => {
    dispatch("next", { message: "next" });
  };
</script>

<section class="container-fluid overflow-auto">
  <table class="table table-striped table-hover mt-3 table-responsive-lg">
    <thead>
      <tr>
        <th>Ticket Id</th>
        <th>Parent Ticket Id</th>
        <th>Ticket Type</th>
        <th>Summary</th>
        <th> Status </th>
        <th>Reporter</th>
        <th> Assignee </th>
        <th>CreatedAt</th>
        <th>UpdatedAt</th>
      </tr>
    </thead>
    <tbody>
      {#each ticketList as tl}
        <tr>
          <td class="text-center">{tl.ticket_id}</td>
          <td>{tl.parent_ticket_id === null ? "-" : tl.parent_ticket_id}</td>
          <td>{tl.ticket_type}</td>
          <td
            on:click={viewTicketHandler(tl.ticket_id)}
            class="font-weight-bold"><a href="##">{tl.summary}</a></td
          >
          <td>{tl.status}</td>
          <td>{tl.reporter}</td>
          <td>{tl.username}</td>
          <td>{dateRest.dateRestructure(tl.createdAt)} </td>
          <td>{dateRest.dateRestructure(tl.updatedAt)} </td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if ticketList.length > 0}
    <div class="clearfix">
      <div class="hint-text ml-3">
        Showing <b>{ticketList.length}</b> out of <b>{count}</b> entries
      </div>
      <ul class="pagination mr-3">
        <li class={currentPage === 1 ? "invisible" : "page-item"}>
          <a href="#" on:click={handlePrevious}
            ><i class="fa fa-angle-double-left" /></a
          >
        </li>
        {#if count > 0}
          {#each Array(Math.ceil(count / limit))
            .fill()
            .map((_, index) => index + 1) as i}
            <li class={currentPage === i ? " page-item active" : " page-item"}>
              <a class="page-link" on:click={() => handlePage(i)}>{i}</a>
            </li>
          {/each}
        {/if}

        <li
          class={currentPage === Math.ceil(count / limit)
            ? "invisible"
            : "page-item"}
        >
          <a href="#" on:click={handleNext} class="page-link"
            ><i class="fa fa-angle-double-right" /></a
          >
        </li>
      </ul>
    </div>
  {/if}
</section>

<style>
  table {
    border: 1px solid #1f5081;
  }
  td,
  b {
    color: #566787;
  }
  .pagination {
    float: right;
    margin: 0 0 5px;
  }
  .pagination li a {
    border: none;
    font-size: 13px;
    min-width: 30px;
    min-height: 30px;
    color: #999;
    margin: 0 2px;
    line-height: 30px;
    border-radius: 2px !important;
    text-align: center;
    padding: 0 6px;
  }
  .pagination li a:hover {
    color: #666;
    cursor: pointer;
  }
  .pagination li.active a,
  .pagination li.active a.page-link {
    background: #1f5081;
    color: white;
  }
  .pagination li.active a:hover {
    background: #1f5081;
  }
  .pagination li.disabled i {
    color: #ccc;
    cursor: pointer;
  }
  .pagination li i {
    font-size: 16px;
    padding-top: 6px;
    cursor: pointer;
  }
  .hint-text {
    float: left;
    margin-top: 10px;
    font-size: 13px;
  }
</style>
