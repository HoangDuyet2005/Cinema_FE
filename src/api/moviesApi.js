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
    // console.log(value);
    const path = `/movies/showing/search?name=${value}`;
    return axiosClient.get(path);
  },


  //lấy thông tin của 1 phim, bao gồm 1 mảng lichChieu<obj> không phân biệt cụm rạp
  getThongTinPhim: (maPhim) => {
    const path = `/movies/details/${maPhim}`;
    return axiosClient.get(path);
  },

  //lấy thông tin của 1 phim, bao gồm 1 mảng lichChieu<obj> không phân biệt cụm rạp
  // getDanhSachPhimTheoNgay: (maNhom, tuNgay, denNgay) => {
  //   const path = `/QuanLyPhim/LayDanhSachPhimTheoNgay`;
  //   return axiosClient.get(path, { maNhom, tuNgay, denNgay });
  // },

  //không co param sẽ 1 trang, 10 phần tử
  // getDanhSachPhimPhanTrang: (param) => {
  //   const path = `/QuanLyPhim/LayDanhSachPhimPhanTrang`;
  //   // param = ?maNhom=GP09&soTrang=${soTrang}&soPhanTuTrenTrang=${soPhanTuTrenTrang}`
  //   return axiosClient.get(path, { param });
  // },

  postThemPhimUpload: (movie) => {
    const path = `/movies/addNew`;
    // console.log(movie);
    //trong obj movie có key hinhAnh là file nên phải chuyển sang formData
    // const formData = new FormData();
    // for (const key in movie) {
    //   // console.log(key);
    //   formData.append(key, movie[key]);
    // }
    // return axiosClient.post(path, formData);
    return axiosClient.post(path, movie);
  },

  postCapNhatPhimUpload: (movie) => {
    // console.log("update phim upload: ", movie);
    const path = `/movies/update`;
    // const formData = new FormData();
    // for (const key in movie) {
    //   formData.append(key, movie[key]);
    // }
    // return axiosClient.put(path, formData);
    return axiosClient.put(path, movie);
  },

  postCapNhatPhim: (movie) => {
    // console.log("update phim: ", movie);
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
};

export default moviesApi;
