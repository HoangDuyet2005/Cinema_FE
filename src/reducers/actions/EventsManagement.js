import Swal from 'sweetalert2';
import eventsApi from '../../api/eventsApi';
import { ADD_EVENT_FAIL, ADD_EVENT_REQUEST, ADD_EVENT_SUCCESS, DELETE_EVENT_FAIL, DELETE_EVENT_REQUEST, DELETE_EVENT_SUCCESS, GET_EVENT_DETAIL_FAIL, GET_EVENT_DETAIL_REQUEST, GET_EVENT_DETAIL_SUCCESS, GET_EVENT_LIST_FAIL, GET_EVENT_LIST_REQUEST, GET_EVENT_LIST_SUCCESS, RESET_EVENT_LIST, SET_IS_EXIST_EVENT_MODIFIED, UPDATE_EVENT_FAIL, UPDATE_EVENT_REQUEST, UPDATE_EVENT_SUCCESS } from '../constants/EventsManagement';

export const getEventsList = () => {
  return (dispatch) => {
    dispatch({
      type: GET_EVENT_LIST_REQUEST
    })
    eventsApi.getListEventManagment()
      .then(result => {
        // console.log(result.data);
        dispatch({
          type: GET_EVENT_LIST_SUCCESS,
          payload: { data: result.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: GET_EVENT_LIST_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}

export const getEventsDetail = (id) => {
  return (dispatch) => {
    dispatch({
      type: GET_EVENT_DETAIL_REQUEST
    })
    eventsApi.getDetailEvent(id)
      .then(result => {
        console.log(result.data);
        dispatch({
          type: GET_EVENT_DETAIL_SUCCESS,
          payload: { data: result.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: GET_EVENT_DETAIL_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}
// useEffect(() => {
//   if (successUpdateUser) {
//     Swal.fire({
//       position: "center",
//       icon: "success",
//       title: "Update Successfully",
//       showConfirmButton: false,
//       timer: 1500,
//     });
//   }
// }, [successUpdateUser]);
export const deleteEvent = (event) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_EVENT_REQUEST
    })
    eventsApi.deleteEvent(event)
      .then(result => {
        console.log(result);

        dispatch({
          type: DELETE_EVENT_SUCCESS,
          payload: { data: result.data.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: DELETE_EVENT_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
            // payload: "Delete fail!"
          })
        }
      )
  }
}

export const resetEventList = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_EVENT_LIST
    })
  }
}

// export const putUserChangePass = (newPassword, oldPassword) => {

//   return (dispatch) => {
//     console.log("truyền vô cập nhật pass: ", newPassword, oldPassword);

//     usersApi.editPassword(newPassword, oldPassword)
//       .then(result => {
//         // console.log("Cập nhật pass thành công: ", result);
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: "Update Successfully",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//       )
//       .catch(
//         error => {
//           // dispatch({
//           //   type: UPDATE_USER_FAIL,
//           //   payload: { error: error.response?.data ? error.response.data : error.message, }
//           // })
//           // console.log("Cập nhật pass false");
//           Swal.fire({
//             position: "center",
//             icon: "error",
//             title: "Password was wrong",
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         }
//       )
//   }
// }


export const putEventUpdate = (event) => {

  return (dispatch) => {
    console.log("truyền vô cập nhật: ", event);
    dispatch({
      type: UPDATE_EVENT_REQUEST
    })
    eventsApi.putEditEvent(event)
      .then(result => {
        Swal.fire('Chỉnh sửa thành công!', '', 'success')
        console.log("Cập nhật: ", result);
        dispatch({
          type: UPDATE_EVENT_SUCCESS,
          payload: { data: result.data.data }
        })
      }
      )
      .catch(
        error => {
          // console.log(error.response);
        Swal.fire("Tên bài viết đã được sử dụng", '', 'info')
          dispatch({
            type: UPDATE_EVENT_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}

export const postAddEvent = (event) => {
  return (dispatch) => {
    dispatch({
      type: ADD_EVENT_REQUEST
    })
    eventsApi.postAddEvent(event)
      .then(result => {
        Swal.fire('Thêm thành công!', '', 'success')
        dispatch({
          type: ADD_EVENT_SUCCESS,
          payload: { data: result.data }
        })
      })
      .catch(error => {
        Swal.fire('Không được bỏ trống!', '', 'info')
        dispatch({
          type: ADD_EVENT_FAIL,
          // payload: { error: error.response?.data ? error.response.data : error.message, }
          payload: "Thêm lỗi!"
        })
      })
  }
}

//chỉnh lại cái type
export const postAddReview = (review) => {
  return (dispatch) => {
    dispatch({
      type: ADD_EVENT_REQUEST
    })
    eventsApi.postAddReview(review)
      .then(result => {
        dispatch({
          type: ADD_EVENT_SUCCESS,
          payload: { data: result.data }
        })
      })
      .catch(error => {
        dispatch({
          type: ADD_EVENT_FAIL,
          // payload: { error: error.response?.data ? error.response.data : error.message, }
          payload: "Thêm lỗi!"
        })
      })
  }
}

// export const postAddStaff = (user) => {
//   return (dispatch) => {
//     // console.log("Truyền staff mới vô api: ", user);
//     dispatch({
//       type: ADD_EVENT_REQUEST
//     })
//     usersApi.postThemNhanVien(user)
//       .then(result => {
//         dispatch({
//           type: ADD_EVENT_SUCCESS,
//           payload: { data: result.data }
//         })
//       })
//       .catch(error => {
//         dispatch({
//           type: ADD_EVENT_FAIL,
//           payload: { error: error.response?.data ? error.response.data : error.message, }
//           // payload: "Thêm lỗi!"
//         })
//       })
//   }
// }

export const setStatusIsExistEventModified = (isExistEventModified) => {
  return (dispatch) => {
    dispatch({
      type: SET_IS_EXIST_EVENT_MODIFIED,
      payload: { isExistEventModified }
    })
  }
}

// export const getInfoUser = () => {
//   return (dispatch) => {
//     dispatch({
//       type: GET_INFO_USER_REQUEST
//     })
//     usersApi.getThongTinTaiKhoan()
//       .then(result => {
//         console.log("getThongTinTaiKhoan: ", result.data);
//         dispatch({
//           type: GET_INFO_USER_SUCCESS,
//           payload: {
//             data: result.data,
//           }
//         })
//       }
//       )
//       .catch(
//         error => {
//           dispatch({
//             type: GET_INFO_USER_FAIL,
//             payload: {
//               error: error.response?.data ? error.response.data : error.message,
//             }
//           })
//         }
//       )
//   }
// }