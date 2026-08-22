import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import bookingApi from "../../../api/bookingApi";
import billsApi from "../../../api/billsApi";
import formatDate from "../../../utilities/formatDate";

export default function ResultBookticket() {
  const history = useHistory();
  const param = useParams();

  const {
    bookingResult,
    listSeatSelected,
    selectedFoods,
    amount,
    foodAmount,
    paymentMethod,
  } = useSelector((state) => state.bookTicketReducer);

  const [billDetail, setBillDetail] = useState(null);
  const [scheduleInfo, setScheduleInfo] = useState(null);

  // 1. Tải thông tin suất chiếu
  useEffect(() => {
    if (param.maLichChieu) {
      bookingApi
        .getScheduleById(param.maLichChieu)
        .then((res) => {
          if (res.data?.data) {
            setScheduleInfo(res.data.data);
          }
        })
        .catch((err) => console.log("Lỗi tải lịch chiếu:", err));
    }
  }, [param.maLichChieu]);

  // 2. Nếu có billId từ bookingResult hoặc URL query, tải lại chi tiết hóa đơn từ Database
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const bId = bookingResult?.id || bookingResult?.billId || searchParams.get("billId");
    if (bId) {
      billsApi
        .getBillByID(bId)
        .then((res) => {
          if (res.data) {
            setBillDetail(res.data);
          }
        })
        .catch((err) => console.log("Lỗi tải chi tiết bill:", err));
    }
  }, [bookingResult]);

  const bookingCode =
    billDetail?.bookingCode ||
    bookingResult?.bookingCode ||
    `WC2026-${String(billDetail?.id || bookingResult?.id || Math.floor(Math.random() * 900000 + 100000))}`;

  // Lấy danh sách ghế thực tế
  const displaySeats =
    billDetail?.seats && billDetail.seats.length > 0
      ? billDetail.seats.map((s) => s.name || s)
      : bookingResult?.seats && bookingResult.seats.length > 0
      ? bookingResult.seats.map((s) => s.name || s)
      : listSeatSelected && listSeatSelected.length > 0
      ? listSeatSelected
      : [];

  // Lấy danh sách bắp nước thực tế
  const displayFoods =
    billDetail?.foods && billDetail.foods.length > 0
      ? billDetail.foods
      : bookingResult?.foods && bookingResult.foods.length > 0
      ? bookingResult.foods
      : selectedFoods && selectedFoods.length > 0
      ? selectedFoods
      : [];

  const finalAmount =
    billDetail?.price != null
      ? Number(billDetail.price)
      : (amount || 0) + (foodAmount || 0);

  const totalFoodPrice = displayFoods.reduce(
    (sum, f) => sum + (Number(f.price) || 0) * (Number(f.quantity) || 1),
    0
  );

  const seatCount = displaySeats.length > 0 ? displaySeats.length : 1;
  const totalTicketPrice = displaySeats.reduce(
    (sum, s) => sum + (typeof s === 'object' && s.price ? Number(s.price) : 0),
    0
  ) || (amount > 0 ? amount : finalAmount > totalFoodPrice ? finalAmount - totalFoodPrice : 0);

  const unitTicketPrice = Math.round(totalTicketPrice / seatCount);

  const movieObj = scheduleInfo?.movie || billDetail?.schedule?.movie;
  const branchObj = scheduleInfo?.branch || billDetail?.schedule?.branch;
  const roomObj = scheduleInfo?.room || billDetail?.schedule?.room;
  const startDateVal = scheduleInfo?.startDate || billDetail?.schedule?.startDate || param.ngayChieu || "2026-08-21";
  const startTimeVal = scheduleInfo?.startTime || billDetail?.schedule?.startTime || param.gioChieu || "10:45:00";

  return (
    <div style={{ backgroundColor: "#ffffff", padding: "20px 24px", minHeight: "80vh", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
      {/* 1. BANNER THÔNG BÁO THÀNH CÔNG MÀU XANH LÁ CHUẨN */}
      <div
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          padding: "24px 20px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#ffffff",
          marginBottom: "24px",
          boxShadow: "0 4px 15px rgba(16, 185, 129, 0.25)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px auto",
            fontSize: "24px",
            fontWeight: "800",
          }}
        >
          ✓
        </div>
        <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "800" }}>
          ĐẶT VÉ & THANH TOÁN THÀNH CÔNG!
        </h2>
        <p style={{ margin: 0, opacity: 0.95, fontSize: "14px" }}>
          Vé xem phim điện tử và mã QR đã được tạo và lưu thành công vào cơ sở dữ liệu!
        </p>
      </div>

      {/* 2. KHUNG MÃ ĐẶT VÉ & QR CODE VIỀN ĐỨT NÉT CAM */}
      <div
        style={{
          border: "2px dashed #ea580c",
          backgroundColor: "#fffaf5",
          borderRadius: "12px",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "inline-block",
          }}
        >
          <QRCodeSVG value={bookingCode} size={110} level="M" />
        </div>

        <div style={{ flex: 1, minWidth: "240px" }}>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#ea580c", letterSpacing: "1px" }}>
            MÃ ĐẶT VÉ DUY NHẤT
          </span>
          <div style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "4px 0 8px 0" }}>
            {bookingCode}
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.4" }}>
            💡 <b>Tại rạp:</b> Xuất trình mã QR trên hoặc đọc mã đặt vé cho nhân viên quầy vé / máy lấy vé tự động để nhận vé xem phim.
          </p>
        </div>
      </div>

      {/* 3. CHI TIẾT VÉ PHIM & COMBO BẮP NƯỚC */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Phim & Suất chiếu */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <img
            src={
              movieObj?.smallImageURl ||
              "https://i.pravatar.cc/150?img=11"
            }
            alt="poster"
            style={{
              width: "70px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1e293b", margin: "0 0 6px 0" }}>
              {movieObj?.name || "Chi Tiết Phim"}
            </h3>
            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
              <b>{branchObj?.name || "WORLD CINEMA"}</b> - {roomObj?.name || "Phòng 101"} ({roomObj?.format || "2D"})
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              Suất: <b>{startTimeVal ? startTimeVal.slice(0, 5) : "10:45"}</b> - {formatDate(startDateVal)?.dateFull || startDateVal}
            </div>
          </div>
        </div>

        {/* Ghế & Giá vé đã đặt */}
        {displaySeats.length > 0 && (
          <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "14px", marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                Vé xem phim & Ghế ngồi ({displaySeats.length} vé):
              </div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#ea580c" }}>
                {totalTicketPrice.toLocaleString("vi-VN")} đ
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
              {displaySeats.map((seatObj, idx) => {
                const seatName = typeof seatObj === 'string' ? seatObj : seatObj?.name || seatObj?.label || (idx + 1);
                const sPrice = typeof seatObj === 'object' && seatObj?.price ? Number(seatObj.price) : unitTicketPrice;
                return (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "#fff7ed",
                      color: "#ea580c",
                      border: "1px solid #fed7aa",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontWeight: "700",
                      fontSize: "13px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#ea580c",
                        color: "#ffffff",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "800",
                      }}
                    >
                      Ghế {seatName}
                    </span>
                    {sPrice > 0 && <span>{sPrice.toLocaleString("vi-VN")} đ</span>}
                  </span>
                );
              })}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              • Đơn giá: {unitTicketPrice.toLocaleString("vi-VN")} đ/vé × {displaySeats.length} vé
            </div>
          </div>
        )}

        {/* Combo bắp nước đã đặt (lưu từ bill_food) */}
        {displayFoods && displayFoods.length > 0 && (
          <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "14px", marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>
                Bắp nước & Combo ({displayFoods.length} sản phẩm):
              </div>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#ea580c" }}>
                {totalFoodPrice.toLocaleString("vi-VN")} đ
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {displayFoods.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    color: "#475569",
                  }}
                >
                  <span>
                    • {f.quantity || 1}x {f.foodName || f.name} ({((f.price || 0)).toLocaleString("vi-VN")} đ/phần)
                  </span>
                  <b>{((f.price || 0) * (f.quantity || 1)).toLocaleString("vi-VN")} đ</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bóc tách tổng tiền & Cổng thanh toán */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#475569" }}>
            <span>Tiền vé ({displaySeats.length} vé):</span>
            <b>{totalTicketPrice.toLocaleString("vi-VN")} đ</b>
          </div>
          {displayFoods && displayFoods.length > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#475569" }}>
              <span>Tiền bắp nước ({displayFoods.length} món):</span>
              <b>{totalFoodPrice.toLocaleString("vi-VN")} đ</b>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #cbd5e1", fontSize: "14px" }}>
            <span style={{ fontWeight: "700", color: "#1e293b" }}>Tổng tiền thanh toán:</span>
            <span style={{ fontWeight: "900", color: "#ea580c", fontSize: "18px" }}>
              {finalAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b", marginTop: "6px" }}>
            <span>Cổng thanh toán:</span>
            <span style={{ fontWeight: "700", color: "#1e293b" }}>{paymentMethod || "VNPay"}</span>
          </div>
        </div>
      </div>

      {/* 4. CÁC NÚT ĐIỀU HƯỚNG */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={() => history.push("/taikhoan")}
          style={{
            flex: "1",
            minWidth: "180px",
            backgroundColor: "#ea580c",
            color: "#ffffff",
            border: "none",
            padding: "14px 20px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
          }}
        >
          XEM VÉ TRONG TÀI KHOẢN
        </button>
        <button
          onClick={() => window.print()}
          style={{
            backgroundColor: "#f8fafc",
            color: "#334155",
            border: "1px solid #cbd5e1",
            padding: "14px 20px",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          🖨️ In / Tải vé
        </button>
        <button
          onClick={() => history.push("/")}
          style={{
            backgroundColor: "#f8fafc",
            color: "#64748b",
            border: "1px solid #cbd5e1",
            padding: "14px 20px",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
}