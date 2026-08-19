import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import useStyles from './style'
import { colorTheater } from '../../../constants/theaterData'
import usersApi from '../../../api/usersApi'

export default function SuccessBooking() {
  const { isMobile, amount, email, phone, paymentMethod, listSeatSelected, successBookingTicketMessage, errorBookTicketMessage, danhSachPhongVe: { thongTinPhim }, thongTinPhongVe } = useSelector((state) => state.bookTicketReducer)
  const { currentUser } = useSelector((state) => state.authReducer)
  // const classes = useStyles({ thongTinPhongVe, color: colorTheater[thongTinPhongVe?.setRap.slice(0, 3).toUpperCase()], isMobile })
  const classes = useStyles({ thongTinPhongVe, isMobile })

  const [userThongTin, setUserThongTin] = useState()

  useEffect(() =>{
    usersApi.getThongTinTaiKhoan()
    .then((response) =>{
      console.log(response);
      setUserThongTin(response);
      // dispatch({
      //   type: LOGIN_SUCCESS,
      //   payload:{ data : response.data.data }
      // })
    })
    .catch((err) => {
      // console.log(err);
    })
  },[])

  return (
    <div className={classes.resultBookticket}>
      <div className={classes.infoTicked} >
        <div className={classes.infoTicked__img}>
          <img style={{width:"150px"}}  alt=""  src={thongTinPhongVe?.setPhim.smallImageURl}/>
        </div>
        <div className={classes.infoTicked__txt}>
          <p className={classes.tenPhim}>
            {thongTinPhongVe?.setPhim.name}
          </p>
          <p className={classes.text__first}><span>{thongTinPhongVe?.setRap.split("-")[0]}</span><span className={classes.text__second}>-{thongTinPhongVe?.setRap.split("-")[1]}</span></p>
          <p className={classes.diaChi} >{thongTinPhongVe?.cumRapChieuData[0].address}</p>
          <table className={classes.table}>
            <tbody>
              <tr>
                <td valign='top' >Showtime:</td>
                <td valign='top'>{`${thongTinPhongVe?.suatChieu} ${thongTinPhongVe?.setNgayXem}`}</td>
              </tr>
              <tr>
                <td valign='top'>Room:</td>
                <td>Phòng 01</td>
              </tr>
              <tr>
                <td valign='top'>Seat(s):</td>
                <td>{listSeatSelected?.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div>
          <h3 className={classes.infoResult_label}>Thông tin vé</h3>
          <table className={`${classes.table} table`}>
            <tbody>
              <tr>
                <td valign='top' >Tên:</td>
                <td>{userThongTin?.data?.data?.name}</td>
              </tr>
              {/* <tr>
                <td valign='top'>Phone:</td>
                <td valign='top'>{phone}</td>
              </tr> */}
              <tr>
                <td valign='top'>Email:</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td valign='top'>Trạng thái:</td>
                <td>
                  {successBookingTicketMessage && <span>Chưa thanh toán <span className={classes.paymentColor}>{paymentMethod}</span></span>}
                  {errorBookTicketMessage && <span>Đặt vé thất bại: <span className={classes.errorColor}>{errorBookTicketMessage}</span></span>}
                </td>
              </tr>
              <tr>
                <td valign='top' >Total:</td>
                <td valign='top'><span>{`${amount.toLocaleString('vi-VI')} đ`}</span></td>
              </tr>
            </tbody>
          </table>
          {successBookingTicketMessage && <p className={classes.noteresult}>Vui lòng kiểm tra thông tin đặt vé!</p>}
        </div>
      </div>
    </div>
  )
}
