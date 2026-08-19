import {
  GET_MOVIE_LIST_REQUEST,
  GET_MOVIE_LIST_SUCCESS,
  GET_MOVIE_LIST_FAIL,
  DELETE_MOVIE_REQUEST,
  DELETE_MOVIE_SUCCESS,
  DELETE_MOVIE_FAIL,
  POST_UPDATE_MOVIE_REQUEST,
  POST_UPDATE_MOVIE_SUCCESS,
  POST_UPDATE_MOVIE_FAIL,
  UPDATE_NONEIMAGE_MOVIE_REQUEST,
  UPDATE_NONEIMAGE_MOVIE_SUCCESS,
  UPDATE_NONEIMAGE_MOVIE_FAIL,
  GET_MOVIE_LIST_REQUEST2,
  GET_MOVIE_LIST_SUCCESS2,
  GET_MOVIE_LIST_FAIL2,
  ADD_MOVIE_UPLOAD_REQUEST,
  ADD_MOVIE_UPLOAD_SUCCESS,
  ADD_MOVIE_UPLOAD_FAIL,
  RESET_MOVIE_MANAGEMENT,
  SAVE_BEFOREINSTALLPROMPT_EVENT,
  GET_SCHEDULE_LIST_REQUEST2,
  GET_SCHEDULE_LIST_SUCCESS2,
  GET_SCHEDULE_LIST_FAIL2,
  DELETE_SCHEDULE_REQUEST,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_FAIL,
  POST_UPDATE_SCHEDULE_REQUEST,
  POST_UPDATE_SCHEDULE_SUCCESS,
  POST_UPDATE_SCHEDULE_FAIL,
  UPDATE_NONEIMAGE_SCHEDULE_REQUEST,
  UPDATE_NONEIMAGE_SCHEDULE_SUCCESS,
  UPDATE_NONEIMAGE_SCHEDULE_FAIL,
  ADD_SCHEDULE_UPLOAD_REQUEST,
  ADD_SCHEDULE_UPLOAD_SUCCESS,
  RESET_SCHEDULE_MANAGEMENT,
  ADD_SCHEDULE_UPLOAD_FAIL,
  GET_MOVIE_LIST_SAP_REQUEST,
  GET_MOVIE_LIST_SAP_SUCCESS,
  GET_MOVIE_LIST_SAP_FAIL,
  GET_MOVIE_HETHONG_LIST_REQUEST,
  GET_MOVIE_HETHONG_LIST_SUCCESS,
  GET_MOVIE_HETHONG_LIST_FAIL,
} from "./constants/Movie";

