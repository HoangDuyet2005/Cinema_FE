import React, { Fragment, useEffect, useState } from 'react'

import formatDate from '../../../../../utilities/formatDate'
import BtnGoToCheckOutPhong from '../../../../../components/BtnGoToCheckOutPhong';
import useStyles from './style'
import theatersApi from '../../../../../api/theatersApi';

export default function LstGioChieu(props) {
  const [lstLichChieuTheoPhim, setLstLichChieuTheoPhim] = useState([]);
  const classes = useStyles()

  useEffect(() =>{
    theatersApi.getThongTinLichChieuPhimCoRap(props.idPhim, props.idRap)
    .then((res)=>{
      setLstLichChieuTheoPhim(res.data.data)
    })
    .catch((err)=>{
      console.log(err);
    })
  },[props.idPhim, props.idRap])

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

  const validSchedules = (lstLichChieuTheoPhim?.content || []).filter(item => {
    const sDate = item.startDate ? item.startDate.slice(0, 10) : '';
    if (sDate < todayStr) return false;
    if (sDate === todayStr && item.startTime && item.startTime < currentTimeStr) return false;
    return true;
  });

  const mangChiChuaNgay = validSchedules.map(item => item.startDate.slice(0, 10));
  const MangNgayKhongTrungLap = [...new Set(mangChiChuaNgay)].sort();

  return (
    <div className={classes.lstNgayChieu}>
      {MangNgayKhongTrungLap.map(date => (
        <Fragment key={date}>
          <p className={classes.ngayChieu}>{formatDate(date).dateFull}</p>
          <div className={classes.groupTime}>
            {validSchedules.map((lichChieuTheoPhim) => (
              (lichChieuTheoPhim.startDate?.slice(0, 10) === date) ?
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
              </Fragment> : null
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  )
}