<script>
  import CreateUserForm from "../components/CreateUserForm.svelte";
  import CreateButton from "../components/shared/CreateButton.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import { navigate } from "svelte-routing";
  let firstLoad = false;
  import userControllerInstance from "../controllers/userController";
  const formSubmitHandler = async (e) => {
    const response = await userControllerInstance.createUser(e.detail);

    if ((await response.status) === 201) {
      setTimeout(() => {
        navigate("/userDashboard");
      }, 1500);
      toast.success(`Successfully Registered `, {
        position: "bottom-center",
      });
    } else if (response.status === 400) {
      toast.error(`${response.message} `, {
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
  <CreateUserForm on:submitCreateForm={formSubmitHandler} />
</section>
