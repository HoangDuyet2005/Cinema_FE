import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { qLyPhimService } from "../../services/QuanLyPhimServices";
import { getMovieList } from "../../reducers/actions/Movie";
import moviesApi from "../../api/moviesApi";
import QuickBooking from "../../components/NewsDetailComponent/QuickBooking";
import SpinnerLoading from "../../components/SpinnerLoading/SpinnerLoading";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import StarIcon from "@material-ui/icons/Star";
import "./styles.scss";

export default function ReviewAll() {
  const dispatch = useDispatch();
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);

  const { movieList } = useSelector((state) => state.movieReducer);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!movieList || movieList.length === 0) {
      dispatch(getMovieList());
    }

    moviesApi
      .getDanhSachPhim()
      .then((res) => {
        const list = res.data?.data?.content || res.data?.data || res.data || [];
        if (Array.isArray(list)) {
          const showingOnly = list.filter((m) => m?.isShowing === 1 || m?.dangChieu === true || m?.is_showing === 1);
          setNowShowingMovies((showingOnly.length > 0 ? showingOnly : list).slice(0, 3));
        }
      })
      .catch((err) => console.log(err));

    qLyPhimService
      .layReviewDuocDuyet()
      .then((res) => {
        const raw = res.data?.data?.content || res.data?.data || res.data || [];
        const approved = raw.filter(
          (item) => item?.type === "REVIEWS" && item?.status === "APPROVE"
        );
        setReviewsList(approved.length > 0 ? [...approved].reverse() : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, [dispatch]);

  const formatTitle = (title, brief) => {
    const text = title || brief || "Review phim hay";
    if (text.startsWith("[Review]")) return text;
    return `[Review] ${text}`;
  };

  const cleanDescription = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").substring(0, 220) + "...";
  };

  return (
    <div className="review-all-page-wrapper">
      <div className="galaxy-section-container">
        {/* Breadcrumb */}
        <div className="review-breadcrumb" style={{ marginBottom: "22px", fontSize: "14px", color: "#64748b" }}>
          <NavLink to="/" style={{ color: "#034ea2", textDecoration: "none", fontWeight: 500 }}>
            Trang chủ
          </NavLink>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#1e293b", fontWeight: 600 }}>Bình luận phim</span>
        </div>

        <div className="row review-all-layout" style={{ margin: 0 }}>
          {/* Left Column: Reviews List */}
          <div className="col-12 col-lg-8 review-all-main-col">
            {/* Section Header: | BÌNH LUẬN PHIM */}
            <div className="galaxy-section-header" style={{ marginBottom: "25px" }}>
              <span className="galaxy-title-bar"></span>
              <h2
                className="galaxy-title-text"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#4a4a4a",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                BÌNH LUẬN PHIM
              </h2>
            </div>

            {loading ? (
              <SpinnerLoading />
            ) : reviewsList.length > 0 ? (
              <div className="reviews-list-container">
                {reviewsList.map((review, idx) => {
                  const targetSlugOrId = review.slug
                    ? encodeURIComponent(review.slug)
                    : review.id;
                  const itemTitle = formatTitle(review.title, review.brief);
                  const itemBrief =
                    review.brief ||
                    cleanDescription(review.description) ||
                    "Đánh giá chi tiết và cảm nhận về bộ phim...";

                  return (
                    <NavLink
                      key={review.id || idx}
                      to={`/review/${targetSlugOrId}`}
                      className="review-horizontal-card"
                    >
                      <div className="card-img-wrapper">
                        <img
                          src={
                            review.mainImage ||
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"
                          }
                          alt={itemTitle}
                          className="card-img"
                        />
                      </div>

                      <div className="card-content">
                        <h3 className="card-title">{itemTitle}</h3>

                        <div className="card-badges">
                          <span className="badge-like-btn">
                            <ThumbUpIcon className="badge-icon" />
                            <span>Thích</span>
                          </span>
                          <span className="badge-view-count">
                            <VisibilityIcon className="badge-icon" />
                            <span>{review.view || review.soView || 285}</span>
                          </span>
                        </div>

                        <p className="card-brief">{itemBrief}</p>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
                <p>Đang cập nhật các bài bình luận phim mới...</p>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar (Exact same as Article Detail Page) */}
          <div className="col-12 col-lg-4 review-all-sidebar-col">
            {/* Widget 1: Mua Vé Nhanh */}
            <QuickBooking />

            {/* Widget 2: | PHIM ĐANG CHIẾU */}
            <div className="sidebar-now-showing-widget">
              <div className="galaxy-section-header">
                <span className="galaxy-title-bar"></span>
                <h3
                  className="galaxy-title-text"
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#4a4a4a",
                    textTransform: "uppercase",
                  }}
                >
                  PHIM ĐANG CHIẾU
                </h3>
              </div>

              <div className="sidebar-movies-list">
                {nowShowingMovies.map((movie, idx) => (
                  <NavLink
                    key={movie.id || idx}
                    to={`/phim/${movie.id}`}
                    className="sidebar-movie-item"
                  >
                    <div className="sidebar-movie-poster-box">
                      <img
                        src={
                          movie.smallImageURl ||
                          movie.smallImageURL ||
                          movie.small_imageurl ||
                          movie.hinhAnh ||
                          movie.poster ||
                          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"
                        }
                        alt={movie.tenPhim || movie.name}
                        className="sidebar-movie-poster"
                      />
                      {/* Rating Badge */}
                      <div className="sidebar-badge-rating">
                        <StarIcon className="star-icon" />
                        <span>
                          {movie.totalVotes > 0 && movie.avgRating != null
                            ? Number(movie.avgRating).toFixed(1)
                            : movie.danhGia != null && movie.danhGia > 0
                            ? Number(movie.danhGia).toFixed(1)
                            : "0"}
                        </span>
                      </div>
                      {/* Age Rating Badge */}
                      <div className="sidebar-badge-age">{movie.rated || "P"}</div>
                    </div>
                    <h5 className="sidebar-movie-name">
                      {movie.tenPhim || movie.name}
                    </h5>
                  </NavLink>
                ))}
              </div>

              {/* See more link */}
              <div className="sidebar-see-more-box">
                <NavLink to="/schedule" className="btn-xem-them-global">
                  Xem thêm
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}