const initialState = {
  movieList: [],
  loadingMovieList: false,
  errorMovieList: null,
  movieDetail: null,

  movieHeThongList: [],
  loadingMovieHeThongList: false,
  errorMovieHeThongList: null,

  movieSapChieuList: [],
  loadingMovieSapChieuList: false,
  errorMovieSapChieuList: null,

  movieList2: null,
  loadingMovieList2: false,
  errorMovieList2: null,

  successDeleteMovie: "",
  loadingDeleteMovie: false,
  errorDeleteMovie: null,

  successUpdateMovie: "",
  loadingUpdateMovie: false,
  errorUpdateMovie: null,

  successUpdateNoneImageMovie: "",
  loadingUpdateNoneImageMovie: false,
  errorUpdateNoneImageMovie: null,

  successAddUploadMovie: "",
  loadingAddUploadMovie: false,
  errorAddUploadMovie: null,

  saveBeforeinstallpromptEvent: null,

  // schedule
  scheduleList2: null,
  loadingScheduleList2: false,
  errorScheduleList2: null,

  successDeleteSchedule: "",
  loadingDeleteSchedule: false,
  errorDeleteSchedule: null,

  successUpdateSchedule: "",
  loadingUpdateSchedule: false,
  errorUpdateSchedule: null,

  successUpdateNoneImageSchedule: "",
  loadingUpdateNoneImageSchedule: false,
  errorUpdateNoneImageSchedule: null,

  successAddUploadSchedule: "",
  loadingAddUploadSchedule: false,
  errorAddUploadSchedule: null,
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MOVIE_LIST_REQUEST: {
      return {
        ...state,
        loadingMovieList: true,
        errorMovieList: null,
        movieDetail: null,
      };
    }
    case GET_MOVIE_LIST_SUCCESS: {
      return {
        ...state,
        movieList: action.payload.data,
        loadingMovieList: false,
      };
    }
    case GET_MOVIE_LIST_FAIL: {
      return {
        ...state,
        errorMovieList: action.payload.errorMovieList,
        loadingMovieList: false,
      };
    }

    case GET_MOVIE_HETHONG_LIST_REQUEST: {
      return {
        ...state,
        loadingMovieHeThongList: true,
        errorMovieHeThongList: null,
        // movieDetail: null,
      };
    }
    case GET_MOVIE_HETHONG_LIST_SUCCESS: {
      return {
        ...state,
        movieHeThongList: action.payload.data,
        loadingMovieHeThongList: false,
      };
    }
    case GET_MOVIE_HETHONG_LIST_FAIL: {
      return {
        ...state,
        errorMovieHeThongList: action.payload.errorMovieHeThongList,
        loadingMovieHeThongList: false,
      };
    }

    case GET_MOVIE_LIST_SAP_REQUEST: {
      return {
        ...state,
        loadingMovieSapChieuList: true,
        errorMovieSapChieuList: null,
        // movieSapChieuDetail: null,
      };
    }
    case GET_MOVIE_LIST_SAP_SUCCESS: {
      return {
        ...state,
        movieSapChieuList: action.payload.data,
        loadingMovieSapChieuList: false,
      };
    }
    case GET_MOVIE_LIST_SAP_FAIL: {
      return {
        ...state,
        errorMovieSapChieuList: action.payload.errorMovieSapChieuList,
        loadingMovieSapChieuList: false,
      };
    }

    case DELETE_MOVIE_REQUEST: {
      return { ...state, loadingDeleteMovie: true, errorDeleteMovie: null };
    }
    case DELETE_MOVIE_SUCCESS: {
      return {
        ...state,
        successDeleteMovie: action.payload.data,
        loadingDeleteMovie: false,
      };
    }
    case DELETE_MOVIE_FAIL: {
      return {
        ...state,
        errorDeleteMovie: action.payload.error,
        loadingDeleteMovie: false,
      };
    }

    case POST_UPDATE_MOVIE_REQUEST: {
      return { ...state, loadingUpdateMovie: true, errorUpdateMovie: null };
    }
    case POST_UPDATE_MOVIE_SUCCESS: {
      return {
        ...state,
        successUpdateMovie: action.payload.data,
        loadingUpdateMovie: false,
      };
    }
    case POST_UPDATE_MOVIE_FAIL: {
      return {
        ...state,
        errorUpdateMovie: action.payload.error,
        loadingUpdateMovie: false,
      };
    }

    case UPDATE_NONEIMAGE_MOVIE_REQUEST: {
      return {
        ...state,
        loadingUpdateNoneImageMovie: true,
        errorUpdateNoneImageMovie: null,
      };
    }
    case UPDATE_NONEIMAGE_MOVIE_SUCCESS: {
      return {
        ...state,
        successUpdateNoneImageMovie: action.payload.data,
        loadingUpdateNoneImageMovie: false,
      };
    }
    case UPDATE_NONEIMAGE_MOVIE_FAIL: {
      return {
        ...state,
        errorUpdateNoneImageMovie: action.payload.error,
        loadingUpdateNoneImageMovie: false,
      };
    }

    case ADD_MOVIE_UPLOAD_REQUEST: {
      return {
        ...state,
        loadingAddUploadMovie: true,
        errorAddUploadMovie: null,
      };
    }
    case ADD_MOVIE_UPLOAD_SUCCESS: {
      return {
        ...state,
        successAddUploadMovie: action.payload.data,
        loadingAddUploadMovie: false,
      };
    }
    case ADD_MOVIE_UPLOAD_FAIL: {
      return {
        ...state,
        errorAddUploadMovie: action.payload.error,
        loadingAddUploadMovie: false,
      };
    }

    case RESET_MOVIE_MANAGEMENT: {
      return {
        ...state,
        loadingMovieList2: false,
        errorMovieList2: null,

        successDeleteMovie: "",
        loadingDeleteMovie: false,
        errorDeleteMovie: null,

        successUpdateMovie: "",
        loadingUpdateMovie: false,
        errorUpdateMovie: null,

        successUpdateNoneImageMovie: "",
        loadingUpdateNoneImageMovie: false,
        errorUpdateNoneImageMovie: null,

        successAddUploadMovie: "",
        loadingAddUploadMovie: false,
        errorAddUploadMovie: null,
      };
    }


    case GET_MOVIE_LIST_REQUEST2: {
      return { ...state, loadingMovieList2: true, errorMovieList2: null };
    }
    case GET_MOVIE_LIST_SUCCESS2: {
      return {
        ...state,
        movieList2: action.payload.data,
        loadingMovieList2: false,
      };
    }
    case GET_MOVIE_LIST_FAIL2: {
      return {
        ...state,
        errorMovieList2: action.payload.errorMovieList,
        loadingMovieList2: false,
      };
    }

    // SCHEDULE
    case GET_SCHEDULE_LIST_REQUEST2: {
      return { ...state, loadingScheduleList2: true, errorScheduleList2: null };
    }
    case GET_SCHEDULE_LIST_SUCCESS2: {
      return {
        ...state,
        scheduleList2: action.payload.data,
        loadingScheduleList2: false,
      };
    }
    case GET_SCHEDULE_LIST_FAIL2: {
      return {
        ...state,
        errorScheduleList2: action.payload.errorScheduleList2,
        loadingScheduleList2: false,
      };
    }

    case DELETE_SCHEDULE_REQUEST: {
      return { ...state, loadingDeleteSchedule: true, errorDeleteSchedule: null };
    }
    case DELETE_SCHEDULE_SUCCESS: {
      return {
        ...state,
        successDeleteSchedule: action.payload.data,
        loadingDeleteSchedule: false,
      };
    }
    case DELETE_SCHEDULE_FAIL: {
      return {
        ...state,
        errorDeleteSchedule: action.payload.error,
        loadingDeleteSchedule: false,
      };
    }

    case POST_UPDATE_SCHEDULE_REQUEST: {
      return { ...state, loadingUpdateSchedule: true, errorUpdateSchedule: null };
    }
    case POST_UPDATE_SCHEDULE_SUCCESS: {
      return {
        ...state,
        successUpdateSchedule: action.payload.data,
        loadingUpdateSchedule: false,
      };
    }
    case POST_UPDATE_SCHEDULE_FAIL: {
      return {
        ...state,
        errorUpdateSchedule: action.payload.error,
        loadingUpdateSchedule: false,
      };
    }

    case UPDATE_NONEIMAGE_SCHEDULE_REQUEST: {
      return {
        ...state,
        loadingUpdateNoneImageSchedule: true,
        errorUpdateNoneImageSchedule: null,
      };
    }
    case UPDATE_NONEIMAGE_SCHEDULE_SUCCESS: {
      return {
        ...state,
        successUpdateNoneImageSchedule: action.payload.data,
        loadingUpdateNoneImageSchedule: false,
      };
    }
    case UPDATE_NONEIMAGE_SCHEDULE_FAIL: {
      return {
        ...state,
        errorUpdateNoneImageSchedule: action.payload.error,
        loadingUpdateNoneImageSchedule: false,
      };
    }

    case ADD_SCHEDULE_UPLOAD_REQUEST: {
      return {
        ...state,
        loadingAddUploadSchedule: true,
        errorAddUploadSchedule: null,
      };
    }
    case ADD_SCHEDULE_UPLOAD_SUCCESS: {
      return {
        ...state,
        successAddUploadSchedule: action.payload.data,
        loadingAddUploadSchedule: false,
      };
    }
    case ADD_SCHEDULE_UPLOAD_FAIL: {
      return {
        ...state,
        errorAddUploadSchedule: action.payload.error,
        loadingAddUploadSchedule: false,
      };
    }

    case RESET_SCHEDULE_MANAGEMENT: {
      return {
        ...state,
        loadingScheduleList2: false,
        errorScheduleList2: null,

        successDeleteSchedule: "",
        loadingDeleteSchedule: false,
        errorDeleteSchedule: null,

        successUpdateSchedule: "",
        loadingUpdateSchedule: false,
        errorUpdateSchedule: null,

        successUpdateNoneImageSchedule: "",
        loadingUpdateNoneImageSchedule: false,
        errorUpdateNoneImageSchedule: null,

        successAddUploadSchedule: "",
        loadingAddUploadSchedule: false,
        errorAddUploadSchedule: null,
      };
    }
// HẾT SCHEDULE
    case SAVE_BEFOREINSTALLPROMPT_EVENT: {
      state.saveBeforeinstallpromptEvent = action.payload.event;
      return state;
    }
    default:
      return state;
  }
};
export default movieReducer;
