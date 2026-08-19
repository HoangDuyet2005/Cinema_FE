import React, { Fragment } from 'react'

import formatDate from '../../../../../utilities/formatDate'
import BtnGoToCheckOut from '../../../../../components/BtnGoToCheckOut';
import useStyles from './style'

export default function LstGioChieu({ lstLichChieuTheoPhim}) {
  // console.log("nè",danhSachPhim);
  const classes = useStyles()
  
  // const mangChiChuaNgay = lstLichChieuTheoPhim.map(item => {  // tạo mảng mới chỉ chứa ngày
  //   return item;// item là "2020-12-17" cắt ra từ 2020-12-17T10:10:00
  // })
  // console.log(mangChiChuaNgay);

  // const MangNgayKhongTrungLap = [...new Set(mangChiChuaNgay)] // xóa đi ngày trùng lặp > dùng mảng này để render số phần tử

  // const filterByDay = (date) => { // lọc ra item từ mảng gốc
  //   const gioChieuRenDer = lstLichChieuTheoPhim.filter(item => {
  //     if (item.startDate.slice(0, 10) === date) {
  //       return true
  //     }
  //     return false
  //   })
  //   return gioChieuRenDer;
  // }

  return (
    <div className={classes.lstNgayChieu}>
      {/* {MangNgayKhongTrungLap.map(date => (
        <Fragment key={date}>
          <p className={classes.ngayChieu}>{formatDate(date).dateFull}</p> {/*in ra ngày hiện tại*/}
          <div className={classes.groupTime}>
            {/* {lstLichChieuTheoPhim.map(lichChieuTheoPhim => ( */}
              <Fragment key={lstLichChieuTheoPhim.id}>
                <BtnGoToCheckOut 
                 lichChieuTheoPhim={lstLichChieuTheoPhim.startTime}
                 duration={lstLichChieuTheoPhim.movie?.duration}
                 idLich={lstLichChieuTheoPhim.id}
                 maPhim={lstLichChieuTheoPhim.movie?.id}
                 ngayChieu={lstLichChieuTheoPhim.startDate}
                 maPhong={lstLichChieuTheoPhim.room?.id}
                 gioChieu={lstLichChieuTheoPhim.startTime}
                 maRap={lstLichChieuTheoPhim.branch?.id} 
                />
              </Fragment>
            {/* ))} */}
          </div>

        {/* </Fragment> */}
      {/* )) */}
      {/* } */}
    </div >
    // <div>
    //   nulll
    // </div>
  )
}
