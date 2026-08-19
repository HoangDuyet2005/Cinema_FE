import { useState } from "react";
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

export const login = (user) => { // đăng nhập
  return async (dispatch, getState) => { //     1
    try {//2
      const stateBefore = getState();//   3
      // console.log("Todos before dispatch: ", stateBefore.authReducer);  //4

      dispatch({          //5
        type: LOGIN_REQUEST,
      });
      const result = await usersApi.postDangNhap(user);     //6
      // console.log("User nhập:---------",result.data);       //7
      
      localStorage.setItem(       //8
        "user",
        JSON.stringify({ ...result.data, avtIdUser: result.data.username })
      );

      dispatch({          //9
        type: LOGIN_SUCCESS,
        payload: {
          data: result.data,
        },
        
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng nhập thành công",
        showConfirmButton: false,
        timer: 1500,
      });
      const stateAfter = getState();      //10
      console.log("Todos after dispatch: ", stateAfter.authReducer);      //11
    } catch (error) {       //12
      dispatch({        //13
        type: LOGIN_FAIL,
        payload: {
          // error: error.response?.data?.data ? error.response?.data?.data : error.message,
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

    // dispatch({
    //   type: LOGIN_REQUEST,
    // });
    // usersApi
    //   .postDangNhap(user)
    //   .then((result) => {
    //     // lưu thông tin user xuống local storeage
    //     localStorage.setItem(
    //       "user",
    //       JSON.stringify({ ...result.data, avtIdUser: result.data.taiKhoan })
    //     );
    //     dispatch({
    //       type: LOGIN_SUCCESS,
    //       payload: {
    //         data: result.data,
    //       },
    //     });
    //   })
    //   .catch((error) => {
    //     dispatch({
    //       type: LOGIN_FAIL,
    //       payload: {
    //         error: error.response?.data ? error.response.data : error.message,
    //       },
    //     });
    //   });
  };
};

export const logout = () => {
  return (dispatch) => {
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
