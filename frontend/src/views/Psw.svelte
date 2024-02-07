<script>
  import Password from "../components/Password.svelte";
  import CreateButton from "../components/shared/CreateButton.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import userControllerInstance from "../controllers/userController";
  import { navigate } from "svelte-routing";
  let oldError = "Please enter appropriate password";
  const changePasswordHandler = async (e) => {
    const response = await userControllerInstance.changePassword(
      e.detail.old,
      e.detail.new,
      e.detail.confirmNew
    );

    if (response.success) {
      toast.success(`Password changed successfully `, {
        position: "bottom-center",
      });
      setTimeout(() => {
        navigate("/ticketDashboard");
      }, 1500);
    } else {
      toast.error(response.message, {
        position: "bottom-center",
      });
      oldError = response.message;
    }
  };
</script>

<section>
  <Toaster />
  <Header>
    <CreateButton />
    <HomeButton /></Header
  >
  <ProfileDropDown />
  <Password {oldError} on:passwordChange={changePasswordHandler} />
</section>
