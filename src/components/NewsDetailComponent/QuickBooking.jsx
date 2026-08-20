import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import theatersApi from "../../api/theatersApi";
import { getMovieList } from "../../reducers/actions/Movie";
import "./QuickBooking.scss";

export default function QuickBooking() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { movieList } = useSelector((state) => state.movieReducer);
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingDates, setLoadingDates] = useState(false);

  const [showtimes, setShowtimes] = useState([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  // Helper dates
  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const getCurrentTimeStr = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
  };

  // Load movies list if not available in Redux
  useEffect(() => {
    if (!movieList || !movieList.data || movieList.data.length === 0) {
      dispatch(getMovieList());
    }
  }, [dispatch, movieList]);

  useEffect(() => {
    if (movieList?.data) {
      setMovies(movieList.data);
    }
  }, [movieList]);

  // Format date helper: "thứ năm, 20/08/2026"
  const formatVietnameseDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const dayNames = [
      "chủ nhật",
      "thứ hai",
      "thứ ba",
      "thứ tư",
      "thứ năm",
      "thứ sáu",
      "thứ bảy",
    ];
    const dayName = dayNames[d.getDay()];
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  };

  // 1. Khi chọn Phim -> Lấy danh sách rạp có chiếu phim đó từ hôm nay trở đi
  const handleMovieChange = (e) => {
    const movieId = e.target.value;
    setSelectedMovieId(movieId);

    // Reset cấp dưới
    setSelectedBranchId("");
    setBranches([]);
    setSelectedDate("");
    setDates([]);
    setShowtimes([]);

    if (!movieId) return;

    setLoadingBranches(true);
    theatersApi
      .getThongTinLichChieuPhim(movieId)
      .then((res) => {
        const schedules = res.data?.data?.content || res.data?.content || [];
        const todayStr = getTodayStr();
        const branchMap = new Map();

        schedules.forEach((item) => {
          const sDate = item.startDate ? item.startDate.slice(0, 10) : "";
          if (sDate >= todayStr && item.branch && !branchMap.has(item.branch.id)) {
            branchMap.set(item.branch.id, item.branch);
          }
        });

        if (branchMap.size === 0) {
          theatersApi
            .getThongTinLichChieuHeThongRap()
            .then((bRes) => {
              const allBranches =
                bRes.data?.data?.content || bRes.data?.content || [];
              setBranches(allBranches);
              setLoadingBranches(false);
            })
            .catch(() => setLoadingBranches(false));
        } else {
          setBranches(Array.from(branchMap.values()));
          setLoadingBranches(false);
        }
      })
      .catch((err) => {
        console.error("Error loading branches for movie:", err);
        theatersApi
          .getThongTinLichChieuHeThongRap()
          .then((bRes) => {
            const allBranches =
              bRes.data?.data?.content || bRes.data?.content || [];
            setBranches(allBranches);
            setLoadingBranches(false);
          })
          .catch(() => setLoadingBranches(false));
      });
  };

  // 2. Khi chọn Rạp -> Lấy danh sách ngày chiếu (chỉ lấy từ hôm nay trở đi)
  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    setSelectedBranchId(branchId);

    // Reset cấp dưới
    setSelectedDate("");
    setDates([]);
    setShowtimes([]);

    if (!branchId || !selectedMovieId) return;

    const todayStr = getTodayStr();
    const currentTimeStr = getCurrentTimeStr();

    setLoadingDates(true);
    theatersApi
      .getThongTinLichChieuPhim(selectedMovieId, branchId)
      .then((res) => {
        const schedules = res.data?.data?.content || res.data?.content || [];
        const dateSet = new Set();
        schedules.forEach((item) => {
          if (item.startDate) {
            const dateStr = item.startDate.slice(0, 10);
            if (dateStr > todayStr) {
              dateSet.add(dateStr);
            } else if (dateStr === todayStr) {
              // Nếu là hôm nay, kiểm tra xem còn suất chiếu nào chưa qua giờ không
              if (!item.startTime || item.startTime >= currentTimeStr) {
                dateSet.add(dateStr);
              }
            }
          }
        });
        const dateList = Array.from(dateSet).sort();
        setDates(dateList);
        setLoadingDates(false);
      })
      .catch((err) => {
        console.error("Error loading dates:", err);
        setLoadingDates(false);
      });
  };

  // 3. Khi chọn Ngày -> Lấy danh sách suất chiếu (chỉ lấy suất chiếu chưa trôi qua)
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    setSelectedDate(dateVal);
    setShowtimes([]);

    if (!dateVal || !selectedMovieId || !selectedBranchId) return;

    const todayStr = getTodayStr();
    const currentTimeStr = getCurrentTimeStr();

    setLoadingShowtimes(true);
    theatersApi
      .getThongTinLichCoNgay(selectedMovieId, selectedBranchId, dateVal)
      .then((res) => {
        const rawList = res.data?.data?.content || res.data?.content || [];
        const list = rawList.filter((s) => {
          const sDate = s.startDate ? s.startDate.slice(0, 10) : "";
          if (sDate !== dateVal) return false;
          // Nếu là ngày hôm nay -> ẩn các suất chiếu có giờ bắt đầu đã trôi qua
          if (dateVal === todayStr && s.startTime && s.startTime < currentTimeStr) {
            return false;
          }
          return true;
        });
        list.sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
        setShowtimes(list);
        setLoadingShowtimes(false);
      })
      .catch((err) => {
        console.error("Error loading showtimes:", err);
        setLoadingShowtimes(false);
      });
  };

  // 4. Khi click chọn suất chiếu -> Chuyển ngay sang trang chọn ghế
  const handleSelectShowtime = (suat) => {
    if (!suat) return;
    const roomId = suat.room?.id || 1;
    const path = `/datvechitiet/${suat.id}/${suat.branch?.id || selectedBranchId}/${suat.movie?.id || selectedMovieId}/${suat.startDate || selectedDate}/${roomId}/${suat.startTime}`;
    history.push(path, path);
  };

  return (
    <div className="quick-booking-card">
      <div className="quick-booking-header">
        <h3>Mua Vé Nhanh</h3>
      </div>

      <div className="quick-booking-body">
        {/* Dropdown 1: Chọn Phim */}
        <div className="custom-select-wrapper">
          <select
            className={`custom-select-control ${selectedMovieId ? "has-value" : ""}`}
            value={selectedMovieId}
            onChange={handleMovieChange}
          >
            <option value="">Chọn phim</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.tenPhim}
              </option>
            ))}
          </select>
          <span className="select-arrow-icon">&#9662;</span>
        </div>

        {/* Dropdown 2: Chọn Rạp */}
        <div className="custom-select-wrapper">
          <select
            className={`custom-select-control ${selectedBranchId ? "has-value" : ""}`}
            value={selectedBranchId}
            onChange={handleBranchChange}
            disabled={!selectedMovieId || loadingBranches}
          >
            <option value="">
              {loadingBranches
                ? "Đang tải rạp..."
                : !selectedMovieId
                ? "Chọn rạp"
                : branches.length === 0
                ? "Không có rạp chiếu"
                : "Chọn rạp"}
            </option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <span className="select-arrow-icon">&#9662;</span>
        </div>

        {/* Dropdown 3: Chọn Ngày */}
        <div className="custom-select-wrapper">
          <select
            className={`custom-select-control ${selectedDate ? "has-value" : ""}`}
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedBranchId || loadingDates}
          >
            <option value="">
              {loadingDates
                ? "Đang tải ngày..."
                : !selectedBranchId
                ? "Chọn ngày"
                : dates.length === 0
                ? "Không có lịch chiếu sắp tới"
                : "Chọn ngày"}
            </option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatVietnameseDate(d)}
              </option>
            ))}
          </select>
          <span className="select-arrow-icon">&#9662;</span>
        </div>

        {/* Khu vực hiển thị suất chiếu khi chọn đủ 3 thông tin */}
        {selectedMovieId && selectedBranchId && selectedDate && (
          <div className="showtimes-section">
            <div className="format-title">2D Phụ Đề</div>

            {loadingShowtimes ? (
              <div className="loading-showtimes-text">Đang tải suất chiếu...</div>
            ) : showtimes.length > 0 ? (
              <div className="showtimes-grid">
                {showtimes.map((suat) => {
                  const displayTime = suat.startTime ? suat.startTime.slice(0, 5) : "";
                  return (
                    <button
                      key={suat.id}
                      type="button"
                      className="showtime-btn"
                      onClick={() => handleSelectShowtime(suat)}
                      title={`Phòng: ${suat.room?.name || "Standard"} - Giờ chiếu: ${displayTime}`}
                    >
                      {displayTime}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="no-showtimes-msg">
                Không có suất chiếu nào phù hợp!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}