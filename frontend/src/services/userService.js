const URL = "http://localhost:8000/user";
const logInUserService = async (userName, password) => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const myProfileService = async () => {
  try {
    const response = await fetch(`${URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const editMyProfileService = async (data) => {
  console.log(data);
  try {
    const response = await fetch(`${URL}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        name: data.name,
        contact_number: data.contact,
        email: data.email,
        lastname: data.lastname,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const changePasswordService = async (
  oldPassword,
  newPassword,
  confirmNewPassword
) => {
  try {
    const response = await fetch(`${URL}/changePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const getAllUsersService = async (page) => {
  try {
    const response = await fetch(`${URL}/admin/getUsers?limit=6&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const createUserService = async (data) => {
  try {
    const response = await fetch(`${URL}/admin/crateUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        name: data.fName,
        lastname: data.lName,
        contact_number: data.contact,
        email: data.email,
        password: data.password,
        username: data.userName,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const deleteUserService = async (id) => {
  try {
    const response = await fetch(`${URL}/admin/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const getDataByIdService = async (id) => {
  try {
    const response = await fetch(`${URL}/admin/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const editUserByIdService = async (data) => {
  try {
    const response = await fetch(`${URL}/admin/editUser/${data.user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        name: data.name,
        lastname: data.lastname,
        contact_number: data.contact_number,
        email: data.email,
        username: data.userName,
      }),
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const logOutService = async () => {
  try {
    const response = await fetch(`${URL}/logOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
      body: JSON.stringify({
        token: JSON.parse(localStorage.getItem("userData")).auth,
      }),
    });
    return response;
  } catch (error) {
    return error;
  }
};
const getAllUsersListService = async () => {
  try {
    const response = await fetch(`${URL}/getAllUsers/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
const searchByUserNameService = async (userName) => {
  try {
    const response = await fetch(`${URL}/admin/get/${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth: JSON.parse(localStorage.getItem("userData")).auth,
      },
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
export {
  logInUserService,
  myProfileService,
  editMyProfileService,
  changePasswordService,
  getAllUsersService,
  createUserService,
  deleteUserService,
  getDataByIdService,
  editUserByIdService,
  logOutService,
  getAllUsersListService,
  searchByUserNameService,
};
