import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import bookingApi from "../../../api/bookingApi";
import formatDate from "../../../utilities/formatDate";

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
    email: reduxEmail,
    phone: reduxPhone,
  } = useSelector((state) => state.bookTicketReducer);

  const currentUser = useSelector((state) => state.authReducer.currentUser);

  const [scheduleInfo, setScheduleInfo] = useState(null);
  const [email, setEmail] = useState(reduxEmail || currentUser?.data?.email || "khachhang@worldcinema.vn");
  const [phone, setPhone] = useState(reduxPhone || currentUser?.data?.phone || "0987654321");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Điều hướng các bước
  const handlePrevStep = () => {
    if (activeStep === 0) {
      history.goBack();
    } else {
      dispatch({ type: "SET_STEP", payload: { activeStep: activeStep - 1 } });
    }
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (!listSeatSelected || listSeatSelected.length === 0) {
        alert("Vui lòng chọn ít nhất 1 ghế để tiếp tục!");
        return;
      }
      dispatch({ type: "SET_STEP", payload: { activeStep: 1 } });
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
      alert("Vui lòng chọn ghế trước khi thanh toán!");
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
          alert("Không lấy được đường dẫn thanh toán từ cổng VNPay!");
          setIsProcessing(false);
        }
      })
      .catch((err) => {
        console.error("Lỗi tạo thanh toán VNPay:", err);
        alert("Lỗi kết nối cổng thanh toán VNPay: " + (err.response?.data?.message || err.message));
        setIsProcessing(false);
      });
  };

  const finalTotalAmount = Math.max(0, amount + (foodAmount || 0) - discountAmount);
  const dateInfo = formatDate(param.ngayChieu || scheduleInfo?.startDate || "2026-08-21");
  const formattedDayStr = `${dateInfo?.dayToday || "Hôm nay"}, ${param.ngayChieu || scheduleInfo?.startDate || "22/08/2026"}`;

  const movieName = scheduleInfo?.movie?.name || "Quỷ Quyệt: Ranh Giới Vô Định";
  const branchName = scheduleInfo?.branch?.name || "WORLD CINEMA Hà Đông";
  const roomName = scheduleInfo?.room?.name || "Phòng 101";
  const roomFormat = scheduleInfo?.room?.format || "2D";
  const rated = scheduleInfo?.movie?.rated || "T16";
  const posterUrl =
    scheduleInfo?.movie?.smallImageURl ||
    "https://i.pravatar.cc/150?img=11";

  return (
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
            Suất: <b style={{ color: "#1e293b", fontWeight: "700" }}>{scheduleInfo?.startTime ? scheduleInfo.startTime.slice(0, 5) : "11:00"}</b> - {formattedDayStr}
          </div>
        </div>

        {/* 4. CHI TIẾT GHẾ VÀ BẮP NƯỚC (NẾU CÓ) */}
        {listSeatSelected && listSeatSelected.length > 0 && (
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {(listSeat || [])
              .filter((s) => s.selected)
              .map((s) => {
                const seatType =
                  s.seatType === "TRIPLE" || s.type === "TRIPLE" || s.type === 3
                    ? "Ghế Ba"
                    : s.seatType === "COUPLE" || s.type === "COUPLE" || s.type === 2
                    ? "Ghế Đôi"
                    : s.seatType === "VIP" || s.type === "VIP" || s.type === 1
                    ? "Ghế VIP"
                    : "Ghế Thường";
                const basePrice = scheduleInfo?.price || 75000;
                const seatPrice =
                  s.price ||
                  (seatType === "Ghế Ba"
                    ? basePrice + 60000
                    : seatType === "Ghế Đôi"
                    ? basePrice + 40000
                    : seatType === "Ghế VIP"
                    ? basePrice + 15000
                    : basePrice);

                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#475569",
                    }}
                  >
                    <span>
                      1x Người Lớn - {seatType} <b>Ghế: {s.name}</b>
                    </span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
                      {seatPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                );
              })}
          </div>
        )}

        {selectedFoods && selectedFoods.length > 0 && (
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>
              Bắp nước & Combo:
            </span>
            {selectedFoods.map((f) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#475569",
                }}
              >
                <span>
                  {f.quantity}x {f.name}
                </span>
                <span style={{ fontWeight: "600", color: "#1e293b" }}>
                  {(f.price * f.quantity).toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 5. ĐƯỜNG KẺ ĐỨT NÉT DASHED */}
        <div style={{ borderBottom: "1px dashed #cbd5e1", margin: "16px 0" }} />

        {/* 6. DÒNG TỔNG CỘNG TIỀN */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
            Tổng cộng
          </span>
          <span style={{ fontSize: "15px", fontWeight: "700", color: "#ea580c" }}>
            {finalTotalAmount.toLocaleString("vi-VN")} <u>đ</u>
          </span>
        </div>

        {/* 7. BỘ NÚT ĐIỀU HƯỚNG [ Quay lại ] (CHỮ CAM) & [ Tiếp tục / Thanh toán ] (NỀN CAM) */}
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
                disabled={!listSeatSelected || listSeatSelected.length === 0}
                style={{
                  padding: "10px 28px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor:
                    listSeatSelected && listSeatSelected.length > 0 ? "#f97316" : "#cbd5e1",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor:
                    listSeatSelected && listSeatSelected.length > 0 ? "pointer" : "not-allowed",
                  outline: "none",
                  transition: "background-color 0.15s ease",
                }}
              >
                Tiếp tục
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                style={{
                  padding: "10px 28px",
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
                {isProcessing ? "Đang xử lý..." : "Thanh toán"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}