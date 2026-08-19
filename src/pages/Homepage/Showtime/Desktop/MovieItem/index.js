import React from 'react'

import { Link, useHistory } from 'react-router-dom'

import BtnPlay from '../../../../../components/BtnPlay';
import BlockRating from '../../../../../components/BlockRating';
import useStyles from './styles';
import useApiThoiLuongDanhGia from '../../../../../utilities/useApiThoiLuongDanhGia';

import './movie.scss'

function MovieItem({ movie, comingMovie }) {
  const classes = useStyles({ bg: movie.smallImageURl, comingMovie });
  const history = useHistory();
  const { thoiLuong } = useApiThoiLuongDanhGia(movie.id)
  return (
    <div style={{
      padding: '7px',
      cursor: 'pointer',
    }} >
      <div className="film">
        <div className="film__img">
          <div className={`film__poster ${classes.addbg}`}>
            <div className="film__overlay" onClick={() => history.push(`/phim/${movie.id}`, { comingMovie })} />
            <div className="play__trailer">
              {/* class play lấy từ Carousel component*/}
              <BtnPlay cssRoot={"play"} width={48} height={48} urlYoutube={movie?.trailerURL} />
            </div>
          </div>
          <BlockRating danhGia={10} />
        </div>
        <div className="film__content">
          <div className={`film__name ${thoiLuong ? "" : "not_hide"}`}>
            <div className="name">
              <p><span className="c18">{movie.duration} phút</span>{movie.name}</p>
            </div>
            <p className="pt-2">
              {thoiLuong ? <span className="text_info">{movie.rated}</span> : <span className="text_info">{movie.rated}</span>}
            </p>
          </div>
          <div className={`film__button`}>
            {/* nếu thoiLuong = undefined => phim hiện không có lịch chiếu */}
            {(thoiLuong || comingMovie) && <Link style={{ background: comingMovie ? "#60c5ef" : "#fb4226", }} to={{ pathname: `/phim/${movie.id}`, state: { comingMovie } }}>{comingMovie ? "THÔNG TIN" : "ĐẶT NGAY!"}</Link>}
          </div>
        </div>
      </div>
    </div>
  )

}
export default MovieItem
