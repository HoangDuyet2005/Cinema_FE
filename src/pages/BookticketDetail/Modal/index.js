import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";

import useStyles from "./style";
import {
  RESET_DATA_BOOKTICKET,
  RESET_ALERT_OVER10,
} from "../../../reducers/constants/BookTicket";
import { LOADING_BACKTO_HOME } from "../../../reducers/constants/Lazy";
import { getListSeat } from "../../../reducers/actions/BookTicket";
import { colorTheater } from "../../../constants/theaterData";
import ResultBookticket from "../ResultBookticket";
import bookingApi from "../../../api/bookingApi";
import Swal from "sweetalert2";
import billsApi from "../../../api/billsApi"
import moviesApi from "../../../api/moviesApi";


export default function Modal() {
  const {
    alertOver10,
    isMobile,
    timeOut,
    successBookingTicketMessage,
    errorBookTicketMessage,
    danhSachPhongVe: { thongTinPhim },
  } = useSelector((state) => state.bookTicketReducer);
  const dispatch = useDispatch();
  const [duocHoan, setDuocHoan] = useState();
  const [thongTinBill, setThongTinBill] = useState()
  const param = useParams(); // lấy dữ liệu param từ URL
  const history = useHistory();
  const classes = useStyles({
    thongTinPhim,
    color: colorTheater[thongTinPhim?.tenCumRap.slice(0, 3).toUpperCase()],
    isMobile,
  });
  const isBookticket =
    successBookingTicketMessage || errorBookTicketMessage ? true : false;

    // console.log('====================================');
    // console.log(param);
    // console.log('====================================');
    useEffect(() => {

      // console.log("Tính toán thời lkuonwjg còn lại");
    // handleTinh();

      // billsApi.getThongTinCuaBill(successBookingTicketMessage?.data?.id)
      // .then((response) =>{
      //   console.log("thông tin bill: ",response);
      //   setThongTinBill(response?.data)
      // })
      // .catch((err) => {
      //   console.log(err);
      // })

      moviesApi.getLichChieuLayThongTin(param?.maPhim, param?.maRap, param?.ngayChieu, param?.gioChieu, param?.maPhong)
      .then((response) =>{
        console.log("Được hoãn hay không: ",response?.data?.data?.content[0].waiting);
        setDuocHoan(response?.data?.data?.content[0].waiting)
      })
      .catch((err) => {
        console.log(err);
      })
      
    }, [duocHoan]);
    
    // console.log(thongTinBill);

  // const handleTinh = () => {
  //   const currentTime = moment().tz('Asia/Ho_Chi_Minh');
  //   console.log(currentTime);

  //   const targetTime = param?.ngayChieu + "T" + param?.gioChieu

  //   const targetTime2 = moment(targetTime, 'YYYY-MM-DDTHH:mm:ss');
  //   console.log(targetTime2);

  //   const timeDiff = Math.round((targetTime2 - currentTime) / (10000 * 60));
  //   console.log(timeDiff);

  //   if (timeDiff >= 60) {
  //     setDuocHoan(true); // Thời gian cách thời điểm cho trước là 60 phút trở lên
  //   } else {
  //     setDuocHoan(false); // Thời gian cách thời điểm cho trước là dưới 60 phút
  //   }
  // }
  const handleReBooking = () => {
    // if (successBookingTicketMessage) {
    //   dispatch(getListSeat(param.maLichChieu));
    // }
    // dispatch({ type: RESET_DATA_BOOKTICKET });

    handleCombackHome();
    console.log("Hủy nha", duocHoan);
    if(duocHoan === false)
    {
      Swal.fire({
        title: 'Trong thời gian 60 phút trước suất chiếu, không thể giữ vé!',
        text: "Bạn không thể dùng chức năng thanh toán sau!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Thanh toán ngay!',
        cancelButtonText: 'Hủy vé đã đặt!'
      }).then((result) => {
        if (result.isConfirmed) {
          handleThanhToan()
        }
        else {
          //api hủy bill (bill)
          Swal.fire('Đã hủy thanh toán sau!', '', 'success')
          console.log("API Hủy bill: ", successBookingTicketMessage?.data?.id);
          handleHuyBill(successBookingTicketMessage?.data?.id)
        }
      })
    }
  };
  const handleTimeOut = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch(getListSeat(param.maLichChieu));
  };
  const handleAlertOver10 = () => {
    dispatch({ type: RESET_ALERT_OVER10 });
    // window.location.reload()
  };

  const handleHuyBill = (billId) => {
    billsApi.postHuyBill(billId)
    .then((response) =>{
      console.log(response);
      console.log("Đã hủy bill");
    })
    .catch((err) => {
      console.log(err);
    })
  }
  const handleCombackHome = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch({ type: LOADING_BACKTO_HOME });
    history.push("/");
  };

  const handleThanhToan = () => {
    // console.log(successBookingTicketMessage?.data?.id);
    history.push(`/payment/${successBookingTicketMessage?.data?.id}/${successBookingTicketMessage?.data?.price}`);
    console.log(successBookingTicketMessage);
  };

  

  return (
    <Dialog
      open={timeOut || (isBookticket && !isMobile) || alertOver10}
      classes={{ paper: classes.modal }}
      maxWidth="md"
    >
      {timeOut &&
        !isBookticket && ( // không thông báo hết giờ khi đã có kết quả đặt vé
          <div className={classes.padding}>
            <p>
              Hết giờ! Vui lòng đặt trong vòng 5 phút.
              <span className={classes.txtClick} onClick={handleTimeOut}>
                Đặt lại!
              </span>
            </p>
          </div>
        )}
      {alertOver10 &&
        !timeOut && ( // ẩn thông báo quá 10 ghế khi time out
          <div className={classes.over10}>
            <div className={classes.notification}>
              <img
                width="100%"
                src="/img/bookticket/Post-notification.png"
                alt="Post-notification"
              />
            </div>
            <p className={classes.textOver}>Bạn không được chọn quá số ghế đã chọn</p>
            <Button
              variant="outlined"
              classes={{ root: classes.btnOver }}
              onClick={handleAlertOver10}
            >
              Okay
            </Button>
          </div>
        )}
      {!isMobile &&
        isBookticket && ( // chỉ open modal khi là desktop và đã đạt vé
          <>
            <ResultBookticket />
            <div className={classes.spaceEvenly}>
              {/* <Button
                classes={{ root: classes.btnResult }}
                onClick={handleReBooking}
              >
                {successBookingTicketMessage && "Đặt thêm ghế cho phim này!"}
                {errorBookTicketMessage && "Cố gắng thử lại"}
              </Button> */}
              {/* <Button
                classes={{ root: classes.btnResult }}
                onClick={handleCombackHome}
              >
                Về trang chủ
              </Button> */}
              <Button
                classes={{ root: classes.btnResult }}
                onClick={handleThanhToan}
              >
                Thanh toán ngay!
              </Button>
              <Button
                classes={{ root: classes.btnResult }}
                onClick={handleReBooking}
              >
                Thanh toán sau!
              </Button>
            </div>
          </>
        )}
    </Dialog>
  );
}
