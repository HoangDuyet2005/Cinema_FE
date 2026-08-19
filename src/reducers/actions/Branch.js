import branchApi from '../../api/branchApi';
import {
  GET_LISTBRANCH_FAIL,
  GET_LISTBRANCH_REQUEST, 
  GET_LISTBRANCH_SUCCESS } 
  from '../constants/Branch';

export const getListBranchByAdminStaff = () => {
  return (dispatch) => {
    dispatch({
      type: GET_LISTBRANCH_REQUEST
    })
    branchApi.getListBranchByAdminStaff()
      .then(result => {
       console.log("data danh sách branch: ", result.data);
        dispatch({
          type: GET_LISTBRANCH_SUCCESS,
          payload: { data: result.data.data }
        })
      })
      .catch(
        error => {
          dispatch({
            type: GET_LISTBRANCH_FAIL,
            payload: { error: error.response?.data ? error.response.data : error.message, }
          })
        }
      )
  }
}


