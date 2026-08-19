import {
 GET_REVIEW_LIST_REQUEST, 
 GET_REVIEW_LIST_SUCCESS, 
 GET_REVIEW_LIST_FAIL, 
 DELETE_REVIEW_REQUEST, 
 DELETE_REVIEW_SUCCESS, 
 DELETE_REVIEW_FAIL, 
 RESET_REVIEW_LIST, 
 UPDATE_REVIEW_REQUEST, 
 UPDATE_REVIEW_SUCCESS, 
 UPDATE_REVIEW_FAIL, 
 ADD_REVIEW_REQUEST, 
 ADD_REVIEW_SUCCESS, 
 ADD_REVIEW_FAIL, 
 SET_IS_EXIST_REVIEW_MODIFIED, 
 GET_INFO_REVIEW_REQUEST, 
 GET_INFO_REVIEW_SUCCESS, 
 GET_INFO_REVIEW_FAIL,
 GET_REVIEW_LISTBYUSER_REQUEST,
 GET_REVIEW_LISTBYUSER_SUCCESS,
 GET_REVIEW_LISTBYUSER_FAIL,
} from './constants/ReviewsManagement';
const initialState = {
  reviewList: null,
  loadingReviewList: false,
  errorReviewList: null,

  reviewListByUser: null,
  loadingReviewListByUser: false,
  errorReviewListByUser: null,

  successDelete: "",
  loadingDelete: false,
  errorDelete: null,

  successUpdateReview: null,
  loadingUpdateReview: false,
  errorUpdateReview: null,

  successAddReview: null,
  loadingAddReview: false,
  errorAddReview: null,

  isExistReviewModified: false,

  successInfoReview: null,
  loadingInfoReview: false,
  errorInfoReview: null,
}

const reviewsManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEW_LIST_REQUEST: {
      return { ...state, loadingReviewList: true, errorReviewList: null };
    }
    case GET_REVIEW_LIST_SUCCESS: {
      return {
        ...state,
        reviewList: action.payload.data,
        loadingReviewList: false
      };
    }
    case GET_REVIEW_LIST_FAIL: {
      return {
        ...state,
        errorReviewList: action.payload.error,
        loadingReviewList: false,
      };
    }

    case GET_REVIEW_LISTBYUSER_REQUEST: {
      return { ...state, loadingReviewListByUser: true, errorReviewListByUser: null };
    }
    case GET_REVIEW_LISTBYUSER_SUCCESS: {
      return {
        ...state,
        reviewListByUser: action.payload.data,
        loadingReviewListByUser: false
      };
    }
    case GET_REVIEW_LISTBYUSER_FAIL: {
      return {
        ...state,
        errorReviewListByUser: action.payload.error,
        loadingReviewListByUser: false,
      };
    }

    case DELETE_REVIEW_REQUEST: {
      return {
        ...state, loadingDelete: true, errorDelete: null, successDelete: "",
      }
    }
    case DELETE_REVIEW_SUCCESS: {
      return {
        ...state, loadingDelete: false, successDelete: action.payload.data, errorDelete: null,
      }
    }
    case DELETE_REVIEW_FAIL: {
      return {
        ...state, loadingDelete: false, errorDelete: action.payload.error, successDelete: "",
      }
    }
    case RESET_REVIEW_LIST: {
      return {
        ...state,
        errorReviewList: null,

        successDelete: "",
        errorDelete: null,

        successUpdateReview: null,
        errorUpdateReview: null,
      }
    }

    case UPDATE_REVIEW_REQUEST: {
      return {
        ...state, loadingUpdateReview: true, errorUpdateReview: null, successUpdateReview: null
      }
    }
    case UPDATE_REVIEW_SUCCESS: {
      return {
        ...state, loadingUpdateReview: false, successUpdateReview: action.payload.data, errorUpdateReview: null
      }
    }
    case UPDATE_REVIEW_FAIL: {
      return {
        ...state, loadingUpdateReview: false, errorUpdateReview: action.payload.error, successUpdateReview: null
      }
    }

    case ADD_REVIEW_REQUEST: {
      return {
        ...state, loadingAddReview: true, errorAddReview: null, successAddReview: null
      }
    }
    case ADD_REVIEW_SUCCESS: {
      return {
        ...state, loadingAddReview: false, successAddReview: action.payload.data, errorAddReview: null
      }
    }
    case ADD_REVIEW_FAIL: {
      return {
        ...state, loadingAddReview: false, errorAddReview: action.payload.error, successAddReview: null
      }
    }

    case SET_IS_EXIST_REVIEW_MODIFIED: {
      state.isExistReviewModified = action.payload.isExistReviewModified
      return state
    }

    case GET_INFO_REVIEW_REQUEST: {
      return { ...state, loadingInfoReview: true, errorInfoReview: null };
    }
    case GET_INFO_REVIEW_SUCCESS: {
      return {
        ...state,
        successInfoReview: action.payload.data,
        loadingInfoReview: false
      };
    }
    case GET_INFO_REVIEW_FAIL: {
      return {
        ...state,
        errorInfoReview: action.payload.error,
        loadingInfoReview: false,
      };
    }
    default:
      return state;
  }
}
export default reviewsManagementReducer;