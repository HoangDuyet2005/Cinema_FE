import React, { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import PropTypes from "prop-types";

import SwipeableViews from "react-swipeable-views";
// import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Theaters from './../Theaters';
import LichChieuDesktop from '../LichChieuDesktopTheoNgay';
import LichChieuDesktopTheoNgay from '../LichChieuDesktop';

import Desktop from "./Desktop";
import useStyles from "./style";
import Mobile from "./Mobile";
import {
  DATE_BEGIN_DANGCHIEU,
  DATE_END_DANGCHIEU,
  DATE_BEGIN_SAPCHIEU,
  DATE_END_SAPCHIEU,
} from "../../../constants/config";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1}}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`
  };
}

export default function SimpleTabs() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = useState({ value: 0, fade: true, notDelay: 0 });
  const [value1, setValue1] = useState(0);
  const { errorMovieList, movieList } = useSelector(
    (state) => state.movieReducer
  );

  // console.log('Selector DS Phim: ', movieList)
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

  const handleChangeBang = (event, newValue) => {
    setValue1(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  }

  useEffect(() => {
    // tạm thời chia đôi list danh sách phim ra, một nửa làm phim đang chiếu, một nửa làm phim sắp chiếu
    const halfIndex = movieList && Math.floor(movieList.length / 2);
    // let dailyMovieList = movieList.slice(0, halfIndex);
    let dailyMovieList = movieList;
    // let comingMovieList = movieList.slice(halfIndex, movieList.length - 1);
    let comingMovieList = movieList;
    setarrayData({ dailyMovieList, comingMovieList });
  }, [movieList]);

  const handleChange = (e, newValue) => {
    setValue((value) => ({ ...value, notDelay: newValue, fade: false }));
    timeout.current = setTimeout(() => {
      setValue((value) => ({ ...value, value: newValue, fade: true }));
    }, 100);
  };

  if (errorMovieList) {
    return <div>{errorMovieList}</div>;
  }

  return (
    <div style={{ paddingTop: "10px"}} id="lichchieu">
       <Box
        sx={{
          // bgcolor: "background.paper",
          // width: 1024,  
          height:"100%",
          position: "relative",
          // left:"14%",
          textAlign: "center"
        }}
      >
        <AppBar position="static" color="default">
          <Tabs
            value={value1}
            onChange={handleChangeBang}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab label="Đặt vé theo rạp" {...a11yProps(0)} />
            <Tab label="Đặt vé theo phim" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value1}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value1} index={0} >
            <Theaters />
          </TabPanel>
          <TabPanel value={value1} index={1} >
            <LichChieuDesktop /> 
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
