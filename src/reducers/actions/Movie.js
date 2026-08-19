import moviesApi from "../../api/moviesApi";
import theatersApi from "../../api/theatersApi";

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
  RESET_SCHEDULE_MANAGEMENT,
  GET_MOVIE_LIST_SAP_REQUEST,
  GET_MOVIE_LIST_SAP_SUCCESS,
  GET_MOVIE_LIST_SAP_FAIL,
  GET_MOVIE_HETHONG_LIST_REQUEST,
  GET_MOVIE_HETHONG_LIST_SUCCESS,
  GET_MOVIE_HETHONG_LIST_FAIL,
} from "../constants/Movie";

export const getMovieList = () => {
  return async (dispatch) => {
    dispatch({
      type: GET_MOVIE_LIST_REQUEST,
    });
    try {
      const result = await moviesApi.getDanhSachPhim();
      // console.log(result);
      dispatch({
        type: GET_MOVIE_LIST_SUCCESS,
        payload: { data: result.data },
      });
    } catch (error) {
      dispatch({
        type: GET_MOVIE_LIST_FAIL,
        payload: {
          errorMovieList: error.response?.data
            ? error.response.data
            : error.message,
        },
      });
    }
  };
};

export const getMovieHeThongList = () => {
  return async (dispatch) => {
    dispatch({
      type: GET_MOVIE_HETHONG_LIST_REQUEST,
    });
    try {
      const result = await moviesApi.getTatCaDanhSachPhimDangSapDaChieu();
      console.log("Movie hệ thống: ",result);
      dispatch({
        type: GET_MOVIE_HETHONG_LIST_SUCCESS,
        payload: { data: result.data },
      });
    } catch (error) {
      dispatch({
        type: GET_MOVIE_HETHONG_LIST_FAIL,
        payload: {
          errorMovieHeThongList: error.response?.data
            ? error.response.data
            : error.message,
        },
      });
    }
  };
};

export const getMovieSapChieuList = () => {
  return async (dispatch) => {
    dispatch({
      type: GET_MOVIE_LIST_SAP_REQUEST,
    });
    try {
      const result = await moviesApi.getDanhSachPhimSapChieu();
      // console.log(result);
      dispatch({
        type: GET_MOVIE_LIST_SAP_SUCCESS,
        payload: { data: result.data },
      });
    } catch (error) {
      dispatch({
        type: GET_MOVIE_LIST_SAP_FAIL,
        payload: {
          errorMovieSapChieuList: error.response?.data
            ? error.response.data
            : error.message,
        },
      });
    }
  };
};

export const getMovieListManagement = () => {
  return (dispatch) => {
    dispatch({
      type: GET_MOVIE_LIST_REQUEST2,
    });
    moviesApi
      .getTatCaDanhSachPhimDangSapDaChieu()
      .then((result) => {
        dispatch({
          type: GET_MOVIE_LIST_SUCCESS2,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_MOVIE_LIST_FAIL2,
          payload: {
            errorMovieList: error.response?.data
              ? error.response.data
              : error.message,
          },
        });
      });
  };
};


export const getScheduleListManagement = (idRap) => {
  console.log(idRap);
  return (dispatch) => {
    dispatch({
      type: GET_SCHEDULE_LIST_REQUEST2,
    });
    theatersApi
      .getThongTinLichChieuHeThongRapTheoRap(idRap)
      .then((result) => {
        console.log("Lấy lch: ", result);
        dispatch({
          type: GET_SCHEDULE_LIST_SUCCESS2,
          payload: { data: result.data.data.content },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_SCHEDULE_LIST_FAIL2,
          payload: {
            errorScheduleList2: error.response?.data
              ? error.response.data
              : error.message,
          },
        });
      });
  };
};

export const getAllScheduleListManagement = () => {
  return (dispatch) => {
    dispatch({
      type: GET_SCHEDULE_LIST_REQUEST2,
    });
    theatersApi
      .getTatCaLichChieuAdmin()
      .then((result) => {
        console.log("Lấy lch: ", result);
        dispatch({
          type: GET_SCHEDULE_LIST_SUCCESS2,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_SCHEDULE_LIST_FAIL2,
          payload: {
            errorScheduleList: error.response?.data
              ? error.response.data
              : error.message,
          },
        });
      });
  };
};


export const deleteMovie = (maPhim) => {
  console.log(maPhim);
  return (dispatch) => {
    dispatch({
      type: DELETE_MOVIE_REQUEST,
    });
    moviesApi
      .deleteMovie(maPhim)
      .then((result) => {
        dispatch({
          type: DELETE_MOVIE_SUCCESS,
          payload: { data: result.data.data },
        });
      })
      .catch((error) => {
        const message = error?.response?.data
          ? error.response.data
          : "Xóa thành công nhưng backend return error";
        dispatch({
          type: DELETE_MOVIE_FAIL,
          payload: { error: message },
        });
      });
  };
};

export const updateMovieUpload = (phimObj) => {
  console.log('updateMovieUpload', phimObj);
  return (dispatch) => {
    dispatch({
      type: POST_UPDATE_MOVIE_REQUEST,
    });
    moviesApi
      .postCapNhatPhimUpload(phimObj)
      .then((result) => {
        console.log("Thành công cập nhật: ",result.data);
        dispatch({
          type: POST_UPDATE_MOVIE_SUCCESS,
          payload: { data: result.data.data },
        });
      })
      .catch((error) => {
        console.log('====================================');
        console.log(error.response?.data);
        console.log('====================================');
        dispatch({
          type: POST_UPDATE_MOVIE_FAIL,
          payload: {
            // error: error.response?.data ? error.response.data : error.message,
            error: "Update fail! Don't be empty any field or Release Date was wrong!"
          },
        });
      });
  };
};
export const updateMovie = (phimObj) => {
  console.log("Update phim: ", phimObj);
  return (dispatch) => {
    dispatch({
      type: UPDATE_NONEIMAGE_MOVIE_REQUEST,
    });
    moviesApi
      .postCapNhatPhim(phimObj)
      .then((result) => {
        console.log(result);
        dispatch({
          type: UPDATE_NONEIMAGE_MOVIE_SUCCESS,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: UPDATE_NONEIMAGE_MOVIE_FAIL,
          payload: {
            error: "Update fail! Don't be empty any field or Release Date was wrong!"
            // error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const addMovieUpload = (movieObj) => {
  return (dispatch) => {
    console.log("movieObj: ", movieObj);
    dispatch({
      type: ADD_MOVIE_UPLOAD_REQUEST,
    });
    moviesApi
      .postThemPhimUpload(movieObj)
      .then((result) => {
        console.log("Thêm: ", result);
        dispatch({
          type: ADD_MOVIE_UPLOAD_SUCCESS,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        console.log("Lỗi thêm: ", error.message);
        dispatch({
          type: ADD_MOVIE_UPLOAD_FAIL,
          payload: {
            // error: error.response?.data ? error.response.data : error.message,
            error: "Lỗi do ngày khởi chiếu không đúng!"
          },
        });
      });
  };
};

export const resetScheduleManagement = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_SCHEDULE_MANAGEMENT,
    });
  };
};

export const resetMoviesManagement = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_MOVIE_MANAGEMENT,
    });
  };
};

export const saveBeforeinstallpromptEvent = (event) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_BEFOREINSTALLPROMPT_EVENT,
      payload: { event },
    });
  };
};
