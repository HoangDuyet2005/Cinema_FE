import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Swal from "sweetalert2";
import bookingApi from "../../../api/bookingApi";
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

  // 1. Tải thông tin Suất chiếu hiện tại từ Database
  useEffect(() => {
    if (param.maLichChieu) {
      bookingApi
        .getScheduleById(param.maLichChieu)
        .then((res) => {
          if (res.data?.data) {
            setScheduleItem(res.data.data);
          }
        })
        .catch((err) => console.log("Lỗi tải thông tin lịch chiếu:", err));
    }
  }, [param.maLichChieu]);

  // 2. Tải danh sách các suất chiếu THỰC TẾ cùng phim, cùng rạp, cùng ngày từ Database
  useEffect(() => {
    const movieId = param.maPhim || scheduleItem?.movie?.id;
    const branchId = param.maRap || scheduleItem?.branch?.id;
    const dateStr = param.ngayChieu || scheduleItem?.startDate;

    if (movieId && branchId && dateStr) {
      bookingApi
        .getSchedules({ movieId, branchId, startDate: dateStr })
        .then((res) => {
          const list = res.data?.data || res.data || [];
          if (Array.isArray(list)) {
            // Lọc chính xác cùng phim, cùng rạp, cùng ngày
            const filtered = list
              .filter(
                (s) =>
                  Number(s.movie?.id || s.movieId) === Number(movieId) &&
                  Number(s.branch?.id || s.branchId) === Number(branchId) &&
                  s.startDate === dateStr
              )
              .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
            setSiblingSchedules(filtered);
          }
        })
        .catch((err) => console.log("Lỗi tải danh sách suất chiếu:", err));
    }
  }, [param.maPhim, param.maRap, param.ngayChieu, scheduleItem]);

  // 3. Kết nối WebSocket Realtime để đồng bộ khóa ghế tức thì giữa các người dùng
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
        (error) => {
          console.warn("WebSocket kết nối thất bại:", error);
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

  // Helper kiểm tra loại ghế 100% từ Database (NORMAL, VIP, COUPLE, TRIPLE)
  const checkSeatType = (seat) => {
    const type = seat?.type !== undefined ? seat.type : seat?.seatType;
    const isCouple = type === "COUPLE" || type === 2;
    const isTriple = type === "TRIPLE" || type === 3;
    const isVip = type === "VIP" || type === 1;
    return { isCouple, isTriple, isVip };
  };

  // Chọn ghế (Tự động chọn 2 ghế cho Ghế Đôi, 3 ghế cho Ghế Ba, 1 ghế cho VIP/Thường)
  const handleSelectSeat = (seatSelected, seatsInRow) => {
    const { isCouple, isTriple } = checkSeatType(seatSelected);

    // 1. Xác định các ghế đi liền nhau trong cụm
    let targetSeats = [seatSelected];

    if (isCouple && seatsInRow) {
      const coupleSeatsInRow = seatsInRow
        .filter((s) => checkSeatType(s).isCouple)
        .sort((a, b) => {
          const numA = parseInt((a.name || a.label || "0").slice(1), 10) || 0;
          const numB = parseInt((b.name || b.label || "0").slice(1), 10) || 0;
          return numA - numB; // 1, 2, 3, 4...
        });

      const idx = coupleSeatsInRow.findIndex((s) => s.id === seatSelected.id);
      if (idx !== -1) {
        if (idx % 2 === 0) {
          targetSeats = [coupleSeatsInRow[idx], coupleSeatsInRow[idx + 1]].filter(Boolean);
        } else {
          targetSeats = [coupleSeatsInRow[idx - 1], coupleSeatsInRow[idx]].filter(Boolean);
        }
      }
    } else if (isTriple && seatsInRow) {
      const tripleSeatsInRow = seatsInRow
        .filter((s) => checkSeatType(s).isTriple)
        .sort((a, b) => {
          const numA = parseInt((a.name || a.label || "0").slice(1), 10) || 0;
          const numB = parseInt((b.name || b.label || "0").slice(1), 10) || 0;
          return numA - numB;
        });

      const idx = tripleSeatsInRow.findIndex((s) => s.id === seatSelected.id);
      if (idx !== -1) {
        const baseIdx = Math.floor(idx / 3) * 3;
        targetSeats = [
          tripleSeatsInRow[baseIdx],
          tripleSeatsInRow[baseIdx + 1],
          tripleSeatsInRow[baseIdx + 2],
        ].filter(Boolean);
      }
    }

    // 2. Kiểm tra xem trong cụm ghế có ghế nào đã bị khóa / bán không
    const hasOccupied = targetSeats.some((s) => s.isOccupied === 1 || s.isOccupied === 2);
    if (hasOccupied) {
      Swal.fire({
        title: "Ghế không khả dụng!",
        text: `Cụm ghế bạn chọn đã có người đặt hoặc đang được giữ chỗ!`,
        icon: "warning",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const isCurrentlySelected = seatSelected.selected;
    const targetSeatIds = targetSeats.map((s) => s.id);
    const currentlySelectedCount = listSeatSelected?.length || 0;

    if (!isCurrentlySelected && currentlySelectedCount + targetSeats.length > soGhe) {
      dispatch({ type: SET_ALERT_OVER10 });
      return;
    }

    // 3. Tính toán danh sách ghế mới sau khi toggle
    const updatedList = listSeat.map((s) => {
      if (targetSeatIds.includes(s.id)) {
        return { ...s, selected: !isCurrentlySelected };
      }
      return s;
    });

    // 4. KIỂM TRA QUY TẮC KHÔNG ĐỂ LẠI GHẾ TRỐNG ĐƠN ĐỘC Ở 2 MÉP (ORPHAN SEAT GAP RULE)
    if (!isCurrentlySelected && seatsInRow && seatsInRow.length > 0) {
      const sortedRowSeats = [...seatsInRow].sort((a, b) => {
        const numA = parseInt((a.name || a.label || "0").slice(1), 10) || 0;
        const numB = parseInt((b.name || b.label || "0").slice(1), 10) || 0;
        return numA - numB; // 1, 2, 3... N
      });

      const totalSeatsInRow = sortedRowSeats.length;

      // Trạng thái ghế trong hàng sau khi chọn (true: đã chọn hoặc đã mua; false: còn trống)
      const seatStates = sortedRowSeats.map((s) => {
        const matchingUpdated = updatedList.find((u) => u.id === s.id);
        return Boolean(matchingUpdated?.selected || s.isOccupied === 1 || s.isOccupied === 2);
      });

      if (isCouple) {
        // Hàng ghế Đôi: Tuyệt đối không để lẻ 1 ghế đơn trong cặp
        const coupleSeats = sortedRowSeats.filter((s) => checkSeatType(s).isCouple);
        for (let i = 0; i < coupleSeats.length; i += 2) {
          const s1 = updatedList.find((u) => u.id === coupleSeats[i]?.id);
          const s2 = updatedList.find((u) => u.id === coupleSeats[i + 1]?.id);
          const sel1 = s1?.selected || s1?.isOccupied === 1 || s1?.isOccupied === 2;
          const sel2 = s2?.selected || s2?.isOccupied === 1 || s2?.isOccupied === 2;

          if ((sel1 && !sel2) || (!sel1 && sel2)) {
            Swal.fire({
              title: "Quy tắc chọn ghế đôi",
              text: "Ghế đôi phải được đặt trọn vẹn theo cặp 2 ghế, không để thừa lại 1 ghế đơn lẻ!",
              icon: "warning",
              confirmButtonColor: "#ea580c",
            });
            return;
          }
        }
      } else if (isTriple) {
        // Hàng ghế Ba: Tuyệt đối không để lẻ 1 hoặc 2 ghế trong cụm
        const tripleSeats = sortedRowSeats.filter((s) => checkSeatType(s).isTriple);
        for (let i = 0; i < tripleSeats.length; i += 3) {
          const s1 = updatedList.find((u) => u.id === tripleSeats[i]?.id);
          const s2 = updatedList.find((u) => u.id === tripleSeats[i + 1]?.id);
          const s3 = updatedList.find((u) => u.id === tripleSeats[i + 2]?.id);
          const selCount = [s1, s2, s3].filter(
            (s) => s?.selected || s?.isOccupied === 1 || s?.isOccupied === 2
          ).length;

          if (selCount > 0 && selCount < 3) {
            Swal.fire({
              title: "Quy tắc chọn ghế ba",
              text: "Ghế ba phải được đặt trọn vẹn theo cụm 3 ghế, không để thừa lại ghế trống lẻ!",
              icon: "warning",
              confirmButtonColor: "#ea580c",
            });
            return;
          }
        }
      } else {
        // Hàng ghế Thường / VIP: Không để lại 1 ghế trống đơn độc ở mép đầu/cuối hàng
        if (!seatStates[0] && seatStates[1]) {
          Swal.fire({
            title: "Không được để trống ghế đầu hàng!",
            text: `Không được để lại 1 ghế trống đơn độc (${sortedRowSeats[0].name || sortedRowSeats[0].label}) ở đầu hàng! Vui lòng chọn ghế liền kề.`,
            icon: "warning",
            confirmButtonColor: "#ea580c",
          });
          return;
        }

        if (!seatStates[totalSeatsInRow - 1] && seatStates[totalSeatsInRow - 2]) {
          Swal.fire({
            title: "Không được để trống ghế cuối hàng!",
            text: `Không được để lại 1 ghế trống đơn độc (${sortedRowSeats[totalSeatsInRow - 1].name || sortedRowSeats[totalSeatsInRow - 1].label}) ở cuối hàng! Vui lòng chọn ghế liền kề.`,
            icon: "warning",
            confirmButtonColor: "#ea580c",
          });
          return;
        }
      }
    }

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

  // Nhóm ghế theo hàng chữ cái (A, B, C, D, E, F, G, H...)
  const rows = {};
  (listSeat || []).forEach((seat) => {
    const rawName = seat.name || seat.label || "A01";
    const rowChar = rawName.charAt(0).toUpperCase();
    if (!rows[rowChar]) {
      rows[rowChar] = [];
    }
    rows[rowChar].push(seat);
  });

  // SẮP XẾP HÀNG GHẾ TỪ TRÊN XUỐNG DƯỚI: HÀNG CAO CẤP XA MÀN HÌNH Ở TRÊN, HÀNG A Ở DƯỚI GẦN MÀN HÌNH
  const rowKeys = Object.keys(rows).sort((a, b) => (a > b ? -1 : 1));

  // Lấy danh sách suất chiếu của đúng phòng / định dạng hiện tại từ DB
  const currentRoomId = scheduleItem?.room?.id || Number(param.maPhong) || 1;
  const currentRoomSchedules = siblingSchedules.filter(
    (s) => Number(s.room?.id || s.roomId) === Number(currentRoomId)
  );
  const displaySchedules = currentRoomSchedules.length > 0 ? currentRoomSchedules : siblingSchedules;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* 1. THANH ĐỔI SUẤT CHIẾU NHANH TRÊN ĐẦU (100% TỪ CSDL CỦA PHÒNG/ĐỊNH DẠNG NÀY) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
          Đổi suất chiếu:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {displaySchedules && displaySchedules.length > 0 ? (
            displaySchedules.map((item) => {
              const isCurrent = Number(item.id) === Number(param.maLichChieu);
              const timeDisplay = item.startTime ? item.startTime.slice(0, 5) : "10:45";

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isCurrent) {
                      const curBrId = item.branch?.id || param.maRap || scheduleItem?.branch?.id || 1;
                      const curMovId = item.movie?.id || param.maPhim || scheduleItem?.movie?.id || 1;
                      const curDStr = item.startDate || param.ngayChieu || scheduleItem?.startDate || "";
                      const curRoId = item.room?.id || param.maPhong || scheduleItem?.room?.id || 1;
                      const curTime = item.startTime;
                      // Đường dẫn chuẩn: /datvechitiet/:maLichChieu/:maRap/:maPhim/:ngayChieu/:maPhong/:gioChieu
                      history.push(
                        `/datvechitiet/${item.id}/${curBrId}/${curMovId}/${curDStr}/${curRoId}/${curTime}`
                      );
                    }
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    border: isCurrent ? "1.5px solid #004b91" : "1px solid #cbd5e1",
                    backgroundColor: isCurrent ? "#004b91" : "#ffffff",
                    color: isCurrent ? "#ffffff" : "#1e293b",
                    fontSize: "13px",
                    fontWeight: isCurrent ? "800" : "500",
                    cursor: isCurrent ? "default" : "pointer",
                    outline: "none",
                    boxShadow: isCurrent ? "0 2px 6px rgba(0, 75, 145, 0.3)" : "none",
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
                fontWeight: "700",
              }}
            >
              {scheduleItem?.startTime ? scheduleItem.startTime.slice(0, 5) : param.gioChieu || "10:45"}
            </span>
          )}
        </div>
      </div>

      {/* 2. SƠ ĐỒ MA TRẬN GHẾ PHÒNG CHIẾU CĂN GIỮA ĐỐI XỨNG */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          overflowX: "auto",
          padding: "16px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "600px" }}>
          {rowKeys.map((rowKey) => {
            const seatsInRow = rows[rowKey];
            seatsInRow.sort((a, b) => {
              const numA = parseInt((a.name || a.label || "0").slice(1), 10) || 0;
              const numB = parseInt((b.name || b.label || "0").slice(1), 10) || 0;
              return numA > numB ? -1 : 1; // Sắp xếp từ số lớn về số bé (16, 15... 1)
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

                    // Kích thước ô ghế chuẩn hóa
                    const seatWidth = isTriple ? "44px" : isCouple ? "36px" : "30px";

                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSelectSeat(seat, seatsInRow)}
                        style={{
                          width: seatWidth,
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
                            e.currentTarget.style.transform = "scale(1.08)";
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

        {/* MÔ PHỎNG MÀN HÌNH CHIẾU SÁT HÀNG A Ở DƯỚI CÙNG */}
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
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế VIP (1 người)</span>
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
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đơn (1 người)</span>
        </div>

        {/* Ghế đôi */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "36px",
              height: "16px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #004b91",
              borderRadius: "4px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đôi (2 người)</span>
        </div>

        {/* Ghế ba */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "48px",
              height: "16px",
              backgroundColor: "#ffffff",
              border: "1.5px solid #ea580c",
              borderRadius: "4px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế ba (3 người)</span>
        </div>
      </div>
    </div>
  );
}