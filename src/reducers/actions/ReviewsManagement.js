import reviewsApi from '../../api/reviewsApi';
import { ADD_REVIEW_FAIL, ADD_REVIEW_REQUEST, GET_REVIEW_LIST_REQUEST, GET_REVIEW_LIST_SUCCESS, GET_REVIEW_LIST_FAIL, RESET_REVIEW_LIST, UPDATE_REVIEW_REQUEST, UPDATE_REVIEW_SUCCESS, UPDATE_REVIEW_FAIL, ADD_REVIEW_SUCCESS, SET_IS_EXIST_REVIEW_MODIFIED, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, DELETE_REVIEW_FAIL, GET_REVIEW_LISTBYUSER_REQUEST, GET_REVIEW_LISTBYUSER_SUCCESS, GET_REVIEW_LISTBYUSER_FAIL } from '../constants/ReviewsManagement';

export const getReviewsList = () => {
  return (dispatch) => {
    dispatch({
      type: GET_REVIEW_LIST_REQUEST
    })
    reviewsApi.getListReview()
      .then(result => {
        console.log(result.data);
        dispatch({
          type: GET_REVIEW_LIST_SUCCESS,
          payload: { data: result.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: GET_REVIEW_LIST_FAIL,
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
export const deleteReview = (review) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_REVIEW_REQUEST
    })
    reviewsApi.deleteReview(review)
      .then(result => {
        console.log(result);

        dispatch({
          type: DELETE_REVIEW_SUCCESS,
          payload: { data: result.data.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
            // payload: "Delete fail!"
          })
        }
      )
  }
}

export const resetReviewList = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_REVIEW_LIST
    })
  }
}

export const getReviewsListByUser = (username) => {
  return (dispatch) => {
    dispatch({
      type: GET_REVIEW_LISTBYUSER_REQUEST
    })
    reviewsApi.getListReviewByUser(username)
      .then(result => {
        console.log("danh sách review bởi user",result.data);
        dispatch({
          type: GET_REVIEW_LISTBYUSER_SUCCESS,
          payload: { data: result.data.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: GET_REVIEW_LISTBYUSER_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
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


export const putReviewUpdate = (review) => {

  return (dispatch) => {
    console.log("truyền vô cập nhật: ", review);
    dispatch({
      type: UPDATE_REVIEW_REQUEST
    })
    reviewsApi.putEditReview(review)
      .then(result => {
        console.log("Cập nhật: ", result);
        dispatch({
          type: UPDATE_REVIEW_SUCCESS,
          payload: { data: result.data }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: UPDATE_REVIEW_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}

export const postAddReview = (review) => {
  return (dispatch) => {
    dispatch({
      type: ADD_REVIEW_REQUEST
    })
    reviewsApi.postAddReview(review)
      .then(result => {
        dispatch({
          type: ADD_REVIEW_SUCCESS,
          payload: { data: result.data }
        })
      })
      .catch(error => {
        dispatch({
          type: ADD_REVIEW_FAIL,
          // payload: { error: error.response?.data ? error.response.data : error.message, }
          payload: "Thêm lỗi!"
        })
      })
  }
}

// //chỉnh lại cái type
// export const postAddReview = (review) => {
//   return (dispatch) => {
//     dispatch({
//       type: ADD_EVENT_REQUEST
//     })
//     eventsApi.postAddReview(review)
//       .then(result => {
//         dispatch({
//           type: ADD_EVENT_SUCCESS,
//           payload: { data: result.data }
//         })
//       })
//       .catch(error => {
//         dispatch({
//           type: ADD_EVENT_FAIL,
//           // payload: { error: error.response?.data ? error.response.data : error.message, }
//           payload: "Thêm lỗi!"
//         })
//       })
//   }
// }

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

export const setStatusIsExistReviewModified = (isExistReviewModified) => {
  return (dispatch) => {
    dispatch({
      type: SET_IS_EXIST_REVIEW_MODIFIED,
      payload: { isExistReviewModified }
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