<script>
  import ProfileDropDown from "../components/shared/ProfileDropDown.svelte";
  import TicketList from "../components/TicketList.svelte";
  import Header from "../components/shared/header.svelte";
  import CreateButton from "../components/shared/CreateButton.svelte";
  import HomeButton from "../components/shared/HomeButton.svelte";
  import SearchBar from "../components/shared/SearchBar.svelte";
  let searchPlaceHolder = "Field To Be Searched + Keywords";
  import { navigate } from "svelte-routing";
  var count = "";
  let page = 1;
  var currentPage = 1;
  let ticketList = [];
  import { onMount } from "svelte";
  import ticketControllerInstance from "../controllers/ticketController";
  let searchValue = "";
  let field = "";
  let limit = 6;

  const handleSearchValueChanged = async (event) => {
    searchValue = event.detail.value;

    field = event.detail.field;

    if (searchValue === "" || field.length === 0) {
      const ticketsList = await ticketControllerInstance.getAllTickets(
        currentPage
      );
      count = await ticketsList.count;
      limit = 7;
      ticketList = await ticketsList.payload;
    } else {
      handleSearchValue(field, searchValue);
    }
  };

  onMount(async () => {
    navigate("/ticketDashboard");
    const ticketsList = await ticketControllerInstance.getAllTickets(
      currentPage
    );
    count = await ticketsList.count;
    ticketList = await ticketsList.payload;
  });
  const handleSearchValue = async (field, searchValue) => {
    const ticketsList = await ticketControllerInstance.searchTicket(
      field,
      searchValue
    );

    ticketList = await ticketsList.data;

    currentPage = 1;
    limit = ticketList.length;
    count = ticketList.length;
  };
  const handlePage = async (e) => {
    const ticketsList = await ticketControllerInstance.getAllTickets(e.detail);
    count = await ticketsList.count;
    ticketList = await ticketsList.payload;
    currentPage = e.detail;
  };
  const handlePrevious = async (e) => {
    if (currentPage > 1) {
      currentPage = currentPage - 1;

      const ticketsList = await ticketControllerInstance.getAllTickets(
        currentPage
      );
      count = await ticketsList.count;
      ticketList = await ticketsList.payload;
    }
  };
  const handleNext = async (e) => {
    if (currentPage < count) {
      currentPage = currentPage + 1;
      const ticketsList = await ticketControllerInstance.getAllTickets(
        currentPage
      );
      count = await ticketsList.count;
      ticketList = await ticketsList.payload;
    }
  };

  const viewTicketHandler = (e) => {
    navigate(`/viewTicket/${e.detail}`);
  };
</script>

<section>
  <Header>
    <CreateButton />
    <HomeButton />
  </Header>
  <SearchBar
    {searchPlaceHolder}
    mode={"ticket"}
    on:searchValueChanged={handleSearchValueChanged}
  />
  <ProfileDropDown />
  <TicketList
    {ticketList}
    {count}
    {currentPage}
    {limit}
    on:next={handleNext}
    on:prev={handlePrevious}
    on:ticketId={viewTicketHandler}
    on:page={handlePage}
  />
</section>
