import React, { useEffect, useState } from 'react'

import { useParams } from "react-router-dom";
import Rating from '@material-ui/lab/Rating';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLocation } from "react-router-dom";

import useStyles from './style';
import formatDate from '../../../utilities/formatDate';
import useApiThoiLuongDanhGia from '../../../utilities/useApiThoiLuongDanhGia';
import Tap from '../Tap';
import BtnPlay from '../../../components/BtnPlay';
import { dataFakeImgTheater } from '../../../constants/theaterData';
import ShowtimeDetail  from "../../UserProfile/ShowtimeDetail/index"
import Showtime from "./../../../pages/Homepage/Showtime";

export default function Desktop({ movieDetailShowtimes: data, isMobile }) {
  // console.log("----------MT---------",data);
  const [onClickBtnMuave, setOnClickBtnMuave] = useState(0)
  const param = useParams()
  const [quantityComment, setQuantityComment] = useState(0)
  const { danhGia } = useApiThoiLuongDanhGia(param.maPhim)
  const classes = useStyles({ bannerImg: data?.smallImageURl })
  const [imageNotFound, setImageNotFound] = useState(false)
  let location = useLocation();

  const handleBtnMuaVe = () => {
    setOnClickBtnMuave(Date.now())
  }
  const onIncreaseQuantityComment = (value) => {
    setQuantityComment(value)
  }

  return (
    <div className={classes.desktop}>
      <div className={classes.top}>
        <div className={classes.gradient}>
        </div>
        <div className={classes.bannerBlur}>
          {imageNotFound && <div className={classes.withOutImage}></div>}
        </div>
        <div className={classes.topInfo}>
          <div className={classes.imgTrailer}>
            <BtnPlay urlYoutube={(data?.trailerURL)} />
            {/* xử lý khi url hình bị lỗi */}
            <img src={data?.smallImageURl} alt="poster" style={{ display: "none" }} onError={(e) => { e.target.onerror = null; setImageNotFound(true) }} />
            {imageNotFound && <div className={classes.withOutImage}></div>}
          </div>
          <div className={classes.shortInfo}> 
            <p>Ngày khởi chiếu:{" "}{formatDate(data?.releaseDate?.slice(0, 10)).dateFull}</p>
            <p><span className={classes.c18}>{data?.rated}</span></p>
            <p className={classes.movieName}>{data?.name}</p>
            {/* <p>{`${thoiLuong ?? "120"} phút - ${danhGia}`} - 2D/Digital</p> */}
            <p>
              Thời lượng: {data?.duration} phút
            </p>
            <button className={classes.btnMuaVe} onClick={handleBtnMuaVe}>{location?.state?.comingMovie ? "Thông tin phim" : "Mua vé"}</button>
          </div>
          {/* <div className={classes.rate}>
            <div className={classes.circular}>
              <span className={classes.danhGia}>{danhGia}</span>
              <CircularProgress variant="determinate" size="100%" value={100} className={classes.behined} color="secondary" />
              <CircularProgress variant="determinate" size="100%" value={danhGia * 10} className={classes.fabProgress} color="secondary" />
            </div>
            <div className={classes.rateStar}>
              <Rating value={(danhGia * 5) / 10} precision={0.5} readOnly />
            </div>
            <span>{quantityComment} người đánh giá</span>
          </div> */}
        </div>
      </div>
      <Tap data={data} onClickBtnMuave={onClickBtnMuave} onIncreaseQuantityComment={onIncreaseQuantityComment} isMobile={isMobile} />
      {/* <ShowtimeDetail /> */}
      {/* <Showtime /> */}
    </div>
  )
}
