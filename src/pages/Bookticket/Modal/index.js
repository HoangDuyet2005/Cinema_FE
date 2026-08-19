import React from "react";

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
    // if (successBookingTicketMessage) {
    //   dispatch(getListSeat(param.maLichChieu));
    // }
    // dispatch({ type: RESET_DATA_BOOKTICKET });
    handleCombackHome()
  };
  const handleTimeOut = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch(getListSeat(param.maLichChieu));
  };
  const handleAlertOver10 = () => {
    dispatch({ type: RESET_ALERT_OVER10 });
    // window.location.reload()
  };

  const handleCombackHome = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch({ type: LOADING_BACKTO_HOME });
    history.push("/");
  };

  const handleThanhToan = () => {
    history.push(`/payment/${successBookingTicketMessage?.data?.id}/${successBookingTicketMessage?.data?.price}`);
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
