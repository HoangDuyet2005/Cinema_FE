import {GET_LISTCATE_REQUEST, GET_LISTCATE_SUCCESS, GET_LISTCATE_FAIL} from "../reducers/constants/Category"
  
  const initialState = {
    cateList: null,
    loadingCateList: false,
    errorCateList: null,
  }
  
  const categoryManagementReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_LISTCATE_REQUEST: {
        return { ...state, loadingCateList: true, errorCateList: null };
      }
      case GET_LISTCATE_SUCCESS: {
        return {
          ...state,
          cateList: action.payload.data,
          loadingCateList: false
        };
      }
      case GET_LISTCATE_FAIL: {
        return {
          ...state,
          errorCateList: action.payload.error,
          loadingCateList: false,
        };
      }
  
      default:
        return state;
    }
  }
  export default categoryManagementReducer;