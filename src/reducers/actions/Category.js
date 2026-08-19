import categoryApi from '../../api/categoryApi';
import {GET_LISTCATE_REQUEST, 
  GET_LISTCATE_SUCCESS, 
  GET_LISTCATE_FAIL,
  POST_ADDCATE_REQUEST,
  POST_ADDCATE_SUCCESS,
  POST_ADDCATE_FAIL} from "../../reducers/constants/Category"

export const getListCategoryByAdminStaff = () => {
  return (dispatch) => {
    dispatch({
      type: GET_LISTCATE_REQUEST
    })
    categoryApi.getListCategoryByAdminStaff()
      .then(result => {
       console.log("data danh sách category: ", result.data);
        dispatch({
          type: GET_LISTCATE_SUCCESS,
          payload: { data: result.data.data }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_LISTCATE_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}

export const addCategoryUpload = (name) => {
  return (dispatch) => {
    console.log("movieObj bên action: ", name);
    dispatch({
      type: POST_ADDCATE_REQUEST,
    });
    categoryApi
      .addCategoryByAdminStaff(name)
      .then((result) => {
        console.log("Thêm: ", result);
        dispatch({
          type: POST_ADDCATE_SUCCESS,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        console.log("Lỗi thêm: ", error.message);
        dispatch({
          type: POST_ADDCATE_FAIL,
          payload: {
            // error: error.response?.data ? error.response.data : error.message,
            error: "Cập nhật lỗi do nội dung trống!"
          },
        });
      });
  };
};


