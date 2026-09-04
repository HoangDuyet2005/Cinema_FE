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

  getSchedules: (params) => {
    const path = `/schedule`;
    return axiosClient.get(path, { params });
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

  // Không còn gửi "amount" cho BE nữa - số tiền do BE tự tính lại từ scheduleId/listSeatIds/foods
  // (đặt vé lần đầu) hoặc từ billId (thanh toán lại hóa đơn đã tồn tại), tránh bị sửa giá ở client.
  createPaymentUrl: ({ bookingInfo, billId, scheduleId, listSeatIds, foods }) => {
    const params = new URLSearchParams();
    params.append("bookingInfo", bookingInfo);
    if (billId != null) params.append("billId", billId);
    if (scheduleId != null) params.append("scheduleId", scheduleId);
    (listSeatIds || []).forEach((id) => params.append("listSeatIds", id));
    (foods || []).forEach((f) => {
      params.append("foodIds", f.foodId);
      params.append("foodQuantities", f.quantity);
    });
    return axiosClient.get(`/payment/create_payment?${params.toString()}`);
  },

  // Xác minh chữ ký VNPay của các tham số trả về trước khi coi giao dịch là thành công
  verifyPaymentReturn: (searchParams) => {
    return axiosClient.get(`/payment/verify-return?${searchParams.toString()}`);
  },

  postTaoLichChieu: (data) => {
    return axiosClient.post("/schedule/add", null, { params: data });
  },
};

export default bookingApi;