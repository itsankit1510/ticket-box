<script>
  import {
    checkContactNumber,
    isAlpha,
    isValidEmail,
  } from "../utils/validations";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let firstLoad = false;
  let fName = "";
  let lName = "";
  let email = "";
  let contact = "+91";
  let userName = "";
  let password = "";
  let confirmPassword = "";
  const formSubmitHandler = async () => {
    firstLoad = true;
    if (
      isAlpha(fName) &&
      isAlpha(lName) &&
      isValidEmail(email) &&
      contact.length === 13 &&
      userName &&
      password.length > 8 &&
      confirmPassword === password
    ) {
      const data = {
        fName: fName,
        lName: lName,
        email: email,
        contact: contact,
        userName: userName,
        password: password,
        confirmPassword: confirmPassword,
      };
      dispatch("submitCreateForm", data);
    }
  };
</script>

<section>
  <div class="container mt-5 w-50">
    <h5 class="text-center font-weight-bold">Create User</h5>
    <form class="mt-3">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="first-name" class="font-weight-bold"
              >First Name <span class="text-danger">*</span></label
            >
            <input
              type="text"
              id="first-name"
              placeholder="First Name"
              class={firstLoad && !isAlpha(fName)
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={fName}
            />

            <div class="invalid-feedback">
              Please provide a valid first name.
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="last-name" class="font-weight-bold"
              >Last Name <span class="text-danger">*</span></label
            >
            <input
              type="text"
              id="last-name"
              placeholder="Last Name"
              class={firstLoad && !isAlpha(lName)
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={lName}
            />
            <div class="invalid-feedback">
              Please provide a valid last name.
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="email" class="font-weight-bold"
          >Email <span class="text-danger">*</span></label
        >
        <input
          type="email"
          id="email"
          placeholder="Email"
          bind:value={email}
          class={firstLoad && !isValidEmail(email)
            ? "form-control is-invalid"
            : "form-control"}
        />
        <div class="invalid-feedback">
          Please provide a valid and unique email address.
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="username" class="font-weight-bold"
              >Username <span class="text-danger">*</span></label
            >
            <input
              type="text"
              id="username"
              placeholder="Username"
              class={firstLoad && userName.trim().length === 0
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={userName}
            />
            <div class="invalid-feedback">
              Please provide a valid and unique username.
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="contact" class="font-weight-bold"
              >Contact <span class="text-danger">*</span></label
            >
            <input
              type="text"
              id="contact"
              bind:value={contact}
              placeholder="Contact"
              maxlength="13"
              class={firstLoad && !checkContactNumber(contact)
                ? "form-control is-invalid"
                : "form-control"}
            />
            <div class="invalid-feedback">
              Please provide a valid contact number.
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="password" class="font-weight-bold"
              >Password <span class="text-danger"> *</span></label
            >
            <input
              type="password"
              id="password"
              placeholder="Password"
              class={firstLoad && password.trim() === ""
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={password}
            />
            <div class="invalid-feedback">Please provide a valid password.</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label for="confirm-password" class="font-weight-bold"
              >Confirm Password <span class="text-danger">*</span></label
            >
            <input
              type="password"
              id="confirm-password"
              bind:value={confirmPassword}
              placeholder="Confirm Password"
              class={firstLoad && password !== confirmPassword
                ? "form-control is-invalid"
                : "form-control"}
            />
            <div class="invalid-feedback">
              Please provide a valid password confirmation.
            </div>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button
          class="btn mt-3 d-grid gap-2 col-4"
          on:click|preventDefault={formSubmitHandler}>Add User</button
        >
      </div>
    </form>
  </div>
</section>

<style>
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
</style>
