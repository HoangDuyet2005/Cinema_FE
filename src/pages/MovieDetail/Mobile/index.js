import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StarIcon from '@material-ui/icons/Star';
import useStyles from './style';
import formatDate from '../../../utilities/formatDate';
import Tap from '../Tap';
import getVideoId from '../../../utilities/getVideoIdFromUrlyoutube';
import MovieRatingModal from '../../../components/MovieRatingModal';
import moviesApi from '../../../api/moviesApi';
const BtnPlay = '/img/carousel/play-video.png';

export default function Mobile({ movieDetailShowtimes: data, isMobile }) {
  const [openVideo, setopenVideo] = useState(false)
  const param = useParams()
  const classes = useStyles({ bannerImg: data?.smallImageURl, openVideo })
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

  return (
    <div className={classes.mobile}>
      <div className={classes.info}>
        <div className={classes.banner}>
        </div>
        <div className={classes.gradient}>
        </div>
        <iframe className={classes.iframe} width="100%" height="100%" src={`https://www.youtube.com/embed/${getVideoId(data?.trailerURL)}`} allowFullScreen frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="trailer movie"></iframe>
        {openVideo || <img src={BtnPlay} className={classes.btnPlay} onClick={() => setopenVideo(true)} alt="play" />}
      </div>
      <div className={classes.shortInfo}>
        <p>{formatDate(data?.releaseDate?.slice(0, 10)).dateFull}</p>
        <p><span className={classes.c18}>{data?.categories}</span></p>
        <p className={classes.movieName}>{data?.name}</p>
        <p>Thời lượng: {data?.duration} phút</p>

        {/* Rating trigger */}
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
      </div>
      <Tap data={data} isMobile={isMobile} />

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