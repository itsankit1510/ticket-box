<script>
  import { tooltip } from "@svelte-plugins/tooltips";
  import { createEventDispatcher, onMount } from "svelte";
  import { Confirm } from "svelte-confirm";
  import { navigate } from "svelte-routing";
  const dispatch = createEventDispatcher();
  export let userList;
  export let count;
  export let currentPage;
  export let limit;
  const handleDelete = async (id) => {
    dispatch("deleteUser", id);
  };
  const handlePage = (page) => {
    dispatch("page", page);
  };
  const handlePrevious = async () => {
    dispatch("prev", "prev");
  };
  const handleNext = async () => {
    dispatch("next", "next");
  };
</script>

<section class="container-fluid">
  {#if userList}
    <table class="table table-striped table-hover mt-3 table-responsive-lg">
      <thead>
        <tr>
          <th class="text-center">Sr. No</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {#each userList as uL, i}
          <tr>
            <td class="text-center">{i + 1}</td>
            <td>{uL.name} {uL.lastname} </td>
            <td> {uL.username}</td>
            <td>{uL.email}</td>
            <td>{uL.contact_number}</td>
            <td>
              <span class="pr-3"
                ><i
                  style=" color:midnight blue; cursor: pointer; font-size: 25px;"
                  class="material-icons"
                  on:click={() => {
                    navigate(`/editUser/${uL.user_id}`);
                  }}
                  use:tooltip={{
                    content: "Edit",
                    position: "bottom",
                    arrow: false,
                  }}>&#xE8B8;</i
                ></span
              >
              <Confirm
                confirmTitle="Delete"
                cancelTitle="Cancel"
                let:confirm={confirmThis}
                ><span class="pl -2"
                  ><i
                    style=" color: red; cursor: pointer; font-size: 25px;"
                    class="material-icons"
                    on:click={() => confirmThis(handleDelete, uL.user_id)}
                    use:tooltip={{
                      content: "Delete",
                      position: "bottom",
                      arrow: false,
                    }}>&#xE872;</i
                  ></span
                >
                <span slot="title"> Delete this user? </span>
              </Confirm>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="clearfix">
      <div class="hint-text ml-3">
        Showing <b>{userList.length}</b> out of <b>{count}</b> entries
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
    cursor: pointer;
  }
  .pagination li.active a:hover {
    background: #1f5081;
    cursor: pointer;
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
