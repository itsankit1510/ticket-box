<script>
  import { navigate } from "svelte-routing";
  const createButtonHandler = () => {
    navigate("/createTicket");
  };
</script>

<button
  type="button"
  on:click={createButtonHandler}
  class="btn btn-outline-light mr-2">Create</button
>
