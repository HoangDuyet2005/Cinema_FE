import React from "react";
import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import { QRCodeSVG } from "qrcode.react";

export default function PopUp(props) {
  const classes = useStyles();
  const ThongTin = props.ThongTin?.data || props.ThongTin;

  const movie = ThongTin?.schedule?.movie;
  const branch = ThongTin?.schedule?.branch;
  const room = ThongTin?.schedule?.room;
  const schedule = ThongTin?.schedule;
  const user = ThongTin?.user;
  const seats = ThongTin?.seats || [];
  const foods = ThongTin?.foods || [];
  const price = ThongTin?.price != null ? Number(ThongTin.price) : 0;
  const bookingCode = ThongTin?.bookingCode || (ThongTin?.id ? `WC2026-${String(ThongTin.id).padStart(6, "0")}` : "WC2026-TICKET");
  const isCheckedIn = ThongTin?.isCheckedIn || false;

  const totalFoodAmount = foods.reduce((sum, f) => sum + (f.price || 0) * (f.quantity || 1), 0);
  const totalTicketAmount = price - totalFoodAmount;

  return (
    <div className={classes.resultBookticket} style={{ padding: "20px", maxWidth: "680px", margin: "0 auto" }}>
      {/* 1. KHUNG MÃ ĐẶT VÉ & QR CODE */}
      <div style={{
        backgroundColor: "#fff7ed",
        border: "1.5px dashed #f97316",
        borderRadius: "10px",
        padding: "16px 20px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ backgroundColor: "#fff", padding: "6px", borderRadius: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
            <QRCodeSVG value={bookingCode} size={90} level="H" />
          </div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              MÃ ĐẶT VÉ
            </span>
            <h4 style={{ margin: "2px 0 4px 0", fontSize: "22px", fontWeight: 800, color: "#1e293b" }}>
              {bookingCode}
            </h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              Quét mã này tại quầy hoặc máy tự phục vụ để lấy vé
            </p>
          </div>
        </div>

        <div>
          {isCheckedIn ? (
            <span style={{
              backgroundColor: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              display: "inline-block"
            }}>
              ✅ ĐÃ NHẬN VÉ TẠI QUẦY
            </span>
          ) : (
            <span style={{
              backgroundColor: "#fef3c7",
              color: "#92400e",
              border: "1px solid #fde68a",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              display: "inline-block"
            }}>
              🎫 CHƯA NHẬN VÉ
            </span>
          )}
        </div>
      </div>

      {/* 2. THÔNG TIN PHIM & SUẤT CHIẾU */}
      <div className={classes.infoTicked} style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <img
          style={{ width: "130px", height: "190px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
          src={movie?.smallImageURl || movie?.largeImageURL || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"}
          alt={movie?.name || "Poster Phim"}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#ea580c", margin: "0 0 6px 0" }}>
            {movie?.name || "Thông tin phim"}
          </h3>
          <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e293b", margin: "0 0 4px 0" }}>
            {branch?.name || "WORLD CINEMA"}
          </p>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0" }}>
            {branch?.address || ""}
          </p>

          <table style={{ width: "100%", fontSize: "13px", lineHeight: "1.8" }}>
            <tbody>
              <tr>
                <td style={{ width: "110px", fontWeight: 600, color: "#475569" }}>Suất chiếu:</td>
                <td>
                  <b>{schedule?.startTime ? `${schedule.startTime}, ` : ""}</b>
                  {schedule?.startDate ? (formatDate(schedule.startDate)?.dateFull || schedule.startDate) : "N/A"}
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "#475569" }}>Phòng chiếu:</td>
                <td><b>{room?.name || "Phòng 101"} ({room?.format || "2D"})</b></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: "#475569" }}>Ghế đã đặt:</td>
                <td>
                  {seats.length > 0 ? (
                    seats.map((seat, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#ea580c",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: 700,
                          fontSize: "12px",
                          marginRight: "6px",
                          display: "inline-block",
                          marginBottom: "4px"
                        }}
                      >
                        Ghế {seat?.name || seat}
                      </span>
                    ))
                  ) : (
                    <span>Chưa có thông tin ghế</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. CHI TIẾT BẮP NƯỚC & COMBO ĐÃ ĐẶT (NẾU CÓ) */}
      {foods.length > 0 && (
        <div style={{ marginTop: "20px", backgroundColor: "#f8fafc", padding: "16px 20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b", margin: "0 0 10px 0" }}>
            🍿 Danh sách Combo & Bắp Nước ({foods.length} sản phẩm)
          </h4>
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #cbd5e1", color: "#64748b", fontSize: "12px", textAlign: "left" }}>
                <th style={{ paddingBottom: "6px" }}>Tên sản phẩm</th>
                <th style={{ paddingBottom: "6px", textAlign: "center" }}>Số lượng</th>
                <th style={{ paddingBottom: "6px", textAlign: "right" }}>Đơn giá</th>
                <th style={{ paddingBottom: "6px", textAlign: "right" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px dashed #e2e8f0", height: "36px" }}>
                  <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.foodName || item.name}</td>
                  <td style={{ textAlign: "center" }}>x{item.quantity}</td>
                  <td style={{ textAlign: "right", color: "#64748b" }}>{(item.price || 0).toLocaleString("vi-VN")} đ</td>
                  <td style={{ textAlign: "right", fontWeight: 700, color: "#1e293b" }}>
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString("vi-VN")} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. THÔNG TIN HÓA ĐƠN & PHÂN RÃ CHI PHÍ */}
      <div style={{ marginTop: "20px", borderTop: "1px dashed #cbd5e1", paddingTop: "15px" }}>
        <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#1e293b", margin: "0 0 12px 0" }}>
          Thông tin thanh toán
        </h4>
        <table style={{ width: "100%", fontSize: "13px", lineHeight: "1.8" }}>
          <tbody>
            <tr>
              <td style={{ width: "160px", color: "#64748b" }}>Mã hóa đơn:</td>
              <td><strong>#{ThongTin?.id || "N/A"}</strong> ({bookingCode})</td>
            </tr>
            <tr>
              <td style={{ color: "#64748b" }}>Khách hàng:</td>
              <td>{user?.name || user?.username || "Khách hàng"} ({user?.email || ""})</td>
            </tr>
            <tr>
              <td style={{ color: "#64748b" }}>Trạng thái thanh toán:</td>
              <td>
                {ThongTin?.status === "SUCCESS" && <span style={{ color: "#16a34a", fontWeight: 700 }}>✅ Đã thanh toán thành công</span>}
                {ThongTin?.status === "WAITING_PAYMENT" && <span style={{ color: "#d97706", fontWeight: 700 }}>⏳ Chờ thanh toán</span>}
                {ThongTin?.status === "EXPIRATION" && <span style={{ color: "#dc2626", fontWeight: 700 }}>❌ Đã hủy / Hết hạn</span>}
                {!ThongTin?.status && <span>N/A</span>}
              </td>
            </tr>
            <tr>
              <td style={{ color: "#64748b" }}>Tiền vé xem phim ({seats.length} vé):</td>
              <td><b>{totalTicketAmount.toLocaleString("vi-VN")} đ</b></td>
            </tr>
            {foods.length > 0 && (
              <tr>
                <td style={{ color: "#64748b" }}>Tiền bắp nước ({foods.length} món):</td>
                <td><b>{totalFoodAmount.toLocaleString("vi-VN")} đ</b></td>
              </tr>
            )}
            <tr style={{ borderTop: "1px solid #e2e8f0" }}>
              <td style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b", paddingTop: "8px" }}>Tổng cộng thanh toán:</td>
              <td style={{ paddingTop: "8px" }}>
                <strong style={{ color: "#ea580c", fontSize: "17px", fontWeight: 900 }}>
                  {price.toLocaleString("vi-VN")} đ
                </strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: "right", marginTop: "16px" }}>
          <button
            onClick={() => window.print()}
            style={{
              backgroundColor: "#f8fafc",
              color: "#334155",
              border: "1px solid #cbd5e1",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            🖨️ In phiếu đặt vé
          </button>
        </div>
      </div>
    </div>
  );
}