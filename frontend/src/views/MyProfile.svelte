<script>
  import { onMount } from "svelte";
  import MyProfileArea from "../components/MyProfileArea.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import CreateButton from "../components/shared/CreateButton.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  let editMode = false;
  $: dynamicEditMode = editMode;
  import userControllerInstance from "../controllers/userController.js";
  const data = { name: "", lastname: "", email: "", contact: "" };
  onMount(async () => {
    const response = await userControllerInstance.myProfile();
    data.name = response.payload.name;
    data.lastname = response.payload.lastname;
    data.email = response.payload.email;
    data.contact = response.payload.contact_number;
  });

  const submitHandler = async (e) => {
    const response = await userControllerInstance.editMyProfile(e.detail);
    if (response.status === 200) {
      toast.success(`Successfully Updated `, {
        position: "bottom-center",
      });
      editMode = false;
    } else {
      toast.error(`Update Failed`, {
        position: "bottom-center",
      });
    }
  };
  const buttonChangeHandler = (e) => {
    editMode = e.detail;
  };
</script>

<section>
  <Toaster />
  <Header>
    <CreateButton />
    <HomeButton />
  </Header>
  <ProfileDropDown />
  <MyProfileArea
    {data}
    {dynamicEditMode}
    on:myDataSubmit={submitHandler}
    on:buttonChange={buttonChangeHandler}
  />
</section>
