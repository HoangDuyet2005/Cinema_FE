import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { ReactComponent as Hand } from "./hand.svg";

import "./styles.scss";
import { getListLikeBaiViet, postLikeUnlikeBaiViet } from "../../../reducers/actions/Interaction";

const particleList = Array.from(Array(10));

export default function LikeButton({userId, articleId}){
  // console.log("id user: ", userId);
  const [liked, setLiked] = useState(null);
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();

  const {likeList} = useSelector((state) => state.interactionReducer)

  useEffect(() => {
    dispatch(getListLikeBaiViet(articleId))
  },[])

  const [soLike, setSoLike]=useState(likeList?.length);

  // console.log("danh sách nè chời ơi ", likeList);

  const handleLikeButtonClick = async () => {
    setLiked(!liked);
    setClicked(true);
    await dispatch(postLikeUnlikeBaiViet({userId, articleId}));
    await dispatch(getListLikeBaiViet(articleId));
  };

  return (
    <button
      // onClick={() => {
      //   setLiked(!liked);
      //   setClicked(true);
      //   dispatch(postLikeUnlikeBaiViet({userId, articleId}))
      //   dispatch(getListLikeBaiViet(articleId))
      //   setSoLike(likeList.length)
      //   console.log("set nè");
      // }}

      onClick={handleLikeButtonClick}

      onAnimationEnd={() => setClicked(false)}
      className={cn("like-button-wrapper", {
        liked,
        clicked,
      })}
    >
      {liked && (
        <div className="particles">
          {particleList.map((_, index) => (
            <div
              className="particle-rotate"
              style={{
                transform: `rotate(${
                  (360 / particleList.length) * index + 1
                }deg)`,
              }}
            >
              <div className="particle-tick" />
            </div>
          ))}
        </div>
      )}
      <div className="like-button">
        <span className="like-button__count">
          {soLike ? soLike : likeList?.length}{" "}
        </span>
        <Hand />
        <span>Like</span>
        <span className={cn("suffix", { liked })}>d</span>
      </div>
    </button>
  );
};
