import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import BtnPlay from '../../../../../components/BtnPlay';
import useStyles from './styles';
import './movie.scss';

function MovieItem({ movie, comingMovie }) {
  const classes = useStyles({ bg: movie.smallImageURl || movie.smallImageURL || movie.hinhAnh, comingMovie });
  const history = useHistory();

  // Dynamic real data from database (0 if unrated)
  const hasRating = movie.totalVotes != null && movie.totalVotes > 0;
  const ratingScore = hasRating && movie.avgRating != null 
    ? Number(movie.avgRating).toFixed(1) 
    : "0";
  const ageRating = movie.rated || "P";

  return (
    <div className="film-card-container">
      <div className="film">
        <div className="film__img">
          <div className={`film__poster ${classes.addbg}`}>
            <div
              className="film__overlay"
              onClick={() => history.push(`/phim/${movie.id}`, { comingMovie })}
            />
            <div className="play__trailer">
              <BtnPlay cssRoot={"play"} width={48} height={48} urlYoutube={movie?.trailerURL} />
            </div>

            {/* Badges inside poster completely synchronized with DB */}
            <div className="film__badge_rating">
              <StarIcon className="star_icon" />
              <span>{ratingScore}</span>
            </div>
            <div className="film__badge_age">
              {ageRating}
            </div>
          </div>
        </div>

        <div className="film__content">
          <h4
            className="film__title"
            title={movie.name || movie.tenPhim}
            onClick={() => history.push(`/phim/${movie.id}`, { comingMovie })}
          >
            {movie.name || movie.tenPhim}
          </h4>

          <div className="film__button">
            <Link
              style={{ background: comingMovie ? "#034ea2" : "#f26b38" }}
              to={{ pathname: `/phim/${movie.id}`, state: { comingMovie } }}
            >
              {comingMovie ? "THÔNG TIN" : "MUA VÉ"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieItem;