import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Swal from "sweetalert2";
import bookingApi from "../../../api/bookingApi";
import theatersApi from "../../../api/theatersApi";
import {
  CHANGE_LISTSEAT,
  SET_ALERT_OVER10,
} from "../../../reducers/constants/BookTicket";

export default function ListSeat() {
  const dispatch = useDispatch();
  const history = useHistory();
  const param = useParams();

  const { listSeat, listSeatSelected } = useSelector(
    (state) => state.bookTicketReducer
  );
  const currentUser = useSelector((state) => state.authReducer.currentUser);
  const currentUserId = currentUser?.data?.id || currentUser?.id || 1;

  const [scheduleItem, setScheduleItem] = useState(null);
  const [siblingSchedules, setSiblingSchedules] = useState([]);
  const [soGhe, setSoGhe] = useState(10);
  const stompClientRef = useRef(null);

  // 1. Tải thông tin Suất chiếu hiện tại
  useEffect(() => {
    if (param.maLichChieu) {
      bookingApi
        .getScheduleById(param.maLichChieu)
        .then((res) => {
          if (res.data?.data) {
            setScheduleItem(res.data.data);
          }
        })
        .catch((err) => console.log("Lỗi tải chi tiết suất chiếu:", err));
    }
  }, [param.maLichChieu]);

  // 2. Kết nối WebSocket Realtime để đồng bộ khóa ghế tức thì giữa các người dùng
  useEffect(() => {
    let stompClient = null;
    let socket = null;
    try {
      socket = new SockJS("http://localhost:8080/ws-cinema");
      stompClient = Stomp.over(socket);
      stompClient.debug = () => {};

      stompClient.connect(
        {},
        () => {
          stompClientRef.current = stompClient;
          if (param?.maLichChieu) {
            stompClient.send(
              "/app/seats/register",
              {},
              JSON.stringify({
                scheduleId: Number(param.maLichChieu),
                userId: Number(currentUserId),
              })
            );

            stompClient.subscribe(
              `/topic/seats/${param.maLichChieu}`,
              (message) => {
                try {
                  const event = JSON.parse(message.body);
                  if (
                    event.userId &&
                    Number(event.userId) === Number(currentUserId)
                  ) {
                    return; // Bỏ qua message từ chính mình
                  }

                  if (event.holdingSeatIds) {
                    dispatch({
                      type: "SYNC_HOLDING_SEATS",
                      payload: { holdingSeatIds: event.holdingSeatIds },
                    });
                  } else if (event.seatId !== undefined && event.isOccupied !== undefined) {
                    dispatch({
                      type: "UPDATE_SEAT_REALTIME",
                      payload: {
                        seatId: event.seatId,
                        isOccupied: event.isOccupied,
                      },
                    });
                  }
                } catch (err) {
                  console.error("Lỗi xử lý WebSocket:", err);
                }
              }
            );
          }
        },
        (err) => {
          console.warn("Cảnh báo kết nối WebSocket:", err);
        }
      );
    } catch (e) {
      console.warn("Lỗi khởi tạo SockJS:", e);
    }

    return () => {
      if (stompClientRef.current) {
        try {
          stompClientRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, [param?.maLichChieu, currentUserId, dispatch]);

  // 3. Tải danh sách các suất chiếu THỰC TẾ từ Database đúng phòng chiếu / rạp
  useEffect(() => {
    const movieId = param.maPhim || scheduleItem?.movie?.id;
    const branchId = param.maRap || scheduleItem?.branch?.id;
    const dateStr = param.ngayChieu || scheduleItem?.startDate;
    const roomId = param.maPhong || scheduleItem?.room?.id;

    if (movieId && branchId && dateStr) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;

      theatersApi
        .getLichCoPhong(movieId, branchId, dateStr, roomId || 4)
        .then((res) => {
          const contents = res.data?.data?.content || [];
          const filtered = contents
            .filter((s) => {
              const sDate = s.startDate ? s.startDate.slice(0, 10) : "";
              if (sDate !== dateStr) return false;

              // LỌC CHÍNH XÁC THEO PHÒNG CHIẾU ĐANG CHỌN
              if (roomId && String(s.room?.id) !== String(roomId)) {
                return false;
              }

              // Nếu là ngày hôm nay, chỉ lấy các suất chiếu CHƯA DIỄN RA
              if (sDate === todayStr && s.startTime && s.startTime <= currentTimeStr) {
                return false;
              }
              return true;
            })
            .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));

          // Loại bỏ trùng lặp giờ chiếu
          const uniqueSchedules = [];
          const seenTimes = new Set();
          filtered.forEach((s) => {
            const t = s.startTime ? s.startTime.slice(0, 5) : "";
            if (!seenTimes.has(t)) {
              seenTimes.add(t);
              uniqueSchedules.push(s);
            }
          });

          setSiblingSchedules(uniqueSchedules);
        })
        .catch((err) => console.log("Lỗi tải suất chiếu cùng phòng:", err));
    }
  }, [param.maLichChieu, param.maPhim, param.maRap, param.ngayChieu, param.maPhong, scheduleItem]);

  // Xử lý chuyển đổi suất chiếu khi click nút giờ
  const handleSwitchSchedule = (sched) => {
    const bId = sched.branch?.id || param.maRap || 1;
    const rId = sched.room?.id || param.maPhong || 1;
    const mId = sched.movie?.id || param.maPhim || 1;
    const sDate = sched.startDate || param.ngayChieu || "2026-08-21";
    const sTime = sched.startTime || "19:00:00";
    history.push(`/datvechitiet/${sched.id}/${bId}/${mId}/${sDate}/${rId}/${sTime}`);
  };

  // Helper kiểm tra loại ghế 100% từ Database
  const checkSeatType = (seat) => {
    const type = seat.seatType || seat.type;
    const isCouple =
      type === "COUPLE" ||
      type === 2 ||
      (seat.name && (seat.name.startsWith("E") || seat.name.startsWith("G")));

    const isTriple =
      type === "TRIPLE" ||
      type === 3 ||
      (seat.name && seat.name.startsWith("F"));

    const isVip =
      type === "VIP" ||
      type === 1 ||
      (seat.name && (seat.name.startsWith("C") || seat.name.startsWith("D")));

    return { isCouple, isTriple, isVip };
  };

  // Chọn ghế
  const handleSelectSeat = (seatSelected) => {
    if (seatSelected.isOccupied === 1 || seatSelected.isOccupied === 2) {
      Swal.fire({
        title: "Ghế không khả dụng!",
        text: `Ghế ${seatSelected.name || seatSelected.label} đã có người đặt hoặc đang được người khác giữ chỗ!`,
        icon: "warning",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const isCurrentlySelected = seatSelected.selected;
    const currentlySelectedCount = listSeatSelected?.length || 0;

    if (!isCurrentlySelected && currentlySelectedCount >= soGhe) {
      dispatch({ type: SET_ALERT_OVER10 });
      return;
    }

    const updatedList = listSeat.map((s) => {
      if (s.id === seatSelected.id) {
        return { ...s, selected: !isCurrentlySelected };
      }
      return s;
    });

    const updatedSelectedSeats = updatedList
      .filter((s) => s.selected)
      .map((s) => s.name || s.label);

    const basePrice = scheduleItem?.price || 75000;
    const totalAmount = updatedList
      .filter((s) => s.selected)
      .reduce((sum, s) => {
        const { isCouple, isTriple, isVip } = checkSeatType(s);
        let p = s.price;
        if (!p) {
          p = isTriple
            ? basePrice + 60000
            : isCouple
            ? basePrice + 40000
            : isVip
            ? basePrice + 15000
            : basePrice;
        }
        return sum + p;
      }, 0);

    const danhSachVe = updatedList
      .filter((s) => s.selected)
      .map((s) => ({ id: s.id }));

    dispatch({
      type: CHANGE_LISTSEAT,
      payload: {
        listSeat: updatedList,
        isSelectedSeat: updatedSelectedSeats.length > 0,
        listSeatSelected: updatedSelectedSeats,
        danhSachVe,
        amount: totalAmount,
      },
    });
  };

  // Nhóm ghế theo hàng chữ cái (A, B, C, D, E, F...)
  const rows = {};
  (listSeat || []).forEach((seat) => {
    const rawName = seat.name || seat.label || "A01";
    const rowChar = rawName.charAt(0).toUpperCase();
    if (!rows[rowChar]) {
      rows[rowChar] = [];
    }
    rows[rowChar].push(seat);
  });

  const rowKeys = Object.keys(rows).sort();

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 1. THANH CHỌN SUẤT CHIẾU CÙNG NGÀY & CÙNG PHÒNG */}
      <div
        style={{
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: "16px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: "700", color: "#475569" }}>
          Đổi suất chiếu:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {siblingSchedules.length > 0 ? (
            siblingSchedules.map((s) => {
              const isActive = String(s.id) === String(param.maLichChieu);
              const timeDisplay = s.startTime ? s.startTime.slice(0, 5) : "10:45";

              return (
                <button
                  key={s.id}
                  onClick={() => handleSwitchSchedule(s)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: isActive ? "1.5px solid #004b91" : "1px solid #cbd5e1",
                    backgroundColor: isActive ? "#004b91" : "#ffffff",
                    color: isActive ? "#ffffff" : "#1e293b",
                    fontSize: "13px",
                    fontWeight: isActive ? "800" : "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {timeDisplay}
                </button>
              );
            })
          ) : (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                backgroundColor: "#004b91",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "800",
              }}
            >
              {param.gioChieu ? param.gioChieu.slice(0, 5) : "19:00"}
            </span>
          )}
        </div>
      </div>

      {/* 2. SƠ ĐỒ GHẾ CĂN GIỮA ĐỐI XỨNG */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          margin: "10px 0 20px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          {rowKeys.map((rowKey) => {
            const seatsInRow = rows[rowKey];
            seatsInRow.sort((a, b) => {
              const numA = parseInt((a.name || a.label || "0").slice(1)) || 0;
              const numB = parseInt((b.name || b.label || "0").slice(1)) || 0;
              return numA > numB ? -1 : 1; // Sắp xếp chuẩn rạp
            });

            return (
              <div
                key={rowKey}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {/* Tên hàng bên trái */}
                <span
                  style={{
                    width: "24px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#64748b",
                    userSelect: "none",
                  }}
                >
                  {rowKey}
                </span>

                {/* Các ô ghế trong hàng */}
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {seatsInRow.map((seat) => {
                    const isOccupied = seat.isOccupied === 1 || seat.isOccupied === 2;
                    const isSelected = seat.selected;
                    const { isCouple, isTriple, isVip } = checkSeatType(seat);

                    const seatNum = seat.name ? seat.name.slice(1) : seat.label;

                    // Xác định màu nền & viền THEO ĐÚNG DỮ LIỆU DATABASE
                    let bg = "#ffffff";
                    let border = "1px solid #cbd5e1";
                    let textColor = "#1e293b";

                    if (isOccupied) {
                      bg = "#cbd5e1";
                      border = "1px solid #cbd5e1";
                      textColor = "#64748b";
                    } else if (isSelected) {
                      bg = "#ea580c";
                      border = "1px solid #ea580c";
                      textColor = "#ffffff";
                    } else if (isTriple) {
                      bg = "#ffffff";
                      border = "1.5px solid #ea580c";
                      textColor = "#ea580c";
                    } else if (isCouple) {
                      bg = "#ffffff";
                      border = "1.5px solid #004b91";
                      textColor = "#004b91";
                    } else if (isVip) {
                      bg = "#ffffff";
                      border = "1.5px solid #f59e0b";
                      textColor = "#d97706";
                    }

                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSelectSeat(seat)}
                        style={{
                          width: isTriple ? "32px" : isCouple ? "32px" : "28px",
                          height: "28px",
                          borderRadius: isTriple || isCouple ? "6px" : "4px",
                          backgroundColor: bg,
                          border: border,
                          color: textColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: isSelected ? "800" : "700",
                          cursor: isOccupied ? "not-allowed" : "pointer",
                          userSelect: "none",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isOccupied && !isSelected) {
                            e.currentTarget.style.transform = "scale(1.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isOccupied && !isSelected) {
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                      >
                        {seatNum}
                      </div>
                    );
                  })}
                </div>

                {/* Tên hàng bên phải */}
                <span
                  style={{
                    width: "24px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#64748b",
                    userSelect: "none",
                  }}
                >
                  {rowKey}
                </span>
              </div>
            );
          })}
        </div>

        {/* MÔ PHỎNG MÀN HÌNH CHIẾU */}
        <div style={{ width: "80%", maxWidth: "600px", marginTop: "32px", textAlign: "center" }}>
          <div
            style={{
              height: "3px",
              backgroundColor: "#ea580c",
              borderRadius: "2px",
              marginBottom: "8px",
            }}
          />
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600", letterSpacing: "1px" }}>
            Màn hình
          </span>
        </div>
      </div>

      {/* 3. CHÚ THÍCH 5 TRẠNG THÁI & PHÂN LOẠI GHẾ (LEGEND) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px",
          borderTop: "1px solid #f1f5f9",
          paddingTop: "20px",
        }}
      >
        {/* Ghế đã bán / Đang giữ chỗ */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#cbd5e1",
              borderRadius: "3px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đã bán / Đang giữ</span>
        </div>

        {/* Ghế đang chọn */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ea580c",
              borderRadius: "3px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đang chọn</span>
        </div>

        {/* Ghế VIP */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #f59e0b",
              borderRadius: "3px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế VIP</span>
        </div>

        {/* Ghế đơn */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "3px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đơn</span>
        </div>

        {/* Ghế đôi */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "16px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #004b91",
              borderRadius: "4px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đôi</span>
        </div>

        {/* Ghế ba */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "36px",
              height: "16px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #ea580c",
              borderRadius: "4px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế ba</span>
        </div>
      </div>
    </div>
  );
}