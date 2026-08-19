import React from 'react'
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import Slider from "react-slick";

import Theaters from './../../Theaters';
import useStyles from './style';
import Choose from '../../Choose';
import LichChieuDesktop from '../../LichChieuDesktop';
import LichChieuDesktopTheoNgay from '../../LichChieuDesktop';

export function NextArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowForwardIosRoundedIcon style={{ right: "-82px" }} onClick={onClick} className={classes.Arrow} />
  );
}

export function PrevArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowBackIosRoundedIcon style={{ left: "-82px" }} onClick={onClick} className={classes.Arrow} />
  );
}

export default function Desktop({ arrayData, value }) {
  const classes = useStyles();
  const settings = {
    className: "center",
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 4,
  };
  // console.log("Arr Datta:", arrayData);
  return (
    <div className={classes.container}>
      <Slider {...settings}>
        {value.value === 0 ? <Theaters /> : <LichChieuDesktop />
        }
      </Slider>
    </div >
  );
}

