import React from "react";
import useStyles from "./style";
import ListSeat from "../ListSeat";
import PayMent from "../PayMent";
import StepCheckout from "./StepCheckout";
import ResultBookticket from "../ResultBookticket";
import { useSelector } from "react-redux";

export default function Index() {
  const classes = useStyles();
  const { activeStep, listSeatSelected, amount } = useSelector((state) => state.bookTicketReducer);

  return (
    <div className={classes.bookTicked}>
      <section className={classes.left}>
        <StepCheckout />
        {activeStep === 0 && <ListSeat />}
        {activeStep === 1 && (
          <div style={{ padding: "30px 50px", backgroundColor: "#fff", minHeight: "80vh" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b", marginBottom: "8px" }}>
              XÁC NHẬN ĐƠN HÀNG VÀ THANH TOÁN
            </h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "25px" }}>
              Vui lòng kiểm tra lại thông tin vé và chọn phương thức thanh toán phù hợp ở bảng bên phải để hoàn tất giao dịch.
            </p>

            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "25px"
            }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a", marginBottom: "15px" }}>
                Danh sách ghế đã chọn ({listSeatSelected?.length || 0} ghế):
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "15px" }}>
                {listSeatSelected?.map((seat) => (
                  <span
                    key={seat}
                    style={{
                      backgroundColor: "#f26b38",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "14px"
                    }}
                  >
                    Ghế {seat}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "15px", color: "#334155", margin: 0 }}>
                Tổng cộng tiền vé: <b style={{ color: "#f26b38", fontSize: "18px" }}>{amount?.toLocaleString("vi-VN")} đ</b>
              </p>
            </div>

            <div style={{
              backgroundColor: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "10px",
              padding: "16px 20px",
              fontSize: "13px",
              color: "#9a3412",
              lineHeight: "1.6"
            }}>
              <p style={{ fontWeight: 600, marginBottom: "4px" }}>📌 Lưu ý quan trọng:</p>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>Vé đã mua không thể hoàn tiền hoặc đổi sang suất chiếu khác sau khi thanh toán thành công.</li>
                <li>Thời gian giao dịch trên cổng thanh toán trực tuyến là tối đa 15 phút.</li>
                <li>Vui lòng mang theo mã vé hoặc email xác nhận khi đến rạp nhận vé tại quầy/kiosk.</li>
              </ul>
            </div>
          </div>
        )}
        {activeStep === 2 && <ResultBookticket />}
      </section>
      <section className={classes.right}>
        <PayMent />
      </section>
    </div>
  );
}