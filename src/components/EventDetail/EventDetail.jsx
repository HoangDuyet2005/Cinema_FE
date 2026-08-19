import React from "react";
import { NavLink } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ShareIcon from "@material-ui/icons/Share";
import "./EventDetail.scss";
export default function EventDetail(props) {
  let { tinTuc, danhSachTinTuc } = props;
  var moment = require("moment");
  const renderTinTucHot = () => {
    return danhSachTinTuc.slice(0, 5).map((tinTuc, index) => {
      return (
        <div className="news__items" key={index}>
          <div className="items__img">
            <img src={tinTuc.image2} alt={tinTuc.image2} />
          </div>
          <div className="items__text">
            <h5 className="items__text-title">
              <NavLink
                className="items__text-link"
                to={`/review/${tinTuc.id}`}
              >
                {tinTuc.title}
              </NavLink>
            </h5>
          </div>
        </div>
      );
    });
  };

  const renderHinhAnh = () => {
    if (tinTuc.image3 === "none") {
      return null;
    } else {
      return (
        <div className="news__form--img">
          <img src={tinTuc.image3} alt={tinTuc.image3} />
        </div>
      );
    }
  };
  const renderTinTuc = () => {
    return (
      <div className="news__form">
        <h1 className="news__form--title mb-2">{tinTuc.title}</h1>
        <div className="below__title">
          <div className="title--info">
            <div className="info--author">
              {tinTuc.author}
              <span className="info--days">
                {moment(tinTuc.dayupload).format("hh:mm DD/MM/yyyy")}
              </span>
            </div>
          </div>
          <div className="title--social">
            <div className="social--item mr-2">
              <ThumbUpAltIcon style={{ marginRight: "5px" }} />
              <span>{tinTuc.likes}</span>
            </div>
            <div className="social--item">
              <ShareIcon style={{ marginRight: "5px" }} />
              <span>{tinTuc.shares}</span>
            </div>
          </div>
        </div>
        <div className="news__form--description">{tinTuc.description1}</div>
        <div className="news__form--img">
          <img src={tinTuc.image1} alt={tinTuc.image1} />
        </div>
        <div className="news__form--description">{tinTuc.description2}</div>
        <div className="news__form--img">
          <img src={tinTuc.image2} alt={tinTuc.image2} />
        </div>
        <div className="news__form--description">{tinTuc.description3}</div>
        {renderHinhAnh()}

        <div className="news__form--source">Nguồn: game8.vn</div>
        <div className="news__form--footer">
          <div className="news__form--button row">
            <div className="button--content col-4">
              <button className="button--item fb">
                <i className="fab fa-facebook-f mr-2"></i>Chia sẻ
              </button>
            </div>
            <div className="button--content col-4">
              <button className="button--item tw">
                <i className="fab fa-twitter mr-2"></i>TWEET
              </button>
            </div>
            <div className="button--content col-4">
              <button className="button--item email">
                <i className="fa fa-envelope mr-2"></i>EMAIL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="news__container container">
      <div className="news__content row">
        <div className="news__left col-md-9 col-sm-12">{renderTinTuc()}</div>
        <div className="news__right col-md-3 col-sm-12">
          <h3 className="news__title">Tin liên quan</h3>
          {renderTinTucHot()}
        </div>
      </div>
    </div>
  );
}
