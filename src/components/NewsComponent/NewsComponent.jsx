import React, { useState, useEffect } from "react";
import "./NewsComponent.scss";
import { NavLink, useHistory } from "react-router-dom";
import { qLyPhimService } from "../../services/QuanLyPhimServices";
import SpinnerLoading from "../SpinnerLoading/SpinnerLoading";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import VisibilityIcon from "@material-ui/icons/Visibility";

export default function NewsComponent() {
  const [danhSachTinTuc, setDanhSachTinTuc] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    qLyPhimService
      .layReviewDuocDuyet()
      .then((res) => {
        setDanhSachTinTuc(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handlerSeeMore = () => {
    history.push("/review");
  };
  const rawList = danhSachTinTuc?.data?.content || danhSachTinTuc?.data || [];
  const approvedReviews = rawList.filter(
    (item) => item?.type === "REVIEWS" && item?.status === "APPROVE"
  );

  const items = approvedReviews.length > 0 ? [...approvedReviews].reverse() : [];
  const mainArticle = items[0];
  const sideArticles = items.slice(1, 4);

  const formatTitle = (title, brief) => {
    const text = title || brief || "Review phim hay";
    if (text.startsWith("[Review]")) return text;
    return `[Review] ${text}`;
  };

  return (
    <div className="featured-articles-wrapper" id="nhung-bai-viet-noi-bat">
      <div className="galaxy-section-container">
        {/* Section Header: | GÓC ĐIỆN ẢNH */}
        <div className="galaxy-section-header-clean">
          <span className="galaxy-title-bar"></span>
          <h2 className="galaxy-title-text">GÓC ĐIỆN ẢNH</h2>
        </div>

        {loading ? (
          <SpinnerLoading />
        ) : mainArticle ? (
          /* 2 Column Layout */
          <div className="row featured-articles-grid" style={{ margin: 0 }}>
            {/* Main Featured Article (Left) */}
            <div className="col-12 col-md-6 mb-4 mb-md-0" style={{ padding: "0 10px" }}>
              <NavLink
                to={`/review/${mainArticle.slug || mainArticle.id}`}
                className="featured-article-main"
              >
                <div className="main-img-container">
                  <img
                    src={mainArticle.mainImage}
                    alt={mainArticle.title}
                    className="main-img"
                  />
                </div>
                <h4 className="main-title">
                  {formatTitle(mainArticle.title, mainArticle.brief)}
                </h4>
                <div className="article-badges">
                  <span className="badge-like">
                    <ThumbUpIcon className="badge-icon like-icon" />
                    <span>Thích</span>
                  </span>
                  <span className="badge-view">
                    <VisibilityIcon className="badge-icon view-icon" />
                    <span>{mainArticle.view || mainArticle.soView || 0}</span>
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Side Articles (Right) */}
            <div className="col-12 col-md-6" style={{ padding: "0 10px" }}>
              <div className="side-articles-list">
                {sideArticles.map((article, index) => (
                  <NavLink
                    key={article.id || index}
                    to={`/review/${article.slug || article.id}`}
                    className="side-article-item"
                  >
                    <div className="side-img-container">
                      <img
                        src={article.mainImage}
                        alt={article.title}
                        className="side-img"
                      />
                    </div>
                    <div className="side-info">
                      <h5 className="side-title">
                        {formatTitle(article.title, article.brief)}
                      </h5>
                      <div className="article-badges">
                        <span className="badge-like">
                          <ThumbUpIcon className="badge-icon like-icon" />
                          <span>Thích</span>
                        </span>
                        <span className="badge-view">
                          <VisibilityIcon className="badge-icon view-icon" />
                          <span>{article.view || article.soView || 0}</span>
                        </span>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#888" }}>
            <p>Đang cập nhật bài viết mới...</p>
          </div>
        )}


        {/* See More Button */}
        <div className="featured-articles-footer" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <button
            className="btn-xem-them-global"
            type="button"
            onClick={handlerSeeMore}
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
}
