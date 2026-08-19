import {
  GET_EVENT_LIST_REQUEST, GET_EVENT_LIST_SUCCESS, GET_EVENT_LIST_FAIL,
  DELETE_EVENT_REQUEST, DELETE_EVENT_SUCCESS, DELETE_EVENT_FAIL, RESET_EVENT_LIST,
  UPDATE_EVENT_REQUEST, UPDATE_EVENT_FAIL,
  ADD_EVENT_REQUEST, ADD_EVENT_SUCCESS, ADD_EVENT_FAIL,
  SET_IS_EXIST_EVENT_MODIFIED,
  GET_INFO_EVENT_REQUEST, GET_INFO_EVENT_SUCCESS, GET_INFO_EVENT_FAIL, UPDATE_EVENT_SUCCESS,
  GET_EVENT_DETAIL_REQUEST, GET_EVENT_DETAIL_SUCCESS, GET_EVENT_DETAIL_FAIL,
} from './constants/EventsManagement';
const initialState = {
  eventList: null,
  loadingEventList: false,
  errorEventList: null,

  eventDetail: null,
  loadingEventDetail: false,
  errorEventDetail: null,
  
  successDelete: "",
  loadingDelete: false,
  errorDelete: null,

  successUpdateEvent: null,
  loadingUpdateEvent: false,
  errorUpdateEvent: null,

  successAddEvent: null,
  loadingAddEvent: false,
  errorAddEvent: null,

  isExistEventModified: false,

  successInfoEvent: null,
  loadingInfoEvent: false,
  errorInfoEvent: null,
}

const eventsManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENT_LIST_REQUEST: {
      return { ...state, loadingEventList: true, errorEventList: null };
    }
    case GET_EVENT_LIST_SUCCESS: {
      return {
        ...state,
        eventList: action.payload.data,
        loadingEventList: false
      };
    }
    case GET_EVENT_LIST_FAIL: {
      return {
        ...state,
        errorEventList: action.payload.error,
        loadingEventList: false,
      };
    }

    case DELETE_EVENT_REQUEST: {
      return {
        ...state, loadingDelete: true, errorDelete: null, successDelete: "",
      }
    }
    case DELETE_EVENT_SUCCESS: {
      return {
        ...state, loadingDelete: false, successDelete: action.payload.data, errorDelete: null,
      }
    }
    case DELETE_EVENT_FAIL: {
      return {
        ...state, loadingDelete: false, errorDelete: action.payload.error, successDelete: "",
      }
    }
    case RESET_EVENT_LIST: {
      return {
        ...state,
        errorEventList: null,

        successDelete: "",
        errorDelete: null,

        successUpdateEvent: null,
        errorUpdateEvent: null,
      }
    }

    case UPDATE_EVENT_REQUEST: {
      return {
        ...state, loadingUpdateEvent: true, errorUpdateEvent: null, successUpdateEvent: null
      }
    }
    case UPDATE_EVENT_SUCCESS: {
      return {
        ...state, loadingUpdateEvent: false, successUpdateEvent: action.payload.data, errorUpdateEvent: null
      }
    }
    case UPDATE_EVENT_FAIL: {
      return {
        ...state, loadingUpdateEvent: false, errorUpdateEvent: action.payload.error, successUpdateEvent: null
      }
    }

    case ADD_EVENT_REQUEST: {
      return {
        ...state, loadingAddEvent: true, errorAddEvent: null, successAddEvent: null
      }
    }
    case ADD_EVENT_SUCCESS: {
      return {
        ...state, loadingAddEvent: false, successAddEvent: action.payload.data, errorAddEvent: null
      }
    }
    case ADD_EVENT_FAIL: {
      return {
        ...state, loadingAddEvent: false, errorAddEvent: action.payload.error, successAddEvent: null
      }
    }

    case SET_IS_EXIST_EVENT_MODIFIED: {
      state.isExistEventModified = action.payload.isExistEventModified
      return state
    }

    case GET_INFO_EVENT_REQUEST: {
      return { ...state, loadingInfoEvent: true, errorInfoEvent: null };
    }
    case GET_INFO_EVENT_SUCCESS: {
      return {
        ...state,
        successInfoEvent: action.payload.data,
        loadingInfoEvent: false
      };
    }
    case GET_INFO_EVENT_FAIL: {
      return {
        ...state,
        errorInfoEvent: action.payload.error,
        loadingInfoEvent: false,
      };
    }
    case GET_EVENT_DETAIL_REQUEST: {
      return { ...state, loadingEventDetail: true, errorEventDetail: null };
    }
    case GET_EVENT_DETAIL_SUCCESS: {
      return {
        ...state,
        eventDetail: action.payload.data,
        loadingEventDetail: false
      };
    }
    case GET_EVENT_DETAIL_FAIL: {
      return {
        ...state,
        errorEventDetail: action.payload.error,
        loadingEventDetail: false,
      };
    }
    default:
      return state;
  }
}
export default eventsManagementReducer;