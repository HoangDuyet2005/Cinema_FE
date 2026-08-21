import {
  GET_LISTSEAT_REQUEST,
  BOOK_TICKET_REQUEST,
  GET_LISTSEAT_SUCCESS,
  GET_LISTSEAT_FAIL,
  CHANGE_LISTSEAT,
  RESET_DATA_BOOKTICKET,
  SET_DATA_PAYMENT,
  SET_READY_PAYMENT,
  TIMEOUT,
  SET_ISMOBILE,
  SET_STEP,
  INIT_DATA,
  RESET_ALERT_OVER10,
  SET_ALERT_OVER10,
  CREATE_SHOWTIME_REQUEST,
  CREATE_SHOWTIME_SUCCESS,
  CREATE_SHOWTIME_FAIL,
  RESET_CREATE_SHOWTIME,
} from "./constants/BookTicket";

const initialState = {
  loadingGetListSeat: false,
  danhSachPhongVe: {},
  errorGetListSeatMessage: null,

  listSeat: [],
  isSelectedSeat: false,
  listSeatSelected: [],
  danhSachVe: [],
  amount: 0,

  // Combo / Thức ăn
  selectedFoods: [],
  foodAmount: 0,

  timeOut: false,
  isMobile: false,
  refreshKey: Date.now(),

  maLichChieu: null,
  taiKhoanNguoiDung: null,
  thongTinPhongVe: {},

  alertOver10: false,

  // payment
  email: "",
  phone: "",
  name: "",
  paymentMethod: "",
  isReadyPayment: false,
  activeStep: 0,

  loadingBookingTicket: false,
  successBookingTicketMessage: null,
  errorBookTicketMessage: null,

  bookingResult: null,
  loadingCreateShowtime: false,
  successCreateShowtime: null,
  errorCreateShowtime: null,
};

const bookTicketReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LISTSEAT_REQUEST: {
      return {
        ...state,
        loadingGetListSeat: true,
        errorGetListSeatMessage: null,
      };
    }
    case GET_LISTSEAT_SUCCESS: {
      return {
        ...state,
        danhSachPhongVe: action.payload.data,
        loadingGetListSeat: false,
      };
    }
    case GET_LISTSEAT_FAIL: {
      return {
        ...state,
        errorGetListSeatMessage: action.payload.error,
        loadingGetListSeat: false,
      };
    }
    case INIT_DATA: {
      return {
        ...state,
        listSeat: action.payload.listSeat,
        maLichChieu: action.payload.maLichChieu,
        taiKhoanNguoiDung: action.payload.taiKhoanNguoiDung,
        email: action.payload.email,
        phone: action.payload.phone,
        thongTinPhongVe: action.payload.thongTinPhongVe,
      };
    }

    case "SYNC_HOLDING_SEATS": {
      const { holdingSeatIds } = action.payload;
      const updatedListSeat = state.listSeat.map((seat) => {
        if (seat.isOccupied === 1) return seat;
        const isHolding = holdingSeatIds && holdingSeatIds.includes(seat.id);
        return {
          ...seat,
          isOccupied: isHolding ? 2 : 0,
          selected: isHolding ? false : seat.selected,
        };
      });

      const updatedListSeatSelected = updatedListSeat
        .filter((seat) => seat.selected)
        .map((seat) => seat.name || seat.label);

      const basePrice = state.thongTinPhongVe?.data?.content[0]?.price || 70000;
      const amount = updatedListSeat
        .filter((seat) => seat.selected)
        .reduce((sum, seat) => {
          const p =
            seat.seatType === "COUPLE" || seat.type === "COUPLE" || seat.type === 2
              ? basePrice + 40000
              : seat.seatType === "VIP" || seat.type === "VIP" || seat.type === 1
              ? basePrice + 15000
              : basePrice;
          return sum + p;
        }, 0);

      const danhSachVe = updatedListSeat
        .filter((seat) => seat.selected)
        .map((seat) => ({ id: seat.id }));

      return {
        ...state,
        listSeat: updatedListSeat,
        listSeatSelected: updatedListSeatSelected,
        isSelectedSeat: updatedListSeatSelected.length > 0,
        amount,
        danhSachVe,
      };
    }

    case "UPDATE_SEAT_REALTIME": {
      const { seatId, isOccupied } = action.payload;
      const updatedListSeat = state.listSeat.map((seat) => {
        if (seat.id === seatId) {
          return {
            ...seat,
            isOccupied: isOccupied,
            selected: isOccupied !== 0 ? false : seat.selected,
          };
        }
        return seat;
      });

      const updatedListSeatSelected = updatedListSeat
        .filter((seat) => seat.selected)
        .map((seat) => seat.name || seat.label);

      const basePrice = state.thongTinPhongVe?.data?.content[0]?.price || 70000;
      const amount = updatedListSeat
        .filter((seat) => seat.selected)
        .reduce((sum, seat) => {
          const p =
            seat.seatType === "COUPLE" || seat.type === "COUPLE" || seat.type === 2
              ? basePrice + 40000
              : seat.seatType === "VIP" || seat.type === "VIP" || seat.type === 1
              ? basePrice + 15000
              : basePrice;
          return sum + p;
        }, 0);

      const danhSachVe = updatedListSeat
        .filter((seat) => seat.selected)
        .map((seat) => ({ id: seat.id }));

      return {
        ...state,
        listSeat: updatedListSeat,
        listSeatSelected: updatedListSeatSelected,
        isSelectedSeat: updatedListSeatSelected.length > 0,
        amount,
        danhSachVe,
      };
    }

    case CHANGE_LISTSEAT: {
      return {
        ...state,
        listSeat: action.payload.listSeat,
        isSelectedSeat: action.payload.isSelectedSeat,
        listSeatSelected: action.payload.listSeatSelected,
        danhSachVe: action.payload.danhSachVe,
        amount: action.payload.amount,
      };
    }

    case "SET_SELECTED_FOODS": {
      const { selectedFoods, foodAmount } = action.payload;
      return {
        ...state,
        selectedFoods: selectedFoods || [],
        foodAmount: foodAmount || 0,
      };
    }

    case RESET_DATA_BOOKTICKET: {
      return {
        ...state,
        danhSachPhongVe: {},
        paymentMethod: "",
        isReadyPayment: false,
        isSelectedSeat: false,
        listSeatSelected: [],
        selectedFoods: [],
        foodAmount: 0,
        timeOut: false,
        activeStep: 0,
        danhSachVe: [],
        successBookingTicketMessage: null,
        errorBookTicketMessage: null,
        refreshKey: Date.now(),
        amount: 0,
        alertOver10: false,
        thongTinPhongVe: {},
      };
    }
    case SET_DATA_PAYMENT: {
      return {
        ...state,
        email: action.payload.email,
        phone: action.payload.phone,
        paymentMethod: action.payload.paymentMethod,
      };
    }
    case SET_READY_PAYMENT: {
      return {
        ...state,
        isReadyPayment: action.payload.isReadyPayment,
      };
    }
    case SET_STEP: {
      return {
        ...state,
        activeStep: action.payload.activeStep,
      };
    }
    case RESET_ALERT_OVER10: {
      return {
        ...state,
        alertOver10: false,
      };
    }
    case SET_ALERT_OVER10: {
      return {
        ...state,
        alertOver10: true,
      };
    }

    case "BOOK_TICKET_REQUEST": {
      return {
        ...state,
        loadingBookingTicket: true,
        errorBookTicketMessage: null,
      };
    }
    case "BOOK_TICKET_SUCCESS": {
      return {
        ...state,
        successBookingTicketMessage: action.payload.data,
        bookingResult: action.payload.bookingResult || null,
        loadingBookingTicket: false,
        activeStep: 3,
      };
    }
    case "BOOK_TICKET_FAIL": {
      return {
        ...state,
        errorBookTicketMessage: action.payload.error,
        loadingBookingTicket: false,
        activeStep: 3,
      };
    }

    case TIMEOUT: {
      return {
        ...state,
        timeOut: true,
      };
    }

    case SET_ISMOBILE: {
      return {
        ...state,
        isMobile: action.payload.isMobile,
      };
    }

    default:
      return state;
  }
};
export default bookTicketReducer;