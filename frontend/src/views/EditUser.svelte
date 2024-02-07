<script>
  export let id;
  import EditUserForm from "../components/EditUserForm.svelte";
  import CreateButton from "../components/shared/CreateButton.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import { onMount } from "svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  import userControllerInstance from "../controllers/userController";
  let firstLoad = false;
  let responseData = [];
  onMount(async () => {
    responseData = await userControllerInstance.getDataById(id);
    responseData = responseData.data;
    responseData.password = "";
  });
  const formSubmitHandler = async (e) => {
    const response = await userControllerInstance.editUserById(responseData);
    if ((await response.status) === 202) {
      toast.success("Successfully Updated.", {
        position: "bottom-center",
      });
      setTimeout(() => {
        navigate("/userDashboard");
      }, 1500);
    } else {
      setTimeout(() => {
        navigate("/ticketDashboard");
      }, 1500);
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
  <EditUserForm {id} {responseData} on:editedUserData={formSubmitHandler} />
</section>
