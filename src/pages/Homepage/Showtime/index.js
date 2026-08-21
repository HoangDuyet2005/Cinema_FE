import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Desktop from "./Desktop";
import useStyles from "./style";
import Mobile from "./Mobile";

export default function SimpleTabs() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = useState({ value: 0, fade: true, notDelay: 0 });
  const { errorMovieList, movieList, errorMovieSapChieuList, movieSapChieuList } = useSelector(
    (state) => state.movieReducer
  );

  const timeout = useRef(null);
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
    setValue((v) => ({ ...v, notDelay: newValue, fade: false }));
    timeout.current = setTimeout(() => {
      setValue((v) => ({ ...v, value: newValue, fade: true }));
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
      <div className={classes.headerContainer}>
        <div className="galaxy-section-header-clean">
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