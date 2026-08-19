import React, { Fragment, useEffect, useState } from 'react'

import formatDate from '../../../../../utilities/formatDate'
import BtnGoToCheckOutPhong from '../../../../../components/BtnGoToCheckOutPhong';
import useStyles from './style'
import theatersApi from '../../../../../api/theatersApi';

export default function LstGioChieu(props) {
  const [lstLichChieuTheoPhim, setLstLichChieuTheoPhim] = useState([]);
  // console.log("nè",props);
  const classes = useStyles()
  useEffect(() =>{
    theatersApi.getThongTinLichChieuPhimCoRap(props.idPhim,props.idRap)
    // theatersApi.getThongTinLichChieuPhimCoRap(7,1)
    .then((res)=>{
      // console.log(res.data.data);
      setLstLichChieuTheoPhim(res.data.data)
    })
    .catch((err)=>{
      // console.log(err);
    })
  },[])
  // console.log(lstLichChieuTheoPhim);
  const mangChiChuaNgay = lstLichChieuTheoPhim?.content?.map(item => {  // tạo mảng mới chỉ chứa ngày
    // if(new Date(item.startDate).getTime() >= new Date().getTime())
    return item.startDate.slice(0, 10);// item là "2020-12-17" cắt ra từ 2020-12-17T10:10:00
  })
  // console.log(mangChiChuaNgay);

  const filteredArray = mangChiChuaNgay?.filter((element) => {
    return element !== undefined;
  });
  // console.log("filteredArray: ", filteredArray);

  const MangNgayKhongTrungLap = [...new Set(filteredArray)] // xóa đi ngày trùng lặp > dùng mảng này để render số phần tử

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
      {MangNgayKhongTrungLap.length === 0 ? <h6 style={{textAlign:"center", padding:"5px",  color:"white", backgroundColor:"black", fontWeight:"medium"}}>Không có suất chiếu hiện tại</h6> : null}
      {MangNgayKhongTrungLap.map(date => (
        <Fragment key={date}>
          <p className={classes.ngayChieu}>{formatDate(date).dateFull}</p>
          <div className={classes.groupTime}>
            {lstLichChieuTheoPhim?.content?.map((lichChieuTheoPhim) => (
              (lichChieuTheoPhim.startDate === date) ?
              <Fragment key={lichChieuTheoPhim?.id}>
                <BtnGoToCheckOutPhong 
                 lichChieuTheoPhim={lichChieuTheoPhim?.startTime}
                 duration={lichChieuTheoPhim?.movie?.duration}
                 idLich={lichChieuTheoPhim?.id}
                 maPhim={lichChieuTheoPhim?.movie?.id}
                 ngayChieu={lichChieuTheoPhim?.startDate}
                 maPhong={lichChieuTheoPhim?.room?.id}
                 gioChieu={lichChieuTheoPhim?.startTime}
                 maRap={lichChieuTheoPhim?.branch?.id}
                 phong={lichChieuTheoPhim?.room?.name}
                />
              </Fragment>:null
            ))}
          </div>

        </Fragment>
      ))
    }
    </div >
  )
}
