import React, { useContext } from "react";
import { ActionContext } from "./ActionContext";

// import styles from "../style.css";

const SignField = () => {
  const actions = useContext(ActionContext);

  const handleDivClick = (e) => {
    if (e.target.name === "dangnhap") {
      window.location.href = actions.signinUrl;
    } else if (e.target.name === "dangky") {
      window.location.href = actions.signupUrl;
    }
  };

  return (
    <div className={"signBox"}>
      <div className={"signLine"}>Vui lòng đăng nhập để bình luận</div>
      <div>
        <button
          className={"loginBtn"}
          name="dangnhap"
          onClick={(e) => handleDivClick(e)}
        >
          Đăng nhập
        </button>
        <button
          className={"signBtn"}
          name="dangky"
          onClick={(e) => handleDivClick(e)}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default SignField;
