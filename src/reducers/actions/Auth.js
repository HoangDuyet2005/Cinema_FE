import Swal from "sweetalert2";
import usersApi from "../../api/usersApi";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  RESET_ERROR_LOGIN_REGISTER,
} from "../constants/Auth";
import { GET_INFO_USER_SUCCESS } from "../constants/UsersManagement";

export const login = (user) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: LOGIN_REQUEST,
      });
      const result = await usersApi.postDangNhap(user);
      const tokenData = result.data;
      
      // Save initial token so subsequent requests have auth header
      localStorage.setItem("user", JSON.stringify(tokenData));

      // Fetch user profile immediately
      try {
        const userProfileRes = await usersApi.getThongTinTaiKhoan();
        const userData = userProfileRes.data?.data || userProfileRes.data;
        const fullUser = {
          ...tokenData,
          ...userData,
          data: userData,
          avtIdUser: userData?.username || user.usernameOrEmail,
        };
        localStorage.setItem("user", JSON.stringify(fullUser));
        localStorage.setItem("userInfo", JSON.stringify(fullUser));

        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            data: fullUser,
          },
        });
        dispatch({
          type: GET_INFO_USER_SUCCESS,
          payload: {
            data: userProfileRes.data,
          },
        });
      } catch (profileErr) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            data: tokenData,
          },
        });
      }

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng nhập thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: {
          error: "Tài khoản hoặc mật khẩu không đúng!"
        },
      });
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Đăng nhập thất bại",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
    dispatch({
      type: LOGOUT,
    });
  };
};

export const register = (user) => {
  return (dispatch) => {
    dispatch({
      type: REGISTER_REQUEST,
    });
    usersApi
      .postDangKy(user)
      .then((result) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: {
            data: result.data,
          },
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đăng ký thành công!",
          text: "Chào mừng bạn đến với World Cinema! Đang chuyển hướng...",
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.log("Register error:", error?.response?.data || error.message);
        let errorMsg = "Đăng ký không thành công! Vui lòng kiểm tra lại thông tin.";
        const serverData = error?.response?.data;

        // 1. Kiểm tra nếu backend trả về danh sách lỗi trường (FieldRequestError)
        const fieldErrors = serverData?.data?.errors;
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          const firstErr = fieldErrors[0];
          const field = firstErr?.field;
          const msg = firstErr?.errorMessage || firstErr?.message;

          if (field === "username") {
            errorMsg = "Tên tài khoản phải từ 4 đến 20 ký tự!";
          } else if (field === "password") {
            errorMsg = "Mật khẩu phải từ 6 đến 32 ký tự!";
          } else if (field === "email") {
            errorMsg = "Địa chỉ Email không đúng định dạng!";
          } else if (field === "name") {
            errorMsg = "Họ và tên không hợp lệ!";
          } else if (msg) {
            errorMsg = msg;
          }
        } else {
          // 2. Kiểm tra chuỗi thông báo từ server
          const rawMsg = serverData?.message || (typeof serverData === "string" ? serverData : error.message);

          if (rawMsg) {
            const lower = rawMsg.toLowerCase();
            if (lower.includes("username is already taken") || lower.includes("tên tài khoản này đã tồn tại")) {
              errorMsg = "Tên tài khoản này đã tồn tại!";
            } else if (lower.includes("email address already in use") || lower.includes("địa chỉ email này đã được")) {
              errorMsg = "Email này đã được đăng ký!";
            } else if (lower.includes("invalid param")) {
              errorMsg = "Thông tin đăng ký không hợp lệ!";
            } else {
              errorMsg = rawMsg;
            }
          }
        }

        dispatch({
          type: REGISTER_FAIL,
          payload: {
            error: errorMsg,
          },
        });
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Đăng ký thất bại",
          text: errorMsg,
          confirmButtonColor: "#dc2626",
        });
      });
  };
};

export const resetErrorLoginRegister = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_ERROR_LOGIN_REGISTER,
    });
  };
};