<script>
  import { navigate } from "svelte-routing";
  import userControllerInstance from "../controllers/userController";
  import { createEventDispatcher } from "svelte";
  let firstLoad = false;
  let oldPassword = "";
  let newPassword = "";
  export let oldError;
  let confirmNewPassword = "";
  const dispatch = createEventDispatcher();
  const changePasswordHandler = async () => {
    firstLoad = true;
    if (
      firstLoad &&
      newPassword.length > 8 &&
      newPassword !== oldPassword &&
      newPassword === confirmNewPassword
    ) {
      dispatch("passwordChange", {
        old: oldPassword,
        new: newPassword,
        confirmNew: confirmNewPassword,
      });
    }
  };
</script>

<form class="form-signin needs-validation">
  <div class="card-body">
    <div class="form-group">
      <h5 class="font-weight-bold text-center">Change Password</h5>

      <label class="" for="oldPassword"
        >Current Password<span class="text-danger"> *</span></label
      >
      <input
        class={firstLoad && oldError == ""
          ? "form-control form-control-sm is-invalid"
          : "form-control form-control-sm"}
        id="oldPassword"
        name="password"
        placeholder="Current Password"
        required
        type="password"
        autocomplete="off"
        aria-describedby="inputGroupPrepend"
        bind:value={oldPassword}
      />
      <div class="invalid-feedback">{oldError}</div>
    </div>

    <div class="form-group">
      <div class="form-group">
        <label class="" for="newPassword"
          >New Password<span class="text-danger"> *</span></label
        >
        <div class="input-group">
          <input
            name="newPassword"
            type="password"
            bind:value={newPassword}
            autocomplete="off"
            class={firstLoad && newPassword.length < 8
              ? "form-control form-control-sm is-invalid"
              : "form-control form-control-sm"}
            id="newPassword"
            placeholder="New Password"
            aria-describedby="inputGroupPrepend"
            required
          />
          <div class="invalid-feedback">
            Password should be greater than 8 characters.
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="" for="confirmPassword"
        >Confirm Password<span class="text-danger">*</span></label
      >
      <div class="input-group">
        <input
          name="confirmPassword"
          type="password"
          autocomplete="off"
          class={firstLoad && confirmNewPassword !== newPassword
            ? "form-control form-control-sm is-invalid"
            : "form-control form-control-sm"}
          id="confirmPassword"
          placeholder="Confirm Password"
          aria-describedby="inputGroupPrepend"
          bind:value={confirmNewPassword}
          required
        />
        <div class="invalid-feedback">Password do not a match.</div>
      </div>
    </div>

    <button
      id="submitBtn"
      class="btn btn-block mt-3"
      on:click|preventDefault={changePasswordHandler}>Update Password</button
    >
  </div>
</form>

<style>
  button {
    background-color: #1f5081;
    border: #1f5081;
    color: white;
  }
  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
    width: 30%;
    margin-left: 35%;
    margin-top: 1%;
  }
</style>
