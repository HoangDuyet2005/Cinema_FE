import axiosClient from "./axiosClient";

const bookingApi = {
  getDanhSachPhongVe: (maLichChieu) => {
    const path = `/seats?scheduleId=${maLichChieu}`;
    return axiosClient.get(path);
  },

  getScheduleById: (id) => {
    const path = `/schedule/${id}`;
    return axiosClient.get(path);
  },

  getConcessions: () => {
    const path = `/concessions`;
    return axiosClient.get(path);
  },

  holdSeats: (data) => {
    const path = `/seats/hold-seats`;
    return axiosClient.post(path, data);
  },

  releaseSeats: (data) => {
    const path = `/seats/release-seats`;
    return axiosClient.post(path, data);
  },

  getLichChieuChiTietHeThong: (movieId, branchId, startDate, startTime, roomId) => {
    const path = `/schedule/getAll?page=0&size=300&movieId=${movieId}&branchId=${branchId}&startDate=${startDate}&startTime=${startTime}&roomId=${roomId}`;
    return axiosClient.get(path);
  },
  
  postDatVe: (data) => {
    const path = `/bills/create-new-bill`;
    return axiosClient.post(path, data);
  },

  createPaymentUrl: (amount, bookingInfo) => {
    const path = `/payment/create_payment?amount=${amount}&bookingInfo=${bookingInfo}`;
    return axiosClient.get(path);
  },

  postTaoLichChieu: (data) => {
    return axiosClient.post("/schedule/add", null, { params: data });
  },
};

export default bookingApi;