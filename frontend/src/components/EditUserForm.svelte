<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let responseData;
  let firstLoad = false;
  import {
    checkContactNumber,
    isAlpha,
    isValidEmail,
  } from "../utils/validations";
  const formSubmitHandler = async () => {
    firstLoad = true;
    if (
      isAlpha(responseData.name) &&
      isAlpha(responseData.lastname) &&
      checkContactNumber(responseData.contact_number) &&
      isValidEmail(responseData.email) &&
      responseData.username !== ""
    ) {
      dispatch("editedUserData", responseData);
    }
  };
</script>

<section>
  <div class="container mt-5 w-50">
    <h5 class="text-center font-weight-bold">Edit User</h5>
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
              class={firstLoad && !isAlpha(responseData.name)
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={responseData.name}
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
              class={firstLoad && !isAlpha(responseData.lastname)
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={responseData.lastname}
            />
            <div class="invalid-feedback">
              Please provide a valid last name.
            </div>
          </div>
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
              bind:value={responseData.username}
              class={firstLoad && responseData.username === 0
                ? "form-control is-invalid"
                : "form-control"}
            />
            <div class="invalid-feedback">Please provide a valid username.</div>
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
              placeholder="Contact"
              maxlength="13"
              bind:value={responseData.contact_number}
              class={firstLoad &&
              !checkContactNumber(responseData.contact_number)
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
            <label for="email" class="font-weight-bold"
              >Email <span class="text-danger">*</span></label
            >
            <input
              type="email"
              id="email"
              placeholder="Email"
              class={firstLoad && !isValidEmail(responseData.email)
                ? "form-control is-invalid"
                : "form-control"}
              bind:value={responseData.email}
            />
            <div class="invalid-feedback">
              Please provide a valid email address.
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
          class="btn mt-3 d-grid gap-2 col-4"
          on:click|preventDefault={formSubmitHandler}>Submit</button
        >
      </div>
    </form>
  </div>
</section>

<style>
  .btn {
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
