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
    activeStep,
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

  // 1. Kiểm tra nếu chuyển hướng từ VNPay về bước Xác Nhận
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

  // 2. Lấy thông tin lịch chiếu thực tế từ Database
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

  // 3. Tải danh sách ghế & dọn sạch ghế giữ cũ khi vào lại trang bước 0
  useEffect(() => {
    if (param?.maLichChieu) {
      const uid = cUser?.id || currentUser?.id || 1;
      const searchParams = new URLSearchParams(location.search);

      // Nếu không phải là bước confirm -> tự động giải phóng các ghế giữ cũ của user này
      if (searchParams.get("step") !== "confirm") {
        bookingApi
          .releaseSeats({
            scheduleId: Number(param.maLichChieu),
            seatIds: [],
            userId: Number(uid),
          })
          .catch(() => {});
      }

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

  // 4. BẮT SỰ KIỆN TẮT TAB / TẢI LẠI TRANG / THOÁT ĐỘT NGỘT BẰNG SEND BEACON
  useEffect(() => {
    const handleEmergencyRelease = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("step") !== "confirm" && param?.maLichChieu) {
        const uid = cUser?.id || currentUser?.id || 1;
        const payload = JSON.stringify({
          scheduleId: Number(param.maLichChieu),
          seatIds: [],
          userId: Number(uid),
        });
        const blob = new Blob([payload], { type: "application/json" });

        if (navigator.sendBeacon) {
          navigator.sendBeacon("http://localhost:8080/api/seats/release-seats", blob);
        }
      }
    };

    window.addEventListener("beforeunload", handleEmergencyRelease);
    window.addEventListener("pagehide", handleEmergencyRelease);

    return () => {
      window.removeEventListener("beforeunload", handleEmergencyRelease);
      window.removeEventListener("pagehide", handleEmergencyRelease);
    };
  }, [param?.maLichChieu, cUser, currentUser]);

  useEffect(() => {
    let initCode = 64;
    const danhSachGheEdit = seat?.map((s, i) => {
      if (i % 16 === 0) initCode++;
      const txt = String.fromCharCode(initCode);
      const number = ((i % 16) + 1).toString().padStart(2, "0");
      return { ...s, label: s.name || txt + number, selected: false };
    });

    const movieObj = scheduleData?.movie || null;
    const branchObj = scheduleData?.branch || null;
    const roomObj = scheduleData?.room || null;
    const startDateVal = scheduleData?.startDate || param?.ngayChieu || "";
    const startTimeVal = scheduleData?.startTime || param?.gioChieu || "";
    const priceVal = scheduleData?.price || 0;

    dispatch({
      type: INIT_DATA,
      payload: {
        listSeat: danhSachGheEdit,
        maLichChieu: param?.maLichChieu,
        hoTen: cUser?.name || currentUser?.name || "Khách hàng",
        taiKhoanNguoiDung: cUser?.id || currentUser?.id || 1,
        email: cUser?.email || currentUser?.email || "",
        phone: cUser?.phone || "",
        name: cUser?.name || currentUser?.name || "Khách hàng",
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