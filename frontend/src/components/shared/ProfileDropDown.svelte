<script>
  import { link, navigate } from "svelte-routing";
  import UserController from "../../controllers/userController";
  import userControllerInstance from "../../controllers/userController";
  let role = JSON.parse(localStorage.getItem("userData")).role;

  const logOutHandler = async () => {
    if (!JSON.parse(localStorage.getItem("userData")).auth) {
      navigate("/");
    } else {
      const response = await userControllerInstance.logOut();
      localStorage.clear();
      navigate("/");
    }
  };
</script>

<section>
  <div class="dropdown position-absolute" style="top: 1rem; right: 1rem;">
    <a
      class="nav-link dropdown-toggle text-white"
      href="#"
      id="profileDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <i class="bi bi-person-circle" />
      {JSON.parse(localStorage.getItem("userData")).role}, {JSON.parse(
        localStorage.getItem("userData")
      ).userName}
    </a>
    <div
      class="dropdown-menu dropdown-menu-right"
      aria-labelledby="profileDropdown"
    >
      {#if role === "Admin"}
        <a class="dropdown-item" href="/createUser" use:link>Add Users</a>
        <a class="dropdown-item" href="/userDashboard" use:link>View Users</a>
      {/if}

      <a class="dropdown-item" href="/myProfile" use:link>My Profile</a>
      <a class="dropdown-item" href="/changePassword" use:link
        >Change Password</a
      >
      <div class="dropdown-divider" />
      <a class="dropdown-item log" on:click={logOutHandler}>Log Out</a>
    </div>
  </div>
</section>

<style>
  a:active {
    background-color: #a5b9cc;
    color: black;
  }
  .log {
    cursor: pointer;
  }
</style>
