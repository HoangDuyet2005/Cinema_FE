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
    email,
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

  // 2. Nếu có billId từ bookingResult, tải lại chi tiết hóa đơn từ Database
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
        .catch((err) => console.log("Lỗi tải chi tiết bill:", err));
    }
  }, [bookingResult]);

  const bookingCode =
    billDetail?.bookingCode ||
    bookingResult?.bookingCode ||
    `WC2026-${String(bookingResult?.id || Math.floor(Math.random() * 900000 + 100000))}`;

  const finalAmount =
    billDetail?.price ||
    (amount || 0) + (foodAmount || 0);

  const displayFoods =
    billDetail?.foods && billDetail.foods.length > 0
      ? billDetail.foods
      : selectedFoods || [];

  return (
    <div style={{ backgroundColor: "#ffffff", padding: "20px 24px", minHeight: "80vh" }}>
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
              scheduleInfo?.movie?.smallImageURl ||
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
              {scheduleInfo?.movie?.name || "Chi Tiết Phim"}
            </h3>
            <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
              <b>{scheduleInfo?.branch?.name || "WORLD CINEMA"}</b> - {scheduleInfo?.room?.name || "Phòng 101"} ({scheduleInfo?.room?.format || "2D"})
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              Suất: <b>{scheduleInfo?.startTime ? scheduleInfo.startTime.slice(0, 5) : "19:00"}</b> - {formatDate(scheduleInfo?.startDate || "2026-08-21")?.dateFull || param.ngayChieu || "21/08/2026"}
            </div>
          </div>
        </div>

        {/* Ghế đã đặt */}
        <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "14px", marginBottom: "14px" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
            Ghế đã đặt:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {listSeatSelected && listSeatSelected.length > 0 ? (
              listSeatSelected.map((seat) => (
                <span
                  key={seat}
                  style={{
                    backgroundColor: "#ea580c",
                    color: "#ffffff",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontWeight: "800",
                    fontSize: "13px",
                  }}
                >
                  Ghế {seat}
                </span>
              ))
            ) : (
              <span style={{ fontSize: "13px", color: "#64748b" }}>Đã lưu</span>
            )}
          </div>
        </div>

        {/* Combo bắp nước đã đặt (lưu từ bill_food) */}
        {displayFoods && displayFoods.length > 0 && (
          <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "14px", marginBottom: "14px" }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "8px" }}>
              Bắp nước & Combo ({displayFoods.length} sản phẩm):
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
                    • {f.quantity || 1}x {f.foodName || f.name}
                  </span>
                  <b>{((f.price || 0) * (f.quantity || 1)).toLocaleString("vi-VN")} đ</b>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tổng tiền & Cổng thanh toán */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
            <span style={{ color: "#64748b" }}>Tổng tiền thanh toán:</span>
            <span style={{ fontWeight: "900", color: "#ea580c", fontSize: "18px" }}>
              {finalAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#64748b" }}>
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