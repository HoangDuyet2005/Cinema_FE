import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import billsApi from "../../api/billsApi";
import { QRCodeSVG } from "qrcode.react";
import formatDate from "../../utilities/formatDate";
import Swal from "sweetalert2";

export default function StaffCheckTicket() {
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const scannerRef = useRef(null);

  const handleSearchCode = async (codeToSearch) => {
    const searchCode = codeToSearch || inputCode;
    if (!searchCode.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập hoặc quét mã vé!", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await billsApi.checkTicket(searchCode.trim());
      setCheckResult(res.data);
    } catch (err) {
      console.error("Lỗi kiểm tra vé:", err);
      Swal.fire("Lỗi", err?.response?.data?.message || err?.message || "Không thể kiểm tra mã vé!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckInAndPrint = async (billId) => {
    try {
      setLoading(true);
      const res = await billsApi.confirmCheckIn(billId);
      Swal.fire("Thành công", "Đã xác nhận nhận vé thành công!", "success");

      setCheckResult((prev) => ({
        ...prev,
        status: "ALREADY_CHECKED_IN",
        message: "Vé này đã được nhận / in trước đó!",
        billDetail: res.data,
      }));

      setTimeout(() => {
        printTicketDirectly();
      }, 150);
    } catch (err) {
      console.error("Lỗi xác nhận nhận vé:", err);
      Swal.fire("Lỗi", err?.response?.data?.message || err?.message || "Không thể xác nhận nhận vé!", "error");
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

    const billDetail = checkResult?.billDetail;
    const m = billDetail?.schedule?.movie;
    const b = billDetail?.schedule?.branch;
    const r = billDetail?.schedule?.room;
    const s = billDetail?.schedule;
    const stList = billDetail?.seats || [];
    const foodList = billDetail?.foods || [];
    const bCode = billDetail?.bookingCode || (billDetail?.id ? `WC2026-${String(billDetail.id).padStart(6, "0")}` : inputCode);
    const dateFormatted = s?.startDate ? (formatDate(s.startDate)?.dateFull || s.startDate) : "";

    const qrMovieSvgEl = document.getElementById("ticket-qr-svg-preview");
    const qrMovieSvgHtml = qrMovieSvgEl ? qrMovieSvgEl.outerHTML : "";

    const qrFoodSvgEl = document.getElementById("food-ticket-qr-svg-preview");
    const qrFoodSvgHtml = qrFoodSvgEl ? qrFoodSvgEl.outerHTML : qrMovieSvgHtml;

    // Tính tổng tiền bắp nước và tiền vé
    const totalFoodAmount = foodList.reduce((sum, f) => sum + (f.price || 0) * (f.quantity || 1), 0);
    const totalTicketAmount = (billDetail?.price || 0) - totalFoodAmount;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Vé & Phiếu Bắp Nước - ${bCode}</title>
          <style>
            @page {
              size: auto;
              margin: 8mm;
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
              flex-direction: column;
              align-items: center;
              gap: 20px;
              padding-top: 10px;
            }
            .ticket-card {
              width: 340px;
              border: 1.5px dashed #000000;
              padding: 18px 20px;
              background: #ffffff;
              color: #000000;
              page-break-inside: avoid;
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
            @media print {
              .page-break {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <!-- 1. VÉ XEM PHIM RIÊNG BIỆT -->
          <div class="ticket-card ${foodList.length > 0 ? "page-break" : ""}">
            <div class="ticket-header">
              <h2>WORLD CINEMA</h2>
              <div class="branch-name">${b?.name || "WORLD CINEMA Hà Đông"}</div>
              <div class="branch-address">${b?.address || ""}</div>
              <div class="ticket-type">🎟️ VÉ XEM PHIM / MOVIE TICKET</div>
            </div>

            <div class="ticket-body">
              <div class="row-line"><b>Phim:</b> ${m?.name || ""}</div>
              <div class="row-line"><b>Suất chiếu:</b> <b>${s?.startTime ? `${s.startTime}, ` : ""}${dateFormatted}</b></div>
              <div class="row-line"><b>Phòng chiếu:</b> <b>${r?.name || ""} (${r?.format || "2D"})</b></div>
              <div class="row-line"><b>Ghế ngồi:</b> <b>${stList.map((st) => st.name || st).join(", ")}</b></div>
              <div class="row-line"><b>Khách hàng:</b> ${billDetail?.user?.name || billDetail?.user?.username || ""}</div>
              <div class="row-line"><b>Mã đặt vé:</b> <b>${bCode}</b></div>
            </div>

            <div class="ticket-qr-section">
              <div class="total-amount">TIỀN VÉ: ${totalTicketAmount.toLocaleString("vi-VN")} đ</div>
              <div class="ticket-qr-box">
                ${qrMovieSvgHtml}
              </div>
              <div class="ticket-code-text">${bCode}</div>
            </div>

            <div class="ticket-footer">
              <div>Vé đã bao gồm 10% VAT.</div>
              <div>Chúc quý khách xem phim vui vẻ!</div>
            </div>
          </div>

          <!-- 2. PHIẾU BẮP NƯỚC & COMBO RIÊNG BIỆT (NẾU CÓ ĐỒ ĂN) -->
          ${
            foodList.length > 0
              ? `
          <div class="ticket-card">
            <div class="ticket-header">
              <h2>WORLD CINEMA</h2>
              <div class="branch-name">${b?.name || "WORLD CINEMA Hà Đông"}</div>
              <div class="branch-address">Quầy Bắp Nước (Concession Counter)</div>
              <div class="ticket-type">🍿 PHIẾU BẮP NƯỚC & COMBO</div>
            </div>

            <div class="ticket-body">
              <div class="row-line"><b>Mã đặt vé:</b> <b>${bCode}</b></div>
              <div class="row-line"><b>Khách hàng:</b> ${billDetail?.user?.name || billDetail?.user?.username || ""}</div>
              <div class="row-line"><b>Thời gian xuất:</b> ${new Date().toLocaleString("vi-VN")}</div>
              <div style="margin-top: 6px; border-top: 1px dashed #444; padding-top: 6px;">
                <b>Danh sách món ăn & combo:</b>
                ${foodList
                  .map(
                    (f) => `
                  <div style="display: flex; justify-content: space-between; margin-top: 3px;">
                    <span>• ${f.quantity}x ${f.foodName || f.name}</span>
                    <b>${((f.price || 0) * (f.quantity || 1)).toLocaleString("vi-VN")} đ</b>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>

            <div class="ticket-qr-section">
              <div class="total-amount">TIỀN BẮP NƯỚC: ${totalFoodAmount.toLocaleString("vi-VN")} đ</div>
              <div class="ticket-qr-box">
                ${qrFoodSvgHtml}
              </div>
              <div class="ticket-code-text">${bCode}-FOOD</div>
            </div>

            <div class="ticket-footer">
              <div>Vui lòng xuất trình phiếu này tại quầy Concession để nhận bắp nước.</div>
              <div>Xin cảm ơn quý khách!</div>
            </div>
          </div>
          `
              : ""
          }
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 500);
  };

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
        (error) => {}
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
  const foods = bill?.foods || [];
  const bookingCode =
    bill?.bookingCode ||
    (bill?.id ? `WC2026-${String(bill.id).padStart(6, "0")}` : inputCode);

  const totalFoodAmount = foods.reduce((sum, f) => sum + (f.price || 0) * (f.quantity || 1), 0);
  const totalTicketAmount = (bill?.price || 0) - totalFoodAmount;

  return (
    <div style={{ padding: "30px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>
            SOÁT VÉ & IN VÉ TẠI QUẦY (QUÉT MÃ QR)
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Quét mã QR từ điện thoại khách hàng hoặc nhập mã đặt vé để xác nhận và in vé xem phim & phiếu bắp nước.
          </p>
        </div>

        {/* Input & Scanner Tool */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            marginBottom: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Nhập mã đặt vé (ví dụ: WC2026-123456 hoặc mã số)..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchCode()}
              style={{
                flex: 1,
                minWidth: "260px",
                padding: "14px 18px",
                fontSize: "15px",
                borderRadius: "8px",
                border: "1.5px solid #cbd5e1",
                outline: "none",
                fontWeight: "600",
              }}
            />
            <button
              onClick={() => handleSearchCode()}
              disabled={loading}
              style={{
                backgroundColor: "#004b91",
                color: "#ffffff",
                border: "none",
                padding: "14px 28px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              {loading ? "Đang tìm..." : "🔍 KIỂM TRA MÃ"}
            </button>
            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              style={{
                backgroundColor: isCameraActive ? "#ef4444" : "#ea580c",
                color: "#ffffff",
                border: "none",
                padding: "14px 24px",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              {isCameraActive ? "✕ Đóng Camera" : "📷 Quét Mã QR Camera"}
            </button>
          </div>

          {isCameraActive && (
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
              <div id="qr-reader-container" style={{ width: "360px" }} />
            </div>
          )}
        </div>

        {/* Check Result Container */}
        {checkResult && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              marginBottom: "40px",
            }}
          >
            {/* Status Banner */}
            <div
              style={{
                padding: "18px 24px",
                backgroundColor:
                  checkResult.status === "VALID"
                    ? "#f0fdf4"
                    : checkResult.status === "ALREADY_CHECKED_IN"
                    ? "#fff7ed"
                    : "#fef2f2",
                borderBottom: `2px solid ${
                  checkResult.status === "VALID"
                    ? "#16a34a"
                    : checkResult.status === "ALREADY_CHECKED_IN"
                    ? "#ea580c"
                    : "#ef4444"
                }`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "800",
                    color:
                      checkResult.status === "VALID"
                        ? "#166534"
                        : checkResult.status === "ALREADY_CHECKED_IN"
                        ? "#9a3412"
                        : "#991b1b",
                  }}
                >
                  {checkResult.status === "VALID" && "✓ MÃ VÉ HỢP LỆ - SẴN SÀNG IN VÉ"}
                  {checkResult.status === "ALREADY_CHECKED_IN" && "⚠️ VÉ NÀY ĐÃ ĐƯỢC NHẬN / IN TRƯỚC ĐÓ"}
                  {checkResult.status !== "VALID" && checkResult.status !== "ALREADY_CHECKED_IN" && "✕ MÃ VÉ KHÔNG HỢP LỆ"}
                </span>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  {checkResult.message}
                </p>
              </div>

              {checkResult.status === "VALID" && (
                <button
                  onClick={() => handleConfirmCheckInAndPrint(bill.id)}
                  disabled={loading}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
                  }}
                >
                  🖨️ XÁC NHẬN & IN {foods.length > 0 ? "2 VÉ (VÉ PHIM + BẮP NƯỚC)" : "VÉ XEM PHIM"}
                </button>
              )}
            </div>

            {/* Bill Info Body - 2 Vé Riêng Biệt */}
            {bill && (
              <div style={{ padding: "30px 24px" }}>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
                  {/* 1. TICKET PREVIEW 1: VÉ XEM PHIM */}
                  <div
                    style={{
                      width: "330px",
                      border: "1.5px dashed #000000",
                      padding: "18px 20px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div style={{ textAlign: "center", borderBottom: "1.5px dashed #000000", paddingBottom: "10px", marginBottom: "12px" }}>
                      <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "900", textTransform: "uppercase" }}>
                        WORLD CINEMA
                      </h2>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", marginBottom: "3px" }}>
                        {branch?.name || "WORLD CINEMA Hà Đông"}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "#222", lineHeight: "1.35", marginBottom: "8px" }}>
                        {branch?.address || ""}
                      </div>
                      <div style={{ fontSize: "13.5px", fontWeight: "900", textTransform: "uppercase", color: "#004b91" }}>
                        🎟️ VÉ XEM PHIM / MOVIE TICKET
                      </div>
                    </div>

                    <div style={{ borderBottom: "1.5px dashed #000000", paddingBottom: "10px", marginBottom: "12px", fontSize: "12px", lineHeight: "1.7" }}>
                      <div><b>Phim:</b> {movie?.name}</div>
                      <div><b>Suất:</b> <b>{schedule?.startTime ? `${schedule.startTime}, ` : ""}{schedule?.startDate ? (formatDate(schedule.startDate)?.dateFull || schedule.startDate) : ""}</b></div>
                      <div><b>Phòng:</b> <b>{room?.name} ({room?.format || "2D"})</b></div>
                      <div><b>Ghế:</b> <b>{seats.map((s) => s.name || s).join(", ")}</b></div>
                      <div><b>Khách:</b> {bill?.user?.name || bill?.user?.username}</div>
                      <div><b>Mã vé:</b> <b>{bookingCode}</b></div>
                    </div>

                    <div style={{ textAlign: "center", borderBottom: "1.5px dashed #000000", paddingBottom: "10px", marginBottom: "10px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "900", marginBottom: "8px" }}>
                        TIỀN VÉ: {totalTicketAmount.toLocaleString("vi-VN")} đ
                      </div>
                      <div style={{ display: "inline-block", padding: "6px", border: "1.5px solid #000000", borderRadius: "4px", backgroundColor: "#fff" }}>
                        <QRCodeSVG id="ticket-qr-svg-preview" value={bookingCode} size={120} level="H" />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: "800", marginTop: "4px" }}>
                        {bookingCode}
                      </div>
                    </div>

                    <div style={{ textAlign: "center", fontSize: "10px", color: "#333", lineHeight: "1.4" }}>
                      <div>Vé đã bao gồm 10% VAT. Chúc quý khách xem phim vui vẻ!</div>
                    </div>
                  </div>

                  {/* 2. TICKET PREVIEW 2: PHIẾU BẮP NƯỚC RIÊNG BIỆT (NẾU CÓ) */}
                  {foods.length > 0 && (
                    <div
                      style={{
                        width: "330px",
                        border: "1.5px dashed #ea580c",
                        padding: "18px 20px",
                        backgroundColor: "#fffaf5",
                        boxShadow: "0 4px 12px rgba(234, 88, 12, 0.08)",
                      }}
                    >
                      <div style={{ textAlign: "center", borderBottom: "1.5px dashed #ea580c", paddingBottom: "10px", marginBottom: "12px" }}>
                        <h2 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "900", textTransform: "uppercase", color: "#c2410c" }}>
                          WORLD CINEMA
                        </h2>
                        <div style={{ fontSize: "12.5px", fontWeight: "700", marginBottom: "3px" }}>
                          {branch?.name || "WORLD CINEMA Hà Đông"}
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748b", marginBottom: "8px" }}>
                          Quầy Bắp Nước (Concession Counter)
                        </div>
                        <div style={{ fontSize: "13.5px", fontWeight: "900", textTransform: "uppercase", color: "#ea580c" }}>
                          🍿 PHIẾU BẮP NƯỚC & COMBO
                        </div>
                      </div>

                      <div style={{ borderBottom: "1.5px dashed #ea580c", paddingBottom: "10px", marginBottom: "12px", fontSize: "12px", lineHeight: "1.7" }}>
                        <div><b>Mã vé:</b> <b>{bookingCode}</b></div>
                        <div><b>Khách:</b> {bill?.user?.name || bill?.user?.username}</div>
                        <div><b>Thời gian:</b> {new Date().toLocaleTimeString("vi-VN")}</div>
                        <div style={{ marginTop: "6px", borderTop: "1px dashed #fed7aa", paddingTop: "6px" }}>
                          <b>Món ăn & Combo:</b>
                          {foods.map((f, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                              <span>• {f.quantity}x {f.foodName || f.name}</span>
                              <b>{((f.price || 0) * (f.quantity || 1)).toLocaleString("vi-VN")} đ</b>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ textAlign: "center", borderBottom: "1.5px dashed #ea580c", paddingBottom: "10px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "900", color: "#c2410c", marginBottom: "8px" }}>
                          TIỀN BẮP NƯỚC: {totalFoodAmount.toLocaleString("vi-VN")} đ
                        </div>
                        <div style={{ display: "inline-block", padding: "6px", border: "1.5px solid #ea580c", borderRadius: "4px", backgroundColor: "#fff" }}>
                          <QRCodeSVG id="food-ticket-qr-svg-preview" value={`${bookingCode}-FOOD`} size={120} level="H" />
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: "800", marginTop: "4px", color: "#ea580c" }}>
                          {bookingCode}-FOOD
                        </div>
                      </div>

                      <div style={{ textAlign: "center", fontSize: "10px", color: "#9a3412", lineHeight: "1.4" }}>
                        <div>Xuất trình phiếu này tại quầy Concession để nhận bắp nước!</div>
                      </div>
                    </div>
                  )}

                  {/* 3. BẢNG TÓM TẮT & NÚT THAO TÁC */}
                  <div style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "17px", fontWeight: "800", color: "#1e293b" }}>
                        Chi tiết đơn đặt vé & bắp nước
                      </h4>
                      <p style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px" }}>
                        Hệ thống tự động phân tách thành <b>2 phiếu in riêng biệt</b>: 1 Vé xem phim để vào phòng chiếu và 1 Phiếu nhận bắp nước tại quầy Concession.
                      </p>

                      <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}>
                        <div style={{ marginBottom: "6px" }}><b>Phim:</b> {movie?.name}</div>
                        <div style={{ marginBottom: "6px" }}><b>Ghế:</b> {seats.map((s) => s.name || s).join(", ")} ({totalTicketAmount.toLocaleString("vi-VN")} đ)</div>
                        {foods.length > 0 && (
                          <div style={{ marginBottom: "6px" }}>
                            <b>Bắp nước:</b> {foods.map((f) => `${f.quantity}x ${f.foodName || f.name}`).join(", ")} ({totalFoodAmount.toLocaleString("vi-VN")} đ)
                          </div>
                        )}
                        <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "6px", marginTop: "6px" }}>
                          <b>Tổng thanh toán:</b> <span style={{ color: "#ea580c", fontWeight: "900", fontSize: "15px" }}>{bill?.price ? `${bill.price.toLocaleString("vi-VN")} đ` : "---"}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                      {checkResult.status === "VALID" && (
                        <button
                          onClick={() => handleConfirmCheckInAndPrint(bill.id)}
                          disabled={loading}
                          style={{
                            flex: 1,
                            backgroundColor: "#16a34a",
                            color: "#ffffff",
                            border: "none",
                            padding: "14px 20px",
                            borderRadius: "8px",
                            fontWeight: "800",
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
                          }}
                        >
                          🖨️ XÁC NHẬN & IN {foods.length > 0 ? "2 VÉ" : "VÉ"}
                        </button>
                      )}

                      {checkResult.status === "ALREADY_CHECKED_IN" && (
                        <button
                          onClick={printTicketDirectly}
                          style={{
                            flex: 1,
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
                          🖨️ In Lại {foods.length > 0 ? "2 Vé" : "Vé"} (Re-print)
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