import React, { useState } from 'react'

import { useParams } from "react-router-dom";

import useStyles from './style';

export default function Desktop({ movieDetailShowtimes: data, isMobile }) {
  // console.log("----------MT---------",data);

  const param = useParams()
  // const { thoiLuong, danhGia } = useApiThoiLuongDanhGia(param.maPhim)
  const classes = useStyles({ bannerImg: data?.mainImage })
  const [imageNotFound, setImageNotFound] = useState(false)
  // let location = useLocation();

  return (
    <div className={classes.desktop}>
      <div className={classes.top}>
        <div className={classes.gradient}>
        </div>
        <div className={classes.bannerBlur}>
          {imageNotFound && <div className={classes.withOutImage}></div>}
        </div>
        <div className={classes.topInfo}>
          {/* <div className={classes.imgTrailer}>
            <img src={data?.mainImage} alt="poster" style={{ display: "none" }} onError={(e) => { e.target.onerror = null; setImageNotFound(true) }} />
            {imageNotFound && <div className={classes.withOutImage}></div>}
          </div> */}
          <div className={classes.shortInfo}> 
            {/* <p>{formatDate(data?.releaseDate?.slice(0, 10)).YyMmDd}</p> */}
            <p><span className={classes.c18}>{data?.type}</span></p>
            <p className={classes.movieName}>{data?.brief}</p>
            {/* <p>{`${thoiLuong ?? "120"} phút - ${danhGia}`} - 2D/Digital</p> */}
            <p className={classes.c19}>
              {data?.title}
            </p>
            {/* <p className={classes.c19}>
              {data?.description}
            </p> */}
            <div dangerouslySetInnerHTML={{__html:data?.description}} className={classes.c19} />
            {/* <button className={classes.btnMuaVe} onClick={handleBtnMuaVe}>{location?.state?.comingMovie ? "Thông tin phim" : "Mua vé"}</button> */}
          </div>
        </div>
      </div>
      </div>
  )
}
