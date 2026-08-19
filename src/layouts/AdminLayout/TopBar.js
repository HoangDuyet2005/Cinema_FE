import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
// import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";

import { LOGOUT } from '../../reducers/constants/Auth';
import { LOADING_BACKTO_HOME } from '../../reducers/constants/Lazy';
import Swal from 'sweetalert2';
const TopBar = ({
  onMobileNavOpen,
  ...rest
}) => {
  const [notifications] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Đăng xuất!',
      text: "Chắc chắn bạn muốn đăng xuất?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Okay, ngay bây giờ!',
      cancelButtonText: 'Không, dừng lại!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: LOGOUT })
        swalWithBootstrapButtons.fire(
          'Đã đăng xuất!',
          'DONE.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Đã dừng',
          'Không đăng xuất!',
          'error'
        )
      }
    })
  }

  const handleClickLogo = () => {
    dispatch({ type: LOADING_BACKTO_HOME })
    setTimeout(() => {
      history.push("/", "")
    }, 50);
  }
  return (

    // đây là phần header trên cùng
    <AppBar
      elevation={0}
      position="static"
      {...rest}
    >
      <Toolbar>
        <div onClick={handleClickLogo} style={{ cursor: "pointer" }}>
          {/* <img src="/img/headTixLogo.png" alt="logo" style={{ height: 50 }} /> */}
          <h5>QUẢN TRỊ HỆ THỐNG WORLD CINEMA</h5>
        </div>

        {/* 1 thẻ div chiếm hết khoảng trống còn lại dể dồn các icon về 2 bên */}
        <Box flexGrow={1} />

        {/* cái icon chuông và đăng xuất */}
        <Hidden mdDown>
          {/* <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="secondary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <Tooltip title="Log out">
            <IconButton color="inherit" onClick={handleLogout}>
              <InputIcon />
            </IconButton>
          </Tooltip>
        </Hidden>

        {/* cái icon menu */}
        <Hidden lgUp>
          <IconButton
            color="inherit"
            // nếu click thì thực hiện func đóng mở Nav được truyền vào từ cha
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

// báo lỗi nếu kiểu dữ liệu truyền vào props không đúng với yều cầu bên dưới
TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;


