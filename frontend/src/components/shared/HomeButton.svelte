<script>
  import { navigate } from "svelte-routing";
  const homeButtonHandler = () => {
    navigate("/ticketDashboard");
  };
</script>

<button
  type="button"
  on:click={homeButtonHandler}
  class="btn btn-outline-light mr-2">Home</button
>
