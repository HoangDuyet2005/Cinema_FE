import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";

import Desktop from "./Desktop";
import useStyles from "./style";
import Mobile from "./Mobile";
import { getMovieSapChieuList } from "../../../reducers/actions/Movie";

export function SampleNextArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowForwardIosRoundedIcon
      style={{ right: "-82px" }}
      onClick={onClick}
      className={classes.Arrow}
    />
  );
}

export function SamplePrevArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowBackIosRoundedIcon
      style={{ left: "-82px" }}
      onClick={onClick}
      className={classes.Arrow}
    />
  );
}

export default function SimpleTabs() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = useState({ value: 0, fade: true, notDelay: 0 });
  const { errorMovieList, movieList, errorMovieSapChieuList, movieSapChieuList } = useSelector(
    (state) => state.movieReducer
  );

  const timeout = useRef(null);
  const dispatch = useDispatch();
  const [arrayData, setarrayData] = useState({
    dailyMovieList: null,
    comingMovieList: null,
  });
  const classes = useStyles({
    fade: value.fade,
    value: value.value,
    notDelay: value.notDelay,
  });
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    let dailyMovieList = movieList;
    let comingMovieList = movieSapChieuList;
    setarrayData({ dailyMovieList, comingMovieList });
  }, [movieList, movieSapChieuList]);

  const handleChange = (newValue) => {
    setValue((value) => ({ ...value, notDelay: newValue, fade: false }));
    timeout.current = setTimeout(() => {
      setValue((value) => ({ ...value, value: newValue, fade: true }));
    }, 100);
  };

  if (errorMovieList) {
    return <div>{errorMovieList}</div>;
  }

  if (errorMovieSapChieuList) {
    return <div>{errorMovieSapChieuList}</div>;
  }

  return (
    <div id="lichchieu" className={classes.rootShowtime}>
      <div className="galaxy-section-container">
        <div className="galaxy-section-header">
          <span className="galaxy-title-bar"></span>
          <h2 className="galaxy-title-text">PHIM</h2>
          <div className="galaxy-tabs">
            <button
              type="button"
              className={`galaxy-tab-btn ${value.value === 0 ? "active" : ""}`}
              onClick={() => handleChange(0)}
            >
              Đang chiếu
            </button>
            <button
              type="button"
              className={`galaxy-tab-btn ${value.value === 1 ? "active" : ""}`}
              onClick={() => handleChange(1)}
            >
              Sắp chiếu
            </button>
          </div>
        </div>
      </div>

      <div className={classes.listMovie}>
        {isDesktop ? (
          <Desktop arrayData={arrayData} value={value} />
        ) : (
          <Mobile arrayData={arrayData} value={value} />
        )}
      </div>
    </div>
  );
}
