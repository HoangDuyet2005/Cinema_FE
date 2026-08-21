import React from "react";
import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";

export default function PopUp(props) {
  const classes = useStyles();
  const ThongTin = props.ThongTin?.data || props.ThongTin;

  const movie = ThongTin?.schedule?.movie;
  const branch = ThongTin?.schedule?.branch;
  const room = ThongTin?.schedule?.room;
  const schedule = ThongTin?.schedule;
  const user = ThongTin?.user;
  const seats = ThongTin?.seats || [];
  const price = ThongTin?.price != null ? Number(ThongTin.price) : 0;

  return (
    <div className={classes.resultBookticket} style={{ padding: "20px" }}>
      <div className={classes.infoTicked}>
        <div className={classes.infoTicked__img}>
          <img
            style={{ width: "180px", borderRadius: "8px", objectFit: "cover" }}
            src={movie?.smallImageURl || movie?.largeImageURL || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"}
            alt={movie?.name || "Poster Phim"}
          />
        </div>
        <div className={classes.infoTicked__txt}>
          <p className={classes.tenPhim} style={{ fontSize: "20px", fontWeight: 700, color: "#e87722" }}>
            {movie?.name || "Thông tin phim"}
          </p>
          <p className={classes.text__first}>
            <span>{branch?.name ? branch.name.split("-")[0] : "Rạp"}</span>
            {branch?.phoneNo && <span className={classes.text__second}> - {branch.phoneNo}</span>}
          </p>
          <p className={classes.diaChi}>{branch?.address || ""}</p>
          <table className={classes.table}>
            <tbody>
              <tr>
                <td valign="top" style={{ width: "100px", fontWeight: 600 }}>Lịch chiếu:</td>
                <td valign="top">
                  {schedule?.startTime ? `${schedule.startTime}, ` : ""}
                  {schedule?.startDate ? formatDate(schedule.startDate).dateFull : "N/A"}
                </td>
              </tr>
              <tr>
                <td valign="top" style={{ fontWeight: 600 }}>Phòng chiếu:</td>
                <td>{room?.name || "N/A"}</td>
              </tr>
              <tr>
                <td valign="top" style={{ fontWeight: 600 }}>Ghế:</td>
                <td>
                  {seats.length > 0 ? (
                    seats.map((seat, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#f26b38",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: 600,
                          fontSize: "12px",
                          marginRight: "6px",
                          display: "inline-block",
                          marginBottom: "4px"
                        }}
                      >
                        {seat?.name || seat}
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

      <div style={{ marginTop: "20px", borderTop: "1px dashed #e2e8f0", paddingTop: "15px" }}>
        <h3 className={classes.infoResult_label} style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "12px" }}>
          Thông tin hóa đơn thanh toán
        </h3>
        <table className={`${classes.table} table`}>
          <tbody>
            <tr>
              <td valign="top" style={{ width: "140px", fontWeight: 600 }}>Mã hóa đơn:</td>
              <td valign="top"><strong>#{ThongTin?.id || "N/A"}</strong></td>
            </tr>
            <tr>
              <td valign="top" style={{ fontWeight: 600 }}>Người đặt vé:</td>
              <td>{user?.name || user?.username || "Khách hàng"}</td>
            </tr>
            <tr>
              <td valign="top" style={{ fontWeight: 600 }}>Email:</td>
              <td>{user?.email || "N/A"}</td>
            </tr>
            <tr>
              <td valign="top" style={{ fontWeight: 600 }}>Trạng thái:</td>
              <td>
                {ThongTin?.status === "SUCCESS" && <span style={{ color: "#16a34a", fontWeight: 700 }}>✅ Đã thanh toán</span>}
                {ThongTin?.status === "WAITING_PAYMENT" && <span style={{ color: "#d97706", fontWeight: 700 }}>⏳ Chờ thanh toán</span>}
                {ThongTin?.status === "EXPIRATION" && <span style={{ color: "#dc2626", fontWeight: 700 }}>❌ Đã hủy / Hết hạn</span>}
                {!ThongTin?.status && <span>N/A</span>}
              </td>
            </tr>
            <tr>
              <td valign="top" style={{ fontWeight: 600 }}>Số lượng vé:</td>
              <td valign="top"><span>{ThongTin?.amountTicket || seats.length || 0} vé</span></td>
            </tr>
            <tr>
              <td valign="top" style={{ fontWeight: 600 }}>Tổng tiền:</td>
              <td valign="top"><strong style={{ color: "#e87722", fontSize: "16px" }}>{price.toLocaleString("vi-VN")} đ</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}