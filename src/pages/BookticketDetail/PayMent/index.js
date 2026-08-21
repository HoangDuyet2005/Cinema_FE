import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import bookingApi from "../../../api/bookingApi";
import billsApi from "../../../api/billsApi";
import formatDate from "../../../utilities/formatDate";
import Countdown from "../Countdown";
import { GET_LISTSEAT_SUCCESS } from "../../../reducers/constants/BookTicket";

export default function PayMent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const param = useParams();

  const {
    activeStep,
    listSeat,
    listSeatSelected,
    amount,
    selectedFoods,
    foodAmount,
    bookingResult,
  } = useSelector((state) => state.bookTicketReducer);

  const currentUser = useSelector((state) => state.authReducer.currentUser);
  const currentUserId = currentUser?.data?.id || currentUser?.id || 1;

  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billDetail, setBillDetail] = useState(null);

  // 1. Tải thông tin suất chiếu
  useEffect(() => {
    bookingApi
      .getScheduleById(param.maLichChieu)
      .then((res) => {
        if (res.data?.data) {
          setScheduleInfo(res.data.data);
        }
      })
      .catch((err) => console.log("Lỗi tải chi tiết thanh toán:", err));
  }, [param.maLichChieu]);

  // 2. Nếu có bookingResult hoặc billId ở bước xác nhận, tải lại chi tiết từ Database
  useEffect(() => {
    const bId = bookingResult?.id || bookingResult?.billId;
    if (bId) {
      billsApi
        .getBillByID(bId)
        .then((res) => {
          if (res.data) {
            setBillDetail(res.data);
          }
        })
        .catch(() => {});
    }
  }, [bookingResult]);

  // Điều hướng các bước
  const handlePrevStep = () => {
    if (activeStep === 0) {
      history.goBack();
    } else {
      // Khi quay lại bước 0 (Chọn ghế), giải phóng ghế đã giữ trên server ngay lập tức
      if (activeStep === 1) {
        bookingApi
          .releaseSeats({
            scheduleId: Number(param.maLichChieu),
            seatIds: [],
            userId: Number(currentUserId),
          })
          .catch(() => {});
      }
      dispatch({ type: "SET_STEP", payload: { activeStep: activeStep - 1 } });
    }
  };

  // Chuyển bước & Kiểm tra khóa ghế Realtime chống chọn trùng ghế
  const handleNextStep = () => {
    if (activeStep === 0) {
      const selectedSeatIds = (listSeat || [])
        .filter((s) => s.selected)
        .map((s) => s.id);

      if (selectedSeatIds.length === 0) {
        Swal.fire({
          title: "Chưa chọn ghế",
          text: "Vui lòng chọn ít nhất 1 ghế để tiếp tục!",
          icon: "warning",
          confirmButtonColor: "#ea580c",
        });
        return;
      }

      setIsProcessing(true);

      // Gọi API Khóa ghế (Hold Seats) trên Server
      bookingApi
        .holdSeats({
          scheduleId: Number(param.maLichChieu),
          seatIds: selectedSeatIds,
          userId: Number(currentUserId),
        })
        .then(() => {
          // Khóa thành công -> Chuyển sang bước 1: Chọn thức ăn
          dispatch({ type: "SET_STEP", payload: { activeStep: 1 } });
        })
        .catch((err) => {
          console.error("Lỗi khóa ghế:", err);
          const conflictSeats = err.response?.data?.conflictSeats || [];
          const conflictStr =
            conflictSeats.length > 0 ? conflictSeats.join(", ") : "bạn chọn";

          Swal.fire({
            title: "Ghế đã có người chọn!",
            text: `Ghế [${conflictStr}] vừa có người khác giữ chỗ hoặc đang thanh toán. Vui lòng chọn ghế khác!`,
            icon: "error",
            confirmButtonColor: "#ea580c",
          });

          // Tải lại sơ đồ ghế mới nhất từ DB
          bookingApi
            .getDanhSachPhongVe(param.maLichChieu)
            .then((res) => {
              if (res.data?.data) {
                dispatch({
                  type: GET_LISTSEAT_SUCCESS,
                  payload: { data: res.data.data },
                });
              }
            })
            .catch(() => {});
        })
        .finally(() => {
          setIsProcessing(false);
        });
    } else if (activeStep === 1) {
      dispatch({ type: "SET_STEP", payload: { activeStep: 2 } });
    }
  };

  // Chuyển sang Cổng Thanh toán VNPay
  const handleCheckout = () => {
    const selectedSeatIds = (listSeat || [])
      .filter((s) => s.selected)
      .map((s) => s.id);

    if (selectedSeatIds.length === 0) {
      Swal.fire({
        title: "Chưa chọn ghế",
        text: "Vui lòng chọn ghế trước khi thanh toán!",
        icon: "warning",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    setIsProcessing(true);

    const finalTotal = Math.max(0, amount + (foodAmount || 0) - discountAmount);
    const userId = currentUser?.data?.id || currentUser?.id || 1;

    // Định dạng chuỗi món ăn để VNPay truyền về sau khi thanh toán thành công
    const foodsStr =
      (selectedFoods || []).length > 0
        ? selectedFoods.map((f) => `${f.id}x${f.quantity}`).join("-")
        : "0";

    const orderInfo = `PAY_${userId}_${param.maLichChieu}_${selectedSeatIds.join("-")}_${foodsStr}`;

    // Tạo URL thanh toán và chuyển hướng trực tiếp sang cổng VNPay
    bookingApi
      .createPaymentUrl(finalTotal, orderInfo)
      .then((res) => {
        const paymentUrl = res.data?.url || res.data?.data || res.data;
        if (paymentUrl && typeof paymentUrl === "string") {
          window.location.href = paymentUrl;
        } else {
          Swal.fire("Lỗi kết nối", "Không lấy được đường dẫn thanh toán từ cổng VNPay!", "error");
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error("Lỗi tạo thanh toán VNPay:", err);
        Swal.fire(
          "Lỗi cổng thanh toán",
          err.response?.data?.message || err.message || "Không thể kết nối cổng VNPay!",
          "error"
        );
        setIsProcessing(false);
      });
  };

  const dateInfo = formatDate(param.ngayChieu || scheduleInfo?.startDate || "2026-08-21");
  const formattedDayStr = `${dateInfo?.dayToday || "Hôm nay"}, ${param.ngayChieu || scheduleInfo?.startDate || "22/08/2026"}`;

  const movieName = scheduleInfo?.movie?.name || billDetail?.schedule?.movie?.name || "Quỷ Quyệt: Ranh Giới Vô Định";
  const branchName = scheduleInfo?.branch?.name || billDetail?.schedule?.branch?.name || "WORLD CINEMA Hà Đông";
  const roomName = scheduleInfo?.room?.name || billDetail?.schedule?.room?.name || "Phòng 202 (3D)";
  const roomFormat = scheduleInfo?.room?.format || billDetail?.schedule?.room?.format || "3D";
  const rated = scheduleInfo?.movie?.rated || billDetail?.schedule?.movie?.rated || "T16";
  const posterUrl =
    scheduleInfo?.movie?.smallImageURl ||
    billDetail?.schedule?.movie?.smallImageURl ||
    "https://i.pravatar.cc/150?img=11";

  // Lấy danh sách ghế: ưu tiên billDetail nếu đã đặt vé xong (activeStep === 3)
  const displaySeats =
    billDetail?.seats && billDetail.seats.length > 0
      ? billDetail.seats
      : (listSeat || []).filter((s) => s.selected);

  const seatNamesStr = displaySeats.map((s) => s.name || s.label || s).join(", ");

  // Lấy danh sách bắp nước: ưu tiên billDetail nếu đã đặt vé xong (activeStep === 3)
  const displayFoods =
    billDetail?.foods && billDetail.foods.length > 0
      ? billDetail.foods
      : selectedFoods || [];

  const displayTotalFood = displayFoods.reduce(
    (sum, f) => sum + (f.price || 0) * (f.quantity || 1),
    0
  );

  const finalTotalAmount =
    billDetail?.price != null
      ? Number(billDetail.price)
      : Math.max(0, amount + (foodAmount || 0) - discountAmount);

  const displaySeatAmount =
    billDetail?.price != null
      ? Number(billDetail.price) - displayTotalFood
      : amount || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* ĐỒNG HỒ ĐẾM NGƯỢC GIỮ GHẾ TRÊN ĐẦU KHUNG (Chỉ ẩn khi đã thanh toán xong ở bước 3) */}
      {activeStep < 3 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "6px",
            paddingRight: "4px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            Thời gian giữ ghế:
          </span>
          <div style={{ color: "#ea580c", fontWeight: "700", fontSize: "14px" }}>
            <Countdown />
          </div>
        </div>
      )}

      {/* KHUNG THẺ TÓM TẮT ĐẶT VÉ TRẮNG VIỀN CAM TRÊN CÙNG */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid #f1f5f9",
        }}
      >
        {/* 1. THANH VIỀN CAM ĐẶC TRƯNG Ở ĐẦU KHUNG */}
        <div style={{ height: "4px", backgroundColor: "#f97316", width: "100%" }} />

        <div style={{ padding: "20px 18px 24px 18px", display: "flex", flexDirection: "column" }}>
          {/* 2. POSTER VÀ THÔNG TIN PHIM */}
          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "16px" }}>
            <img
              src={posterUrl}
              alt="poster"
              style={{
                width: "90px",
                height: "135px",
                objectFit: "cover",
                borderRadius: "4px",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#1e293b",
                  margin: "0 0 10px 0",
                  lineHeight: "1.35",
                }}
              >
                {movieName}
              </h3>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>
                  {roomName} {roomFormat} Phụ Đề -
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#ffffff",
                    backgroundColor: "#f97316",
                    padding: "1px 6px",
                    borderRadius: "3px",
                    display: "inline-block",
                  }}
                >
                  {rated}
                </span>
              </div>
            </div>
          </div>

          {/* 3. TÊN CỤM RẠP & PHÒNG CHIẾU */}
          <div style={{ marginBottom: "6px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", lineHeight: "1.4" }}>
              {branchName} - {roomName}
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
              Suất: <b style={{ color: "#1e293b", fontWeight: "700" }}>{scheduleInfo?.startTime ? scheduleInfo.startTime.slice(0, 5) : "10:45"}</b> - {formattedDayStr}
            </div>
          </div>

          {/* 4. CHI TIẾT GHẾ ĐÃ CHỌN */}
          {displaySeats.length > 0 && (
            <>
              <div style={{ borderBottom: "1px dashed #cbd5e1", margin: "14px 0" }} />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#1e293b", fontWeight: "700" }}>
                  <span>
                    {displaySeats.length}x GHẾ {displaySeats[0]?.seatType === "COUPLE" || displaySeats[0]?.seatType === 2 ? "ĐÔI" : displaySeats[0]?.seatType === "TRIPLE" || displaySeats[0]?.seatType === 3 ? "BA" : displaySeats[0]?.seatType === "VIP" || displaySeats[0]?.seatType === 1 ? "VIP" : "THƯỜNG"} {roomFormat}
                  </span>
                  <span>{displaySeatAmount.toLocaleString("vi-VN")} <u>đ</u></span>
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                  Ghế: {seatNamesStr}
                </div>
              </div>
            </>
          )}

          {/* 5. CHI TIẾT BẮP NƯỚC ĐÃ CHỌN */}
          {displayFoods && displayFoods.length > 0 && (
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {displayFoods.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12.5px",
                    color: "#334155",
                  }}
                >
                  <span>
                    {f.quantity || 1}x {f.foodName || f.name}
                  </span>
                  <span style={{ fontWeight: "700", color: "#1e293b" }}>
                    {((f.price || 0) * (f.quantity || 1)).toLocaleString("vi-VN")} <u>đ</u>
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 6. ĐƯỜNG KẺ ĐỨT NÉT DASHED */}
          <div style={{ borderBottom: "1px dashed #cbd5e1", margin: "16px 0" }} />

          {/* 7. DÒNG TỔNG CỘNG TIỀN */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: activeStep < 3 ? "24px" : "4px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
              Tổng cộng
            </span>
            <span style={{ fontSize: "15px", fontWeight: "700", color: "#ea580c" }}>
              {finalTotalAmount.toLocaleString("vi-VN")} <u>đ</u>
            </span>
          </div>

          {/* 8. BỘ NÚT ĐIỀU HƯỚNG [ Quay lại ] (CHỮ CAM) & [ Tiếp tục / Thanh toán ] (NỀN CAM) */}
          {activeStep < 3 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                onClick={handlePrevStep}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#ea580c",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "8px 12px",
                  outline: "none",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Quay lại
              </button>

              {activeStep < 2 ? (
                <button
                  onClick={handleNextStep}
                  disabled={isProcessing || (!displaySeats || displaySeats.length === 0)}
                  style={{
                    padding: "10px 32px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor:
                      displaySeats && displaySeats.length > 0 && !isProcessing
                        ? "#f97316"
                        : "#cbd5e1",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor:
                      displaySeats && displaySeats.length > 0 && !isProcessing
                        ? "pointer"
                        : "not-allowed",
                    outline: "none",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {isProcessing ? "Đang giữ ghế..." : "Tiếp tục"}
                </button>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  style={{
                    padding: "10px 32px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: isProcessing ? "#cbd5e1" : "#f97316",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    outline: "none",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  {isProcessing ? "Đang chuyển VNPay..." : "Thanh toán"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}