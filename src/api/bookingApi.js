import axiosClient from "./axiosClient";
const bookingApi = {
  //lấy thông tin phòng vé của 1 bộ phim
  getDanhSachPhongVe: (maLichChieu) => {
    const path = `/seats?scheduleId=${maLichChieu}`;
    return axiosClient.get(path);
  },

  getLichChieuChiTietHeThong: (movieId, branchId, startDate, startTime, roomId) =>{
    const path = `/schedule/getAll?page=0&size=300&movieId=${movieId}&branchId=${branchId}&startDate=${startDate}&startTime=${startTime}&roomId=${roomId}`;
    // console.log("Lấy chi tiết lịch thành công!");
    return axiosClient.get(path);
  },
  
  postDatVe: (data) => {
    const path = `/bills/create-new-bill`;
    // console.log("Đặt vé thành công!");
    return axiosClient.post(path, data);
  },

  postTaoLichChieu: ({branchId, movieId, price, roomId, startDate, startTime}) => {
    const path = `/schedule/add?movieId=${movieId}&branchId=${branchId}&roomId=${roomId}&startDate=${startDate}&startTime=${startTime}&price=${price}`;
    return axiosClient.post(path);
  },
};

export default bookingApi;
