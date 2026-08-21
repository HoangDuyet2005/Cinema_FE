import React from "react";
import useStyles from "./style";
import ListSeat from "../ListSeat";
import FoodSelection from "../FoodSelection";
import PayMent from "../PayMent";
import StepCheckout from "./StepCheckout";
import ResultBookticket from "../ResultBookticket";
import { useSelector } from "react-redux";

export default function Index() {
  const classes = useStyles();
  const {
    activeStep,
    listSeatSelected,
    amount,
    selectedFoods,
    foodAmount,
  } = useSelector((state) => state.bookTicketReducer);

  return (
    <div className={classes.bookTicked}>
      <section className={classes.left}>
        <StepCheckout />

        {/* Bước 0: Chọn ghế */}
        {activeStep === 0 && <ListSeat />}

        {/* Bước 1: Chọn combo thức ăn & nước uống */}
        {activeStep === 1 && <FoodSelection />}

        {/* Bước 2: Xác nhận đơn hàng & Chọn cổng thanh toán */}
        {activeStep === 2 && (
          <div style={{ padding: "30px 40px", backgroundColor: "#fff", minHeight: "80vh" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
              XÁC NHẬN THÔNG TIN ĐƠN ĐẶT VÉ
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "25px" }}>
              Vui lòng kiểm tra lại danh sách ghế, combo bắp nước và nhấn nút "Thanh toán" ở bảng bên phải để hoàn tất giao dịch.
            </p>

            {/* Chi tiết ghế */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                1. Ghế đã chọn ({listSeatSelected?.length || 0} ghế):
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                {listSeatSelected?.map((seat) => (
                  <span
                    key={seat}
                    style={{
                      backgroundColor: "#ea580c",
                      color: "#fff",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  >
                    Ghế {seat}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "14px", color: "#334155", margin: 0 }}>
                Tiền vé: <b style={{ color: "#ea580c" }}>{amount?.toLocaleString("vi-VN")} đ</b>
              </p>
            </div>

            {/* Chi tiết combo bắp nước */}
            {selectedFoods && selectedFoods.length > 0 && (
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
                  2. Combo bắp nước & Snack ({selectedFoods.length} sản phẩm):
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
                  {selectedFoods.map((f) => (
                    <div
                      key={f.id}
                      style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#334155" }}
                    >
                      <span>
                        • {f.quantity}x {f.name}
                      </span>
                      <b>{(f.price * f.quantity).toLocaleString("vi-VN")} đ</b>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "14px", color: "#334155", margin: 0 }}>
                  Tiền bắp nước: <b style={{ color: "#ea580c" }}>{(foodAmount || 0).toLocaleString("vi-VN")} đ</b>
                </p>
              </div>
            )}

            {/* Lưu ý thanh toán */}
            <div
              style={{
                backgroundColor: "#fff7ed",
                border: "1px solid #fed7aa",
                borderRadius: "10px",
                padding: "16px 20px",
                fontSize: "13px",
                color: "#9a3412",
                lineHeight: "1.6",
              }}
            >
              <p style={{ fontWeight: 700, marginBottom: "4px" }}>📌 Lưu ý giao dịch:</p>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>Hệ thống sẽ giữ ghế trong vòng 10 phút để quý khách hoàn tất thanh toán.</li>
                <li>Vé đã thanh toán thành công sẽ được gửi trực tiếp qua Email và hiển thị mã QR tại trang kết quả.</li>
                <li>Vui lòng kiểm tra kỹ độ tuổi xem phim quy định trước khi xác nhận.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Bước 3: Kết quả đặt vé */}
        {activeStep === 3 && <ResultBookticket />}
      </section>

      {/* Cột tóm tắt cố định bên phải */}
      <section className={classes.right}>
        <PayMent />
      </section>
    </div>
  );
}