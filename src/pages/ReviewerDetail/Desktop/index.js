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
import { FAKE_AVATAR } from '../../../constants/config';
import NewsComponent from '../../../components/NewsComponentForReviewer/NewsComponent';
import PostReviewer from '../../PostReviewer';

import { Modal, Avatar, Button, Card, CardActions, CardContent, CardHeader, IconButton, Typography } from '@material-ui/core';


export default function Desktop({ reviewerDetailShowtimes: data, reviewList: reviewList1, isMobile }, ) {
  console.log("----------MT---------",reviewList1);
  const [onClickBtnMuave, setOnClickBtnMuave] = useState(0)
  const param = useParams()
  const [quantityComment, setQuantityComment] = useState(0)
  const { thoiLuong, danhGia } = useApiThoiLuongDanhGia(param.maPhim)
  const classes = useStyles({ bannerImg: data?.image ? data?.image : FAKE_AVATAR })
  const [imageNotFound, setImageNotFound] = useState(false)
  let location = useLocation();

  // const handleBtnMuaVe = () => {
  //   setOnClickBtnMuave(Date.now())
  // }
  // const onIncreaseQuantityComment = (value) => {
  //   setQuantityComment(value)
  // }

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
            {/* <BtnPlay urlYoutube={(data?.trailerURL)} /> */}
            {/* xử lý khi url hình bị lỗi */}
            <img src={data?.image ? data?.image : FAKE_AVATAR} alt="poster" style={{ display: "none" }} onError={(e) => { e.target.onerror = null; setImageNotFound(true) }} />
            {imageNotFound && <div className={classes.withOutImage}></div>}
          </div>
          <div className={classes.shortInfo}> 
            <p className={classes.movieName}>{data?.name}</p>
            <p>Email:{" "}{data?.email}</p>
            <p><span>Tên tài khoản:{" "}{data?.username}</span></p>
            {/* <p>Tiểu sử:{" "} {data?.bio ? data?.bio : "Không có tiểu sử"}</p> */}
            {/* <p>{`${thoiLuong ?? "120"} phút - ${danhGia}`} - 2D/Digital</p> */}
            {/* <button className={classes.btnMuaVe} onClick={handleBtnMuaVe}>{location?.state?.comingMovie ? "Thông tin phim" : "Mua vé"}</button> */}
          </div>
          {/* <div className={classes.rate}>
            <div className={classes.circular}>
              <span className={classes.danhGia}>{data?.followers ? data?.followers: "0"}</span>
              <CircularProgress variant="determinate" size="100%" value={100} className={classes.behined} color="secondary" />
              <CircularProgress variant="determinate" size="100%" value={data?.followers * 10} className={classes.fabProgress} color="secondary" />
            </div>

            <span>người theo dõi</span>
          </div> */}

          <div className={classes.rate} style={{marginLeft:"1rem"}}>
            <div className={classes.circular}>
              <span className={classes.danhGia}>{reviewList1?.length ? reviewList1?.length: "0"}</span>
              <CircularProgress variant="determinate" size="100%" value={100} className={classes.behined} color="secondary" />
              <CircularProgress variant="determinate" size="100%" value={reviewList1?.length * 2} className={classes.fabProgress} color="secondary" />
            </div>
            {/* <div className={classes.rateStar}>
              <Rating value={(danhGia * 5) / 10} precision={0.5} readOnly />
            </div> */}
            <span>bài viết đã viết</span>
          </div>
        </div>
      </div>
      {/* <Tap data={data} onClickBtnMuave={onClickBtnMuave} onIncreaseQuantityComment={onIncreaseQuantityComment} isMobile={isMobile} /> */}
      {/* <ShowtimeDetail /> */}
      {/* <Showtime /> */}
      {/* <NewsComponent reviewerDetailShowtimes={data} reviewList={reviewList1}/> */}
      <PostReviewer reviewerDetailShowtimes={data} reviewList={reviewList1} avatar ={data?.image}/>
    </div>
  )
}
