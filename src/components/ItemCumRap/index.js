import React, { Fragment } from 'react'

import Address from './Address'
import FakeImgTheater from '../FakeImgTheater/fakeImgTheater'
import BtnGoToCheckOut from '../BtnGoToCheckOut'
import TenCumRap from '../TenCumRap'
import { useStyles, Accordion, AccordionSummary, AccordionDetails } from './style'

export default function ItemCumRap({ tenCumRap, maLichChieu, lichChieuPhim, diaChi, defaultExpanded, maPhim, ngayChieu, maPhong, gioChieu, maRap, giaVe}) {
  const classes = useStyles()

  return (
    <>
      <div className={classes.cumRapItem} >
        <Accordion key={tenCumRap} square defaultExpanded={defaultExpanded ?? false}>
          <AccordionSummary>
            <FakeImgTheater nameTheater={tenCumRap} imgStyle={classes.imgTheater} />
            <div className={classes.wrapInfo} >
              <TenCumRap tenCumRap={tenCumRap} giaVe={giaVe}/>
              <Address maLichChieu={maLichChieu} diaChiAlreadyExist={diaChi} />
            </div>
            <div style={{ clear: "both" }}></div>
          </AccordionSummary>
          <AccordionDetails >
            {/* {lichChieuPhim.map(lcp => (
              <Fragment key={lcp.id} >
                <BtnGoToCheckOut lichChieuTheoPhim={lcp?.startTime} />
              </Fragment>
            ))} */}
              <Fragment key={lichChieuPhim.id} >
                <BtnGoToCheckOut lichChieuTheoPhim={lichChieuPhim?.startTime} 
                duration = {lichChieuPhim?.movie?.duration} 
                idLich={lichChieuPhim?.id} 
                maPhim={maPhim} 
                ngayChieu={ngayChieu}
                maPhong={maPhong}
                gioChieu={gioChieu}
                maRap={maRap}/>
              </Fragment>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  )
}
