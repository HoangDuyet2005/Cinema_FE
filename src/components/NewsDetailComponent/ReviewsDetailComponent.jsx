import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Button from '@mui/material/Button';
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ShareIcon from "@material-ui/icons/Share";
import "./ReviewsDetailComponent.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import eventsApi from "../../api/eventsApi";
import SpinnerLoading from "../SpinnerLoading/SpinnerLoading";
import InforReviewDetail from "../../pages/InforReviewDetail.js";

export default function ReviewsDetailComponent(props) {
  // console.log(props.tinTuc);
  let { tinTuc, danhSachTinTuc } = props;
  let [danhSachTinTucHot, setDanhSachTinTucHot] = useState([]);
  let [loading, setLoading] = useState(true);

  var moment = require("moment");
  useEffect(() => {
    eventsApi
      .getListEvent()
      .then((res) => {
        setDanhSachTinTucHot(res?.data);
        setLoading(false);
        // console.log("Lấy tin tức",res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log(danhSachTinTucHot);
  // const renderTinTucHot = () => {
  //   return danhSachTinTuc.slice(0, 5).map((tinTuc, index) => {
  //     return (
  //       <div className="news__items" key={index} 
  //       style={{
  //         backgroundColor:"white",
  //       }}>
  //         <div className="items__img">
  //           <img src={tinTuc.image2} alt={tinTuc.image2} />
  //         </div>
  //         <div className="items__text">
  //           <h5 className="items__text-title">
  //             <NavLink
  //               className="items__text-link"
  //               to={`/review/${tinTuc.id}`}
  //             >
  //               {tinTuc.title}
  //             </NavLink>
  //           </h5>
  //         </div>
  //       </div>
  //     );
  //   });
  // };

  // Chỉnh ở đây
  const renderTinTucHot = () => {
    return danhSachTinTucHot?.data?.reverse().map((tinTuc, index) => {
      if(tinTuc?.type === "REVIEWS" && tinTuc?.status === "APPROVE")
      // if(tinTuc?.status === "APPROVE")
      return (
        <div className="news__items" key={index}>
          <div className="items__img">
            <img src={tinTuc?.mainImage} alt={tinTuc?.mainImage} />
          </div>
          <div className="items__text">
            <h6 className="items__text-title">
              <NavLink
                className="items__text-link"
                to={`/review/${tinTuc.slug}`}
              >
                {tinTuc?.brief || (
                  <SkeletonTheme color="#202020" highlightColor="#111111">
                    <h2>
                      <Skeleton count={3} duration={2} />
                    </h2>
                  </SkeletonTheme>
                )}
              </NavLink>
            </h6>
          </div>
        </div>
      );
    });
  };

  // const renderHinhAnh = () => {
  //   if (tinTuc.image3 === "none") {
  //     return null;
  //   } else {
  //     return (
  //       <div className="news__form--img">
  //         <img src={tinTuc.image3} alt={tinTuc.image3} />
  //       </div>
  //     );
  //   }
  // };
  const renderTinTuc = () => {
    return (
      <div className="news__form">
        <h1 className="news__form--title mb-2">{tinTuc?.data?.title}</h1>
        <div className="below__title">
          <div className="title--info">
            <div className="info--author" style={{color:"red"}}>
            Tác giả:
            <NavLink
                to={`/reviewer/${tinTuc?.data?.createdBy}`}
              >
                {" "}{tinTuc?.data?.createdBy}
            </NavLink>
              <span className="info--days" style={{color:"blue"}}>
                Cập nhật lúc {" "}
                {moment(tinTuc.dayupload).format("hh:mm DD/MM/yyyy")}
              </span>
            </div>
          </div>
          <div className="title--social">
            <div className="social--item mr-2">
              {/* <ThumbUpAltIcon style={{ marginRight: "5px" }} />
              <span>{tinTuc?.likes}</span> */}
                <InforReviewDetail idReviewPost={tinTuc?.data?.id} soView={tinTuc?.data?.view}/>
            </div>
            {/* <div className="social--item">
              <ShareIcon style={{ marginRight: "5px" }} />
              <span>{tinTuc?.shares}</span>
            </div> */}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{__html:tinTuc?.data?.description}} />
        {/* <div className="news__form--description">{tinTuc.description1}</div>
        <div className="news__form--img">
          <img src={tinTuc.image1} alt={tinTuc.image1} />
        </div>
        <div className="news__form--description">{tinTuc.description2}</div>
        <div className="news__form--img">
          <img src={tinTuc.image2} alt={tinTuc.image2} />
        </div>
        <div className="news__form--description">{tinTuc.description3}</div>
        {renderHinhAnh()} */}

        <div className="news__form--source">Nguồn: Reviewer</div>
        <div className="news__form--footer">
          <div className="news__form--button row">
            {/* <div className="button--content col-4">
            </div> */}
            {/* <div className="button--content col-4">
              <button className="button--item tw">
                <i className="fab fa-twitter mr-2"></i>TWEET
              </button>
            </div>
            <div className="button--content col-4">
              <button className="button--item email">
                <i className="fa fa-envelope mr-2"></i>EMAIL
              </button>
            </div> */}
          </div>
        </div>

        <div style={{display:"block"}}>
          <h6 style={{marginTop:"1rem"}}>TAG: {" "}
            <Button color="secondary">{tinTuc?.data?.keyword}</Button>
          </h6>
        </div>
      </div>
    );
  };
  if (loading) {
    return <SpinnerLoading />;
  } else {
  return (
    <div className="news__container container">
      <div className="news__content row">
        <div className="news__left col-md-9 col-sm-12">
          {renderTinTuc()}
          <div>
              
          </div>

        </div>
        <div className="news__right col-md-3 col-sm-12" >
          <h3 className="news__title">Tin liên quan</h3>
          {renderTinTucHot()}
        </div>
      </div>
    </div>
  );
}
}
