import {GET_LISTLIKE_REQUEST, 
  GET_LISTLIKE_SUCCESS, 
  GET_LISTLIKE_FAIL, 
  GET_LISTCOMMENT_REQUEST, 
  GET_LISTCOMMENT_SUCCESS, 
  GET_LISTCOMMENT_FAIL, 
  POST_LIKEUNLIKE_REQUEST, 
  POST_LIKEUNLIKE_SUCCESS, 
  POST_LIKEUNLIKE_FAIL, 
  POST_COMMENT_REQUEST, 
  POST_COMMENT_SUCCESS, 
  POST_COMMENT_FAIL,
  GET_LIKECHECK_REQUEST,
  GET_LIKECHECK_SUCCESS,
  GET_LIKECHECK_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAIL

} from "../reducers/constants/Interaction"
  
  const initialState = {
    likeList: null,
    loadingLikeList: false,
    errorLikeList: null,

    likePost: null,
    loadingLikePost: false,
    errorLikePost: null,

    commentList: null,
    loadingCommentList: false,
    errorCommentList: null,

    commentPost: null,
    loadingCommentPost: false,
    errorCommentPost: null,

    likeCheck:  null,
    loadingCheck: false,
    errorCheck: null,

    postDelete:  null,
    loadingDelete: false,
    errorDelete: null,

  }
  
  const InteractionReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_LISTLIKE_REQUEST: {
        return { ...state, loadingLikeList: true, errorLikeList: null };
      }
      case GET_LISTLIKE_SUCCESS: {
        return {
          ...state,
          likeList: action.payload.data,
          loadingLikeList: false
        };
      }
      case GET_LISTLIKE_FAIL: {
        return {
          ...state,
          errorLikeList: action.payload.error,
          loadingLikeList: false,
        };
      }

      case GET_LISTCOMMENT_REQUEST: {
        return { ...state, loadingCommentList: true, errorCommentList: null };
      }
      case GET_LISTCOMMENT_SUCCESS: {
        return {
          ...state,
          commentList: action.payload.data,
          loadingCommentList: false
        };
      }
      case GET_LISTCOMMENT_FAIL: {
        return {
          ...state,
          errorCommentList: action.payload.error,
          loadingCommentList: false,
        };
      }

      case POST_LIKEUNLIKE_REQUEST: {
        return { ...state, loadingLikePost: true, errorLikePost: null };
      }
      case POST_LIKEUNLIKE_SUCCESS: {
        return {
          ...state,
          likePost: action.payload.data,
          loadingLikePost: false
        };
      }
      case POST_LIKEUNLIKE_FAIL: {
        return {
          ...state,
          errorLikePost: action.payload.error,
          loadingLikePost: false,
        };
      }

      case POST_COMMENT_REQUEST: {
        return { ...state, loadingCommentPost: true, errorCommentPost: null };
      }
      case POST_COMMENT_SUCCESS: {
        return {
          ...state,
          commentPost: action.payload.data,
          loadingCommentPost: false
        };
      }
      case POST_COMMENT_FAIL: {
        return {
          ...state,
          errorCommentPost: action.payload.error,
          loadingCommentPost: false,
        };
      }

      case GET_LIKECHECK_REQUEST: {
        return { ...state, loadingCheck: true, errorCheck: null };
      }
      case GET_LIKECHECK_SUCCESS: {
        return {
          ...state,
          likeCheck: action.payload.data,
          loadingCheck: false
        };
      }
      case GET_LIKECHECK_FAIL: {
        return {
          ...state,
          errorCheck: action.payload.error,
          loadingCheck: false,
        };
      }

      case POST_DELETE_REQUEST: {
        return { ...state, loadingDelete: true, errorDelete: null };
      }
      case POST_DELETE_SUCCESS: {
        return {
          ...state,
          postDelete: action.payload.data,
          loadingDelete: false
        };
      }
      case POST_DELETE_FAIL: {
        return {
          ...state,
          errorDelete: action.payload.error,
          loadingDelete: false,
        };
      }
  
      default:
        return state;
    }
  }
  export default InteractionReducer;