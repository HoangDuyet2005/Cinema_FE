import React, { useRef, useEffect, useState } from "react";

import SeatIcon from "@material-ui/icons/CallToActionRounded";
import { useSelector, useDispatch } from "react-redux";
import Countdown from "../Countdown";

import useStyles from "./style";
import { colorTheater, logoTheater } from "../../../constants/theaterData";
import formatDate from "../../../utilities/formatDate";
import {
  CHANGE_LISTSEAT,
  SET_ALERT_OVER10,
} from "../../../reducers/constants/BookTicket";
import TenCumRap from "../../../components/TenCumRap";
import poster from "../../../assets/posterBG.jpg"
import { useParams } from "react-router-dom";
import bookingApi from "../../../api/bookingApi";

export default function ListSeat() {
  const {
    isMobile,
    listSeat,
    danhSachPhongVe: { thongTinPhim },
    thongTinPhongVe,
  } = useSelector((state) => state.bookTicketReducer);
  console.log("-------", listSeat);
  console.log("------sdas-", thongTinPhongVe);
  const domToSeatElement = useRef(null);
  const [widthSeat, setWidthSeat] = useState(0);
  const [soGhe, setSoGhe] = useState(1);


  const [thongTin, setThongTin] = useState()
  const param = useParams();

  console.log(param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong);
  useEffect(() => {
    // lấy thongTinPhim và danhSachGhe
    // dispatch(getListSeat(param.maLichChieu));
    bookingApi.getLichChieuChiTietHeThong(param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong)
    .then((response) =>{
      console.log(response.data.data);
      setThongTin(response.data);
      // dispatch({
      //   type: GET_LISTSEAT_SUCCESS,
      //   payload: { data: response.data.data }
      // })
    })
    .catch((err) => {
      console.log(err);
    })
    // return () => {
    //   // xóa dữ liệu khi đóng hủy component
    //   dispatch({ type: RESET_DATA_BOOKTICKET });
    // };
  }, []);
  
  const classes = useStyles({
    color: colorTheater[thongTinPhongVe?.setRap?.slice(0,3).toUpperCase()],
    //color: "white",
    modalLeftImg: thongTin?.data?.content[0]?.movie?.smallImageURl,
   // modalLeftImg: poster,
    isMobile,
    widthLabel: widthSeat / 2,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    // khởi tạo event lắng nghe "resize"
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    handleResize();
  }, [listSeat]); // sau khi có listSeat thì run handleResize để lấy giá trị đầu tiên
  const handleResize = () => {
    setWidthSeat(domToSeatElement?.current?.offsetWidth);
  };

 

  // const handleSelectedSeat = (seatSelected) => {
  //   if (seatSelected.isOccupied) {
  //     // click vào ghế đã có người chọn
  //     return;
  //   }
  //   // đổi lại giá trị selected của ghế đã chọn
  //   let newListSeat = listSeat.map((seat) => {
  //     if (seatSelected.id === seat.id) {
  //       return { ...seat, selected: !seat.selected };
  //     }
  //     return seat;
  //   });
  //   // cập nhật lại danh sách hiển thị ghế đã chọn
  //   const newListSeatSelected = newListSeat?.reduce(
  //     (newListSeatSelected, seat) => {
  //       if (seat.selected) {
  //         return [...newListSeatSelected, seat.label];
  //       }
  //       return newListSeatSelected;
  //     },
  //     []
  //   );
  //   // thông báo nếu chọn quá 10 ghế
  //   if (newListSeatSelected.length === 11) {
  //     dispatch({
  //       type: SET_ALERT_OVER10,
  //     });
  //     return;
  //   }
  //   // cập nhật lại danhSachVe dùng để booking
  //   const danhSachVe = newListSeat?.reduce((danhSachVe, seat) => {
  //     if (seat.selected) {
  //       return [...danhSachVe, { id: seat.id}];//giá vé nè thay vô
  //     }
  //     return danhSachVe;
  //   }, []);
  //   // cập nhật biến kiểm tra đã có ghế nào được chọn chưa
  //   const isSelectedSeat = newListSeatSelected.length > 0 ? true : false;
  //   // tính lại tổng tiền
  //   const amount = newListSeat?.reduce((amount, seat) => {
  //     if (seat.selected) {
  //       return (amount += 70000);
  //     }
  //     return amount;
  //   }, 0);
  //   dispatch({
  //     type: CHANGE_LISTSEAT,
  //     payload: {
  //       listSeat: newListSeat,
  //       isSelectedSeat,
  //       listSeatSelected: newListSeatSelected,
  //       danhSachVe,
  //       amount,
  //     },
  //   });
  // };
  // const color = (seat) => {
  //   let color;
  //   if (seat.type === "NORMAL") {
  //     color = "#3e515d";
  //   }
  //   if (seat.type === "VIP") {
  //     color = "#f7b500";
  //   }
  //   if (seat.selected) {
  //     color = "#44c020";
  //   }
  //   if (seat.isOccupied) {
  //     color = "#99c5ff";
  //   }
  //   return color;
  // };
  const handleSelectedSeat = (seatSelected) => {
    if (seatSelected.isOccupied) {
      // click vào ghế đã có người chọn
      return;
    }
    // đổi lại giá trị selected của ghế đã chọn
    let newListSeat = listSeat.map((seat) => {
      if (seatSelected.id === seat.id) {
        return { ...seat, selected: !seat.selected };
      }
      return seat;
    });
    // cập nhật lại danh sách hiển thị ghế đã chọn
    const newListSeatSelected = newListSeat?.reduce(
      (newListSeatSelected, seat) => {
        if (seat.selected) {
          return [...newListSeatSelected, seat.name];
        }
        return newListSeatSelected;
      },
      []
    );
    // thông báo nếu chọn quá 10 ghế
    if (newListSeatSelected.length > soGhe) {
      console.log("dispatch: ", soGhe);
      dispatch({
        type: SET_ALERT_OVER10,
      });
      return;
    }
    // cập nhật lại danhSachVe dùng để booking
    const danhSachVe = newListSeat?.reduce((danhSachVe, seat) => {
      if (seat.selected) {
        return [...danhSachVe, { id: seat.id}];//giá vé nè thay vô
      }
      return danhSachVe;
    }, []);
    // cập nhật biến kiểm tra đã có ghế nào được chọn chưa
    const isSelectedSeat = newListSeatSelected.length > 0 ? true : false;
    // tính lại tổng tiền
    const amount = newListSeat?.reduce((amount, seat) => {
      if (seat.selected) {
        if(seat.type === "NORMAL")
        {
          return (amount += 70000);
        }
        else {
          return (amount += 80000)
        }

      }
      return amount;
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
    let color;
    if (seat.type === "NORMAL") {
      color = "#3e515d";
    }
    if (seat.type === "VIP") {
      color = "#f7b500";
    }
    if (seat.selected) {
      color = "#44c020";
    }
    if (seat.isOccupied) {
      color = "#99c5ff";
    }
    return color;
  };

  const handlerSoGhe =(e) =>{
    setSoGhe(e.target.value);
  }
  console.log("soGhe: ",soGhe);
  const handlerXacNhanSoGhe =()=>{
    // setSoGhe(soGhe)
    console.log("xác nhận", soGhe);
  }
console.log(thongTin);
  return (
    <main className={classes.listSeat}>
      {/* thông tin phim */}
      <div className={classes.info_CountDown}>
        <div className={classes.infoTheater}>
          <img
            src={thongTin?.data?.content[0]?.movie?.smallImageURl}
            alt="phim"
            style={{ width: 100, height: 150 }}
          />
          <div className={classes.text}>
            <p style={{color: "green", fontWeight:"700", marginBottom:"1rem", fontSize:"2rem"}}>{thongTin?.data?.content[0]?.movie?.name}</p>
            <TenCumRap tenCumRap={thongTin?.data?.content[0]?.branch?.name} />
            <p className={classes.textTime}>{`${
              thongTin && formatDate(thongTin?.data?.content[0]?.startDate).dayToday
            } - ${thongTin?.data?.content[0]?.startDate} - ${thongTin?.data?.content[0]?.movie?.rated}`}</p>
          <input
            style={{
              display:"flex",
              justifyContent:"center",
              textAlign:"center",
              // margin:"1rem",
              border:"1px solid orange",
              backgroundColor:"black",
              color:"white",
              height:"2rem",
              witdth:"3rem",
              fontSize:"1.5rem"
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
            display:"flex",
            position:"absolute",
            top:"27.8%",
            left:"45%",
            // justifyContent:"center",
            // textAlign:"center",
            // marginTop:"1.2rem",
            // height:"2rem",
            // witdth:"3rem",
          }}
          > Ghế</h4>
          </div>
        </div>
        {/* <div className={classes.countDown}>
          <p className={classes.timeTitle}>Time count down</p>
          <Countdown />
        </div> */}
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
                  <p className={classes.label}>{seat.name.slice(0, 1)}</p>
                )}
                {/* số ghế thứ tự của ghế */}
                {seat.selected && (
                  <p className={classes.seatName}>
                    {Number(seat.name.slice(1)) < 10
                      ? seat.name.slice(1)
                      : seat.name.slice(1)}
                  </p>
                )}
                {seat.isOccupied === 0 && (
                  <p className={classes.seatName}>
                    {Number(seat.name.slice(1)) < 10
                      ? seat.name.slice(1)
                      : seat.name.slice(1)}
                  </p>
                )}
                {/* label ghế đã có người đặt */}
                {seat.isOccupied === 1 && (
                  <img
                    className={classes.seatLocked}
                    src="/img/bookticket/notchoose.png"
                    alt="notchoose"
                  />
                )}
                {/* icon ghế */}
                <SeatIcon
                  style={{ color: color(seat) }}
                  className={classes.seatIcon}
                />
                {/* đường viền chỉ vùng ghế */}
                {/* {seat.name === "C8" &&(
                  <img
                    className={classes.viewCenter}
                    src="/img/bookticket/seatcenter.png"
                    alt="seatcenter"
                  />
                )} */}
                {/* vùng bắt sự kiện click */}
                <div
                  className={classes.areaClick}
                  onClick={() => handleSelectedSeat(seat)}
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
              <p className={classes.posiX}>x</p>
              <SeatIcon style={{ color: "#99c5ff", fontSize: 27 }} />
            </div>
            <p>Đã đặt</p>
          </div>
        </div>
        {/* <div className={classes.positionView}>
          <span>
            <span className={classes.linecenter} />
            <span>Ở giữ</span>
          </span>
          <span className={classes.line}>
            <span className={classes.linebeautiful} />
            <span>View đẹp</span>
          </span>
        </div> */}
      </div>

      {/* modalleft */}
      <div className={classes.modalleft}>
        <div className={classes.opacity}></div>
      </div>
    </main>
  );
}
