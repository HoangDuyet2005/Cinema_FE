import React, { useState, useEffect, useRef } from "react";
import user from "./user.png";
// import "./custom.css";

import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
// import "./styles.css";
var _ = require("lodash");

const CustomInput = ({
  cancellor,
  parentId,
  value,
  edit,
  submit,
  handleCancel,

  onChange
}) => {
  const [text, setText] = useState(value === undefined ? "" : value);

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    setHtml(value);
    // setEditable(true);
  }, []);

  const handleClickInside = () => setClickedOutside(false);
  const handleClickOutside = (e) => {
    if (
      _.isEmpty(inputRef.current.el.current) ||
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

  const EditButton = (props) => {
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
              setBold(!bold);
              break;
            }

            case "i": {
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
    console.log(e.target.value);
    setText(e.target.value);
  };

  return (
    <div className="form">
      <img src={user} style={{ width: 40, height: 40 }} />
      <div className="input-div">
        <span className="input-name">Riya Negi</span>
        <div>
          <ContentEditable
            ref={inputRef}
            className="editable"
            tagName="pre"
            html={value} // innerHTML of the editable div
            disabled={false} // use true to disable edition
            onChange={onChange} // handle innerHTML change
            onBlur={sanitize}
            onFocus={(evt) => {
              setClickedOutside(false);
            }}
          />
          <div>
            <div>
              <EditButton cmd="bold" name="B" />
              <EditButton cmd="italic" name="i" />
            </div>

            <div className="btn-div">
              <button
                className="post-btn"
                onClick={() => {
                  submit(cancellor, text, parentId, edit, setText);
                }}
                type="submit"
                disabled={!text}
              >
                Đăng
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  handleCancel(cancellor, edit);
                }}
              >
                Hủy
              </button>
            </div>
            {/* <div>
                    <button onClick={props.onCancel}>Cancel</button>
                    <button onClick={props.onPost}>Post</button>
                  </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomInput;
