import React from 'react'
import { useHistory } from "react-router-dom";
import useStyles from './style'

export default function BtnGoToCheckout({ lichChieuTheoPhim, duration, idLich, maPhim, ngayChieu, maPhong, gioChieu, maRap }) {
  const classes = useStyles()
  const history = useHistory()

  function toHoursAndMinutes(totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
  
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  }
  
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function convertH2M(timeInHour){
    var timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }
  
  // var timeInMinutes = convertH2M("14:30");
  // console.log(timeInMinutes);


  const calculateTimeout = (ngayChieuGioChieu, duration) => {
    // const fakeThoiLuong = duration
    // console.log("ngayChieuGioChieu: ", ngayChieuGioChieu);
    const timeInObj = ngayChieuGioChieu
    const gioDoi = convertH2M(timeInObj)
    // console.log(gioDoi);
    const tongGio = duration + gioDoi

    // const timeThem = toHoursAndMinutes(duration)
    // const timeThem = new Date(duration.getTime() + 30 * 60 * 1000)
    // console.log("tongGio", tongGio);

    const timeOutObj = toHoursAndMinutes(tongGio)
    // const timeOutObj = timeInObj + fakeThoiLuong * 60 * 1000;
    // console.log("timeOutObj", timeOutObj);

    return timeOutObj
  }

  return (
    <button className={classes.button} onClick={() => history.push(`/datvechitiet/${idLich}/${maRap}/${maPhim}/${ngayChieu}/${maPhong}/${gioChieu}`, `/datvechitiet/${idLich}/${maRap}/${maPhim}/${ngayChieu}${maPhong}/${gioChieu}`)}>
      <span className={classes.inTime}>Chiếu từ {lichChieuTheoPhim.slice(0, 5)}</span>
      <span className={classes.outTime}>{` đến ${calculateTimeout(lichChieuTheoPhim, duration)}`}</span>
    </button>
  )
}
