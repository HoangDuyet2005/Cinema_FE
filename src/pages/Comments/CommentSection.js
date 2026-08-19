import React, { useEffect, useState } from "react";
import DisplayComments from "./DisplayComments";
import { ActionProvider } from "./ActionContext";
import SignField from "./SignField";
import Input from "./Input";

const CommentSection = ({
  commentsArray,
  currentUser,
  setComment,
  signinUrl,
  signupUrl,
  customInput,
  articleId,
  // test
}) => {
  const [comments, setComments] = useState(commentsArray);

  useEffect(() => {
    setComments(commentsArray);
    console.log(">>> commentsArray", commentsArray);
  }, [commentsArray]);

  return (
    <ActionProvider
      currentUser={currentUser}
      setComment={setComment}
      comments={comments}
      signinUrl={signinUrl}
      signupUrl={signupUrl}
      customInput={customInput}
      articleId={articleId}
    >
      {/* {console.log(">>> ActionProvider")} */}
      <div className={"section"}>
        <div className={"inputBox"}>
          {signupUrl && !currentUser ? <SignField /> : <Input />}
        </div>
        <div className={"displayComments"}>
          <DisplayComments comments={comments} />
        </div>
      </div>
    </ActionProvider>
  );
};

export default CommentSection;
