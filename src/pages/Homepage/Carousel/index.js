import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { useHistory } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

import homeCarouselData from "../../../constants/homeCarouselData";
import Choose from "./Choose";
import ChooseByBranch from "./ChooseByBranch";
import useStyles from "./styles";
import BtnPlay from "../../../components/BtnPlay";
import { LOADING_BACKTO_HOME_COMPLETED } from "../../../reducers/constants/Lazy";
import "./carousel.css";

export default function Carousel() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const history = useHistory();
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    centerMode: true,
    centerPadding: "15%",
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerMode: true,
          centerPadding: "12%",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerMode: true,
          centerPadding: "8%",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerMode: false,
          centerPadding: "0px",
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    dispatch({ type: LOADING_BACKTO_HOME_COMPLETED });
  }, [dispatch]);

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div className={`${classes.arrowContainer} ${classes.arrowNext}`} onClick={onClick}>
        <ArrowForwardIosRoundedIcon className={classes.arrowIcon} />
      </div>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <div className={`${classes.arrowContainer} ${classes.arrowPrev}`} onClick={onClick}>
        <ArrowBackIosRoundedIcon className={classes.arrowIcon} />
      </div>
    );
  }

  return (
    <div id="carousel" className={classes.carousel}>
      <Slider {...settings}>
        {homeCarouselData.map((banner) => {
          const bannerId = banner.id || banner.maPhim;
          const bannerImg = banner.largeImageURL || banner.hinhAnh;
          const bannerTrailer = banner.trailerURL || banner.trailer;
          const bannerName = banner.name || banner.tenPhim;

          return (
            <div key={bannerId} className={classes.slideWrapper}>
              <div className={classes.itemSlider}>
                <img src={bannerImg} alt={bannerName} className={classes.img} />
                <div
                  className={classes.backgroundLinear}
                  onClick={() => history.push(`/phim/${bannerId}`)}
                />
                {isDesktop && bannerTrailer && (
                  <BtnPlay cssRoot={"play"} urlYoutube={bannerTrailer} />
                )}
              </div>
            </div>
          );
        })}
      </Slider>

      {/* Khung Đặt Vé Nhanh với 2 Tab (Đặt vé theo phim / Đặt vé theo rạp) */}
      <div className={classes.bookingWrapper}>
        <div className={classes.tabsHeader}>
          <button
            type="button"
            className={`${classes.tabBtn} ${tabIndex === 0 ? classes.tabBtnActive : ""}`}
            onClick={() => setTabIndex(0)}
          >
            Đặt vé theo phim
          </button>
          <button
            type="button"
            className={`${classes.tabBtn} ${tabIndex === 1 ? classes.tabBtnActive : ""}`}
            onClick={() => setTabIndex(1)}
          >
            Đặt vé theo rạp
          </button>
        </div>

        <div className={classes.tabContent}>
          {tabIndex === 0 ? <Choose /> : <ChooseByBranch />}
        </div>
      </div>
    </div>
  );
}