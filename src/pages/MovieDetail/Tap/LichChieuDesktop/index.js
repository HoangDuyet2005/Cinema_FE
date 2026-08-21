import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import theatersApi from "../../../../api/theatersApi";
import branchApi from "../../../../api/branchApi";
import formatDate from "../../../../utilities/formatDate";

const DEFAULT_CITIES = [
  "Toàn quốc",
  "TP Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cà Mau",
  "Hải Phòng",
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Tây Ninh",
  "Cần Thơ"
];

export default function LichChieuDesktop() {
  const param = useParams();
  const history = useHistory();

  const [schedules, setSchedules] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateStartIndex, setDateStartIndex] = useState(0);

  // Bộ lọc Tỉnh/Thành & Cụm Rạp
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [selectedCity, setSelectedCity] = useState("Toàn quốc");
  const [branchesList, setBranchesList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("ALL");

  useEffect(() => {
    // 1. Tải danh sách Tỉnh/Thành phố từ API
    branchApi.getAllCities()
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          const distinctCities = ["Toàn quốc", ...res.data.data.filter(c => c && c.trim() !== "")];
          setCities([...new Set(distinctCities)]);
        }
      })
      .catch((err) => console.log("Lỗi tải danh sách tỉnh thành:", err));

    // 2. Tải toàn bộ chi nhánh rạp
    branchApi.getListBranchByAdminStaff()
      .then((res) => {
        if (res.data?.data) {
          setBranchesList(res.data.data);
        }
      })
      .catch((err) => console.log("Lỗi tải danh sách rạp:", err));

    // 3. Tải toàn bộ suất chiếu của phim này
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentTimeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;

    theatersApi.getThongTinLichChieuPhim(param.maPhim, null)
      .then((response) => {
        const allSchedules = (response?.data?.data?.content || []).filter((s) => {
          const sDate = s.startDate ? s.startDate.slice(0, 10) : "";
          if (sDate < todayStr) return false;
          if (sDate === todayStr && s.startTime && s.startTime < currentTimeStr) return false;
          return true;
        });
        setSchedules(allSchedules);

        // Sinh danh sách ngày chiếu
        const uniqueDates = [...new Set(allSchedules.map((s) => s.startDate ? s.startDate.slice(0, 10) : ""))].filter((d) => d >= todayStr).sort();

        // Nếu có ít ngày chiếu, tạo 7 ngày từ hôm nay
        let finalDates = uniqueDates;
        if (finalDates.length < 7) {
          const tempDates = [];
          for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            tempDates.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
          }
          finalDates = [...new Set([...uniqueDates, ...tempDates])].sort();
        }

        setDates(finalDates);
        if (finalDates.length > 0) {
          setSelectedDate(finalDates[0]);
        }
      })
      .catch((err) => console.log("Lỗi tải lịch chiếu:", err));
  }, [param.maPhim]);

  // Chuẩn hóa tên tỉnh thành để so sánh và lọc chuẩn xác
  const normalizeCity = (cityStr) => {
    if (!cityStr) return "";
    return cityStr.toLowerCase()
      .replace("tp.", "tp")
      .replace("thành phố", "tp")
      .replace(/[\s-]/g, "");
  };

  // Lọc danh sách rạp theo Tỉnh/Thành phố đang chọn
  const filteredBranchesByCity = branchesList.filter((b) => {
    if (selectedCity === "Toàn quốc") return true;
    const bCityNorm = normalizeCity(b.city);
    const bAddrNorm = normalizeCity(b.address);
    const selCityNorm = normalizeCity(selectedCity);
    return bCityNorm.includes(selCityNorm) || bAddrNorm.includes(selCityNorm) || selCityNorm.includes(bCityNorm);
  });

  // Lọc suất chiếu theo Ngày + Tỉnh/Thành + Cụm Rạp
  const filteredSchedules = schedules.filter((s) => {
    const sDate = s.startDate ? s.startDate.slice(0, 10) : "";
    if (selectedDate && sDate !== selectedDate) return false;

    if (selectedCity !== "Toàn quốc") {
      const bCityNorm = normalizeCity(s.branch?.city);
      const bAddrNorm = normalizeCity(s.branch?.address);
      const selCityNorm = normalizeCity(selectedCity);
      if (!bCityNorm.includes(selCityNorm) && !bAddrNorm.includes(selCityNorm) && !selCityNorm.includes(bCityNorm)) {
        return false;
      }
    }

    if (selectedBranchId !== "ALL" && String(s.branch?.id) !== String(selectedBranchId)) {
      return false;
    }

    return true;
  });

  // Gom nhóm suất chiếu theo Cụm Rạp -> Định dạng phòng chiếu
  const branchesMap = {};
  filteredSchedules.forEach((s) => {
    const bId = s.branch?.id || 1;
    if (!branchesMap[bId]) {
      branchesMap[bId] = { branch: s.branch, formats: {} };
    }

    const formatName = (s.format || s.room?.format || "2D").trim().toUpperCase();
    const roomName = s.room?.name || "Phòng 101";

    let formatHeader = "2D";
    let subTitle = "2D Phụ Đề";

    if (formatName.includes("3D")) {
      formatHeader = "Onyx x Dolby Atmos";
      subTitle = "3D Phụ Đề";
    } else if (formatName.includes("IMAX")) {
      formatHeader = "IMAX Laser";
      subTitle = "IMAX Phụ Đề";
    } else if (formatName.includes("4DX")) {
      formatHeader = "VIP - ROMANTICO";
      subTitle = "4DX Phụ Đề";
    } else {
      formatHeader = roomName.includes("2D") ? roomName : `${roomName} (2D)`;
      subTitle = "2D Phụ Đề";
    }

    const formatKey = `${formatHeader}_${subTitle}`;
    if (!branchesMap[bId].formats[formatKey]) {
      branchesMap[bId].formats[formatKey] = {
        title: formatHeader,
        subTitle: subTitle,
        roomName: roomName,
        schedules: [],
      };
    }
    branchesMap[bId].formats[formatKey].schedules.push(s);
  });

  const branchListResult = Object.values(branchesMap);

  // Điều khiển thanh trượt ngày (hiển thị 5 ngày)
  const visibleDates = dates.slice(dateStartIndex, dateStartIndex + 5);
  const handlePrevDate = () => {
    if (dateStartIndex > 0) setDateStartIndex(dateStartIndex - 1);
  };
  const handleNextDate = () => {
    if (dateStartIndex + 5 < dates.length) setDateStartIndex(dateStartIndex + 1);
  };

  const handleGoToSeatBooking = (s) => {
    const bId = s.branch?.id || 1;
    const rId = s.room?.id || 1;
    const mId = s.movie?.id || param.maPhim || 1;
    const sDate = s.startDate || "2026-08-21";
    const sTime = s.startTime || "19:00:00";
    history.push(`/datvechitiet/${s.id}/${bId}/${mId}/${sDate}/${rId}/${sTime}`);
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: "960px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      padding: "20px 24px",
      boxShadow: "0 4px 25px rgba(0, 0, 0, 0.12)",
      color: "#1e293b",
      boxSizing: "border-box"
    }}>
      {/* THANH ĐIỀU HƯỚNG CHỌN NGÀY VÀ BỘ LỌC CÙNG NẰM TRÊN 1 HÀNG DUY NHẤT */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        width: "100%",
        gap: "10px"
      }}>
        {/* Nút lướt ngày & Danh sách các tab ngày (Phía Trái) */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          <button
            onClick={handlePrevDate}
            disabled={dateStartIndex === 0}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              fontWeight: 900,
              cursor: dateStartIndex === 0 ? "not-allowed" : "pointer",
              color: dateStartIndex === 0 ? "#cbd5e1" : "#1e293b",
              padding: "2px 6px",
              lineHeight: 1
            }}
          >
            &lt;
          </button>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {visibleDates.map((day, idx) => {
              const isSelected = day === selectedDate;
              const formatted = formatDate(day);
              const dateParts = day.split("-");
              const shortDate = `${dateParts[2]}/${dateParts[1]}`;

              let dayName = formatted.dayToday;
              if (idx === 0 && dateStartIndex === 0) {
                dayName = "Hôm Nay";
              }

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  style={{
                    backgroundColor: isSelected ? "#004b91" : "transparent",
                    borderRadius: "6px",
                    padding: isSelected ? "6px 12px" : "6px 10px",
                    textAlign: "center",
                    cursor: "pointer",
                    minWidth: "68px",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "#f0f7ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div style={{
                    fontSize: "12px",
                    fontWeight: isSelected ? "700" : "600",
                    color: isSelected ? "#ffffff" : "#475569",
                    lineHeight: "1.2",
                    marginBottom: "2px",
                    whiteSpace: "nowrap"
                  }}>
                    {dayName}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    fontWeight: "800",
                    color: isSelected ? "#ffffff" : "#1e293b",
                    lineHeight: "1.2",
                    whiteSpace: "nowrap"
                  }}>
                    {shortDate}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNextDate}
            disabled={dateStartIndex + 5 >= dates.length}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              fontWeight: 900,
              cursor: dateStartIndex + 5 >= dates.length ? "not-allowed" : "pointer",
              color: dateStartIndex + 5 >= dates.length ? "#cbd5e1" : "#1e293b",
              padding: "2px 6px",
              lineHeight: 1
            }}
          >
            &gt;
          </button>
        </div>

        {/* 2 Dropdowns Tỉnh Thành & Cụm Rạp (Phía Phải - Cùng Hàng) */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          {/* Dropdown 1: Tỉnh / Thành phố */}
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedBranchId("ALL");
            }}
            style={{
              padding: "7px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              color: "#334155",
              outline: "none",
              cursor: "pointer",
              width: "135px",
              height: "36px"
            }}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Dropdown 2: Cụm rạp */}
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={{
              padding: "7px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              color: "#334155",
              outline: "none",
              cursor: "pointer",
              width: "165px",
              height: "36px"
            }}
          >
            <option value="ALL">Tất cả rạp</option>
            {filteredBranchesByCity.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ĐƯỜNG VIỀN NGANG XANH NƯỚC BIỂN NGĂN CÁCH THANH ĐIỀU HƯỚNG VÀ DANH SÁCH RẠP */}
      <div style={{ borderBottom: "2px solid #004b91", margin: "14px 0 22px 0" }} />

      {/* KHUNG DANH SÁCH RẠP VÀ CÁC SUẤT CHIẾU */}
      <div>
        {branchListResult.length === 0 ? (
          <div style={{ textAlign: "center", padding: "35px 20px", color: "#64748b" }}>
            <p style={{ fontSize: "15px", fontWeight: 600, margin: "0 0 6px 0" }}>
              🎬 Không có suất chiếu phù hợp với bộ lọc bạn đã chọn.
            </p>
            <p style={{ fontSize: "13px", margin: 0 }}>
              Vui lòng chọn ngày chiếu, Tỉnh/Thành phố hoặc cụm rạp khác!
            </p>
          </div>
        ) : (
          branchListResult.map((item, bIndex) => (
            <div
              key={item.branch?.id || bIndex}
              style={{
                borderBottom: bIndex === branchListResult.length - 1 ? "none" : "1px solid #f1f5f9",
                paddingBottom: bIndex === branchListResult.length - 1 ? "0" : "24px",
                marginBottom: bIndex === branchListResult.length - 1 ? "0" : "24px"
              }}
            >
              {/* Tên Cụm Rạp */}
              <h3 style={{
                fontSize: "17px",
                fontWeight: "800",
                color: "#1e293b",
                margin: "0 0 14px 0",
                letterSpacing: "0.2px"
              }}>
                {item.branch?.name}
              </h3>

              {/* Danh sách các định dạng phòng chiếu */}
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {Object.values(item.formats).map((fmt, fIndex) => (
                  <div
                    key={fIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "18px"
                    }}
                  >
                    {/* Cột trái: Tên định dạng & Loại phụ đề */}
                    <div style={{ width: "210px", minWidth: "170px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#334155" }}>
                        {fmt.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        {fmt.subTitle}
                      </div>
                    </div>

                    {/* Cột phải: Các nút suất chiếu (Hộp giờ chiếu chuẩn như mẫu) */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", flex: 1 }}>
                      {fmt.schedules
                        .sort((a, b) => (a.startTime > b.startTime ? 1 : -1))
                        .map((s) => {
                          const timeDisplay = s.startTime ? s.startTime.slice(0, 5) : "";
                          return (
                            <button
                              key={s.id}
                              onClick={() => handleGoToSeatBooking(s)}
                              style={{
                                backgroundColor: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                padding: "9px 24px",
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "#1e293b",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                outline: "none"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#004b91";
                                e.currentTarget.style.color = "#004b91";
                                e.currentTarget.style.backgroundColor = "#f0f7ff";
                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 75, 145, 0.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#cbd5e1";
                                e.currentTarget.style.color = "#1e293b";
                                e.currentTarget.style.backgroundColor = "#ffffff";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {timeDisplay}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}