import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from '@mui/material/Button';
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ShareIcon from "@material-ui/icons/Share";
import "./TinTucDetailComponent.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import eventsApi from "../../api/eventsApi";
import SpinnerLoading from "../SpinnerLoading/SpinnerLoading";

export default function TinTucDetailComponent(props) {
  // console.log(props.tinTuc);
  let { tinTuc } = props;

  var moment = require("moment");

  const renderTinTuc = () => {
    return (
      <div className="news__form">
        <h3 className="news__form--title mb-2">{tinTuc?.brief}</h3>
        <h6 className="news__form--title mb-2">{tinTuc?.title}</h6>
        <div className="below__title">
          <div className="title--info">
            <div className="info--author" style={{color:"red"}}>
              {tinTuc?.type} - TIN TỨC VÀ SỰ KIỆN
            </div>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{__html:tinTuc?.description}} />
        <div style={{display:"block"}}>
          <h6 style={{marginTop:"1rem"}}>TAG: {" "}
            <Button color="secondary">{tinTuc?.keyword}</Button>
          </h6>
        </div>
      </div>
      
    );
  };
  if (!tinTuc) {
    return <SpinnerLoading />;
  } else {
  return (
    <div className="news__container container">
      <div className="news__content row">
        <div className="news__left col-md-12 col-sm-12">
          {renderTinTuc()}
        </div>
      </div>
    </div>
  );
}
}
