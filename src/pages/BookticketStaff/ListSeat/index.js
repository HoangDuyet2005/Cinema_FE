import React, { useRef, useEffect, useState } from "react";
import SeatIcon from "@material-ui/icons/CallToActionRounded";
import { useSelector, useDispatch } from "react-redux";
import Countdown from "../Countdown";
import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import {
  CHANGE_LISTSEAT,
  SET_ALERT_OVER10,
} from "../../../reducers/constants/BookTicket";
import TenCumRap from "../../../components/TenCumRap";
import { useParams } from "react-router-dom";
import bookingApi from "../../../api/bookingApi";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import Swal from "sweetalert2";

export default function ListSeat() {
  const {
    isMobile,
    listSeat,
    danhSachPhongVe: { thongTinPhim },
    thongTinPhongVe,
  } = useSelector((state) => state.bookTicketReducer);

  const { currentUser } = useSelector((state) => state.authReducer);
  const currentUserId = currentUser?.data?.id || currentUser?.id || 1;

  const domToSeatElement = useRef(null);
  const stompClientRef = useRef(null);
  const [widthSeat, setWidthSeat] = useState(0);
  const [soGhe, setSoGhe] = useState(10);
  const [thongTin, setThongTin] = useState();
  const param = useParams();

  useEffect(() => {
    bookingApi
      .getScheduleById(param.maLichChieu)
      .then((response) => {
        if (response?.data?.data) {
          setThongTin({ data: { content: [response.data.data] } });
        }
      })
      .catch(() => {
        if (param.maPhim && param.maRap && param.ngayChieu && param.gioChieu && param.maPhong) {
          bookingApi
            .getLichChieuChiTietHeThong(param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong)
            .then((response) => {
              setThongTin(response.data);
            })
            .catch(() => {});
        }
      });
  }, [param.maLichChieu, param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong]);

  const scheduleItem = thongTin?.data?.content?.[0] || thongTinPhongVe?.data?.content?.[0];

  const classes = useStyles({
    modalLeftImg: scheduleItem?.movie?.smallImageURl || "/img/movies/attack-on-titan-2_1785484162552.jpg",
    isMobile,
    widthLabel: widthSeat / 2,
  });
  const dispatch = useDispatch();

  // WebSocket Subscription
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
            stompClient.send("/app/seats/register", {}, JSON.stringify({
              scheduleId: Number(param.maLichChieu),
              userId: Number(currentUserId)
            }));

            stompClient.subscribe(`/topic/seats/${param.maLichChieu}`, (message) => {
              try {
                const event = JSON.parse(message.body);
                if (event.userId && Number(event.userId) === Number(currentUserId)) {
                  return;
                }
                if (event.holdingSeatIds) {
                  dispatch({
                    type: "SYNC_HOLDING_SEATS",
                    payload: { holdingSeatIds: event.holdingSeatIds },
                  });
                } else if (event.seatId) {
                  dispatch({
                    type: "UPDATE_SEAT_REALTIME",
                    payload: { seatId: event.seatId, isOccupied: event.isOccupied },
                  });
                }
              } catch (err) {
                console.error("Error processing WS message:", err);
              }
            });
          }
        },
        (err) => {
          console.warn("WebSocket connection warning:", err);
        }
      );
    } catch (e) {
      console.warn("SockJS init error:", e);
    }

    return () => {
      if (stompClientRef.current) {
        try {
          stompClientRef.current.disconnect();
        } catch (e) {}
      }
    };
  }, [param?.maLichChieu, currentUserId]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    handleResize();
  }, [listSeat]);

  const handleResize = () => {
    setWidthSeat(domToSeatElement?.current?.offsetWidth);
  };

  const handleSelectedSeat = (seatSelected) => {
    if (seatSelected.isOccupied === 1) {
      Swal.fire({
        title: "Ghế đã được đặt!",
        text: "Ghế này đã có người đặt và thanh toán thành công.",
        icon: "info",
        confirmButtonColor: "#f26b38",
      });
      return;
    }

    if (seatSelected.isOccupied === 2) {
      Swal.fire({
        title: "Ghế đã bị khóa!",
        text: "Ghế này đã có người chuyển sang trang thanh toán trước. Vui lòng chọn ghế khác.",
        icon: "warning",
        confirmButtonColor: "#f26b38",
      });
      return;
    }

    const isNowSelected = !seatSelected.selected;
    let newListSeat = listSeat.map((seat) => {
      if (seatSelected.id === seat.id) {
        return { ...seat, selected: isNowSelected };
      }
      return seat;
    });

    const newListSeatSelected = newListSeat?.reduce(
      (acc, seat) => {
        if (seat.selected) {
          return [...acc, seat.name || seat.label];
        }
        return acc;
      },
      []
    );

    if (newListSeatSelected.length > soGhe) {
      dispatch({
        type: SET_ALERT_OVER10,
      });
      return;
    }

    const danhSachVe = newListSeat?.reduce((acc, seat) => {
      if (seat.selected) {
        return [...acc, { id: seat.id }];
      }
      return acc;
    }, []);

    const isSelectedSeat = newListSeatSelected.length > 0;
    const basePrice = scheduleItem?.price || 95000;
    const amount = newListSeat?.reduce((sum, seat) => {
      if (seat.selected) {
        const p = seat.price || ((seat.seatType === "COUPLE" || seat.type === "COUPLE" || seat.type === 2) ? basePrice + 40000 : ((seat.seatType === "VIP" || seat.type === "VIP" || seat.type === 1) ? basePrice + 15000 : basePrice));
        return sum + p;
      }
      return sum;
    }, 0);

    dispatch({
      type: CHANGE_LISTSEAT,
      payload: {
        listSeat: newListSeat,
        isSelectedSeat,
        listSeatSelected: newListSeatSelected,
        danhSachVe,
        amount,
      },
    });
  };

  const color = (seat) => {
    if (seat.selected) {
      return "#44c020";
    }
    if (seat.isOccupied === 1) {
      return "#99c5ff";
    }
    if (seat.isOccupied === 2) {
      return "#ec4899";
    }
    if (seat.seatType === "COUPLE" || seat.type === "COUPLE" || seat.type === 2) {
      return "#e11d48";
    }
    if (seat.seatType === "VIP" || seat.type === "VIP" || seat.type === 1) {
      return "#f7b500";
    }
    return "#3e515d";
  };

  const handlerSoGhe = (e) => {
    const val = Number(e.target.value);
    setSoGhe(val > 0 ? val : 1);
  };

  return (
    <main className={classes.listSeat}>
      {/* thông tin phim */}
      <div className={classes.info_CountDown}>
        <div className={classes.infoTheater}>
          <img
            src={scheduleItem?.movie?.smallImageURl || "/img/movies/attack-on-titan-2_1785484162552.jpg"}
            alt="phim"
            style={{ width: 70, height: 100, borderRadius: "4px", objectFit: "cover" }}
          />
          <div className={classes.text}>
            <TenCumRap
              tenCumRap={scheduleItem?.branch?.name || "WORLD CINEMA Hà Đông"}
              giaVe={scheduleItem?.price || 95000}
            />
            <p className={classes.textTime}>{`${
              scheduleItem?.startDate ? formatDate(scheduleItem.startDate).dayToday : "Hôm nay"
            } - ${scheduleItem?.startDate || "2026-08-21"} - ${scheduleItem?.movie?.rated || "T16"}`}</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <input
            style={{
              backgroundColor: "black",
              color: "white",
              border: "1px solid yellow",
              width: "2.8rem",
              height: "2.2rem",
              fontSize: "1.4rem",
              textAlign: "center",
              marginRight: "6px",
              fontWeight: 700,
              borderRadius: "4px"
            }}
            value={soGhe}
            type="number"
            min="1"
            max="80"
            placeholder="Số ghế!"
            onChange={(e) => handlerSoGhe(e)}
          />
          <h4
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              margin: 0,
              height: "2.2rem",
              lineHeight: "2.2rem",
              fontWeight: 600,
              fontSize: "16px",
              color: "#333"
            }}
          >
            Ghế
          </h4>
        </div>

        <div className={classes.countDown}>
          <p className={classes.timeTitle}>Thời gian đặt giới hạn</p>
          <Countdown />
        </div>
      </div>

      <div className={classes.overflowSeat}>
        <div className={classes.invariantWidth}>
          {/* mô phỏng màn hình */}
          <img
            className={classes.screen}
            src="/img/bookticket/screen.png"
            alt="screen"
          />
          {/* danh sách ghế */}
          <div className={classes.seatSelect}>
            {listSeat?.map((seat, i) => (
              <div
                className={classes.seat}
                key={seat.id}
                ref={domToSeatElement}
              >
                {/* label A B C ... đầu mỗi row */}
                {(i === 0 || i % 16 === 0) && (
                  <p className={classes.label}>{seat.name ? seat.name.slice(0, 1) : seat.label.slice(0, 1)}</p>
                )}

                {/* số ghế thứ tự của ghế khi đang chọn */}
                {seat.selected && (
                  <p className={classes.seatName}>
                    {Number(seat.name ? seat.name.slice(1) : seat.label.slice(1)) < 10
                      ? (seat.name ? seat.name.slice(1) : seat.label.slice(1))
                      : (seat.name ? seat.name.slice(1) : seat.label.slice(1))}
                  </p>
                )}

                {/* số ghế khi còn trống */}
                {seat.isOccupied === 0 && !seat.selected && (
                  <p className={classes.seatName}>
                    {Number(seat.name ? seat.name.slice(1) : seat.label.slice(1)) < 10
                      ? (seat.name ? seat.name.slice(1) : seat.label.slice(1))
                      : (seat.name ? seat.name.slice(1) : seat.label.slice(1))}
                  </p>
                )}

                {/* label ghế đã có người đặt */}
                {seat.isOccupied === 1 && !seat.selected && (
                  <img
                    className={classes.seatLocked}
                    src="/img/bookticket/notchoose.png"
                    alt="notchoose"
                  />
                )}

                {/* label ghế đã bị khóa */}
                {seat.isOccupied === 2 && !seat.selected && (
                  <span
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "12px",
                      zIndex: 2,
                      userSelect: "none",
                      pointerEvents: "none"
                    }}
                  >
                    🔒
                  </span>
                )}

                {/* icon ghế */}
                <SeatIcon
                  style={{ color: color(seat) }}
                  className={classes.seatIcon}
                />

                {/* vùng bắt sự kiện click */}
                <div
                  className={classes.areaClick}
                  onClick={() => handleSelectedSeat(seat)}
                  style={{ cursor: seat.isOccupied ? "not-allowed" : "pointer" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* thông tin các loại ghế */}
      <div className={classes.noteSeat}>
        <div className={classes.typeSeats}>
          <div>
            <SeatIcon style={{ color: "#3e515d", fontSize: 27 }} />
            <p>Ghế thường</p>
          </div>
          <div>
            <SeatIcon style={{ color: "#f7b500", fontSize: 27 }} />
            <p>VIP</p>
          </div>
          <div>
            <SeatIcon style={{ color: "#44c020", fontSize: 27 }} />
            <p>Đang chọn</p>
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <span className={classes.posiX} style={{ fontSize: "14px", lineHeight: 1 }}>🔒</span>
              <SeatIcon style={{ color: "#ec4899", fontSize: 27 }} />
            </div>
            <p>Đã khóa</p>
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <p className={classes.posiX}>x</p>
              <SeatIcon style={{ color: "#99c5ff", fontSize: 27 }} />
            </div>
            <p>Đã đặt</p>
          </div>
        </div>
      </div>

      {/* modalleft */}
      <div className={classes.modalleft}>
        <div className={classes.opacity}></div>
      </div>
    </main>
  );
}