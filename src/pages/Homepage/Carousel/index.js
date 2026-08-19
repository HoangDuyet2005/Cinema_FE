import React, { useEffect } from "react";

import Slider from "react-slick";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

import homeCarouselData from "../../../constants/homeCarouselData";
import SearchStickets from "./SearchTickets";
import Choose from "./Choose";
import useStyles from "./styles";
import BtnPlay from "../../../components/BtnPlay";
import { LOADING_BACKTO_HOME_COMPLETED } from "../../../reducers/constants/Lazy";
import "./carousel.css";
import Booking from "./Booking";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
// import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ChooseByBranch from "./ChooseByBranch";
import ChooseByDate from "./ChooseByDate";
import ChatBox from "./ChatBox";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

export default function Carousel() {
  const movieList = useSelector((state) => state.movieReducer.movieList);
  // console.log("Lấy banner phim nè: ",movieList);

  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const history = useHistory();
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    // autoplaySpeed: 5000, //speed per sence
    // autoplay: false,
    speed: 1000,
    // swipeToSlide: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // dotsClass: "slickdotsbanner",
  };

  useEffect(() => {
    dispatch({ type: LOADING_BACKTO_HOME_COMPLETED });
  }, []);

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <ArrowForwardIosRoundedIcon
        style={{ right: "15px" }}
        onClick={onClick}
        className={classes.Arrow}
      />
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <ArrowBackIosRoundedIcon
        style={{ left: "15px" }}
        onClick={onClick}
        className={classes.Arrow}
      />
    );
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  return (
    <div id="carousel" className={classes.carousel}>
      <Slider {...settings}>
        {movieList?.data?.map((banner) => {
          return (
            <div key={banner.id} className={classes.itemSlider}>
              <img src={banner?.largeImageURL} alt="banner" className={classes.img} />
              <div
                className={classes.backgroundLinear}
                onClick={() => history.push(`/phim/${banner.id}`)}
              />
              {isDesktop && (
                <BtnPlay cssRoot={"play"} urlYoutube={banner.trailerURL} />
              )}
            </div>
          );
        })}
      </Slider>
      <div style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: "1000" }}><ChatBox /></div>
      <Box
        sx={{
          // bgcolor: "background.paper",
          width: "71%",
          height: "100%",
          position: "relative",
          // left:"13%",
          textAlign: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, 0%)"
        }}
      >
        <AppBar position="relative" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            classes={{ indicator: classes.indicator }}
            textColor="primariry"
            variant="fullWidth"
            aria-label="action tabs example"
          >
            <Tab label="Đặt vé theo phim" {...a11yProps(0)} />
            <Tab label="Đặt vé theo rạp" {...a11yProps(1)} />
            
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} >
            <Choose />
          </TabPanel>
          <TabPanel value={value} index={1} >
            <ChooseByBranch />
          </TabPanel>
          
        </SwipeableViews>
      </Box>

      {/* <Choose/> */}
    </div>
  );
}
