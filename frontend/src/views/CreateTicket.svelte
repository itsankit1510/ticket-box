<script>
  import CreateButton from "../components/shared/CreateButton.svelte";
  import CreateTicketForm from "../components/shared/CreateTicketForm.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import userControllerInstance from "../controllers/userController";
  import ticketControllerInstance from "../controllers/ticketController";
  import toast, { Toaster } from "svelte-french-toast";
  let assigneeList = [];
  onMount(async () => {
    const getUserList = await userControllerInstance.getAllUserList();
    assigneeList = getUserList.payload;
  });
  const submitHandler = async (e) => {
    const response = await ticketControllerInstance.createTicket(
      e.detail.parentTicketId,
      e.detail.ticketType,
      e.detail.summary,
      e.detail.description,
      e.detail.assignee
    );
    if (response.status === 201) {
      toast.success(`Successfully Created `, {
        position: "bottom-center",
      });
      setTimeout(() => {
        navigate("/ticketDashboard");
      }, 1500);
    } else {
      toast.error(`${response.message}`, {
        position: "bottom-center",
      });
    }
  };
</script>

<section>
  <Toaster />
  <Header>
    <CreateButton />
    <HomeButton />
  </Header>
  <ProfileDropDown />
  <CreateTicketForm {assigneeList} on:register={submitHandler} />
</section>
