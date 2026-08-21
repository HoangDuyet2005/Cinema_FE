import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import EditIcon from "@material-ui/icons/Edit";
import moviesApi from "../../api/moviesApi";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import "./MovieRatingModal.scss";

export default function MovieRatingModal({
  open,
  onClose,
  movie,
  ratingData,
  onRatingUpdated,
  currentUser,
}) {
  const history = useHistory();
  const [hoverScore, setHoverScore] = useState(0);
  const [selectedScore, setSelectedScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ratingData?.userRating) {
      setSelectedScore(ratingData.userRating);
    } else {
      setSelectedScore(0);
    }
  }, [ratingData, open]);

  const displayScore =
    hoverScore > 0
      ? hoverScore
      : selectedScore > 0
      ? selectedScore
      : ratingData?.totalVotes > 0
      ? ratingData?.avgRating
      : 0.0;

  const currentUserId = currentUser?.id || currentUser?.data?.id;

  const handleStarClick = (score) => {
    setSelectedScore(score);
  };

  const handleStarMouseEnter = (score) => {
    setHoverScore(score);
  };

  const handleStarMouseLeave = () => {
    setHoverScore(0);
  };

  const handleSubmitRating = () => {
    if (!currentUserId) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng đăng nhập",
        text: "Bạn cần đăng nhập để đánh giá phim!",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
      }).then((res) => {
        if (res.isConfirmed) {
          history.push("/dangnhap");
        }
      });
      return;
    }

    if (selectedScore <= 0) {
      Swal.fire("Thông báo", "Vui lòng chọn số sao để đánh giá!", "info");
      return;
    }

    setSubmitting(true);
    moviesApi
      .postMovieRating({
        movieId: movie?.id,
        userId: currentUserId,
        score: selectedScore,
      })
      .then((res) => {
        setSubmitting(false);
        Swal.fire({
          icon: "success",
          title: "Đánh giá thành công!",
          text: `Bạn đã đánh giá ${selectedScore}/10 điểm cho phim ${movie?.name || movie?.tenPhim}!`,
          timer: 1800,
          showConfirmButton: false,
        });
        if (onRatingUpdated && res.data?.data) {
          onRatingUpdated(res.data.data);
        }
        onClose();
      })
      .catch((err) => {
        setSubmitting(false);
        console.error("Error submitting rating:", err);
        Swal.fire("Lỗi", "Không thể gửi đánh giá, vui lòng thử lại!", "error");
      });
  };

  const bannerImg =
    movie?.smallImageURl ||
    movie?.smallImageURL ||
    movie?.hinhAnh ||
    movie?.largeImageURL ||
    movie?.large_imageurl ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="movie-rating-dialog"
      maxWidth="xs"
      fullWidth
    >
      <div className="rating-modal-container">
        {/* Top Banner */}
        <div className="rating-banner-box">
          <img src={bannerImg} alt={movie?.name} className="rating-banner-img" />
          <button type="button" className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Movie Title */}
        <div className="rating-movie-title">
          {movie?.name || movie?.tenPhim}
        </div>

        {/* Rating Circle */}
        <div className="rating-circle-wrapper">
          <div className="circle-score-row">
            <StarIcon className="star-icon" />
            <span className="score-text">{Number(displayScore).toFixed(1)}</span>
          </div>
          <span className="votes-text">
            ({ratingData?.totalVotes || 0} đánh giá)
          </span>
        </div>

        {/* 10 Interactive Stars */}
        <div className="stars-interactive-row" onMouseLeave={handleStarMouseLeave}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starVal) => {
            const isFilled = (hoverScore || selectedScore) >= starVal;
            return (
              <button
                key={starVal}
                type="button"
                className="star-btn"
                onClick={() => handleStarClick(starVal)}
                onMouseEnter={() => handleStarMouseEnter(starVal)}
                title={`${starVal} sao`}
              >
                {isFilled ? (
                  <StarIcon className="star-svg-icon" />
                ) : (
                  <StarBorderIcon className="star-svg-icon" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="rating-modal-footer">
          <button type="button" className="btn-footer-close" onClick={onClose}>
            Đóng
          </button>
          <button
            type="button"
            className="btn-footer-submit"
            onClick={handleSubmitRating}
            disabled={submitting}
          >
            <EditIcon className="edit-icon" />
            <span>{submitting ? "Đang gửi..." : "Xác Nhận"}</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}