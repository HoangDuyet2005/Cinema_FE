import React, { useMemo } from 'react';
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import Slider from "react-slick";

import MovieItem from './MovieItem';
import useStyles from './style';

export function NextArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <div className={`${classes.Arrow} ${classes.arrowNext}`} onClick={onClick} style={{ right: "-28px" }}>
      <ArrowForwardIosRoundedIcon style={{ fontSize: 20 }} />
    </div>
  );
}

export function PrevArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <div className={`${classes.Arrow} ${classes.arrowPrev}`} onClick={onClick} style={{ left: "-28px" }}>
      <ArrowBackIosRoundedIcon style={{ fontSize: 20 }} />
    </div>
  );
}

export default function Desktop({ arrayData, value }) {
  const classes = useStyles();

  const sortedDailyList = useMemo(() => {
    if (!arrayData?.dailyMovieList?.data) return [];
    const preferredOrder = [13, 8, 9, 10, 17, 16, 15, 14, 11, 12];
    return [...arrayData.dailyMovieList.data].sort((a, b) => {
      const idxA = preferredOrder.indexOf(a.id);
      const idxB = preferredOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.id - b.id;
    });
  }, [arrayData?.dailyMovieList]);

  const settings = {
    className: "center",
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className={classes.container}>
      <Slider {...settings}>
        {value.value === 0 ?
          sortedDailyList.map((movie) => {
            return (
              <div className="px-1 align-top" key={movie.id}>
                <MovieItem
                  movie={movie}
                />
              </div>
            )
          }) :
          arrayData?.comingMovieList?.data?.map((movie) => {
            return (
              <div className="px-1 align-top" key={movie.id}>
                <MovieItem
                  movie={movie}
                  comingMovie
                />
              </div>
            )
          })
        }
      </Slider>
    </div>
  );
}