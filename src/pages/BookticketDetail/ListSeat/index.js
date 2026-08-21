import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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

  const [scheduleItem, setScheduleItem] = useState(null);
  const [siblingSchedules, setSiblingSchedules] = useState([]);
  const [soGhe, setSoGhe] = useState(10);

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

  // 2. Tải danh sách các suất chiếu THỰC TẾ từ Database đúng phòng chiếu / rạp
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

              // Nếu là ngày hôm nay, chỉ lấy các suất chiếu CHƯA DIỄN RA (startTime > giờ hiện tại)
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
    const rawType = seat.seatType !== undefined && seat.seatType !== null ? seat.seatType : seat.type;
    const isCouple = rawType === "COUPLE" || rawType === 2;
    const isTriple = rawType === "TRIPLE" || rawType === 3;
    const isVip = rawType === "VIP" || rawType === 1;
    return { isCouple, isTriple, isVip };
  };

  // Xử lý chọn / hủy chọn ghế
  const handleSelectSeat = (seat) => {
    if (seat.isOccupied === 1 || seat.isOccupied === 2) return;

    const isCurrentlySelected = seat.selected;
    let nextListSeat = [];

    const { isCouple, isTriple } = checkSeatType(seat);

    if (isTriple) {
      // Cụm 3 ghế liền kề
      const row = seat.name ? seat.name.slice(0, 1) : "F";
      const colNum = parseInt(seat.name ? seat.name.slice(1) : "1", 10);
      const groupBase = Math.floor((colNum - 1) / 3) * 3 + 1;
      const partnerNames = [
        `${row}${groupBase}`,
        `${row}${groupBase + 1}`,
        `${row}${groupBase + 2}`,
      ];

      nextListSeat = (listSeat || []).map((s) => {
        if (partnerNames.includes(s.name) || s.id === seat.id) {
          return { ...s, selected: !isCurrentlySelected };
        }
        return s;
      });
    } else if (isCouple) {
      // Cụm 2 ghế đôi liền kề
      const row = seat.name ? seat.name.slice(0, 1) : "E";
      const colNum = parseInt(seat.name ? seat.name.slice(1) : "1", 10);
      const partnerCol = colNum % 2 === 1 ? colNum + 1 : colNum - 1;
      const partnerName = `${row}${partnerCol}`;

      nextListSeat = (listSeat || []).map((s) => {
        if (s.id === seat.id || s.name === partnerName) {
          return { ...s, selected: !isCurrentlySelected };
        }
        return s;
      });
    } else {
      // Ghế đơn (Thường hoặc VIP)
      nextListSeat = (listSeat || []).map((s) => {
        if (s.id === seat.id) {
          return { ...s, selected: !isCurrentlySelected };
        }
        return s;
      });
    }

    const nextSelectedNames = nextListSeat
      .filter((s) => s.selected)
      .map((s) => s.name || s.label);

    if (nextSelectedNames.length > soGhe) {
      dispatch({ type: SET_ALERT_OVER10 });
      return;
    }

    const danhSachVe = nextListSeat
      .filter((s) => s.selected)
      .map((s) => ({ id: s.id }));

    const basePrice = scheduleItem?.price || 75000;
    const amount = nextListSeat
      .filter((s) => s.selected)
      .reduce((sum, s) => {
        const { isCouple: c, isTriple: tr, isVip: v } = checkSeatType(s);
        const p =
          s.price ||
          (tr
            ? basePrice + 60000
            : c
            ? basePrice + 40000
            : v
            ? basePrice + 15000
            : basePrice);
        return sum + p;
      }, 0);

    dispatch({
      type: CHANGE_LISTSEAT,
      payload: {
        listSeat: nextListSeat,
        isSelectedSeat: nextSelectedNames.length > 0,
        listSeatSelected: nextSelectedNames,
        danhSachVe,
        amount,
      },
    });
  };

  // Gom nhóm ghế theo Hàng (Row)
  const rowsMap = {};
  (listSeat || []).forEach((seat) => {
    const rowChar = seat.name ? seat.name.slice(0, 1) : "A";
    if (!rowsMap[rowChar]) {
      rowsMap[rowChar] = [];
    }
    rowsMap[rowChar].push(seat);
  });

  // Sắp xếp các hàng (Từ trên xuống dưới, ví dụ F, E, D, C, B, A hoặc H->A)
  const sortedRowKeys = Object.keys(rowsMap).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div style={{ backgroundColor: "#ffffff", padding: "20px 24px", minHeight: "80vh" }}>
      {/* 1. THANH ĐỔI SUẤT CHIẾU ĐỒNG BỘ 100% THEO ĐÚNG PHÒNG CHIẾU ĐANG CHỌN */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: "16px",
          marginBottom: "24px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", marginRight: "6px" }}>
          Đổi suất chiếu
        </span>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          {siblingSchedules.length === 0 ? (
            <span style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>
              (Chỉ còn 1 suất chiếu này trong ngày)
            </span>
          ) : (
            siblingSchedules.map((s) => {
              const isCurrent = String(s.id) === String(param.maLichChieu);
              const timeStr = s.startTime ? s.startTime.slice(0, 5) : "";
              return (
                <button
                  key={s.id}
                  onClick={() => handleSwitchSchedule(s)}
                  style={{
                    backgroundColor: isCurrent ? "#004b91" : "#ffffff",
                    color: isCurrent ? "#ffffff" : "#1e293b",
                    border: isCurrent ? "1px solid #004b91" : "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    fontWeight: isCurrent ? "700" : "600",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    outline: "none",
                  }}
                >
                  {timeStr}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. KHUNG SƠ ĐỒ GHẾ NGỒI CĂN GIỮA ĐỐI XỨNG THEO ĐÚNG DATABASE */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "20px 0 35px 0",
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "500px" }}>
          {sortedRowKeys.map((rowKey) => {
            const seatsInRow = rowsMap[rowKey].sort((a, b) => {
              const numA = parseInt(a.name ? a.name.slice(1) : "0", 10);
              const numB = parseInt(b.name ? b.name.slice(1) : "0", 10);
              return numA > numB ? -1 : 1; // Sắp xếp từ phải sang trái chuẩn rạp (6, 5, 4, 3, 2, 1)
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
                      border = "1.5px solid #ea580c"; // Viền cam ghế ba
                      textColor = "#ea580c";
                    } else if (isCouple) {
                      bg = "#ffffff";
                      border = "1.5px solid #004b91"; // Viền xanh ghế đôi
                      textColor = "#004b91";
                    } else if (isVip) {
                      bg = "#ffffff";
                      border = "1.5px solid #f59e0b"; // Viền vàng ghế VIP
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
        {/* Ghế đã bán */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#cbd5e1",
              borderRadius: "3px",
            }}
          />
          <span style={{ fontSize: "13px", color: "#64748b" }}>Ghế đã bán</span>
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