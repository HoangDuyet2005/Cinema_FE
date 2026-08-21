import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import {
  SET_DATA_PAYMENT,
  SET_READY_PAYMENT,
  SET_STEP,
  CHANGE_LISTSEAT,
} from "../../../reducers/constants/BookTicket";
import bookingApi from "../../../api/bookingApi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const makeObjError = (name, value, dataSubmit) => {
  let newErrors = {
    ...dataSubmit.errors,
    [name]:
      value?.trim() === ""
        ? name.charAt(0).toUpperCase() + name.slice(1) + " not be empty!"
        : "",
  };

  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexNumber = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
  if (name === "email" && value) {
    if (!regexEmail.test(value)) {
      newErrors[name] = "Email không hợp lệ";
    }
  }
  if (name === "phone" && value) {
    if (!regexNumber.test(value)) {
      newErrors[name] = "Số điện thoại không hợp lệ";
    }
  }
  return newErrors;
};

export default function PayMent() {
  const {
    listSeat,
    amount,
    email,
    phone,
    name,
    isReadyPayment,
    isMobile,
    danhSachVe,
    danhSachPhongVe: { thongTinPhim },
    maLichChieu,
    taiKhoanNguoiDung,
    isSelectedSeat,
    listSeatSelected,
    thongTinPhongVe,
    activeStep,
  } = useSelector((state) => state.bookTicketReducer);

  const { currentUser } = useSelector((state) => state.authReducer);
  const currentUserId = currentUser?.data?.id || currentUser?.id || 1;

  const dispatch = useDispatch();
  const emailRef = useRef();
  const phoneRef = useRef();
  let variClear = useRef("");
  const [dataFocus, setDataFocus] = useState({ phone: false, email: false, name: false });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");

  const [thongTin, setThongTin] = useState();
  const param = useParams();

  useEffect(() => {
    bookingApi
      .getScheduleById(param.maLichChieu)
      .then((response) => {
        if (response?.data?.data) {
          setThongTin({ data: { content: [response.data.data] } });
        }
      })
      .catch(() => {
        if (param.maPhim && param.maRap && param.ngayChieu && param.gioChieu && param.maPhong) {
          bookingApi
            .getLichChieuChiTietHeThong(param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong)
            .then((response) => {
              setThongTin(response.data);
            })
            .catch(() => {});
        }
      });
  }, [param.maLichChieu, param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong]);

  const scheduleInfo = thongTin?.data?.content?.[0] || thongTinPhongVe?.data?.content?.[0];

  const finalAmount = Math.max(0, amount - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      Swal.fire("Thông báo", "Vui lòng nhập mã giảm giá", "info");
      return;
    }
    if (code === "CINEMA10" || code === "WORLD10" || code === "DISCOUNT10") {
      const discount = Math.round(amount * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo(code);
      Swal.fire("Thành công", `Áp dụng mã ${code} thành công! Giảm 10% (-${discount.toLocaleString("vi-VN")} đ)`, "success");
    } else if (code === "CINEMA20" || code === "GIAM20K" || code === "CGV2026") {
      const discount = Math.min(amount, 20000);
      setDiscountAmount(discount);
      setAppliedPromo(code);
      Swal.fire("Thành công", `Áp dụng mã ${code} thành công! Giảm 20.000 đ`, "success");
    } else {
      Swal.fire("Mã không hợp lệ", "Mã giảm giá không chính xác hoặc đã hết hạn.", "error");
    }
  };

  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setAppliedPromo("");
    setPromoCode("");
  };

  const [dataSubmit, setdataSubmit] = useState({
    values: {
      email: email || currentUser?.email || "theduyet@gmail.com",
      phone: phone || "0376621299",
      name: name || currentUser?.name || "Hoàng Thế Duyệt",
      paymentMethod: "VNPay",
      thongTinPhongVe: thongTinPhongVe,
    },
    errors: {
      email: "",
      phone: "",
      name: "",
    },
  });

  const classes = useStyles({
    isSelectedSeat,
    isReadyPayment,
    isMobile,
    dataFocus,
    dataSubmit,
  });

  const onChange = (e) => {
    let { name, value } = e.target;
    let newValues = { ...dataSubmit.values, [name]: value };
    let newErrors = makeObjError(name, value, dataSubmit);
    setdataSubmit((prev) => ({
      ...prev,
      values: newValues,
      errors: newErrors,
    }));
  };

  useEffect(() => {
    clearTimeout(variClear.current);
    variClear.current = setTimeout(() => {
      dispatch({
        type: SET_DATA_PAYMENT,
        payload: {
          email: dataSubmit.values.email,
          phone: dataSubmit.values.phone,
          name: dataSubmit.values.name,
          paymentMethod: dataSubmit.values.paymentMethod,
        },
      });

      if (
        !dataSubmit.errors.email &&
        dataSubmit.values.email &&
        isSelectedSeat &&
        listSeatSelected &&
        listSeatSelected.length > 0
      ) {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: true },
        });
      } else {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: false },
        });
      }
    }, 400);
  }, [dataSubmit, isSelectedSeat, listSeatSelected, dispatch]);

  useEffect(() => {
    setdataSubmit((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        email: email || prev.values.email,
        phone: phone || prev.values.phone,
        name: name || prev.values.name,
      },
    }));
  }, [listSeat, email, phone, name]);

  const handleNextStep = async () => {
    if (!isSelectedSeat || !listSeatSelected || listSeatSelected.length === 0) {
      Swal.fire({
        title: "Vui lòng chọn ghế!",
        text: "Bạn cần chọn ít nhất 1 ghế trên sơ đồ trước khi tiếp tục.",
        icon: "warning",
        confirmButtonColor: "#f26b38",
      });
      return;
    }
    if (!dataSubmit.values.email || dataSubmit.errors.email) {
      Swal.fire({
        title: "Email nhận vé không hợp lệ!",
        text: "Vui lòng nhập chính xác email để nhận thông tin vé.",
        icon: "warning",
        confirmButtonColor: "#f26b38",
      });
      return;
    }

    try {
      const selectedSeatIds = listSeat.filter((s) => s.selected).map((s) => s.id);
      const res = await bookingApi.holdSeats({
        scheduleId: Number(param.maLichChieu),
        seatIds: selectedSeatIds,
        userId: Number(currentUserId),
      });

      if (res?.data?.success) {
        window.history.pushState({ step: 1 }, "");
        dispatch({ type: SET_STEP, payload: { activeStep: 1 } });
      }
    } catch (err) {
      console.error("Hold seats error:", err);
      const conflictSeats = err.response?.data?.conflictSeats || [];
      const msg = conflictSeats.length > 0
        ? `Ghế ${conflictSeats.join(", ")} đã có người chuyển sang trang thanh toán trước và bị khóa. Vui lòng chọn ghế khác.`
        : (err.response?.data?.message || "Ghế đã có người đặt trước! Vui lòng chọn lại ghế khác.");

      Swal.fire({
        title: "Ghế đã có người đặt trước!",
        text: msg,
        icon: "error",
        confirmButtonColor: "#f26b38",
      });

      bookingApi.getDanhSachPhongVe(param.maLichChieu).then((response) => {
        if (response?.data?.data) {
          const serverSeats = response.data.data;
          const updatedListSeat = listSeat.map((seat) => {
            const matching = serverSeats.find((s) => s.id === seat.id);
            const isOcc = matching ? matching.isOccupied : seat.isOccupied;
            return {
              ...seat,
              isOccupied: isOcc,
              selected: isOcc !== 0 ? false : seat.selected,
            };
          });
          const newSelected = updatedListSeat.filter((s) => s.selected).map((s) => s.name || s.label);
          const danhSachVe = updatedListSeat.filter((s) => s.selected).map((s) => ({ id: s.id }));
          const basePrice = scheduleInfo?.price || 95000;
          const amount = updatedListSeat.filter((s) => s.selected).reduce((sum, s) => {
            const p = (s.seatType === "VIP" || s.type === "VIP") ? basePrice + 10000 : basePrice;
            return sum + p;
          }, 0);

          dispatch({
            type: CHANGE_LISTSEAT,
            payload: {
              listSeat: updatedListSeat,
              isSelectedSeat: newSelected.length > 0,
              listSeatSelected: newSelected,
              danhSachVe,
              amount,
            },
          });
        }
      });
    }
  };

  // Lắng nghe sự kiện bấm nút Quay lại trên Trình duyệt (Browser Back Button)
  useEffect(() => {
    const handlePopState = () => {
      if (activeStep === 1) {
        const selectedSeatIds = listSeat.filter((s) => s.selected).map((s) => s.id);
        bookingApi.releaseSeats({
          scheduleId: Number(param.maLichChieu),
          seatIds: selectedSeatIds,
          userId: Number(currentUserId),
        }).catch(() => {});

        dispatch({ type: SET_STEP, payload: { activeStep: 0 } });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeStep, listSeat, param.maLichChieu, currentUserId, dispatch]);

  // Giải phóng ghế khi tắt tab hoặc thoát trình duyệt
  useEffect(() => {
    const handleUnload = () => {
      if (activeStep === 1) {
        const selectedSeatIds = listSeat.filter((s) => s.selected).map((s) => s.id);
        const data = JSON.stringify({
          scheduleId: Number(param.maLichChieu),
          seatIds: selectedSeatIds,
          userId: Number(currentUserId),
        });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("http://localhost:8080/api/seats/release-seats", new Blob([data], { type: "application/json" }));
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [activeStep, listSeat, param.maLichChieu, currentUserId]);

  const handlePrevStep = () => {
    const selectedSeatIds = listSeat.filter((s) => s.selected).map((s) => s.id);
    bookingApi.releaseSeats({
      scheduleId: Number(param.maLichChieu),
      seatIds: selectedSeatIds,
      userId: Number(currentUserId),
    }).catch(() => {});

    dispatch({ type: SET_STEP, payload: { activeStep: 0 } });
    if (window.history.state && window.history.state.step === 1) {
      window.history.back();
    }
  };

  const handleBookTicket = () => {
    if (!agreeTerms) {
      Swal.fire({
        title: "Chưa đồng ý điều khoản!",
        text: "Vui lòng tích chọn đồng ý với điều khoản sử dụng trước khi tiếp tục.",
        icon: "warning",
        confirmButtonText: "Đồng ý",
        confirmButtonColor: "#f26b38",
      });
      return;
    }

    if (!isSelectedSeat || !listSeatSelected || listSeatSelected.length === 0) {
      Swal.fire({
        title: "Vui lòng chọn ghế!",
        text: "Bạn chưa chọn ghế nào để thực hiện đặt vé.",
        icon: "warning",
        confirmButtonColor: "#f26b38",
      });
      return;
    }

    const currentMethod = dataSubmit.values.paymentMethod || "VNPay";

    Swal.fire({
      title: "Xác nhận thanh toán",
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.7; padding: 5px;">
          <p><b>Phim:</b> ${scheduleInfo?.movie?.name || "Phim"}</p>
          <p><b>Rạp:</b> ${scheduleInfo?.branch?.name || "Rạp"}</p>
          <p><b>Ghế chọn:</b> ${listSeatSelected?.join(", ")}</p>
          <p><b>Tổng tiền:</b> <span style="color: #f26b38; font-weight: bold; font-size: 16px;">${finalAmount.toLocaleString("vi-VN")} đ</span> ${discountAmount > 0 ? `<small style="color: #16a34a;">(Đã giảm ${discountAmount.toLocaleString("vi-VN")} đ)</small>` : ""}</p>
          <p><b>Hình thức:</b> ${currentMethod}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Thanh toán ngay",
      cancelButtonText: "Quay lại",
      confirmButtonColor: "#f26b38",
      cancelButtonColor: "#94a3b8",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const listSeatIds = listSeat.filter((s) => s.selected).map((s) => s.id);
          const bookingInfo = `PAY_${currentUserId}_${param.maLichChieu}_${listSeatIds.join("-")}`;
          
          const paymentRes = await bookingApi.createPaymentUrl(finalAmount, bookingInfo);
          const paymentUrl = paymentRes?.data?.url;

          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            throw new Error("Không nhận được URL chuyển tiếp từ cổng thanh toán.");
          }
        } catch (error) {
          console.error("Payment error:", error);
          const errMsg =
            error.response?.data?.message ||
            error.message ||
            "Lỗi không xác định khi kết nối cổng thanh toán";

          if (
            errMsg.includes("BOOKING_SEAT_EXIST") ||
            errMsg.includes("đã có người đặt") ||
            errMsg.includes("SEAT")
          ) {
            Swal.fire({
              title: "Ghế đã được đặt!",
              text: "Ghế bạn chọn đã được người khác đặt thành công. Vui lòng chọn ghế khác.",
              icon: "error",
              confirmButtonColor: "#f26b38",
            });
          } else {
            Swal.fire({
              title: "Lỗi thanh toán!",
              text: errMsg,
              icon: "error",
              confirmButtonColor: "#f26b38",
            });
          }
        }
      }
    });
  };

  const onFocus = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: true });
  };
  const onBlur = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: false });
  };

  return (
    <aside className={classes.payMent}>
      <div>
        <div className={`${classes.amount} ${classes.payMentItem}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span>{`${finalAmount.toLocaleString("vi-VN")} đ`}</span>
          {discountAmount > 0 && (
            <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 500, marginTop: "2px" }}>
              (Đã giảm: -{discountAmount.toLocaleString("vi-VN")} đ)
            </span>
          )}
        </div>

        {/* THÔNG TIN PHIM VÀ SUẤT CHIẾU */}
        <div className={classes.payMentItem}>
          <p className={classes.tenPhim}>{scheduleInfo?.movie?.name || "Attack On Titan: The Last Attack"}</p>
          <p style={{ fontWeight: 600, color: "#475569", margin: "2px 0 6px 0" }}>
            {scheduleInfo?.branch?.name || "WORLD CINEMA Hà Đông"}
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Phòng:</p>
            <span>{scheduleInfo?.room?.name || "Phòng 202"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Ngày chiếu:</p>
            <span>{scheduleInfo?.startDate ? formatDate(scheduleInfo.startDate).dateFull : "Hôm nay, 21 tháng 08, 2026"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Giờ chiếu:</p>
            <span>{scheduleInfo?.startTime || "10:45:00"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Thời lượng:</p>
            <span>{scheduleInfo?.movie?.duration || 145} Phút</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Thể loại: </p>
            <span>{scheduleInfo?.movie?.categories || "Hoạt Hình"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Ngôn ngữ: </p>
            <span>{scheduleInfo?.movie?.language || "Tiếng Nhật - Phụ đề Tiếng Việt"}</span>
          </div>
        </div>

        {/* GHẾ ĐÃ CHỌN */}
        <div className={`${classes.seatInfo} ${classes.payMentItem}`}>
          <span>{`Ghế: ${listSeatSelected && listSeatSelected.length > 0 ? listSeatSelected.join(", ") : "Chưa chọn"}`}</span>
          <p className={classes.amountLittle}>
            {`${amount.toLocaleString("vi-VN")} đ`}
          </p>
        </div>

        {/* EMAIL NHẬN VÉ */}
        <div className={classes.payMentItem}>
          <label className={classes.labelEmail}>E-Mail nhận vé</label>
          <input
            type="text"
            name="email"
            ref={emailRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.email}
            className={classes.fillInEmail}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.email}</p>
        </div>

        {/* PHƯƠNG THỨC THANH TOÁN (KHI Ở BƯỚC 1) */}
        {activeStep === 1 && (
          <div style={{ marginTop: "15px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#333", marginBottom: "6px", display: "block" }}>
                Mã giảm giá / Voucher
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Nhập mã (VD: CINEMA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "13px",
                    textTransform: "uppercase",
                    outline: "none"
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  style={{
                    backgroundColor: "#f26b38",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Áp dụng
                </button>
              </div>
              {appliedPromo && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#16a34a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>✓ Đã áp dụng mã: <b>{appliedPromo}</b> (-{discountAmount.toLocaleString("vi-VN")} đ)</span>
                  <span style={{ color: "#ef4444", cursor: "pointer", textDecoration: "underline" }} onClick={handleRemovePromo}>
                    Gỡ bỏ
                  </span>
                </div>
              )}
            </div>

            <div className={classes.selectedPayMentMethod}>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "#333", marginBottom: "8px", display: "block" }}>
                Phương thức thanh toán trực tuyến
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: dataSubmit.values.paymentMethod === "VNPay" ? "1.5px solid #f26b38" : "1px solid #e2e8f0",
                  backgroundColor: dataSubmit.values.paymentMethod === "VNPay" ? "#fff7ed" : "#fff",
                  cursor: "pointer",
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPay"
                    onChange={onChange}
                    checked={dataSubmit.values.paymentMethod === "VNPay"}
                    style={{ marginRight: "10px", accentColor: "#f26b38" }}
                  />
                  <img
                    src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo.svg"
                    alt="VNPay"
                    style={{ width: "65px", height: "auto", marginRight: "12px" }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
                    VNPay (Thẻ ATM nội địa / Quét mã QR)
                  </span>
                </label>
              </div>
            </div>

            <div style={{ padding: "14px 0 6px 0", display: "flex", alignItems: "flex-start", fontSize: "12px", color: "#64748b" }}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginRight: "8px", marginTop: "2px", cursor: "pointer", accentColor: "#f26b38" }}
              />
              <label htmlFor="agreeTerms" style={{ cursor: "pointer", lineHeight: "1.4" }}>
                Tôi đồng ý với <b>điều khoản sử dụng</b> và xác nhận mua vé cho người xem có độ tuổi phù hợp theo quy định.
              </label>
            </div>
          </div>
        )}

        {/* NÚT ĐIỀU HƯỚNG TƯƠNG ỨNG TỪNG BƯỚC */}
        <div className={classes.bottomSection}>
          {activeStep === 0 && (
            <button
              className={classes.btnDatVe}
              disabled={!isReadyPayment}
              onClick={handleNextStep}
              style={{
                backgroundColor: isReadyPayment ? "#f26b38" : "#afafaf",
                backgroundImage: "none",
                boxShadow: isReadyPayment ? "0 4px 12px rgba(242, 107, 56, 0.4)" : "none",
              }}
            >
              <p className={classes.txtDatVe}>TIẾP TỤC THANH TOÁN</p>
            </button>
          )}

          {activeStep === 1 && (
            <div style={{ display: "flex", position: "fixed", bottom: 0, right: 0, width: "25%", height: 60 }}>
              <button
                onClick={handlePrevStep}
                style={{
                  width: "35%",
                  border: "none",
                  backgroundColor: "#64748b",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                QUAY LẠI
              </button>
              <button
                disabled={!isReadyPayment}
                onClick={handleBookTicket}
                style={{
                  width: "65%",
                  border: "none",
                  backgroundColor: "#f26b38",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(242, 107, 56, 0.4)"
                }}
              >
                PAYMENT (THANH TOÁN)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={classes.notice} />
    </aside>
  );
}