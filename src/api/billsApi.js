import axiosClient from "./axiosClient";

const reviewsApi = {

  getBillDashBoard: (fromDate, toDate, branchId = 0, movieId = 0) => {
    const path = `/bills/getBillDashBoard?fromDate=${fromDate}&toDate=${toDate}&branchId=${branchId}&movieId=${movieId}&status=SUCCESS`;
    return axiosClient.get(path);
  },

  getBillDashBoardSortAZ: (fromDate, toDate, branchId = 0, movieId = 0) => {
    const path = `/bills/getUserDashBoard?status=SUCCESS&fromDate=${fromDate}&toDate=${toDate}&branchId=${branchId}&movieId=${movieId}`;
    return axiosClient.get(path);
  },

  getBillSideBySide: (fromDate, toDate, branchId = 0, movieId = 0) => {
    const path = `/bills/getBillDashBoard?fromDate=${fromDate}&toDate=${toDate}&branchId=${branchId}&movieId=${movieId}&status=SUCCESS`;
    return axiosClient.get(path);
  },

  getTicketSalePerDay: (fromDate, toDate, branchId = 0, movieId = 0) => {
    const path = `/bills/getBillDashBoard?fromDate=${fromDate}&toDate=${toDate}&branchId=${branchId}&movieId=${movieId}&status=SUCCESS`;
    return axiosClient.get(path);
  },

  getBillPieChart: (fromDate, toDate, branchId = 0, movieId = 0) => {
    const path = `/bills/getBillDashBoard?fromDate=${fromDate}&toDate=${toDate}&branchId=${branchId}&movieId=${movieId}&status=SUCCESS`;
    return axiosClient.get(path);
  },

  postThanhToan: (id) => {
    const path = `/bills/payment?id=${id}`;
    return axiosClient.post(path);
  },
  // fix
  getListBill: () => {
    const path = `/bills/getAllBill?status=WAITING_PAYMENT`;
    return axiosClient.get(path);
  },

  getListBillCuaStaff: () => {
    const path = `/bills/getAllBill`;
    return axiosClient.get(path);
  },

  //Sửa lại cho profile
  getListBillChuaThanhToanBoiUser: (id) => {
    const path = `/bills/getAllBill?userId=${id}`;
    return axiosClient.get(path);
  },

  getListBillDaThanhToan: () => {
    const path = `/bills/getUserDashBoard?status=SUCCESS`;
    return axiosClient.get(path);
  },

  getListBillUserId: (id) => {
    const path = `/bills/getUserDashBoard?status=SUCCESS&userId=${id}`;
    return axiosClient.get(path);
  },

  postAddReview: (event) => {
    const path = "/";
    return axiosClient.post(path, event);
  },

  getThongTinCuaBill: (billId) => {
    const path = `/bills/${billId}`;
    return axiosClient.get(path);
  },

  postHuyBill: (billId) => {
    const path = `/bills/delete?billId=${billId}`;
    return axiosClient.post(path);
  },

  deleteBill: (eventId) => {
    const path = `/`;
    return axiosClient.put(path);
  },

  putEditReview: (event) => {
    const path = `/`;
    return axiosClient.put(path, event);
  },

  putDuyetReview: (eventId) => {
    const path = `/`;
    return axiosClient.put(path);
  },

  putTuChoiReview: (eventId) => {
    const path = `/`;
    return axiosClient.put(path);
  },

  getBillByID: (id) => {
    const path = `/bills/${id}`;
    return axiosClient.get(path);
  },

  checkTicket: (code) => {
    const path = `/bills/check-ticket?code=${encodeURIComponent(code)}`;
    return axiosClient.get(path);
  },

  confirmCheckIn: (billId) => {
    const path = `/bills/check-in?billId=${billId}`;
    return axiosClient.post(path);
  },
};

export default reviewsApi;