import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import branchApi from "../../api/branchApi";

export default function SeatConfigManagement() {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [seats, setSeats] = useState([]);
  const [brushType, setBrushType] = useState(0); // 0: NORMAL, 1: VIP, 2: COUPLE, 3: TRIPLE, -1: DELETE
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Tải danh sách chi nhánh
  useEffect(() => {
    branchApi
      .getListBranchByAdminStaff()
      .then((res) => {
        const branchList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : res.data?.data?.content || [];
        setBranches(branchList);
        if (branchList.length > 0) {
          setSelectedBranchId(branchList[0].id);
        }
      })
      .catch((err) => console.log("Lỗi tải chi nhánh:", err));
  }, []);

  // 2. Tải danh sách phòng khi chọn chi nhánh
  useEffect(() => {
    if (!selectedBranchId) return;
    axiosClient
      .get(`/rooms/branch?branchId=${selectedBranchId}`)
      .then((res) => {
        const roomList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : res.data?.data?.content || [];
        setRooms(roomList);
        if (roomList.length > 0) {
          setSelectedRoomId(roomList[0].id);
        } else {
          setSelectedRoomId("");
          setSeats([]);
        }
      })
      .catch((err) => {
        console.log("Lỗi tải phòng:", err);
      });
  }, [selectedBranchId]);

  // 3. Tải sơ đồ ghế hiện tại của phòng từ Database
  useEffect(() => {
    if (!selectedRoomId) return;
    setLoading(true);
    axiosClient
      .get(`/seats/room/${selectedRoomId}`)
      .then((res) => {
        const seatList = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        if (seatList && seatList.length > 0) {
          setSeats(seatList);
        } else {
          generateDefaultPreset("ROMANTICO");
        }
      })
      .catch(() => {
        generateDefaultPreset("ROMANTICO");
      })
      .finally(() => setLoading(false));
  }, [selectedRoomId]);

  // Đổi loại ghế khi click
  const handleSeatClick = (seat) => {
    if (brushType === -1) {
      setSeats(seats.filter((s) => s.name !== seat.name));
    } else {
      setSeats(
        seats.map((s) => {
          if (s.name === seat.name) {
            return { ...s, seatType: brushType, type: brushType };
          }
          return s;
        })
      );
    }
  };

  // Đổi loại cho toàn bộ hàng
  const handleRowTypeChange = (rowChar, type) => {
    setSeats(
      seats.map((s) => {
        if (s.name && s.name.startsWith(rowChar)) {
          return { ...s, seatType: type, type: type };
        }
        return s;
      })
    );
  };

  // Áp dụng 4 Mẫu Preset Sơ Đồ Phòng Chuẩn Cinema
  const generateDefaultPreset = (presetType) => {
    let newSeats = [];
    if (presetType === "ROMANTICO") {
      // Mẫu VIP Romantico (4DX): A-D VIP 6 ghế, E Ghế Đôi 8 ghế, F Ghế Ba 6 ghế
      for (const row of ["A", "B", "C", "D"]) {
        for (let col = 1; col <= 6; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 1, type: 1 });
        }
      }
      for (let col = 1; col <= 8; col++) {
        newSeats.push({ name: `E${col}`, seatType: 2, type: 2 });
      }
      for (let col = 1; col <= 6; col++) {
        newSeats.push({ name: `F${col}`, seatType: 3, type: 3 });
      }
    } else if (presetType === "ONYX") {
      // Mẫu Onyx 3D: A-C Thường 17 ghế, D-G VIP 14 ghế, H Ghế Đôi 18 ghế
      for (const row of ["A", "B", "C"]) {
        for (let col = 1; col <= 17; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 0, type: 0 });
        }
      }
      for (const row of ["D", "E", "F", "G"]) {
        for (let col = 1; col <= 14; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 1, type: 1 });
        }
      }
      for (let col = 1; col <= 18; col++) {
        newSeats.push({ name: `H${col}`, seatType: 2, type: 2 });
      }
    } else if (presetType === "IMAX") {
      // Mẫu IMAX Laser: Vòm góc rộng A-C 14 ghế thường, D-H 16 ghế VIP, J 18 ghế đôi
      for (const row of ["A", "B", "C"]) {
        for (let col = 1; col <= 14; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 0, type: 0 });
        }
      }
      for (const row of ["D", "E", "F", "G", "H"]) {
        for (let col = 1; col <= 16; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 1, type: 1 });
        }
      }
      for (let col = 1; col <= 18; col++) {
        newSeats.push({ name: `J${col}`, seatType: 2, type: 2 });
      }
    } else {
      // Mẫu Standard 2D LILY: A-D 12 ghế thường, E-K 12 ghế VIP, L 16 ghế đôi
      for (const row of ["A", "B", "C", "D"]) {
        for (let col = 1; col <= 12; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 0, type: 0 });
        }
      }
      for (const row of ["E", "F", "G", "H", "I", "J", "K"]) {
        for (let col = 1; col <= 12; col++) {
          newSeats.push({ name: `${row}${col}`, seatType: 1, type: 1 });
        }
      }
      for (let col = 1; col <= 16; col++) {
        newSeats.push({ name: `L${col}`, seatType: 2, type: 2 });
      }
    }
    setSeats(newSeats);
  };

  // Lưu cấu hình vào Database
  const handleSaveConfig = () => {
    if (!selectedRoomId) return;
    setSaving(true);
    setSuccessMsg("");

    const payload = {
      roomId: Number(selectedRoomId),
      seats: seats.map((s) => {
        let t = 0;
        if (s.seatType === "VIP" || s.type === "VIP" || s.seatType === 1 || s.type === 1) t = 1;
        else if (s.seatType === "COUPLE" || s.type === "COUPLE" || s.seatType === 2 || s.type === 2) t = 2;
        else if (s.seatType === "TRIPLE" || s.type === "TRIPLE" || s.seatType === 3 || s.type === 3) t = 3;
        return {
          name: s.name,
          seatType: t,
        };
      }),
    };

    axiosClient
      .post("/seats/configure-room", payload)
      .then(() => {
        setSuccessMsg(`Đã lưu cấu hình sơ đồ ${seats.length} ghế thành công vào Database!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      })
      .catch((err) => {
        alert("Lỗi lưu cấu hình ghế: " + (err.response?.data?.message || err.message));
      })
      .finally(() => setSaving(false));
  };

  // Helper xác định loại ghế
  const getSeatTypeMeta = (seat) => {
    const rawType = seat.seatType !== undefined && seat.seatType !== null ? seat.seatType : seat.type;
    const isVip = rawType === "VIP" || rawType === 1;
    const isCouple = rawType === "COUPLE" || rawType === 2;
    const isTriple = rawType === "TRIPLE" || rawType === 3;
    return { isVip, isCouple, isTriple };
  };

  // Gom nhóm ghế theo Hàng
  const rowsMap = {};
  seats.forEach((seat) => {
    const rowChar = seat.name ? seat.name.slice(0, 1) : "A";
    if (!rowsMap[rowChar]) rowsMap[rowChar] = [];
    rowsMap[rowChar].push(seat);
  });
  const sortedRowKeys = Object.keys(rowsMap).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div style={{ padding: "30px 40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "25px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>
          QUẢN LÝ & CẤU HÌNH SƠ ĐỒ GHẾ PHÒNG CHIẾU
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
          Tùy chỉnh ma trận ghế và đồng bộ trực tiếp với Database (Ghế Thường, Ghế VIP, Ghế Đôi, Ghế Ba).
        </p>
      </div>

      {/* 1. Bộ Chọn Chi Nhánh & Phòng Chiếu & Các Nút Mẫu Preset */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px 24px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
            1. Chọn Cụm Rạp:
          </label>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
              minWidth: "220px",
              outline: "none",
            }}
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
            2. Chọn Phòng Chiếu:
          </label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              fontWeight: "600",
              color: "#1e293b",
              minWidth: "220px",
              outline: "none",
            }}
          >
            {rooms.length === 0 ? (
              <option value="">(Không có phòng)</option>
            ) : (
              rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - [{r.format || "2D"}]
                </option>
              ))
            )}
          </select>
        </div>

        {/* 4 Mẫu Preset */}
        <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <button
            onClick={() => generateDefaultPreset("ROMANTICO")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ea580c",
              backgroundColor: "#fff7ed",
              color: "#c2410c",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            + Mẫu VIP Romantico
          </button>
          <button
            onClick={() => generateDefaultPreset("ONYX")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #0284c7",
              backgroundColor: "#f0f9ff",
              color: "#0369a1",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            + Mẫu Onyx 3D
          </button>
          <button
            onClick={() => generateDefaultPreset("IMAX")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #7c3aed",
              backgroundColor: "#f5f3ff",
              color: "#6d28d9",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            + Mẫu IMAX Laser
          </button>
          <button
            onClick={() => generateDefaultPreset("STANDARD_2D")}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #10b981",
              backgroundColor: "#ecfdf5",
              color: "#047857",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            + Mẫu 2D Tiêu Chuẩn
          </button>
          <button
            onClick={handleSaveConfig}
            disabled={saving}
            style={{
              padding: "9px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#004b91",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: "800",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(0, 75, 145, 0.3)",
            }}
          >
            {saving ? "Đang lưu..." : "💾 LƯU CẤU HÌNH GHẾ"}
          </button>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "12px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      {/* 2. Thanh Công Cụ Chọn Loại Ghế (Brush Selector) */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "16px 20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
          Chọn chế độ gán loại ghế:
        </span>
        {[
          { type: 0, label: "Ghế Thường", bg: "#ffffff", border: "1px solid #cbd5e1", text: "#1e293b" },
          { type: 1, label: "Ghế VIP", bg: "#ffffff", border: "1.5px solid #f59e0b", text: "#d97706" },
          { type: 2, label: "Ghế Đôi (Couple)", bg: "#ffffff", border: "1.5px solid #004b91", text: "#004b91" },
          { type: 3, label: "Ghế Ba (Sweetbox 3)", bg: "#ffffff", border: "1.5px solid #ea580c", text: "#ea580c" },
          { type: -1, label: "🗑️ Xóa / Bỏ ghế", bg: "#fef2f2", border: "1px solid #f87171", text: "#ef4444" },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => setBrushType(item.type)}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              border: brushType === item.type ? "2px solid #0f172a" : item.border,
              backgroundColor: brushType === item.type ? "#f1f5f9" : item.bg,
              color: item.text,
              fontSize: "13px",
              fontWeight: brushType === item.type ? "800" : "600",
              cursor: "pointer",
              boxShadow: brushType === item.type ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {item.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "13px", color: "#64748b" }}>
          Tổng số ghế hiện tại: <b style={{ color: "#004b91" }}>{seats.length} ghế</b>
        </span>
      </div>

      {/* 3. Khung Ma Trận Ghế Trực Quan CĂN GIỮA ĐỐI XỨNG */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px 20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <div style={{ padding: "40px", color: "#64748b" }}>Đang tải sơ đồ phòng...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "600px" }}>
            {sortedRowKeys.map((rowKey) => {
              const seatsInRow = rowsMap[rowKey].sort((a, b) => {
                const numA = parseInt(a.name ? a.name.slice(1) : "0", 10);
                const numB = parseInt(b.name ? b.name.slice(1) : "0", 10);
                return numA > numB ? -1 : 1;
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
                  {/* Dropdown Gán Hàng */}
                  <select
                    onChange={(e) => handleRowTypeChange(rowKey, Number(e.target.value))}
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      color: "#334155",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Gán hàng...
                    </option>
                    <option value="0">Thường</option>
                    <option value="1">VIP</option>
                    <option value="2">Ghế Đôi</option>
                    <option value="3">Ghế Ba</option>
                  </select>

                  {/* Tên hàng bên trái */}
                  <span
                    style={{
                      width: "24px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#64748b",
                    }}
                  >
                    {rowKey}
                  </span>

                  {/* Danh sách ghế CĂN GIỮA */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {seatsInRow.map((seat) => {
                      const { isVip, isCouple, isTriple } = getSeatTypeMeta(seat);

                      let border = "1px solid #cbd5e1";
                      let color = "#1e293b";
                      let width = "30px";

                      if (isTriple) {
                        border = "1.5px solid #ea580c";
                        color = "#ea580c";
                        width = "34px";
                      } else if (isCouple) {
                        border = "1.5px solid #004b91";
                        color = "#004b91";
                        width = "34px";
                      } else if (isVip) {
                        border = "1.5px solid #f59e0b";
                        color = "#d97706";
                      }

                      return (
                        <div
                          key={seat.name}
                          onClick={() => handleSeatClick(seat)}
                          style={{
                            width: width,
                            height: "28px",
                            borderRadius: isTriple || isCouple ? "6px" : "4px",
                            backgroundColor: "#ffffff",
                            border: border,
                            color: color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          {seat.name.slice(1)}
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
                    }}
                  >
                    {rowKey}
                  </span>
                </div>
              );
            })}

            {/* Màn hình */}
            <div style={{ width: "80%", margin: "30px auto 0 auto", textAlign: "center" }}>
              <div style={{ height: "3px", backgroundColor: "#ea580c", borderRadius: "2px", marginBottom: "6px" }} />
              <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700" }}>Màn hình chiếu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}