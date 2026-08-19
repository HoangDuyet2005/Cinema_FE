import React, { useState, useRef, useEffect } from "react";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
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

const filterByDay = (movieList, tuNgay, denNgay) => {
  return movieList.filter((item) => {
    // ms tính từ ngày gốc(1970) tới ngày item
    const timeItem = new Date(item.ngayKhoiChieu).getTime();
    // ms tính từ ngày gốc tới ngày lựa chọn
    const timeTuNgay = new Date(tuNgay).getTime();
    const timeDenNgay = new Date(denNgay).getTime();
    if (timeTuNgay <= timeItem && timeItem <= timeDenNgay) {
      return true;
    }
    return false;
  });
};

export default function SimpleTabs() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = useState({ value: 0, fade: true, notDelay: 0 });
  const { errorMovieList, movieList, errorMovieSapChieuList, movieSapChieuList } = useSelector(
    (state) => state.movieReducer
  );

  // const { errorMovieSapChieuList, movieSapChieuList } = useSelector(
  //   (state) => state.movieReducer
  // );

  // console.log('Selector DS Phim: ', movieList)
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

  // useEffect(() => {
  //   dispatch(getMovieSapChieuList());
  // },[movieList])

  useEffect(() => {
    // tạm thời chia đôi list danh sách phim ra, một nửa làm phim đang chiếu, một nửa làm phim sắp chiếu
    const halfIndex = movieList && Math.floor(movieList.length / 2);
    // let dailyMovieList = movieList.slice(0, halfIndex);
    let dailyMovieList = movieList;
    // let comingMovieList = movieList.slice(halfIndex, movieList.length - 1);
    let comingMovieList = movieSapChieuList;
    setarrayData({ dailyMovieList, comingMovieList });
  }, [movieList, movieSapChieuList]);

  // console.log('====================================');
  // console.log(movieSapChieuList);
  // console.log('====================================');
  const handleChange = (e, newValue) => {
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
    <div id="lichchieu">
      <AppBar className={classes.appBar} position="static">
        <Tabs
          classes={{
            root: classes.tabBar,
            flexContainer: classes.flexContainer,
            indicator: classes.indicator,
          }}
          value={value.value}
          onChange={handleChange}
        >
          <Tab
            disableRipple
            className={`${classes.tabButton} ${classes.tabDangChieu}`}
            label="Đang chiếu"
          />
          <Tab
            disableRipple
            className={`${classes.tabButton} ${classes.tabSapChieu}`}
            label="Sắp chiếu"
          />
        </Tabs>
      </AppBar>
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
