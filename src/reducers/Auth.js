// Auth Reducer: Phục vụ cho đăng nhập, đăng ký, lưu trữ thông tin user đăng nhập

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  RESET_ERROR_LOGIN_REGISTER,
} from './constants/Auth';

const currentUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  currentUser: currentUser,
  loadingLogin: false,
  errorLogin: null,

  responseRegister: null,
  loadingRegister: false,
  errorRegister: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return { ...state, loadingLogin: true, errorLogin: null };
    }

    case LOGIN_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload.data,
        loadingLogin: false,
        errorLogin: null,
      };
    }

    case LOGIN_FAIL: {
      return {
        ...state,
        errorLogin: action.payload.error,
        loadingLogin: false,
      };
    }

    case LOGOUT: {
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
      return {
        ...state,
        currentUser: null,
        errorLogin: null,
        loadingLogin: false,
        responseRegister: null,
        errorRegister: null,
        loadingRegister: false,
      };
    }

    case REGISTER_REQUEST: {
      return { ...state, loadingRegister: true, errorRegister: null, responseRegister: null };
    }

    case REGISTER_SUCCESS: {
      return {
        ...state,
        responseRegister: action.payload.data,
        loadingRegister: false,
        errorRegister: null,
      };
    }

    case REGISTER_FAIL: {
      return {
        ...state,
        errorRegister: action.payload.error,
        loadingRegister: false,
        responseRegister: null,
      };
    }

    case RESET_ERROR_LOGIN_REGISTER: {
      return {
        ...state,
        errorRegister: null,
        errorLogin: null,
        responseRegister: null,
      };
    }

    default:
      return state;
  }
};

export default authReducer;