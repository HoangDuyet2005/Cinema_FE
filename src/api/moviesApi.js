import axiosClient from "./axiosClient";
const moviesApi = {
  //lấy thông tin toàn bộ danh sách phim
  getDanhSachPhim: () => {
    const path = `/movies/showing`;
    return axiosClient.get(path);
  },

  getTatCaDanhSachPhimDangSapDaChieu: () => {
    console.log("Vào get movie hệ thống");
    const path = `/movies/getList?page=0&size=30`;
    return axiosClient.get(path);
  },

  getDanhSachPhimSapChieu: () => {
    const path = `/movies/getList?page=0&size=10&isShowing=0`;
    return axiosClient.get(path);
  },

  getSearchPhim: (value) => {
    const path = `/movies/showing/search?name=${value}`;
    return axiosClient.get(path);
  },

  //lấy thông tin của 1 phim, bao gồm 1 mảng lichChieu<obj> không phân biệt cụm rạp
  getThongTinPhim: (maPhim) => {
    const path = `/movies/details/${maPhim}`;
    return axiosClient.get(path);
  },

  postThemPhimUpload: (movie) => {
    const path = `/movies/addNew`;
    return axiosClient.post(path, movie);
  },

  postCapNhatPhimUpload: (movie) => {
    const path = `/movies/update`;
    return axiosClient.put(path, movie);
  },

  postCapNhatPhim: (movie) => {
    const path = `/movies/update`;
    return axiosClient.put(path, movie);
  },

  deleteMovie: (maPhim) => {
    const path = `/movies/${maPhim}`;
    return axiosClient.delete(path);
  },

  getLichChieuLayThongTin: (movieId, branchId, startDate, startTime, roomId) => {
    const path = `/schedule/getAll?page=0&size=20&movieId=${movieId}&branchId=${branchId}&startDate=${startDate}&startTime=${startTime}&roomId=${roomId}`;
    return axiosClient.get(path);
  },

  getMovieRating: (movieId, userId) => {
    const path = userId ? `/movies/${movieId}/rating?userId=${userId}` : `/movies/${movieId}/rating`;
    return axiosClient.get(path);
  },

  postMovieRating: (data) => {
    const path = `/movies/rating`;
    return axiosClient.post(path, data);
  },
};

export default moviesApi;