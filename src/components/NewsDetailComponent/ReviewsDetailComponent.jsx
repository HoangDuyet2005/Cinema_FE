import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ShareIcon from "@material-ui/icons/Share";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import VisibilityIcon from "@material-ui/icons/Visibility";
import StarIcon from "@material-ui/icons/Star";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import { useSelector, useDispatch } from "react-redux";
import { getMovieList } from "../../reducers/actions/Movie";
import eventsApi from "../../api/eventsApi";
import interactionApi from "../../api/interactionApi";
import Choose from "../../pages/Homepage/Carousel/Choose";
import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/vi";
import "./ReviewsDetailComponent.scss";

moment.locale("vi");

export default function ReviewsDetailComponent(props) {
  const { tinTuc, isPromotion } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  // Get current logged in user
  const auth = useSelector((state) => state.authReducer);
  const usersMgmt = useSelector((state) => state.usersManagementReducer);

  const currentUser =
    auth?.currentUser ||
    usersMgmt?.successInfoUser?.data ||
    (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null) ||
    (localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null);

  const userId = currentUser?.id || currentUser?.data?.id;

  const { movieList } = useSelector((state) => state.movieReducer);

  const articleData = tinTuc?.data || tinTuc || {};
  const articleId = articleData?.id;

  // Is this a news/promotion article or a review article?
  const isNewsArticle =
    isPromotion || articleData?.type === "NEWS" || articleData?.type === 1;

  const [danhSachTinTucKhac, setDanhSachTinTucKhac] = useState([]);
  const [likesCount, setLikesCount] = useState(
    articleData?.likes || articleData?.totalLike || 0
  );
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Comment states
  const [commentsList, setCommentsList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [submittingCmt, setSubmittingCmt] = useState(false);

  useEffect(() => {
    if (!movieList || !movieList.length) {
      dispatch(getMovieList());
    }

    // Fetch related articles according to category (NEWS or REVIEWS)
    eventsApi
      .getListEvent()
      .then((res) => {
        const rawData =
          res?.data?.data?.content ||
          res?.data?.content ||
          res?.data?.data ||
          res?.data ||
          [];
        const list = Array.isArray(rawData)
          ? rawData.filter((item) => {
              if (item?.status !== "APPROVE") return false;
              if (isNewsArticle) {
                return item?.type === "NEWS" || item?.type === 1;
              } else {
                return item?.type === "REVIEWS" || item?.type === 0;
              }
            })
          : [];
        setDanhSachTinTucKhac(list);
      })
      .catch((err) => console.log(err));

    if (articleId) {
      // Fetch Likes
      interactionApi
        .getAllLikeBaiViet(articleId)
        .then((res) => {
          const likesArr = res?.data?.data || res?.data || [];
          if (Array.isArray(likesArr)) {
            setLikesCount(likesArr.length);
          }
        })
        .catch((err) => console.log(err));

      // Check if user liked
      if (userId) {
        interactionApi
          .checkUserLikeOrUnlike(userId, articleId)
          .then((res) => {
            if (
              res?.data?.success === true ||
              res?.data?.data === true ||
              res?.data === true
            ) {
              setIsLiked(true);
            } else {
              setIsLiked(false);
            }
          })
          .catch((err) => console.log(err));

        eventsApi
          .checkSaveArticle({ userId: userId, articleId: articleId })
          .then((res) => {
            if (
              res?.data?.success === true ||
              res?.data?.data === true ||
              res?.data === true
            ) {
              setIsSaved(true);
            } else {
              setIsSaved(false);
            }
          })
          .catch((err) => console.log(err));
      }

      // Fetch Comments
      fetchComments();
    }
  }, [articleId, userId, isNewsArticle]);

  const fetchComments = () => {
    if (!articleId) return;
    interactionApi
      .getAllCommentBaiViet(articleId)
      .then((res) => {
        const cmts =
          res?.data?.data?.content ||
          res?.data?.content ||
          res?.data?.data ||
          res?.data ||
          [];
        setCommentsList(Array.isArray(cmts) ? cmts : []);
      })
      .catch((err) => console.log(err));
  };

  // Toggle Like (Thumbs-Up, NO hearts)
  const handleLikeToggle = () => {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để thích bài viết!",
        confirmButtonText: "Đăng nhập ngay",
      }).then((res) => {
        if (res.isConfirmed) history.push("/dangnhap");
      });
      return;
    }

    const nextLikedState = !isLiked;
    setIsLiked(nextLikedState);
    setLikesCount((prev) => (nextLikedState ? prev + 1 : Math.max(0, prev - 1)));

    interactionApi
      .postLikeVaHuyThichBaiViet({
        articleId: articleId,
        userId: userId,
        isLike: nextLikedState ? 1 : 0,
      })
      .catch((err) => console.log(err));
  };

  // Toggle Save Article
  const handleSaveToggle = () => {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để lưu bài viết!",
        confirmButtonText: "Đăng nhập ngay",
      }).then((res) => {
        if (res.isConfirmed) history.push("/dangnhap");
      });
      return;
    }

    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    eventsApi
      .addSaveArticle({ userId: userId, articleId: articleId })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: nextSavedState
            ? "Đã lưu bài viết!"
            : "Đã gỡ bài viết khỏi danh sách lưu!",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((err) => console.log(err));
  };

  // Share Article
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: articleData?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: "success",
        title: "Đã sao chép liên kết!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Submit Comment
  const handlePostCommentSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để bình luận!",
        confirmButtonText: "Đăng nhập ngay",
      }).then((res) => {
        if (res.isConfirmed) history.push("/dangnhap");
      });
      return;
    }

    if (!commentText.trim()) return;

    setSubmittingCmt(true);

    interactionApi
      .postThemComment({
        articleId: articleId,
        userId: userId,
        description: commentText.trim(),
      })
      .then(() => {
        setSubmittingCmt(false);
        setCommentText("");
        fetchComments();
        Swal.fire({
          icon: "success",
          title: "Đã gửi bình luận!",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        setSubmittingCmt(false);
        console.log(err);
      });
  };

  // Delete Comment
  const handleDeleteComment = (cmtId) => {
    Swal.fire({
      title: "Xác nhận xóa bình luận?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((res) => {
      if (res.isConfirmed) {
        interactionApi
          .putDeleteComment(cmtId)
          .then(() => {
            fetchComments();
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const movieDataList = Array.isArray(movieList?.data)
    ? movieList.data
    : Array.isArray(movieList)
    ? movieList
    : [];

  const nowShowingMovies = movieDataList.slice(0, 3);

  const safeOtherArticles = Array.isArray(danhSachTinTucKhac)
    ? danhSachTinTucKhac.filter((item) => item?.id !== articleId).slice(0, 4)
    : [];

  const formatTitle = (title, brief) => {
    const text = title || brief || "Bài viết tin tức";
    if (isNewsArticle) {
      if (text.startsWith("[Khuyến Mãi]") || text.startsWith("[Tin Tức]"))
        return text;
      return `[Khuyến Mãi] ${text}`;
    } else {
      if (text.startsWith("[Review]")) return text;
      return `[Review] ${text}`;
    }
  };

  const categoryName = isNewsArticle ? "Tin tức khuyến mãi" : "Bình luận phim";
  const categoryPath = isNewsArticle ? "/news" : "/review";
  const otherSectionTitle = isNewsArticle
    ? "TIN TỨC KHUYẾN MÃI KHÁC"
    : "BÌNH LUẬN PHIM KHÁC";

  return (
    <div className="review-detail-page-wrapper">
      <div className="galaxy-section-container">
        {/* Breadcrumb */}
        <div className="review-breadcrumb">
          <NavLink to="/" className="breadcrumb-link">
            Trang chủ
          </NavLink>
          <span className="breadcrumb-separator">/</span>
          <NavLink to={categoryPath} className="breadcrumb-link">
            {categoryName}
          </NavLink>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">
            {formatTitle(articleData.title, articleData.brief)}
          </span>
        </div>

        {/* Main Content Layout */}
        <div className="row review-detail-layout" style={{ margin: 0 }}>
          {/* Left Column: Article Content */}
          <div
            className="col-12 col-lg-8 review-main-col"
            style={{ padding: "0 20px 0 0" }}
          >
            <h1 className="article-main-title">
              {formatTitle(articleData.title, articleData.brief)}
            </h1>

            {/* Social / Badges Row - Thumbs-Up Like, No Hearts */}
            <div className="article-social-bar">
              <button
                type="button"
                className={`btn-facebook-like ${isLiked ? "active" : ""}`}
                onClick={handleLikeToggle}
              >
                <ThumbUpIcon className="btn-icon" />
                <span>Thích {likesCount}</span>
              </button>

              <button
                type="button"
                className="btn-facebook-share"
                onClick={handleShare}
              >
                <ShareIcon className="btn-icon" />
                <span>Chia sẻ</span>
              </button>

              <button
                type="button"
                className={`btn-save-article ${isSaved ? "saved" : ""}`}
                onClick={handleSaveToggle}
              >
                {isSaved ? (
                  <BookmarkIcon className="btn-icon" />
                ) : (
                  <BookmarkBorderIcon className="btn-icon" />
                )}
                <span>{isSaved ? "Đã lưu" : "Lưu bài viết"}</span>
              </button>

              <span className="badge-view-count">
                <VisibilityIcon className="btn-icon" />
                <span>{articleData.view || 0} lượt xem</span>
              </span>
            </div>

            {/* Brief Lead Paragraph */}
            {articleData.brief && (
              <div className="article-lead-text">
                <p>{articleData.brief}</p>
              </div>
            )}

            {/* Main Banner Image if available */}
            {articleData.mainImage && (
              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <img
                  src={articleData.mainImage}
                  alt={articleData.title}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                  }}
                />
              </div>
            )}

            {/* Rich HTML Body Content */}
            <div
              className="article-rich-body"
              dangerouslySetInnerHTML={{
                __html:
                  articleData.description ||
                  "<p>Nội dung đang được cập nhật...</p>",
              }}
            />

            {/* Comments Section */}
            <div className="article-comments-section">
              <div className="galaxy-section-header">
                <span className="galaxy-title-bar"></span>
                <h3 className="galaxy-title-text">
                  BÌNH LUẬN BÀI VIẾT ({commentsList.length})
                </h3>
              </div>

              {/* Add Comment Box */}
              <form
                onSubmit={handlePostCommentSubmit}
                className="add-comment-box"
              >
                <textarea
                  className="comment-textarea"
                  rows={3}
                  placeholder="Nói lên suy nghĩ của bạn về bài viết này..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="comment-submit-row">
                  <button
                    type="submit"
                    className="btn-submit-comment"
                    disabled={submittingCmt || !commentText.trim()}
                  >
                    <SendIcon style={{ fontSize: 16, marginRight: 6 }} />
                    <span>
                      {submittingCmt ? "Đang gửi..." : "Gửi bình luận"}
                    </span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="comments-list-box">
                {commentsList.length > 0 ? (
                  commentsList.map((cmt, idx) => (
                    <div key={cmt.id || idx} className="comment-item-card">
                      <div className="comment-user-avatar">
                        <img
                          src={
                            cmt.userImage ||
                            cmt.image ||
                            "https://i.ibb.co/3S3S87N/user-fake.jpg"
                          }
                          alt={cmt.userName || cmt.name}
                        />
                      </div>
                      <div className="comment-content-box">
                        <div className="comment-header-row">
                          <span className="user-name">
                            {cmt.userName || cmt.name || "Khách hàng"}
                          </span>
                          <span className="comment-time">
                            {cmt.createdAt
                              ? moment(cmt.createdAt).fromNow()
                              : "Vừa xong"}
                          </span>
                        </div>
                        <p className="comment-text">
                          {cmt.description || cmt.content}
                        </p>
                      </div>

                      {/* Delete button if comment belongs to current user */}
                      {userId === cmt.userId && (
                        <button
                          type="button"
                          className="btn-delete-comment"
                          onClick={() => handleDeleteComment(cmt.id)}
                          title="Xóa bình luận"
                        >
                          <DeleteIcon style={{ fontSize: 18 }} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-comments-text">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Section: | BÌNH LUẬN PHIM KHÁC or | TIN TỨC KHUYẾN MÃI KHÁC */}
            <div className="related-reviews-section">
              <div className="galaxy-section-header">
                <span className="galaxy-title-bar"></span>
                <h3 className="galaxy-title-text">{otherSectionTitle}</h3>
              </div>

              <div className="row other-reviews-grid" style={{ margin: 0 }}>
                {safeOtherArticles.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="col-6 col-md-3 other-review-card-wrapper"
                    style={{ padding: "0 8px", marginBottom: "16px" }}
                  >
                    <NavLink
                      to={
                        isNewsArticle
                          ? `/detail-news/${
                              item.slug
                                ? encodeURIComponent(item.slug)
                                : item.id
                            }`
                          : `/review/${
                              item.slug
                                ? encodeURIComponent(item.slug)
                                : item.id
                            }`
                      }
                      className="other-review-card"
                    >
                      <div className="other-review-img-box">
                        <img
                          src={
                            item.mainImage ||
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"
                          }
                          alt={item.title}
                          className="other-review-img"
                        />
                      </div>
                      <h5 className="other-review-title">
                        {formatTitle(item.title, item.brief)}
                      </h5>
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div
            className="col-12 col-lg-4 review-sidebar-col"
            style={{ padding: "0 0 0 10px" }}
          >
            {/* Widget 1: Mua Vé Nhanh (Fully Interactive Choose Component) */}
            <div className="sidebar-quick-book-widget">
              <div className="quick-book-header">
                <h3>Mua Vé Nhanh</h3>
              </div>
              <div className="quick-book-body-wrapper">
                <Choose />
              </div>
            </div>

            {/* Widget 2: | PHIM ĐANG CHIẾU */}
            <div className="sidebar-now-showing-widget">
              <div className="galaxy-section-header">
                <span className="galaxy-title-bar"></span>
                <h3 className="galaxy-title-text">PHIM ĐANG CHIẾU</h3>
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
                          movie.hinhAnh ||
                          movie.largeImageURL ||
                          movie.poster ||
                          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"
                        }
                        alt={movie.tenPhim}
                        className="sidebar-movie-poster"
                      />
                      {/* Rating Badge */}
                      <div className="sidebar-badge-rating">
                        <StarIcon className="star-icon" />
                        <span>{movie.danhGia || 9.5}</span>
                      </div>
                      {/* Age Rating Badge */}
                      <div className="sidebar-badge-age">T13</div>
                    </div>
                    <h5 className="sidebar-movie-name">
                      {movie.tenPhim || movie.title || movie.name}
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
