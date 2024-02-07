<script>
  import LogInArea from "../components/LogInArea.svelte";
  import Header from "../components/shared/header.svelte";
  import { navigate } from "svelte-routing";
  import toast, { Toaster } from "svelte-french-toast";
  import userControllerInstance from "../controllers/userController.js";
  let response = 200;
  const onSubmitHandler = async (e) => {
    const submitResponse = await userControllerInstance.logIn(
      e.detail.userName,
      e.detail.password
    );
    if ((await submitResponse.status) === 200) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          auth: submitResponse.token,
          role: submitResponse.role,
          userName: submitResponse.userName,
        })
      );

      toast.success("Successfully Logged In", {
        position: "bottom-center",
      });
      setTimeout(() => {
        if (submitResponse.firstLogIn) {
          navigate("/changePassword", { replace: true });
        } else {
          navigate("/ticketDashboard", { replace: true });
        }
      }, 1000);
    } else {
      toast.error("Check your username & password", {
        position: "bottom-center",
      });
    }
  };
</script>

<section>
  <Toaster />
  <Header />
  <LogInArea on:logSubmit={onSubmitHandler} />
</section>
