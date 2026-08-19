import {
 GET_BILL_LIST_REQUEST, 
 GET_BILL_LIST_SUCCESS, 
 GET_BILL_LIST_FAIL, 
 DELETE_BILL_REQUEST, 
 DELETE_BILL_SUCCESS, 
 DELETE_BILL_FAIL, 
 RESET_BILL_LIST, 
 UPDATE_BILL_REQUEST, 
 UPDATE_BILL_SUCCESS, 
 UPDATE_BILL_FAIL, 
 ADD_BILL_REQUEST, 
 ADD_BILL_SUCCESS, 
 ADD_BILL_FAIL, 
 SET_IS_EXIST_BILL_MODIFIED, 
 GET_INFO_BILL_REQUEST, 
 GET_INFO_BILL_SUCCESS, 
 GET_INFO_BILL_FAIL,
 GET_BILL_LIST_REQUEST_USER,
 GET_BILL_LIST_SUCCESS_USER,
 GET_BILL_LIST_FAIL_USER,
 GET_BILL_LIST_REQUEST_USER_DTT,
 GET_BILL_LIST_SUCCESS_USER_DTT,
 GET_BILL_LIST_FAIL_USER_DTT,
 GET_BILL_LIST_REQUEST_USER_DTT_ID,
 GET_BILL_LIST_SUCCESS_USER_DTT_ID,
 GET_BILL_LIST_FAIL_USER_DTT_ID,
 GET_BILL_LIST_REQUEST_TTTQ,
 GET_BILL_LIST_SUCCESS_TTTQ,
 GET_BILL_LIST_FAIL_TTTQ,
} from './constants/Bill';
const initialState = {
  billList: [],
  loadingBillList: false,
  errorBillList: null,

  billListChuaTT: null,
  loadingBillListChuaTT: false,
  errorBillListChuaTT: null,

  billListTTTaiQuay: null,
  loadingBillListTTTaiQuay: false,
  errorBillListTTTaiQuay: null,

  billListDaTT: null,
  loadingBillListDaTT: false,
  errorBillListDaTT: null,

  billListUserId: null,
  loadingBillListUserId: false,
  errorBillListUserId: null,

  successDelete: "",
  loadingDelete: false,
  errorDelete: null,

  successUpdateBill: null,
  loadingUpdateBill: false,
  errorUpdateBill: null,

  successAddBill: null,
  loadingAddBill: false,
  errorAddBill: null,

  isExistBillModified: false,

  successInfoBill: null,
  loadingInfoBill: false,
  errorInfoBill: null,
}

const billsManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILL_LIST_REQUEST: {
      return { ...state, loadingBillList: true, errorBillList: null };
    }
    case GET_BILL_LIST_SUCCESS: {
      return {
        ...state,
        billList: action.payload.data,
        loadingBillList: false
      };
    }
    case GET_BILL_LIST_FAIL: {
      return {
        ...state,
        errorBillList: action.payload.error,
        loadingBillList: false,
      };
    }

    case GET_BILL_LIST_REQUEST_USER: {
      return { ...state, loadingBillListChuaTT: true, errorBillListChuaTT: null };
    }
    case GET_BILL_LIST_SUCCESS_USER: {
      return {
        ...state,
        billListChuaTT: action.payload.data,
        loadingBillListChuaTT: false
      };
    }
    case GET_BILL_LIST_FAIL_USER: {
      return {
        ...state,
        errorBillListChuaTT: action.payload.error,
        loadingBillListChuaTT: false,
      };
    }

    case GET_BILL_LIST_REQUEST_TTTQ: {
      return { ...state, loadingBillListTTTaiQuay: true, errorBillListTTTaiQuay: null };
    }
    case GET_BILL_LIST_SUCCESS_TTTQ: {
      return {
        ...state,
        billListTTTaiQuay: action.payload.data,
        loadingBillListTTTaiQuay: false
      };
    }
    case GET_BILL_LIST_FAIL_TTTQ: {
      return {
        ...state,
        errorBillListTTTaiQuay: action.payload.error,
        loadingBillListTTTaiQuay: false,
      };
    }

    case GET_BILL_LIST_REQUEST_USER_DTT: {
      return { ...state, loadingBillListDaTT: true, errorBillListDaTT: null };
    }
    case GET_BILL_LIST_SUCCESS_USER_DTT: {
      return {
        ...state,
        billListDaTT: action.payload.data,
        loadingBillListDaTT: false
      };
    }
    case GET_BILL_LIST_FAIL_USER_DTT: {
      return {
        ...state,
        errorBillListDaTT: action.payload.error,
        loadingBillListDaTT: false,
      };
    }

    case GET_BILL_LIST_REQUEST_USER_DTT_ID: {
      return { ...state, loadingBillListUserId: true, errorBillListUserId: null };
    }
    case GET_BILL_LIST_SUCCESS_USER_DTT_ID: {
      return {
        ...state,
        billListUserId: action.payload.data,
        loadingBillListUserId: false
      };
    }
    case GET_BILL_LIST_FAIL_USER_DTT_ID: {
      return {
        ...state,
        errorBillListUserId: action.payload.error,
        loadingBillListUserId: false,
      };
    }

    case DELETE_BILL_REQUEST: {
      return {
        ...state, loadingDelete: true, errorDelete: null, successDelete: "",
      }
    }
    case DELETE_BILL_SUCCESS: {
      return {
        ...state, loadingDelete: false, successDelete: action.payload.data, errorDelete: null,
      }
    }
    case DELETE_BILL_FAIL: {
      return {
        ...state, loadingDelete: false, errorDelete: action.payload.error, successDelete: "",
      }
    }
    case RESET_BILL_LIST: {
      return {
        ...state,
        errorBillList: null,

        successDelete: "",
        errorDelete: null,

        successUpdateBill: null,
        errorUpdateBill: null,
      }
    }

    case UPDATE_BILL_REQUEST: {
      return {
        ...state, loadingUpdateBill: true, errorUpdateBill: null, successUpdateBill: null
      }
    }
    case UPDATE_BILL_SUCCESS: {
      return {
        ...state, loadingUpdateBill: false, successUpdateBill: action.payload.data, errorUpdateBill: null
      }
    }
    case UPDATE_BILL_FAIL: {
      return {
        ...state, loadingUpdateBill: false, errorUpdateBill: action.payload.error, successUpdateBill: null
      }
    }

    case ADD_BILL_REQUEST: {
      return {
        ...state, loadingAddBill: true, errorAddBill: null, successAddBill: null
      }
    }
    case ADD_BILL_SUCCESS: {
      return {
        ...state, loadingAddBill: false, successAddBill: action.payload.data, errorAddBill: null
      }
    }
    case ADD_BILL_FAIL: {
      return {
        ...state, loadingAddBill: false, errorAddBill: action.payload.error, successAddBill: null
      }
    }

    case SET_IS_EXIST_BILL_MODIFIED: {
      state.isExistBillModified = action.payload.isExistBillModified
      return state
    }

    case GET_INFO_BILL_REQUEST: {
      return { ...state, loadingInfoBill: true, errorInfoBill: null };
    }
    case GET_INFO_BILL_SUCCESS: {
      return {
        ...state,
        successInfoBill: action.payload.data,
        loadingInfoBill: false
      };
    }
    case GET_INFO_BILL_FAIL: {
      return {
        ...state,
        errorInfoBill: action.payload.error,
        loadingInfoBill: false,
      };
    }
    default:
      return state;
  }
}
export default billsManagementReducer;