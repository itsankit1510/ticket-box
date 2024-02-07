<script>
  import { Router, Link, Route, navigate } from "svelte-routing";
  import LogIn from "../views/LogIn.svelte";
  import MyProfile from "../views/MyProfile.svelte";
  import Psw from "../views/Psw.svelte";
  import CreateUser from "../views/CreateUser.svelte";
  import TicketDashboard from "../views/TicketDashboard.svelte";
  import UserDashboard from "../views/UserDashboard.svelte";
  import EditUser from "../views/EditUser.svelte";
  import ViewSingleTicket from "../views/ViewSingleTicket.svelte";
  import CreateTicket from "../views/CreateTicket.svelte";

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    navigate("/");
  }
</script>

<Router>
  <Route path="/">
    {#if userData}
      <TicketDashboard />
    {:else}
      <LogIn />
    {/if}
  </Route>
  <Route path="/ticketDashboard">
    <TicketDashboard />
  </Route>
  <Route path="/changePassword">
    <Psw />
  </Route>
  <Route path="/ticketDashboard">
    <TicketDashboard />
  </Route>
  <Route path="/userDashboard">
    <UserDashboard />
  </Route>
  <Route path="/myProfile">
    <MyProfile />
  </Route>
  <Route path="/createUser">
    <CreateUser />
  </Route>
  <Route path="/editUser/:id" let:params>
    <EditUser id={params.id} />
  </Route>
  <Route path="/viewTicket/:id" let:params>
    <ViewSingleTicket id={params.id} />
  </Route>
  <Route path="/viewSingleTicket">
    <ViewSingleTicket />
  </Route>
  <Route path="/createTicket">
    <CreateTicket />
  </Route>
</Router>
<!-- 
<Router>
  <Route path="/user">
    <LogIn />
  </Route>
 
</Router> -->
