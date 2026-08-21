import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Desktop from "./Desktop";
import Mobile from "./Mobile";
import Modal from "./Modal";
import Header from "../../layouts/MainLayout/Header";
import Footer from "../../components/Footer/Footer";
import { DISPLAY_MOBILE_BOOKTICKET } from "../../constants/config";
import usersApi from "../../api/usersApi";
import bookingApi from "../../api/bookingApi";
import billsApi from "../../api/billsApi";
import {
  GET_LISTSEAT_SUCCESS,
  INIT_DATA,
  RESET_DATA_BOOKTICKET,
  SET_ISMOBILE,
} from "../../reducers/constants/BookTicket";

export default function BookTicketsDetail() {
  const { isLazy } = useSelector((state) => state.lazyReducer);
  const {
    loadingGetListSeat,
    refreshKey,
    timeOut,
    isMobile,
    errorGetListSeatMessage,
  } = useSelector((state) => state.bookTicketReducer);
  const { currentUser } = useSelector((state) => state.authReducer);

  const param = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const mediaQuery = useMediaQuery(DISPLAY_MOBILE_BOOKTICKET);
  const loading = isLazy || loadingGetListSeat;

  const [cUser, setCUser] = useState();
  const [scheduleData, setScheduleData] = useState(null);
  const [seat, setSeat] = useState([]);

  // Kiểm tra nếu chuyển hướng từ VNPay về bước Xác Nhận
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const stepParam = searchParams.get("step");
    const billIdParam = searchParams.get("billId");

    if (stepParam === "confirm" || searchParams.get("vnp_ResponseCode") === "00") {
      dispatch({ type: "SET_STEP", payload: { activeStep: 3 } });
      if (billIdParam) {
        billsApi
          .getBillByID(billIdParam)
          .then((res) => {
            if (res.data) {
              dispatch({
                type: "BOOK_TICKET_SUCCESS",
                payload: {
                  data: "Đặt vé thành công!",
                  bookingResult: res.data,
                },
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    usersApi
      .getThongTinTaiKhoan()
      .then((response) => {
        setCUser(response?.data?.data || response?.data);
      })
      .catch(() => {});
  }, []);

  // Lấy thông tin lịch chiếu đầy đủ theo mã lịch chiếu
  useEffect(() => {
    if (param?.maLichChieu) {
      bookingApi
        .getScheduleById(param.maLichChieu)
        .then((response) => {
          if (response?.data?.data) {
            setScheduleData(response.data.data);
          }
        })
        .catch(() => {
          if (
            param?.maPhim &&
            param?.maRap &&
            param?.ngayChieu &&
            param?.gioChieu &&
            param?.maPhong
          ) {
            bookingApi
              .getLichChieuChiTietHeThong(
                param.maPhim,
                param.maRap,
                param.ngayChieu,
                param.gioChieu,
                param.maPhong
              )
              .then((res) => {
                const content =
                  res?.data?.data?.content?.[0] || res?.data?.content?.[0];
                if (content) setScheduleData(content);
              })
              .catch(() => {});
          }
        });
    }
  }, [
    param?.maLichChieu,
    param?.maPhim,
    param?.maRap,
    param?.ngayChieu,
    param?.gioChieu,
    param?.maPhong,
  ]);

  // Lấy danh sách ghế của lịch chiếu
  useEffect(() => {
    if (param?.maLichChieu) {
      bookingApi
        .getDanhSachPhongVe(param.maLichChieu)
        .then((response) => {
          setSeat(response?.data?.data || []);
          dispatch({
            type: GET_LISTSEAT_SUCCESS,
            payload: { data: response?.data?.data || [] },
          });
        })
        .catch(() => {});
    }

    return () => {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("step") !== "confirm") {
        const uid = cUser?.id || currentUser?.id || 1;
        bookingApi
          .releaseSeats({
            scheduleId: Number(param?.maLichChieu),
            seatIds: [],
            userId: Number(uid),
          })
          .catch(() => {});
        dispatch({ type: RESET_DATA_BOOKTICKET });
      }
    };
  }, [param?.maLichChieu, cUser, currentUser, location.search, dispatch]);

  useEffect(() => {
    let initCode = 64;
    const danhSachGheEdit = seat?.map((s, i) => {
      if (i % 16 === 0) initCode++;
      const txt = String.fromCharCode(initCode);
      const number = ((i % 16) + 1).toString().padStart(2, "0");
      return { ...s, label: s.name || txt + number, selected: false };
    });

    const movieObj = scheduleData?.movie || {
      name: "Attack on Titan: The Last Attack",
      smallImageURl: "/img/movies/attack-on-titan-2_1785484162552.jpg",
      duration: 145,
      categories: "Hoạt Hình",
      rated: "T16",
    };

    const branchObj = scheduleData?.branch || { name: "WORLD CINEMA Hà Đông" };
    const roomObj = scheduleData?.room || { name: "Phòng 202" };
    const startDateVal =
      scheduleData?.startDate || param?.ngayChieu || "2026-08-21";
    const startTimeVal =
      scheduleData?.startTime || param?.gioChieu || "10:45:00";
    const priceVal = scheduleData?.price || 95000;

    dispatch({
      type: INIT_DATA,
      payload: {
        listSeat: danhSachGheEdit,
        maLichChieu: param?.maLichChieu,
        hoTen: cUser?.name || currentUser?.name || "Hoàng Thế Duyệt",
        taiKhoanNguoiDung: cUser?.id || currentUser?.id || "2",
        email: cUser?.email || currentUser?.email || "theduyet@gmail.com",
        phone: cUser?.phone || "0376621299",
        name: cUser?.name || currentUser?.name || "Hoàng Thế Duyệt",
        thongTinPhongVe: {
          data: {
            content: [
              {
                movie: movieObj,
                branch: branchObj,
                room: roomObj,
                startDate: startDateVal,
                startTime: startTimeVal,
                price: priceVal,
              },
            ],
          },
        },
      },
    });
  }, [seat, cUser, currentUser, scheduleData, param, timeOut, dispatch]);

  useEffect(() => {
    dispatch({ type: SET_ISMOBILE, payload: { isMobile: mediaQuery } });
  }, [mediaQuery, dispatch]);

  if (errorGetListSeatMessage) {
    return <div>{errorGetListSeatMessage}</div>;
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* 1. Header có sẵn của hệ thống */}
      <Header />

      {/* 2. Phần Body đặt vé chi tiết */}
      <div style={{ maxWidth: "1280px", margin: "20px auto 40px auto", padding: "0 16px" }}>
        {isMobile ? (
          <Mobile key={refreshKey} />
        ) : (
          <Desktop key={refreshKey + 1} />
        )}
      </div>

      {/* 3. Footer có sẵn của hệ thống */}
      <Footer />

      <Modal />
    </div>
  );
}