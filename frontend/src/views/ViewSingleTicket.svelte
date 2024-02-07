<script>
  import { onMount } from "svelte";

  import CreateButton from "../components/shared/CreateButton.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import SingleTicket from "../components/SingleTicket.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  import ticketControllerInstance from "../controllers/ticketController";
  import commentControllerInstance from "../controllers/commentController";
  import userControllerInstance from "../controllers/userController";
  let editMode = false;
  $: updatedEditMode = editMode;
  let ticketData;
  let userData;
  let logData;
  let commentData;
  let comment = "";
  let assigneeList = [];

  export let id;

  onMount(async () => {
    const response = await ticketControllerInstance.viewTicket(id);
    ticketData = response.payload[0];
    userData = response.payload[1];
    logData = response.payload[2];
    commentData = response.payload[3];

    const getUserList = await userControllerInstance.getAllUserList();
    assigneeList = getUserList.payload;
  });
  const editedDataHandler = async (e) => {
    const response = await ticketControllerInstance.editTicket(id, e.detail);
    if ((await response.status) === 200) {
      const response = await ticketControllerInstance.viewTicket(id);
      ticketData = response.payload[0];
      userData = response.payload[1];
      logData = response.payload[2];
      commentData = response.payload[3];
      editMode = false;
      toast.success("Successfully Updated.", {
        position: "bottom-center",
      });
    } else {
      editMode = true;
      toast.error(`${response.message}`, {
        position: "bottom-center",
      });
    }
  };
  const deleteCommentHandler = async (e) => {
    const response = await commentControllerInstance.deleteComment(e.detail);

    if (response.status === 200) {
      const response = await ticketControllerInstance.viewTicket(id);
      commentData = response.payload[3];
    }
  };

  const addCommentHandler = async (e) => {
    const response = await commentControllerInstance.addComment(e.detail, id);

    if (response.status === 201) {
      const response = await ticketControllerInstance.viewTicket(id);
      commentData = response.payload[3];
      comment = "";
    }
  };
  const deleteTicketHandler = async (e) => {
    const response = await ticketControllerInstance.deleteTicket(e.detail);
    if (response.status === 200) {
      toast.success("Successfully Deleted.", {
        position: "bottom-center",
      });
      setTimeout(() => {
        navigate("/ticketDashboard");
      }, 1000);
    }
  };
</script>

<section>
  <Toaster />
  <Header
    ><CreateButton />
    <HomeButton /></Header
  >
  <ProfileDropDown />
  <SingleTicket
    {ticketData}
    {userData}
    {logData}
    {commentData}
    {updatedEditMode}
    {assigneeList}
    on:addComment={addCommentHandler}
    on:editedData={editedDataHandler}
    on:deleteComment={deleteCommentHandler}
    on:deleteTicket={deleteTicketHandler}
  />
</section>
