import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import billsApi from './../../../api/billsApi'

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

export default function Modal() {
  const {
    alertOver10,
    isMobile,
    timeOut,
    successBookingTicketMessage,
    errorBookTicketMessage,
    danhSachPhongVe: { thongTinPhim },
  } = useSelector((state) => state.bookTicketReducer);
  console.log(successBookingTicketMessage);
  const dispatch = useDispatch();
  const param = useParams(); // lấy dữ liệu param từ URL
  const history = useHistory();
  const classes = useStyles({
    thongTinPhim,
    color: colorTheater[thongTinPhim?.tenCumRap.slice(0, 3).toUpperCase()],
    isMobile,
  });
  const isBookticket =
    successBookingTicketMessage || errorBookTicketMessage ? true : false;

  const handleReBooking = () => {
    if (successBookingTicketMessage) {
      dispatch(getListSeat(param.maLichChieu));
    }
    dispatch({ type: RESET_DATA_BOOKTICKET });
  };
  const handleTimeOut = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch(getListSeat(param.maLichChieu));
  };
  const handleAlertOver10 = () => {
    dispatch({ type: RESET_ALERT_OVER10 });
    window.location.reload()
  };

  const handleCombackHome = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch({ type: LOADING_BACKTO_HOME });
    history.push("/");
  };

  const handlerThanhToan =() =>{
    dispatch({ type: RESET_DATA_BOOKTICKET });

    console.log(successBookingTicketMessage?.data?.id);
    handlerComfirm()
}

const handlerComfirm = () =>{
    Swal.fire({
        title: 'Bạn có chắc muốn thanh toán?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
      }).then((result) => {
        if (result.isConfirmed) {
            billsApi.postThanhToan(successBookingTicketMessage?.data?.id)
            .then((res)=>{
                console.log(res);
                Swal.fire('Đã thanh toán!', '', 'success')
                // history.push("/staff/bills");
            })
            .catch((err) =>{
                console.log(err);
                Swal.fire('Đã quá hạn thanh toán!', '', 'info')
                history.push("/")
            })
        } else if (result.isDenied) {
          Swal.fire('Không thanh toán ngay!', '', 'info')
            // history.push("/staff/bills");
        }
      })
  }

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
            <p className={classes.textOver}>Nhân viên không được chọn quá số lượng ghế đã điền</p>
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
              <Button
                classes={{ root: classes.btnResult }}
                onClick={handlerThanhToan}
              >
                Thanh toán cho khách hàng tại quầy
              </Button>
            </div>
          </>
        )}
    </Dialog>
  );
}
