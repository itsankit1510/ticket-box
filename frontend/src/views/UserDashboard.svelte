<script>
  import { onMount } from "svelte";
  import CreateButton from "../components/shared/CreateButton.svelte";
  import Header from "../components/shared/header.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import SearchBar from "../components/shared/SearchBar.svelte";
  import UserList from "../components/UserList.svelte";
  import userControllerInstance from "../controllers/userController";
  let userList = [];
  var count = "";
  let page = 1;
  let currentPage = 1;
  let searchValue = "";
  let limit = 6;
  let searchPlaceHolder = "Search by username";
  onMount(async () => {
    const usersList = await userControllerInstance.getAllUsers(currentPage);
    count = await usersList.count;
    userList = await usersList.payload;
  });
  const deleteUserHandler = async (e) => {
    const response = await userControllerInstance.deleteUser(e.detail);
    if ((await response.status) === 200) {
      userList = [];
      userList = await userControllerInstance.getAllUsers(page);
      userList = userList.payload;
    } else {
      navigate("/ticketDashboard");
    }
  };

  const handlePage = async (e) => {
    const usersList = await userControllerInstance.getAllUsers(e.detail);
    count = await usersList.count;
    userList = await usersList.payload;
    currentPage = e.detail;
  };
  const handlePrevious = async (e) => {
    if (currentPage > 1) {
      currentPage = currentPage - 1;
      const usersList = await userControllerInstance.getAllUsers(currentPage);
      count = await usersList.count;
      userList = await usersList.payload;
    }
  };
  const handleNext = async (e) => {
    if (currentPage < count) {
      currentPage = currentPage + 1;

      const usersList = await userControllerInstance.getAllUsers(currentPage);
      count = await usersList.count;
      userList = await usersList.payload;
    }
  };
  const handleSearchValueChanged = async (e) => {
    searchValue = e.detail.value;

    if (searchValue === "") {
      const usersList = await userControllerInstance.getAllUsers(currentPage);
      count = await usersList.count;
      userList = await usersList.payload;
      limit = userList.length;
    } else {
      handleSearchValue(searchValue);
    }
  };
  const handleSearchValue = async (searchValue) => {
    const usersList = await userControllerInstance.searchByUserName(
      searchValue
    );

    userList = await usersList.data;

    currentPage = 1;
    limit = userList.length;
    count = userList.length;
  };
</script>

<section>
  <Header
    ><CreateButton />
    <HomeButton /></Header
  >
  <SearchBar
    {searchPlaceHolder}
    on:searchValueChanged={handleSearchValueChanged}
  />
  <ProfileDropDown />
  <UserList
    {userList}
    {count}
    {currentPage}
    {limit}
    on:deleteUser={deleteUserHandler}
    on:next={handleNext}
    on:prev={handlePrevious}
    on:page={handlePage}
  />
</section>
