import React, { useEffect } from "react";
import Slider from "react-slick";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventsList } from "../../../reducers/actions/EventsManagement";
import useStyles from "./style";

export default function SimpleTabs() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {
    eventList,
    errorDelete,
    successDelete,
    successUpdateEvent,
    successAddEvent,
  } = useSelector((state) => state.eventsManagementReducer);

  useEffect(() => {
    if (
      !eventList ||
      successUpdateEvent ||
      successDelete ||
      errorDelete ||
      successAddEvent
    ) {
      dispatch(getEventsList());
    }
  }, []);

  const rawEvents = eventList?.data?.content || eventList?.data || [];
  const newsItems = rawEvents.filter(
    (event) =>
      event?.status === "CREATE" &&
      event?.status !== "DELETE" &&
      event?.type === "NEWS"
  );

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: newsItems.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    touchThreshold: 10,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    cssEase: "ease-out",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: newsItems.length > 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: newsItems.length > 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: newsItems.length > 1,
        },
      },
    ],
  };

  return (
    <div className={classes.root} id="tintuc">
      <div className="galaxy-section-container">
        {/* Section Heading: | TIN KHUYẾN MÃI */}
        <div className="galaxy-section-header-clean" style={{ marginBottom: "20px" }}>
          <span className="galaxy-title-bar"></span>
          <h2 className="galaxy-title-text">
            TIN KHUYẾN MÃI
          </h2>
        </div>

        {/* Slider Carousel */}
        {newsItems.length > 0 ? (
          <div className={classes.sliderWrapper}>
            <Slider {...sliderSettings}>
              {newsItems.map((event, index) => {
                const itemTitle = event.title || event.brief || "Tin tức khuyến mãi";
                return (
                  <div key={event.id || index} className={classes.slideItem}>
                    <NavLink
                      to={`/detail-news/${event.id}`}
                      className={classes.newsCard}
                    >
                      <div className={classes.imgWrapper}>
                        <img
                          className={classes.fullImg}
                          src={event.mainImage}
                          alt={itemTitle}
                          onError={(e) => {
                            e.target.src = "/img/hinh-1-14.jpg";
                          }}
                        />
                      </div>
                      <h4 className={classes.newsTitle}>
                        {itemTitle}
                      </h4>
                    </NavLink>
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 0", color: "#888" }}>
            <p>Đang cập nhật tin tức khuyến mãi mới...</p>
          </div>
        )}
      </div>
    </div>
  );
}