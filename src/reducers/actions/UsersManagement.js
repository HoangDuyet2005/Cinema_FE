import Swal from 'sweetalert2';
import usersApi from '../../api/usersApi';
import {
  GET_USER_LIST_REQUEST, GET_USER_LIST_SUCCESS, GET_USER_LIST_FAIL,
  DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL, RESET_USER_LIST,
  UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
  ADD_USER_REQUEST, ADD_USER_SUCCESS, ADD_USER_FAIL,
  SET_IS_EXIST_USER_MODIFIED,
  GET_INFO_USER_REQUEST, GET_INFO_USER_SUCCESS, GET_INFO_USER_FAIL, GET_INFO_REVIEWER_REQUEST, GET_INFO_REVIEWER_SUCCESS, GET_INFO_REVIEWER_FAIL,
} from '../constants/UsersManagement';
import { LOGIN_SUCCESS } from '../constants/Auth';

export const getUsersList = () => {
  return (dispatch) => {
    dispatch({
      type: GET_USER_LIST_REQUEST
    })
    usersApi.getDanhSachNguoiDung()
      .then(result => {
        dispatch({
          type: GET_USER_LIST_SUCCESS,
          payload: { data: result.data }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_USER_LIST_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message }
          })
        }
      )
  }
}

export const deleteUser = (taiKhoanUser) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_USER_REQUEST
    })
    usersApi.deleteUser(taiKhoanUser)
      .then(result => {
        dispatch({
          type: DELETE_USER_SUCCESS,
          payload: { data: result.data.data }
        })
      })
      .catch(
        error => {
          dispatch({
            type: DELETE_USER_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message }
          })
        }
      )
  }
}

export const resetUserList = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_USER_LIST
    })
  }
}

export const putUserChangePass = (newPassword, oldPassword) => {
  return (dispatch) => {
    usersApi.editPassword(newPassword, oldPassword)
      .then(result => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(
        error => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Nhập mật khẩu sai!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      )
  }
}

export const putUserUpdate = (user) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_USER_REQUEST
    })
    usersApi.editTaiKhoan(user)
      .then(result => {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: { data: result.data }
        })
        
        // Immediately fetch updated profile to sync Redux store & localStorage
        usersApi.getThongTinTaiKhoan()
          .then(res => {
            const userData = res.data?.data || res.data;
            dispatch({
              type: GET_INFO_USER_SUCCESS,
              payload: { data: res.data }
            });
            
            try {
              const localUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};
              const fullUser = {
                ...localUser,
                ...userData,
                data: userData,
                image: user.image || userData?.image || localUser.image,
              };
              localStorage.setItem("user", JSON.stringify(fullUser));
              localStorage.setItem("userInfo", JSON.stringify(fullUser));
              dispatch({
                type: LOGIN_SUCCESS,
                payload: { data: fullUser }
              });
            } catch (e) {
              console.error(e);
            }
          })
          .catch(e => console.log(e));

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật thành công",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(
        error => {
          dispatch({
            type: UPDATE_USER_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message }
          })
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Cập nhật thất bại!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      )
  }
}

export const postAddUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: ADD_USER_REQUEST
    })
    usersApi.postThemNguoiDung(user)
      .then(result => {
        dispatch({
          type: ADD_USER_SUCCESS,
          payload: { data: result.data }
        })
      })
      .catch(error => {
        dispatch({
          type: ADD_USER_FAIL,
          payload: "Thêm lỗi!"
        })
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Không thành công',
          text: 'Tên tài khoản hoặc email bị trùng!!',
          confirmButtonText: `Okay`,
        })
      })
  }
}

export const postAddStaff = (user) => {
  return (dispatch) => {
    dispatch({
      type: ADD_USER_REQUEST
    })
    usersApi.postThemNhanVien(user)
      .then(result => {
        dispatch({
          type: ADD_USER_SUCCESS,
          payload: { data: result.data }
        })
      })
      .catch(error => {
        dispatch({
          type: ADD_USER_FAIL,
          payload: "Thêm lỗi!"
        })
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Không thành công',
          text: 'Tên tài khoản hoặc email nhân viên bị trùng!!',
          confirmButtonText: `Okay`,
        })
      })
  }
}

export const setStatusIsExistUserModified = (isExistUserModified) => {
  return (dispatch) => {
    dispatch({
      type: SET_IS_EXIST_USER_MODIFIED,
      payload: { isExistUserModified }
    })
  }
}

export const getInfoUser = () => {
  return (dispatch) => {
    dispatch({
      type: GET_INFO_USER_REQUEST
    })
    usersApi.getThongTinTaiKhoan()
      .then(result => {
        dispatch({
          type: GET_INFO_USER_SUCCESS,
          payload: {
            data: result.data,
          }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_INFO_USER_FAIL,
            payload: {
              error: error.response?.data ? error.response.data : error.message,
            }
          })
        }
      )
  }
}

export const getInfoReviewer = (username) => {
  return (dispatch) => {
    dispatch({
      type: GET_INFO_REVIEWER_REQUEST
    })
    usersApi.getChiTietTaiKhoanReviewer(username)
      .then(result => {
        dispatch({
          type: GET_INFO_REVIEWER_SUCCESS,
          payload: {
            data: result.data.data,
          }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_INFO_REVIEWER_FAIL,
            payload: {
              error: error.response?.data ? error.response.data : error.message,
            }
          })
        }
      )
  }
}