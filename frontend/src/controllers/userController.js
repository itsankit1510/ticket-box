import {
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
} from "../services/userService";
import {
  checkContactNumber,
  isAlpha,
  isValidEmail,
} from "../utils/validations";

class UserController {
  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }
    UserController.instance = this;
  }
  async logIn(userName, password) {
    if (!userName || !password) {
      return {
        status: 401,
        success: false,
        message: "Incorrect email or password",
      };
    }
    try {
      const checkIfUserExists = await logInUserService(userName, password);
      return checkIfUserExists;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async myProfile() {
    if (!JSON.parse(localStorage.getItem("userData")).auth) {
      return {
        status: 401,
        success: false,
        message: "Please log in first",
      };
    }
    try {
      const getLoggedInUserData = await myProfileService();
      return await getLoggedInUserData;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
        error: error.stack,
      };
    }
  }
  async editMyProfile(data) {
    if (!JSON.parse(localStorage.getItem("userData")).auth) {
      return {
        status: 401,
        success: false,
        message: "Please log in first",
      };
    }
    try {
      const editMyProfileData = await editMyProfileService(data);
      return await editMyProfileData;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async changePassword(oldPassword, newPassword, confirmNewPassword) {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return {
        success: false,
        statusCode: 400,
        message: "All fields are required",
      };
    }
    if(oldPassword.length < 8 ) {
      return {
        success: false,
        statusCode: 400,
        message: "Password length should be greater than 8 characters",
      };
    }
    
    if (oldPassword === newPassword) {
      return {
        success: false,
        statusCode: 400,
        message: "Old Password & New Password cannot be same",
      };
    }

    if (newPassword !== confirmNewPassword) {
      return {
        success: false,
        statusCode: 400,
        message: "New password and confirm new password do not match",
      };
    }
    try {
      const changePasswordResponse = await changePasswordService(
        oldPassword,
        newPassword,
        confirmNewPassword
      );
      return await changePasswordResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async getAllUsers(page) {
    if (!JSON.parse(localStorage.getItem("userData")).auth) {
      return {
        status: 401,
        success: false,
        message: "Error Occured",
      };
    }
    try {
      const getAllUsersResponse = await getAllUsersService(page);

      return getAllUsersResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async createUser(data) {
    if (
      data.fName &&
      isAlpha(data.lName) &&
      checkContactNumber(data.contact) &&
      !isValidEmail(data.email) &&
      data.password !== "" &&
      data.confirmPassword.length > 8 &&
      data.userName !== ""
    ) {
      return {
        status: 401,
        success: false,
        message: "Please enter valid data",
      };
    }
    try {
      const createUserResponse = await createUserService(data);
      return createUserResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async deleteUser(id) {
    if (!id) {
      return {
        status: 401,
        success: false,
        message: "Please enter valid data",
      };
    }
    try {
      const deleteUserResponse = await deleteUserService(id);
      return deleteUserResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async getDataById(id) {
    if (!id) {
      return {
        status: 401,
        success: false,
        message: "Please enter valid data",
      };
    }
    try {
      const getDataByIdResponse = await getDataByIdService(id);
      return await getDataByIdResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async editUserById(data) {
    try {
      if (
        isAlpha(data.name) &&
        isAlpha(data.lastname) &&
        checkContactNumber(data.contact_number) &&
        isValidEmail(data.email) &&
        data.username !== ""
      ) {
        const editUserDataByIdResponse = editUserByIdService(data);
        return editUserDataByIdResponse;
      } else {
        return {
          status: 400,
          success: false,
          message: "Please enter valid data",
        };
      }
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async getAllUserList() {
    try {
      const serviceResponse = await getAllUsersListService();
      return await serviceResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async logOut() {
    if (!JSON.parse(localStorage.getItem("userData")).auth) {
      return {
        status: 404,
        success: false,
        message: "Token not found",
      };
    }
    try {
      const logOutResponse = await logOutService();
      return logOutResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
  async searchByUserName(userName) {
    try {
      const searchByUserNameResponse = await searchByUserNameService(userName);
      return searchByUserNameResponse;
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: error,
      };
    }
  }
}
const userControllerInstance = new UserController();
export default userControllerInstance;
