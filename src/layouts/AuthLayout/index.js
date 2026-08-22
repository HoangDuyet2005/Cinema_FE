import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { LOADING_BACKTO_HOME } from '../../reducers/constants/Lazy';

const bgAuth = '/img/posterBG.jpg';

// Preload hình nền vào bộ nhớ trình duyệt ngay khi file được import
if (typeof window !== "undefined") {
  const preloadImg = new Image();
  preloadImg.src = bgAuth;
}

const useStyles = makeStyles((theme) => ({
  backgroundImage: {
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#881337', // Màu nền đỏ điện ảnh dự phòng tức thì loại bỏ delay
    backgroundImage: `url(${bgAuth})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center",
    padding: '30px 16px',
    transition: 'opacity 0.2s ease-in-out',
  },
  bgBlueColor: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    width: '100%',
    maxWidth: 520,
    height: "fit-content",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "100%",
    },
    borderRadius: 0,
    position: "relative",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px 16px",
    animation: "$fadeIn 0.25s ease-out",
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "scale(0.96)",
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  closeButton: {
    position: 'absolute',
    top: -16,
    right: -16,
    backgroundColor: "#ffffff",
    border: '1px solid rgba(226, 232, 240, 0.8)',
    borderRadius: "50%",
    padding: 6,
    color: "#1e293b",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    '&:focus': {
      outline: 'none'
    },
    '&:hover': {
      backgroundColor: "#dc2626",
      color: "#ffffff",
      transform: "scale(1.08)",
    },
    transition: "all .2s ease",
  },
}));

export default function AuthLayout(props) {
  const classes = useStyles();
  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClose = () => {
    if (location.state?.slice(0, 5) === "/phim") {
      history.push(location.state);
      return;
    }
    dispatch({ type: LOADING_BACKTO_HOME });
    setTimeout(() => {
      history.push("/");
    }, 50);
  };

  return (
    <div className={classes.backgroundImage}>
      <div className={classes.bgBlueColor}>
        {props.children}
        <IconButton className={classes.closeButton} onClick={handleClose} >
          <CloseIcon fontSize='small' />
        </IconButton>
      </div>
    </div>
  );
}