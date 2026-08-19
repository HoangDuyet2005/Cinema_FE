import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { getListCommentBaiViet, postCommentBaiViet } from "../../reducers/actions/Interaction";

export const ActionContext = createContext();
export const ActionProvider = ({
  children,
  currentUser,
  setComment,
  comments,
  signinUrl,
  signupUrl,
  customInput,
  articleId
}) => {
  const [replies, setReplies] = useState([]);
  const [user, setUser] = useState();
  const [editArr, setEdit] = useState([]);
  const dispatch = useDispatch()

  // const {commentPost} = useSelector((state) => state.interactionReducer)
  // console.log(
  //   currentUser,
  //   articleId,
  //   comments);

  useEffect(() => {
    if (currentUser) {
      setUser(true);
    } else {
      setUser(false);
    }
  },[]);

  // useEffect(() => {
  //   dispatch(postCommentBaiViet({}))
  // },[])

  // useEffect(() => {
  //   console.log("children :", children);
  // }, [children]);

  // useEffect(() => {
  //   console.log("replies :", replies);
  // }, [replies]);

  // useEffect(() => {
  //   console.log("editArr :", editArr);
  // }, [editArr]);

  useEffect(() => {
    console.log("comments --------:", comments);
    // dispatch(getListCommentBaiViet(articleId))
  }, [comments]);

  const handleAction = (id, edit, userInfo) => {
    console.log("handleAction", id, edit, [...replies, id], editArr, userInfo);

    if (edit) {
      setEdit([...editArr, id]);
    } else {
      setReplies([...replies, { id, userInfo }]);
    }
  };

  const handleCancel = (id, edit, setText) => {
    if (edit) {
      const list = [...editArr];
      const newList = list.filter((i) => i !== id);
      setEdit(newList);
    } else if (!edit) {
      const list = [...replies];
      const newList = list.filter((i) => i.id !== id);
      setReplies(newList);
    }

    console.log(id, edit, setText, replies);
    setText("");
  };

  const onSubmit = (text, parentId, child) => {
    if (text.length > 0) {
      // if (!parentId && !child) {
      dispatch(postCommentBaiViet({description: text, articleId: articleId, userId: currentUser?.data?.userId}))
      console.log("Thêm cmt mới:", text);
        setComment([
          ...comments,
          {
            userId: currentUser.userId,
            comId: uuid(),
            avatarUrl: currentUser.avatarUrl,
            fullName: currentUser.name,
            text: text
          }
        ]);
      // } else if (parentId && child) {
      //   const newList = [...comments];
      //   const index = newList.findIndex((x) => x.comId === parentId);
      //   newList[index].replies.push({
      //     userId: currentUser.userId,
      //     comId: uuid(),
      //     avatarUrl: currentUser.avatarUrl,
      //     fullName: currentUser.name,
      //     text: text
      //   });
      //   setComment(newList);
      // } else if (parentId && !child) {
      //   const newList = [...comments];
      //   const index = newList.findIndex((x) => x.comId === parentId);
      //   const newReplies =
      //     newList[index].replies === undefined
      //       ? []
      //       : [...newList[index].replies];
      //   newReplies.push({
      //     userId: currentUser.userId,
      //     comId: uuid(),
      //     avatarUrl: currentUser.avatarUrl,
      //     fullName: currentUser.name,
      //     text: text
      //   });
      //   newList[index].replies = newReplies;
      //   setComment(newList);
      // }
    }
  };

  const editText = (id, text, parentId) => {
    if (parentId === undefined) {
      const newList = [...comments];
      const index = newList.findIndex((x) => x.comId === id);
      newList[index].text = text;
      setComment(newList);
    } else if (parentId !== undefined) {
      const newList = [...comments];
      const index = newList.findIndex((x) => x.comId === parentId);
      const replyIndex = newList[index].replies.findIndex(
        (i) => i.comId === id
      );
      newList[index].replies[replyIndex].text = text;
      setComment(newList);
    }
  };

  const deleteText = (id, parentId) => {
    if (parentId === undefined) {
      const newList = [...comments];
      const filter = newList.filter((x) => x.comId !== id);
      setComment(filter);
    } else if (parentId !== undefined) {
      const newList = [...comments];
      const index = newList.findIndex((x) => x.comId === parentId);
      const filter = newList[index].replies.filter((x) => x.comId !== id);
      newList[index].replies = filter;
      setComment(newList);
    }
  };

  //Hàm đăng cmt
  const submit = (cancellor, text, parentId, edit, setText, child) => {
    if (edit) {
      console.log("Vào edit");
      editText(cancellor, text, parentId);
      handleCancel(cancellor, edit, setText);
      setText("");
      console.log(cancellor, text, parentId);

    } else {
      // console.log("Vào thêm cmt");
      // onSubmit(text, parentId, child);
      onSubmit(text, parentId, child);
      // setComment([
      //   ...comments,
      //   {
      //     userId: currentUser?.userId,
      //     comId: uuid(),
      //     avatarUrl: currentUser?.avatarUrl,
      //     fullName: currentUser?.name,
      //     text: text
      //   }
      // ]);
      // console.log("list CMT mới: ", comments);
      // dispatch(getListCommentBaiViet(articleId))
      handleCancel(cancellor, edit, setText);// đóng cmt lại
      setText("");
      // console.log(text, parentId, child);

    }
  };

  const test = () => {
    console.log("A -test");
  };

  console.log("list mới :", comments);

  
  return (
    <ActionContext.Provider
      value={{
        onSubmit: onSubmit,
        userImg: currentUser && currentUser.avatarUrl,
        userId: currentUser && currentUser.userId,
        userName: currentUser && currentUser.name,
        handleAction: handleAction,
        handleCancel: handleCancel,
        replies: replies,
        setReplies: setReplies,
        editArr: editArr,
        onEdit: editText,
        onDelete: deleteText,
        signinUrl: signinUrl,
        signupUrl: signupUrl,
        user: user,
        customInput: customInput,
        submit: submit,

        test: test
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
