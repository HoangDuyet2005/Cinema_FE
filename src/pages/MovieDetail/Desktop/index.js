import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import StarIcon from '@material-ui/icons/Star';
import useStyles from './style';
import formatDate from '../../../utilities/formatDate';
import Tap from '../Tap';
import BtnPlay from '../../../components/BtnPlay';
import MovieRatingModal from '../../../components/MovieRatingModal';
import moviesApi from '../../../api/moviesApi';

export default function Desktop({ movieDetailShowtimes: data, isMobile }) {
  const [onClickBtnMuave, setOnClickBtnMuave] = useState(0)
  const param = useParams()
  const [quantityComment, setQuantityComment] = useState(0)
  const classes = useStyles({ bannerImg: data?.smallImageURl })
  const [imageNotFound, setImageNotFound] = useState(false)
  const [openRatingModal, setOpenRatingModal] = useState(false)
  const [ratingData, setRatingData] = useState({
    avgRating: 0.0,
    totalVotes: 0,
    userRating: null,
  })

  const auth = useSelector((state) => state.authReducer);
  const usersMgmt = useSelector((state) => state.usersManagementReducer);
  const currentUser =
    auth?.currentUser ||
    usersMgmt?.successInfoUser?.data ||
    (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null) ||
    (localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null);

  const userId = currentUser?.id || currentUser?.data?.id;
  let location = useLocation();

  const movieId = data?.id || param?.maPhim;

  useEffect(() => {
    if (movieId) {
      moviesApi
        .getMovieRating(movieId, userId)
        .then((res) => {
          if (res.data?.data) {
            setRatingData(res.data.data);
          }
        })
        .catch((err) => console.log("Error loading movie rating:", err));
    }
  }, [movieId, userId]);

  const handleRatingUpdated = (newRatingData) => {
    setRatingData(newRatingData);
  };

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
            <img src={data?.smallImageURl} alt="poster" style={{ display: "none" }} onError={(e) => { e.target.onerror = null; setImageNotFound(true) }} />
            {imageNotFound && <div className={classes.withOutImage}></div>}
          </div>
          <div className={classes.shortInfo}> 
            <p>Ngày khởi chiếu:{" "}{formatDate(data?.releaseDate?.slice(0, 10)).dateFull}</p>
            <p><span className={classes.c18}>{data?.rated}</span></p>
            <p className={classes.movieName}>{data?.name}</p>
            <p>
              Thời lượng: {data?.duration} phút
            </p>

            {/* Phần đánh giá sao theo đúng ảnh mẫu Image 2 */}
            <div>
              <div
                className={classes.ratingTrigger}
                onClick={() => setOpenRatingModal(true)}
                title="Bấm vào đây để đánh giá phim"
              >
                <StarIcon className={classes.starIcon} />
                <span className={classes.ratingScore}>
                  {ratingData.totalVotes > 0 ? Number(ratingData.avgRating).toFixed(1) : "0"}
                </span>
                <span className={classes.ratingVotes}>
                  ({ratingData.totalVotes || 0} votes)
                </span>
              </div>
            </div>

            <div>
              <button className={classes.btnMuaVe} onClick={handleBtnMuaVe}>
                {location?.state?.comingMovie ? "Thông tin phim" : "Mua vé"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Tap data={data} onClickBtnMuave={onClickBtnMuave} onIncreaseQuantityComment={onIncreaseQuantityComment} isMobile={isMobile} />

      {/* Modal đánh giá sao theo đúng Image 3 & Image 4 */}
      <MovieRatingModal
        open={openRatingModal}
        onClose={() => setOpenRatingModal(false)}
        movie={data}
        ratingData={ratingData}
        onRatingUpdated={handleRatingUpdated}
        currentUser={currentUser}
      />
    </div>
  )
}