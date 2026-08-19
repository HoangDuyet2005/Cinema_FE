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
          title: "Đăng ký thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.log(error.message);
        dispatch({
          type: REGISTER_FAIL,
          payload: {
            error: "Tên tài khoản hoặc email đã tồn tại!"
          },
        });
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Đăng ký thất bại",
          showConfirmButton: false,
          timer: 1500,
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