import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";

import useStyles from "./style";
import {
  RESET_DATA_BOOKTICKET,
  RESET_ALERT_OVER10,
} from "../../../reducers/constants/BookTicket";
import { getListSeat } from "../../../reducers/actions/BookTicket";
import { colorTheater } from "../../../constants/theaterData";

export default function Modal() {
  const {
    alertOver10,
    isMobile,
    timeOut,
    danhSachPhongVe: { thongTinPhim },
  } = useSelector((state) => state.bookTicketReducer);
  const dispatch = useDispatch();
  const param = useParams();
  const classes = useStyles({
    thongTinPhim,
    color: colorTheater[thongTinPhim?.tenCumRap.slice(0, 3).toUpperCase()],
    isMobile,
  });

  const handleTimeOut = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch(getListSeat(param.maLichChieu));
  };

  const handleAlertOver10 = () => {
    dispatch({ type: RESET_ALERT_OVER10 });
  };

  return (
    <Dialog
      open={Boolean(timeOut || alertOver10)}
      classes={{ paper: classes.modal }}
      maxWidth="md"
    >
      {timeOut && (
        <div className={classes.padding}>
          <p>
            Hết giờ! Vui lòng đặt trong vòng 5 phút.
            <span className={classes.txtClick} onClick={handleTimeOut}>
              Đặt lại!
            </span>
          </p>
        </div>
      )}
      {alertOver10 && !timeOut && (
        <div className={classes.over10}>
          <div className={classes.notification}>
            <img
              width="100%"
              src="/img/bookticket/Post-notification.png"
              alt="Post-notification"
            />
          </div>
          <p className={classes.textOver}>Bạn không được chọn quá số ghế cho phép!</p>
          <Button
            variant="outlined"
            classes={{ root: classes.btnOver }}
            onClick={handleAlertOver10}
          >
            Okay
          </Button>
        </div>
      )}
    </Dialog>
  );
}