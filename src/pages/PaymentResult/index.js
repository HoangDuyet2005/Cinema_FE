import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import bookingApi from "../../api/bookingApi";

export default function PaymentResult() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get("vnp_ResponseCode");
    const orderInfo = searchParams.get("vnp_OrderInfo");
    const transactionNo = searchParams.get("vnp_TransactionNo") || "";
    const bankCode = searchParams.get("vnp_BankCode") || "VNPay";

    if (orderInfo && orderInfo.startsWith("PAY_")) {
      const parts = orderInfo.split("_");
      const userId = Number(parts[1]) || 1;
      const scheduleId = Number(parts[2]);
      const listSeatIds = parts[3] ? parts[3].split("-").map(Number).filter(Boolean) : [];
      const foodsStr = parts[4];
      const foods = [];
      if (foodsStr && foodsStr !== "0" && foodsStr !== "none") {
        foodsStr.split("-").forEach((item) => {
          const [fId, qty] = item.split("x").map(Number);
          if (fId && qty) {
            foods.push({ foodId: fId, quantity: qty });
          }
        });
      }

      // Xác minh lại chữ ký (vnp_SecureHash) với BE trước khi tin vào kết quả trên URL - trước đây
      // chỉ đọc vnp_ResponseCode từ query string, cho phép ai đó tự gõ URL này để lấy vé miễn phí
      // mà không cần thanh toán thật.
      bookingApi
        .verifyPaymentReturn(searchParams)
        .then((verifyRes) => {
          const { valid, responseCode: verifiedCode } = verifyRes?.data || {};
          if (!valid || verifiedCode !== "00" || responseCode !== "00") {
            bookingApi.releaseSeats({ scheduleId, seatIds: listSeatIds, userId }).catch(() => {});
            alert(
              valid
                ? "Giao dịch thanh toán chưa hoàn tất hoặc đã bị hủy."
                : "Không thể xác minh giao dịch thanh toán (chữ ký không hợp lệ)."
            );
            history.replace(`/datvechitiet/${scheduleId}/1/1/2026-08-21/1/19:00:00`);
            return;
          }

          // 1. Lưu vé và bắp nước vào CSDL (chỉ sau khi đã xác minh giao dịch VNPay hợp lệ)
          bookingApi
            .postDatVe({ userId, scheduleId, listSeatIds, foods })
            .then(async (res) => {
              const createdBill = res?.data?.data || res?.data;
              const billId = createdBill?.id;

              // Giải phóng in-memory holding
              bookingApi.releaseSeats({ scheduleId, seatIds: listSeatIds, userId }).catch(() => {});

              // Lấy thông tin lịch chiếu để quay về đúng trang đặt vé chi tiết ở Bước Xác Nhận
              try {
                const schedRes = await bookingApi.getScheduleById(scheduleId);
                const sched = schedRes?.data?.data || schedRes?.data;
                const bId = sched?.branch?.id || 1;
                const mId = sched?.movie?.id || 1;
                const sDate = sched?.startDate || "2026-08-21";
                const rId = sched?.room?.id || 1;
                const sTime = sched?.startTime || "19:00:00";

                history.replace(
                  `/datvechitiet/${scheduleId}/${bId}/${mId}/${sDate}/${rId}/${sTime}?step=confirm&billId=${billId}&transNo=${transactionNo}&bank=${bankCode}`
                );
              } catch (err) {
                history.replace(
                  `/datvechitiet/${scheduleId}/1/1/2026-08-21/1/19:00:00?step=confirm&billId=${billId}`
                );
              }
            })
            .catch((err) => {
              console.error("Lỗi khi lưu đơn hàng:", err);
              history.replace("/");
            });
        })
        .catch((err) => {
          console.error("Lỗi khi xác minh giao dịch VNPay:", err);
          bookingApi.releaseSeats({ scheduleId, seatIds: listSeatIds, userId }).catch(() => {});
          history.replace(`/datvechitiet/${scheduleId}/1/1/2026-08-21/1/19:00:00`);
        });
    } else {
      history.replace("/");
    }
  }, [location.search, history]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <div style={{ fontSize: "36px", marginBottom: "16px" }}>⏳</div>
      <h3 style={{ margin: "0 0 8px 0", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>
        Đang chuyển về trang Xác nhận đơn đặt vé...
      </h3>
      <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
        Vui lòng đợi trong giây lát trong khi hệ thống hoàn tất ghi nhận đơn hàng!
      </p>
    </div>
  );
}