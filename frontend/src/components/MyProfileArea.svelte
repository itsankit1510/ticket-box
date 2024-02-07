<script>
  import { createEventDispatcher, onMount } from "svelte";
  import {
    isAlpha,
    checkContactNumber,
    isValidEmail,
  } from "../utils/validations.js";
  export let dynamicEditMode;

  let firstLoad = false;
  export let data;
  const dispatch = createEventDispatcher();

  const submitHandler = async () => {
    firstLoad = true;
    if (
      isAlpha(data.name) &&
      isAlpha(data.lastname) &&
      isValidEmail(data.email) &&
      checkContactNumber(data.contact)
    ) {
      dispatch("myDataSubmit", data);
    }
  };
  const editClickHandler = () => {
    dispatch("buttonChange", true);
  };
</script>

<section>
  {#if data}
    <div class="container mt-5 w-50">
      <h4 class="text-center font-weight-bold">My Profile</h4>
      <div class=" row mt-4">
        <div class="col">
          <label for="firstName" class="ml-2 font-weight-bold"
            >First Name <span class="text-danger">*</span></label
          >
          {#if dynamicEditMode}
            <input
              type="text"
              class={firstLoad && !isAlpha(data.name)
                ? "form-control input-sm is-invalid"
                : "form-control input-sm"}
              placeholder="First Name"
              bind:value={data.name}
            />
            <div id="validationServer03Feedback" class="invalid-feedback">
              Please provide a valid name.
            </div>
          {:else}
            <p class="ml-2">{data.name}</p>
          {/if}
        </div>
        <div class="col">
          <label for="lastName" class="ml-2 font-weight-bold"
            >Last Name <span class="text-danger">*</span></label
          >
          {#if dynamicEditMode}
            <input
              type="text"
              class={firstLoad && !isAlpha(data.lastname)
                ? "form-control input-sm is-invalid"
                : "form-control input-sm"}
              placeholder="Last Name"
              bind:value={data.lastname}
            />
            <div id="validationServer03Feedback" class="invalid-feedback">
              Please provide a valid last name.
            </div>
          {:else}
            <p class="ml-2">{data.lastname}</p>
          {/if}
        </div>
      </div>
      <div class=" row mt-3">
        <div class="col">
          <label for="email" class="ml-1 font-weight-bold"
            >Email <span class="text-danger">*</span></label
          >
          {#if dynamicEditMode}
            <input
              type="text"
              class={firstLoad && !isValidEmail(data.email)
                ? "form-control input-sm is-invalid"
                : "form-control input-sm"}
              placeholder="Email"
              bind:value={data.email}
            />
            <div class="invalid-feedback">Please enter a valid email.</div>
          {:else}
            <p class="ml-1">{data.email}</p>
          {/if}
        </div>
        <div class="col">
          <label for="contact" class="ml-2 font-weight-bold"
            >Contact <span class="text-danger">*</span></label
          >
          {#if dynamicEditMode}
            <input
              type="text"
              class={firstLoad && !checkContactNumber(data.contact)
                ? "form-control input-sm is-invalid"
                : "form-control input-sm"}
              placeholder="Contact Number"
              bind:value={data.contact}
            />
            <div class="invalid-feedback">
              Contact number should start with country code.
            </div>
          {:else}
            <p class="ml-1">{data.contact}</p>
          {/if}
        </div>
      </div>
      <div class="text-center">
        {#if !dynamicEditMode}
          <button
            class="btn mt-3 px-3 font-weight-normal"
            on:click={editClickHandler}>Edit Profile</button
          >
        {:else}
          <button
            class="btn mt-3 px-3 font-weight-normal"
            on:click={submitHandler}>Submit</button
          >
        {/if}
      </div>
    </div>
  {/if}
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
  button:active {
    border: #6284a6;
  }
  h4 {
    color: #1f5081;
  }
</style>
