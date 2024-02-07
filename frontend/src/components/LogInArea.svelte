<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let firstLoad = false;
  function handleEnter(e) {
    if (e.keyCode === 13) {
      onSubmitHandler();
    }
  }

  let userName = "";
  let password = "";
  const onSubmitHandler = async () => {
    firstLoad = true;
    if (userName.length !== 0 || password.length !== 0) {
      dispatch("logSubmit", { userName: userName, password: password });
    }
  };
</script>

<section>
  <div class="container mt-5 w-25">
    <h4 class="text-center font-weight-bold">Log In</h4>
    <div class="form-group">
      <label for="username " class="font-weight-bold mb-2"
        >Username <span>*</span></label
      >
      <input
        bind:value={userName}
        type="text"
        class={userName.length === 0 && firstLoad
          ? "form-control is-invalid"
          : "form-control "}
        placeholder=" Username"
      />
      <div class="invalid-feedback">
        Please enter correct username and password
      </div>
    </div>
    <div class="form-group">
      <label for="password" class="font-weight-bold mb-2 display-6"
        >Password <span>*</span>
      </label>
      <input
        bind:value={password}
        type="password"
        class={password.length === 0 && firstLoad
          ? "form-control is-invalid"
          : "form-control "}
        placeholder="Password"
        on:keydown={handleEnter}
      />
      <div class="invalid-feedback">
        Please enter correct username and password
      </div>
    </div>

    <button class="btn btn-block mt-3" on:click={onSubmitHandler}>Log In</button
    >
  </div>
</section>

<style>
  .form-group {
    margin-bottom: 0rem;
  }
  label {
    font-size: medium;
  }
  button {
    background-color: #1f5081;
    border: #1f5081;
    color: white;
  }
  button:hover {
    background-color: #6284a6;
    border: #6284a6;
    color: white;
  }
  span {
    color: red;
  }
  h4 {
    color: #1f5081;
  }
</style>
