import React, { useState, useEffect } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

import data from "./data.json";
import CommentSection from "./CommentSection";

import "./style.css";
import { getInfoUser } from "../../reducers/actions/UsersManagement";
import { useDispatch, useSelector } from "react-redux";
import { getListCommentBaiViet } from "../../reducers/actions/Interaction";

const Comment = (props) => {
  const { successInfoUser, loadingInfoUser } = useSelector(
    (state) => state.usersManagementReducer
  );
  const { commentList } = useSelector((state) => state.interactionReducer);

  const dispatch = useDispatch();
  const [comment, setComment] = useState(commentList);
  const userId = successInfoUser?.data?.id;
  const avatarUrl = successInfoUser?.data?.image;
  const name = successInfoUser?.data?.name;
  const signinUrl = "/dangnhap";
  const signupUrl = "/dangky";

  console.log(props);

  let count = 0;
  commentList?.content?.map((i) => {
    count += 1;
    i.replies && i.replies.map((i) => (count += 1));
  });

  useEffect(() => {
    dispatch(getInfoUser)
    dispatch(getListCommentBaiViet(props?.idReviewPost));
  }, []);

  useEffect(() => {}, []);

  // const customInputFunc = (props) => {
  //   return (
  //     <CustomInputt
  //       parentId={props.parentId}
  //       cancellor={props.cancellor}
  //       value={props.value}
  //       edit={props.edit}
  //       submit={props.submit}
  //       handleCancel={props.handleCancel}
  //       onChange={(e) => {
  //         console.log("onChange");
  //       }}
  //     />
  //   );
  // };

  return (
      <SlidingPane
        // hideHeader={true}
        closeIcon={<div>X</div>}
        className="some-custom-class"
        overlayClassName="some-custom-overlay-class"
        isOpen={props.isPaneOpen}
        // title="Hey, it is optional pane title.  I can be React component too."
        // subtitle="Optional subtitle."
        width={"450px"}
        marginTop={"10rem"}
        onRequestClose={() => {
          // triggered on "<" on left top click or on outside click
          props.onClose(false);
        }}
      >
        <CommentSection
          currentUser={
            userId && { userId: userId, avatarUrl: avatarUrl, name: name }
          }
          commentsArray={commentList?.content}
          setComment={setComment}
          signinUrl={signinUrl}
          signupUrl={signupUrl}
          articleId={props?.idReviewPost}
          // customInput={customInputFunc}
        />
      </SlidingPane>
    
  );
};

export default Comment;
