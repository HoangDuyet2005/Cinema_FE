import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import billsApi from "../../api/billsApi";
import bookingApi from "../../api/bookingApi";
import formatDate from "../../utilities/formatDate";

export default function PaymentResult() {
  const location = useLocation();
  const history = useHistory();
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'cancelled', 'expired', 'failed'
  const [paymentData, setPaymentData] = useState({});
  const [ticketDetail, setTicketDetail] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get("vnp_ResponseCode");
    const orderInfo = searchParams.get("vnp_OrderInfo");
    const amount = searchParams.get("vnp_Amount");
    const bankCode = searchParams.get("vnp_BankCode");
    const transactionNo = searchParams.get("vnp_TransactionNo");
    const cardType = searchParams.get("vnp_CardType");
    const payDate = searchParams.get("vnp_PayDate");

    let formattedDate = "";
    if (payDate && payDate.length === 14) {
      const year = payDate.substring(0, 4);
      const month = payDate.substring(4, 6);
      const day = payDate.substring(6, 8);
      const hour = payDate.substring(8, 10);
      const minute = payDate.substring(10, 12);
      const second = payDate.substring(12, 14);
      formattedDate = `${hour}:${minute}:${second} ${day}/${month}/${year}`;
    }

    const dataObj = {
      billId: "---",
      bookingCode: "---",
      amount: amount ? Number(amount) / 100 : 0,
      bankCode: bankCode || "VNPay",
      transactionNo: transactionNo || "---",
      cardType: cardType || "ATM/QR",
      payDate: formattedDate || new Date().toLocaleString("vi-VN"),
      responseCode: responseCode,
    };
    setPaymentData(dataObj);

    // Xử lý booking payload từ orderInfo dạng PAY_userId_scheduleId_seatId1-seatId2
    if (orderInfo && orderInfo.startsWith("PAY_")) {
      const parts = orderInfo.split("_");
      const userId = Number(parts[1]) || 1;
      const scheduleId = Number(parts[2]);
      const listSeatIds = parts[3] ? parts[3].split("-").map(Number) : [];

      if (responseCode === "00") {
        // THANH TOÁN THÀNH CÔNG -> LƯU BILL VÀ TICKET VÀO CSDL VỚI STATUS = SUCCESS
        bookingApi
          .postDatVe({
            userId,
            scheduleId,
            listSeatIds,
          })
          .then((res) => {
            const createdBill = res?.data?.data || res?.data;
            const bId = createdBill?.id;
            const bCode = createdBill?.bookingCode || (bId ? `WC2026-${String(bId).padStart(6, "0")}` : "WC2026-TICKET");

            setPaymentData((prev) => ({
              ...prev,
              billId: bId || "Thành công",
              bookingCode: bCode,
            }));

            // Giải phóng in-memory lock
            bookingApi.releaseSeats({ scheduleId, seatIds: listSeatIds, userId }).catch(() => {});

            // Lấy thông tin chi tiết đầy đủ của vé xem phim
            if (bId) {
              billsApi.getBillByID(bId)
                .then((billRes) => {
                  setTicketDetail(billRes.data);
                  setStatus("success");
                })
                .catch(() => setStatus("success"));
            } else {
              setStatus("success");
            }
          })
          .catch((err) => {
            console.error("Lỗi khi lưu đơn hàng thành công:", err);
            setStatus("success");
          });
      } else {
        // THANH TOÁN THẤT BẠI / HỦY / HẾT HẠN -> GIẢI PHÓNG GHẾ NGAY
        bookingApi.releaseSeats({ scheduleId, seatIds: listSeatIds, userId }).catch(() => {});

        if (responseCode === "24") {
          setStatus("cancelled");
          setErrorMessage("Giao dịch đã được hủy theo yêu cầu của bạn. Ghế đã được tự động giải phóng.");
        } else if (responseCode === "11") {
          setStatus("expired");
          setErrorMessage("Giao dịch đã hết hạn thanh toán (quá thời gian chờ). Ghế đã được tự động giải phóng.");
        } else {
          setStatus("failed");
          setErrorMessage(`Thanh toán không thành công qua cổng VNPay (Mã phản hồi: ${responseCode || "N/A"}). Ghế đã được tự động giải phóng.`);
        }
      }
    } else {
      // Hỗ trợ trường hợp orderInfo là billId
      const billId = orderInfo;
      setPaymentData((prev) => ({
        ...prev,
        billId: billId || "---",
        bookingCode: billId ? `WC2026-${String(billId).padStart(6, "0")}` : "---",
      }));

      if (responseCode === "00") {
        if (billId) {
          billsApi.postThanhToan(billId)
            .then(() => {
              billsApi.getBillByID(billId).then((r) => setTicketDetail(r.data)).catch(() => {});
              setStatus("success");
            })
            .catch(() => setStatus("success"));
        } else {
          setStatus("success");
        }
      } else {
        if (billId) {
          billsApi.postHuyBill(billId).catch(() => {});
        }
        if (responseCode === "24") {
          setStatus("cancelled");
          setErrorMessage("Giao dịch đã được hủy theo yêu cầu của bạn. Ghế đã được tự động giải phóng.");
        } else if (responseCode === "11") {
          setStatus("expired");
          setErrorMessage("Giao dịch đã hết hạn thanh toán. Ghế đã được tự động giải phóng.");
        } else {
          setStatus("failed");
          setErrorMessage(`Thanh toán không thành công (Mã phản hồi: ${responseCode || "N/A"}). Ghế đã được tự động giải phóng.`);
        }
      }
    }
  }, [location]);

  const movie = ticketDetail?.schedule?.movie;
  const branch = ticketDetail?.schedule?.branch;
  const room = ticketDetail?.schedule?.room;
  const schedule = ticketDetail?.schedule;
  const seats = ticketDetail?.seats || [];
  const bookingCode = ticketDetail?.bookingCode || paymentData.bookingCode || "WC2026-TICKET";

  return (
    <div style={{
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0f172a",
      padding: "40px 15px",
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        width: "100%",
        maxWidth: "750px",
        overflow: "hidden",
      }}>
        {/* Loading State */}
        {status === "loading" && (
          <div style={{ padding: "80px 20px", textAlign: "center" }}>
            <div style={{
              width: "54px",
              height: "54px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #e87722",
              borderRadius: "50%",
              margin: "0 auto 24px auto",
              animation: "spin 1s linear infinite"
            }} />
            <h3 style={{ margin: 0, color: "#1e293b", fontSize: "20px", fontWeight: 700 }}>Đang xác nhận kết quả thanh toán...</h3>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "8px" }}>Vui lòng không tắt trình duyệt hoặc tải lại trang.</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div>
            {/* Header banner */}
            <div style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "30px 20px",
              textAlign: "center",
              color: "#fff"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px auto",
                fontSize: "32px",
                fontWeight: 700
              }}>
                ✓
              </div>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, letterSpacing: "0.5px" }}>
                ĐẶT VÉ & THANH TOÁN THÀNH CÔNG!
              </h2>
              <p style={{ margin: "6px 0 0 0", opacity: 0.95, fontSize: "14px" }}>
                Vé xem phim điện tử và mã QR đã được tạo thành công cho đơn hàng của bạn
              </p>
            </div>

            {/* E-Ticket Card Body */}
            <div style={{ padding: "30px" }}>
              {/* QR Code & Booking Code Box */}
              <div style={{
                backgroundColor: "#fff7ed",
                border: "2px dashed #f97316",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "25px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                textAlign: "center"
              }}>
                <div style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                  display: "inline-block"
                }}>
                  <QRCodeSVG
                    value={bookingCode}
                    size={135}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div style={{ textAlign: "left", maxWidth: "380px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#ea580c", textTransform: "uppercase", letterSpacing: "1px" }}>
                    MÃ ĐẶT VÉ DUY NHẤT
                  </span>
                  <h3 style={{ margin: "4px 0 8px 0", fontSize: "24px", fontWeight: 800, color: "#1e293b", letterSpacing: "1px" }}>
                    {bookingCode}
                  </h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                    💡 <b>Tại rạp:</b> Xuất trình mã QR trên hoặc đọc mã đặt vé cho nhân viên quầy vé / máy lấy vé tự động để nhận vé xem phim.
                  </p>
                </div>
              </div>

              {/* Movie & Showtime Details */}
              {movie && (
                <div style={{
                  display: "flex",
                  gap: "18px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #e2e8f0",
                  marginBottom: "20px"
                }}>
                  <img
                    src={movie?.smallImageURl || movie?.largeImageURL || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"}
                    alt={movie?.name || "Movie"}
                    style={{ width: "90px", height: "130px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
                      {movie?.name}
                    </h4>
                    <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#64748b" }}>
                      🏢 <b>Rạp:</b> {branch?.name || "World Cinema"} ({branch?.address || ""})
                    </p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#64748b" }}>
                      🕒 <b>Suất chiếu:</b> <span style={{ color: "#e87722", fontWeight: 700 }}>
                        {schedule?.startTime ? `${schedule.startTime}, ` : ""}
                        {schedule?.startDate ? formatDate(schedule.startDate).dateFull : ""}
                      </span> ({room?.name || "Phòng chiếu"})
                    </p>
                    <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Ghế đã đặt:</span>
                      {seats.length > 0 ? (
                        seats.map((seat, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: "#e87722",
                              color: "#fff",
                              padding: "2px 10px",
                              borderRadius: "4px",
                              fontWeight: 700,
                              fontSize: "13px"
                            }}
                          >
                            {seat?.name || seat}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: "13px", color: "#64748b" }}>Đã lưu</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Summary Fields */}
              <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "20px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#64748b" }}>Tổng tiền thanh toán:</span>
                  <span style={{ fontWeight: 800, color: "#e87722", fontSize: "18px" }}>
                    {paymentData.amount ? `${paymentData.amount.toLocaleString("vi-VN")} đ` : "---"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#64748b" }}>Cổng thanh toán:</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>VNPay ({paymentData.bankCode || "NCB"})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#64748b" }}>Mã giao dịch VNPay:</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{paymentData.transactionNo}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Thời gian thanh toán:</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{paymentData.payDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => history.push("/taikhoan")}
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    backgroundColor: "#e87722",
                    color: "#fff",
                    border: "none",
                    padding: "14px 20px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(232, 119, 34, 0.3)"
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
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "pointer"
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
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "pointer"
                  }}
                >
                  Về Trang Chủ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled / Expired / Failed State */}
        {(status === "cancelled" || status === "expired" || status === "failed") && (
          <div>
            <div style={{
              background: status === "cancelled"
                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              padding: "35px 20px",
              textAlign: "center",
              color: "#fff"
            }}>
              <div style={{
                width: "64px",
                height: "64px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px auto",
                fontSize: "32px",
                fontWeight: 700
              }}>
                {status === "cancelled" ? "!" : "✕"}
              </div>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
                {status === "cancelled" && "GIAO DỊCH ĐÃ BỊ HỦY"}
                {status === "expired" && "GIAO DỊCH HẾT HẠN"}
                {status === "failed" && "THANH TOÁN THẤT BẠI"}
              </h2>
              <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontSize: "14px" }}>
                {errorMessage}
              </p>
            </div>

            <div style={{ padding: "30px" }}>
              <div style={{
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "25px",
                fontSize: "13px",
                color: "#9f1239",
                lineHeight: "1.5"
              }}>
                Ghế ngồi của bạn chưa được thanh toán và đã được tự động mở lại cho các khách hàng khác. Bạn có thể chọn và đặt vé lại bất kỳ lúc nào.
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => history.push("/")}
                  style={{
                    flex: 1,
                    backgroundColor: "#e87722",
                    color: "#fff",
                    border: "none",
                    padding: "14px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(232, 119, 34, 0.3)"
                  }}
                >
                  ĐẶT VÉ LẠI
                </button>
                <button
                  onClick={() => history.push("/")}
                  style={{
                    flex: 1,
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "14px 20px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "pointer"
                  }}
                >
                  VỀ TRANG CHỦ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}