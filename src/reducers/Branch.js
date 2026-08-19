import { GET_LISTBRANCH_REQUEST, GET_LISTBRANCH_SUCCESS, GET_LISTBRANCH_FAIL} from "../reducers/constants/Branch";
  const initialState = {
    branchList: null,
    loadingBranchList: false,
    errorBranchList: null,
  }
  
  const branchManagementReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_LISTBRANCH_REQUEST: {
        return { ...state, loadingBranchList: true, errorBranchList: null };
      }
      case GET_LISTBRANCH_SUCCESS: {
        return {
          ...state,
          branchList: action.payload.data,
          loadingBranchList: false
        };
      }
      case GET_LISTBRANCH_FAIL: {
        return {
          ...state,
          errorBranchList: action.payload.error,
          loadingBranchList: false,
        };
      }
  
      default:
        return state;
    }
  }
  export default branchManagementReducer;