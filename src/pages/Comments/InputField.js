import React, { useContext, useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import { ActionContext } from "./ActionContext";
// import styles from "../style.css";

var _ = require("lodash");

/*
  main : คือถูกเรียกจาก main ด้านบนสุด ทีไม่ใช่ comment
*/
const InputField = ({ cancellor, parentId, child, value, edit, main }) => {
  const [text, setText] = useState(``);
  const [sanitizeConf, setSanitizeConf] = useState({
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
    allowedAttributes: { a: ["href"] }
  });

  const [html, setHtml] = useState(``);
  const [clickedOutside, setClickedOutside] = useState(true);
  const [italic, setItalic] = useState(false);
  const [bold, setBold] = useState(false);
  const inputRef = useRef();
  const bRef = useRef();
  const iRef = useRef();

  const [inputOpen, setInputOpen] = useState(false);

  const actions = useContext(ActionContext);

  // console.log("actions", actions);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  // useEffect(() => {
  //   console.log("value : ", value);
  // });

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleClickInside = () => setClickedOutside(false);
  const handleClickOutside = (e) => {
    if (
      _.isEmpty(inputRef.current) ||
      _.isEmpty(bRef.current) ||
      _.isEmpty(iRef.current)
    ) {
      return;
    }

    if (
      !inputRef.current.el.current.contains(e.target) &&
      !bRef.current.contains(e.target) &&
      !iRef.current.contains(e.target)
    ) {
      setClickedOutside(true);
    }
  };

  const sanitize = () => {
    setHtml(sanitizeHtml(html, sanitizeConf));
  };

  const CmdButton = (props) => {
    let { cmd, arg, name } = props;

    let cn = "unselect";
    switch (name.toLowerCase()) {
      case "b": {
        cn = bold ? "select" : "unselect";
        break;
      }
      case "i": {
        cn = italic ? "select" : "unselect";
        break;
      }
      default:
        break;
    }

    return (
      <button
        ref={name.toLowerCase() === "b" ? bRef : iRef}
        disabled={clickedOutside}
        key={cmd}
        className={cn}
        onClick={(evt) => {
          evt.preventDefault(); // Avoids loosing focus from the editable area
          document.execCommand(cmd, false, arg); // Send the command to the browser

          switch (name.toLowerCase()) {
            case "b": {
              if (!_.isEmpty(inputRef.current)) {
                inputRef.current.el.current.focus();
              }

              setBold(!bold);
              break;
            }

            case "i": {
              if (!_.isEmpty(inputRef.current)) {
                inputRef.current.el.current.focus();
              }

              setItalic(!italic);
              break;
            }

            default:
              break;
          }
        }}
      >
        {name || cmd}
      </button>
    );
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const form = () => {
    return (
      <div className={"displayComments"}>
        {/* {console.log("actions :", actions)} */}
        {parentId === undefined ? (
          <div className={"userImg"}>
            <img
              src={actions.userImg}
              style={{ width: 25, height: 25, borderRadius: 38 / 2 }}
              alt="userIcon"
            />
            <div className="fullName">{actions.userName}</div>
          </div>
        ) : (
          <div></div>
        )}

        {/* <input
          className={styles.postComment}
          type="text"
          placeholder="Type your reply here."
          component="input"
          value={text}
          onChange={handleChange}
        /> */}

        <ContentEditable
          ref={inputRef}
          className="editable"
          // tagName="pre"
          placeholder={"Để lại bình luận của bạn..."}
          html={_.isEmpty(text) ? "" : text} // innerHTML of the editable div
          disabled={false} // use true to disable edition
          onChange={handleChange} // handle innerHTML change
          onBlur={sanitize}
          onFocus={(evt) => {
            setClickedOutside(false);
          }}
        />
        <div>
          <div></div>
          <div className={"inputActions"}>
            <CmdButton cmd="bold" name="Bold" />
            <CmdButton cmd="italic" name="Italic" />
            {
              /*(text || parentId) && */

              <button
                className={"cancelBtn"}
                onClick={() => {
                  // console.log("cancelBtn : ", cancellor, true, setText);
                  if (edit) {
                    actions.handleCancel(cancellor, true, setText);
                  } else if (parentId === undefined) {
                    setInputOpen(false);
                    actions.handleCancel(cancellor, false, setText);
                  } else {
                    actions.handleCancel(cancellor, false, setText);
                  }
                }}
                // setInputOpen(true);
              >
                Hủy
              </button>
            }

            <button
              className={"postBtn"}
              onClick={() => {
                edit === true
                  ? actions.submit(cancellor, text, parentId, true, setText)
                  : actions.submit(cancellor, text, parentId, false, setText);

                if (parentId === undefined) {
                  setInputOpen(false);
                }
              }}
              type="button"
              disabled={!text}
              style={
                !text
                  ? { backgroundColor: "#0d790d" }
                  : { backgroundColor: "#0d790d" }
              }
            >
              Đăng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    // <form
    //   className={styles.form}
    //   style={
    //     !child && !edit && main === undefined
    //       ? { marginLeft: 36 }
    //       : { marginLeft: 8 }
    //   }
    // >
    <div>
      {/* {console.log("inputOpen, parentId", inputOpen, parentId)} */}
      {parentId === undefined ? (
        // <button
        //   onClick={(e) => {
        //     setInputOpen(true);
        //   }}
        // >
        //   A
        // </button>

        inputOpen ? (
          form()
        ) : (
          <div
            className="form"
            onClick={(e) => {
              setInputOpen(true);
            }}
          >
            Để lại bình luận...
          </div>
        )
      ) : (
        form()
      )}
    </div>
    // {/* </form> */}
  );
};

export default InputField;
