import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QRCodeSVG } from "qrcode.react";
import Swal from "sweetalert2";
import billsApi from "../../api/billsApi";
import formatDate from "../../utilities/formatDate";

export default function StaffCheckTicket() {
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);

  const handleSearchCode = async (codeToSearch) => {
    const rawCode = (typeof codeToSearch === "string" && codeToSearch.trim()) 
      ? codeToSearch 
      : inputCode;
    const code = String(rawCode || "").trim();

    if (!code) {
      Swal.fire("Lưu ý", "Vui lòng nhập hoặc quét mã đặt vé / QR Code!", "warning");
      return;
    }

    setLoading(true);
    setCheckResult(null);

    try {
      const res = await billsApi.checkTicket(code);
      const data = res?.data;
      setCheckResult(data);
      if (data?.status === "VALID") {
        Swal.fire({
          icon: "success",
          title: "Vé hợp lệ!",
          text: "Đơn đặt vé đã sẵn sàng để in vé.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (data?.status === "ALREADY_CHECKED_IN") {
        Swal.fire({
          icon: "warning",
          title: "Vé đã được nhận trước đó!",
          text: data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Không thể nhận vé!",
          text: data.message || "Mã không hợp lệ hoặc đã bị hủy.",
        });
      }
    } catch (err) {
      console.error("Lỗi kiểm tra vé:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Không thể kết nối đến máy chủ để kiểm tra vé!";
      Swal.fire("Lỗi", errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const printTicketDirectly = () => {
    const existingIframe = document.getElementById("ticket-print-iframe");
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "ticket-print-iframe";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const qrSvgEl = document.getElementById("ticket-qr-svg-preview");
    const qrSvgHtml = qrSvgEl ? qrSvgEl.outerHTML : "";

    const billDetail = checkResult?.billDetail;
    const m = billDetail?.schedule?.movie;
    const b = billDetail?.schedule?.branch;
    const r = billDetail?.schedule?.room;
    const s = billDetail?.schedule;
    const stList = billDetail?.seats || [];
    const bCode = billDetail?.bookingCode || (billDetail?.id ? `WC2026-${String(billDetail.id).padStart(6, "0")}` : inputCode);
    const dateFormatted = s?.startDate ? formatDate(s.startDate).dateFull : "";

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Vé - ${bCode}</title>
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              background: #fff;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding-top: 15px;
            }
            .ticket-card {
              width: 340px;
              border: 1.5px dashed #000000;
              padding: 18px 20px;
              background: #ffffff;
              color: #000000;
            }
            .ticket-header {
              text-align: center;
              border-bottom: 1.5px dashed #000000;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .ticket-header h2 {
              font-size: 18px;
              font-weight: 900;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            .ticket-header .branch-name {
              font-size: 12.5px;
              font-weight: 700;
              margin-bottom: 3px;
            }
            .ticket-header .branch-address {
              font-size: 10.5px;
              color: #222;
              line-height: 1.35;
              margin-bottom: 8px;
            }
            .ticket-header .ticket-type {
              font-size: 14px;
              font-weight: 900;
              letter-spacing: 0.5px;
              text-transform: uppercase;
            }
            .ticket-body {
              border-bottom: 1.5px dashed #000000;
              padding-bottom: 10px;
              margin-bottom: 12px;
              font-size: 12.5px;
              line-height: 1.75;
            }
            .ticket-body .row-line {
              margin-bottom: 1px;
            }
            .ticket-body b {
              font-weight: 700;
            }
            .ticket-qr-section {
              text-align: center;
              border-bottom: 1.5px dashed #000000;
              padding-bottom: 12px;
              margin-bottom: 10px;
            }
            .ticket-qr-section .total-amount {
              font-size: 15px;
              font-weight: 900;
              margin-bottom: 10px;
            }
            .ticket-qr-box {
              display: inline-block;
              padding: 6px;
              border: 1.5px solid #000000;
              border-radius: 4px;
              background: #ffffff;
            }
            .ticket-code-text {
              font-size: 12px;
              font-weight: 800;
              margin-top: 6px;
              letter-spacing: 0.5px;
            }
            .ticket-footer {
              text-align: center;
              font-size: 10.5px;
              color: #333;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="ticket-header">
              <h2>WORLD CINEMA</h2>
              <div class="branch-name">${b?.name || "WORLD CINEMA"}</div>
              <div class="branch-address">${b?.address || ""}</div>
              <div class="ticket-type">VÉ XEM PHIM / MOVIE TICKET</div>
            </div>
            <div class="ticket-body">
              <div class="row-line"><b>Phim:</b> ${m?.name || ""}</div>
              <div class="row-line"><b>Suất chiếu:</b> <b>${s?.startTime ? `${s.startTime}, ` : ""}${dateFormatted}</b></div>
              <div class="row-line"><b>Phòng chiếu:</b> <b>${r?.name || ""}</b></div>
              <div class="row-line"><b>Ghế ngồi:</b> <b>${stList.map((st) => st.name || st).join(", ")}</b></div>
              <div class="row-line"><b>Khách hàng:</b> ${billDetail?.user?.name || billDetail?.user?.username || ""}</div>
              <div class="row-line"><b>Mã đặt vé:</b> <b>${bCode}</b></div>
            </div>
            <div class="ticket-qr-section">
              <div class="total-amount">TỔNG TIỀN: ${billDetail?.price ? `${billDetail.price.toLocaleString("vi-VN")} đ` : "0 đ"}</div>
              <div class="ticket-qr-box">
                ${qrSvgHtml}
              </div>
              <div class="ticket-code-text">${bCode}</div>
            </div>
            <div class="ticket-footer">
              <div>Vé đã bao gồm 10% VAT.</div>
              <div>Chúc quý khách xem phim vui vẻ!</div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 250);
  };

  const handleConfirmCheckInAndPrint = async (billId) => {
    if (!billId) return;

    try {
      setLoading(true);
      const res = await billsApi.confirmCheckIn(billId);

      setCheckResult((prev) => ({
        ...prev,
        status: "ALREADY_CHECKED_IN",
        message: `Vé đã được nhận / in thành công vào lúc ${new Date().toLocaleTimeString("vi-VN")} ${new Date().toLocaleDateString("vi-VN")}!`,
        billDetail: res.data,
      }));

      // Gọi lệnh in iframe trực tiếp
      setTimeout(() => {
        printTicketDirectly();
      }, 100);
    } catch (err) {
      console.error("Lỗi xác nhận nhận vé:", err);
      Swal.fire("Lỗi", err?.response?.data?.message || err?.message || "Không thể xác nhận nhận vé!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Setup HTML5 QR Scanner
  useEffect(() => {
    if (isCameraActive) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          setInputCode(decodedText);
          setIsCameraActive(false);
          scanner.clear().catch(() => {});
          handleSearchCode(decodedText);
        },
        (error) => {
          // ignore frame scan errors
        }
      );

      scannerRef.current = scanner;

      return () => {
        scanner.clear().catch(() => {});
      };
    }
  }, [isCameraActive]);

  const bill = checkResult?.billDetail;
  const movie = bill?.schedule?.movie;
  const branch = bill?.schedule?.branch;
  const room = bill?.schedule?.room;
  const schedule = bill?.schedule;
  const seats = bill?.seats || [];
  const bookingCode = bill?.bookingCode || (bill?.id ? `WC2026-${String(bill.id).padStart(6, "0")}` : inputCode);

  return (
    <div style={{ minHeight: "90vh", backgroundColor: "#f1f5f9", padding: "30px 20px" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: "24px 30px",
          borderRadius: "12px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <div>
            <span style={{ fontSize: "12px", color: "#f97316", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
              CỔNG NHÂN VIÊN & TỰ PHỤC VỤ
            </span>
            <h2 style={{ margin: "4px 0 0 0", fontSize: "22px", fontWeight: 800 }}>
              QUẦY SOÁT VÉ & IN VÉ TỰ ĐỘNG
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              style={{
                backgroundColor: isCameraActive ? "#ef4444" : "#e87722",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              📷 {isCameraActive ? "Đóng Camera" : "Bật Camera Quét QR"}
            </button>
          </div>
        </div>

        {/* Camera Scanner View */}
        {isCameraActive && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 15px 0", color: "#1e293b", fontWeight: 700 }}>
              Đưa mã QR trước ống kính máy ảnh để quét tự động
            </h4>
            <div id="qr-reader-container" style={{ maxWidth: "450px", margin: "0 auto" }} />
          </div>
        )}

        {/* Manual Input Search Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px 30px",
          marginBottom: "24px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
        }}>
          <h4 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: 700, color: "#334155" }}>
            Nhập Mã Đặt Vé (Booking Code) hoặc Quét Mã Vạch / QR Code
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchCode();
            }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Ví dụ: WC2026-329169 hoặc 16"
              autoFocus
              style={{
                flex: 1,
                minWidth: "260px",
                padding: "12px 18px",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                outline: "none",
                transition: "border-color 0.2s ease"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#e87722")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: "#e87722",
                color: "#fff",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(232, 119, 34, 0.3)"
              }}
            >
              {loading ? "Đang tra cứu..." : "🔍 KIỂM TRA VÉ"}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {checkResult && (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            border: checkResult.status === "VALID" ? "2px solid #10b981" : "2px solid #f97316"
          }}>
            {/* Status Header */}
            <div style={{
              padding: "20px 25px",
              backgroundColor: checkResult.status === "VALID"
                ? "#dcfce7"
                : checkResult.status === "ALREADY_CHECKED_IN"
                ? "#ffedd5"
                : "#fee2e2",
              color: checkResult.status === "VALID"
                ? "#166534"
                : checkResult.status === "ALREADY_CHECKED_IN"
                ? "#9a3412"
                : "#991b1b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px"
            }}>
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 800 }}>
                  {checkResult.status === "VALID" && "✅ VÉ HỢP LỆ - SẴN SÀNG IN VÉ"}
                  {checkResult.status === "ALREADY_CHECKED_IN" && "⚠️ VÉ ĐÃ ĐƯỢC NHẬN / IN TRƯỚC ĐÓ"}
                  {checkResult.status === "WAITING_PAYMENT" && "⏳ ĐƠN HÀNG CHƯA HOÀN TẤT THANH TOÁN"}
                  {checkResult.status === "EXPIRED_OR_CANCELLED" && "❌ VÉ ĐÃ HẾT HẠN HOẶC BỊ HỦY"}
                  {checkResult.status === "NOT_FOUND" && "❌ KHÔNG TÌM THẤY MÃ ĐẶT VÉ NÀY"}
                </h3>
                <p style={{ margin: 0, fontSize: "13px" }}>{checkResult.message}</p>
              </div>

              {checkResult.status === "VALID" && bill && (
                <button
                  onClick={() => handleConfirmCheckInAndPrint(bill.id)}
                  disabled={loading}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: 800,
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
                  }}
                >
                  🖨️ XÁC NHẬN & IN VÉ XEM PHIM
                </button>
              )}
            </div>

            {/* Bill Info Body */}
            {bill && (
              <div style={{ padding: "30px" }}>
                <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
                  {/* Exact Ticket Preview Card */}
                  <div style={{
                    width: "350px",
                    border: "1.5px dashed #000000",
                    padding: "18px 20px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontFamily: "Arial, sans-serif"
                  }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", borderBottom: "1.5px dashed #000000", paddingBottom: "10px", marginBottom: "12px" }}>
                      <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        WORLD CINEMA
                      </h2>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, marginBottom: "3px" }}>
                        {branch?.name || "WORLD CINEMA Hà Đông"}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#222", lineHeight: "1.35", marginBottom: "8px" }}>
                        {branch?.address || ""}
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        VÉ XEM PHIM / MOVIE TICKET
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ borderBottom: "1.5px dashed #000000", paddingBottom: "10px", marginBottom: "12px", fontSize: "12.5px", lineHeight: "1.75" }}>
                      <div style={{ marginBottom: "1px" }}><b>Phim:</b> {movie?.name}</div>
                      <div style={{ marginBottom: "1px" }}><b>Suất chiếu:</b> <b>{schedule?.startTime ? `${schedule.startTime}, ` : ""}{schedule?.startDate ? formatDate(schedule.startDate).dateFull : ""}</b></div>
                      <div style={{ marginBottom: "1px" }}><b>Phòng chiếu:</b> <b>{room?.name}</b></div>
                      <div style={{ marginBottom: "1px" }}><b>Ghế ngồi:</b> <b>{seats.map((s) => s.name || s).join(", ")}</b></div>
                      <div style={{ marginBottom: "1px" }}><b>Khách hàng:</b> {bill?.user?.name || bill?.user?.username}</div>
                      <div style={{ marginBottom: "1px" }}><b>Mã đặt vé:</b> <b>{bookingCode}</b></div>
                    </div>

                    {/* QR Section */}
                    <div style={{ textAlign: "center", borderBottom: "1.5px dashed #000000", paddingBottom: "12px", marginBottom: "10px" }}>
                      <div style={{ fontSize: "15px", fontWeight: 900, marginBottom: "10px" }}>
                        TỔNG TIỀN: {bill?.price ? `${bill.price.toLocaleString("vi-VN")} đ` : "0 đ"}
                      </div>
                      <div style={{ display: "inline-block", padding: "6px", border: "1.5px solid #000000", borderRadius: "4px", backgroundColor: "#fff" }}>
                        <QRCodeSVG id="ticket-qr-svg-preview" value={bookingCode} size={135} level="H" includeMargin={false} />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 800, marginTop: "6px", letterSpacing: "0.5px" }}>
                        {bookingCode}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: "center", fontSize: "10.5px", color: "#333", lineHeight: "1.5" }}>
                      <div>Vé đã bao gồm 10% VAT.</div>
                      <div>Chúc quý khách xem phim vui vẻ!</div>
                    </div>
                  </div>

                  {/* Right side Action Info */}
                  <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
                        Thông tin xác nhận vé
                      </h4>
                      <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>
                        Đơn đặt vé đã được thanh toán thành công và có mã hợp lệ trong hệ thống. Bạn có thể nhấn <b>Xác nhận & In vé xem phim</b> để in vé giao cho khách.
                      </p>
                      <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px" }}>
                        <div style={{ marginBottom: "6px" }}><b>Tên phim:</b> {movie?.name}</div>
                        <div style={{ marginBottom: "6px" }}><b>Khách hàng:</b> {bill?.user?.name || bill?.user?.username} ({bill?.user?.email})</div>
                        <div style={{ marginBottom: "6px" }}><b>Số ghế:</b> {seats.map((s) => s.name || s).join(", ")}</div>
                        <div><b>Tổng thanh toán:</b> <span style={{ color: "#e87722", fontWeight: 800 }}>{bill?.price ? `${bill.price.toLocaleString("vi-VN")} đ` : "---"}</span></div>
                      </div>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                      {checkResult.status === "VALID" && (
                        <button
                          onClick={() => handleConfirmCheckInAndPrint(bill.id)}
                          disabled={loading}
                          style={{
                            flex: 1,
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            border: "none",
                            padding: "14px 20px",
                            borderRadius: "8px",
                            fontWeight: 800,
                            fontSize: "15px",
                            cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)"
                          }}
                        >
                          🖨️ XÁC NHẬN VÀ IN VÉ
                        </button>
                      )}

                      {checkResult.status === "ALREADY_CHECKED_IN" && (
                        <button
                          onClick={printTicketDirectly}
                          style={{
                            flex: 1,
                            backgroundColor: "#e87722",
                            color: "#fff",
                            border: "none",
                            padding: "14px 20px",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "15px",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(232, 119, 34, 0.3)"
                          }}
                        >
                          🖨️ In Lại Vé (Re-print)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}