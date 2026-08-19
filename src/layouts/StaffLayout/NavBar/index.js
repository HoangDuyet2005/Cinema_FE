import React, { useEffect, useState } from 'react';

import MovieIcon from '@material-ui/icons/Movie';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';

import NavItem from './NavItem';
import { FAKE_AVATAR } from '../../../constants/config';
import { GET_INFO_USER_FAIL, GET_INFO_USER_REQUEST, GET_INFO_USER_SUCCESS } from '../../../reducers/constants/UsersManagement';
import usersApi from '../../../api/usersApi';

const items = [
  {
    href: '/staff/movies',
    icon: MovieIcon,
    title: 'Quản lý phim'
  },
  {
    href: '/staff/branch',
    icon: PostAddIcon,
    title: 'Quản lý chi nhánh rạp'
  },
  {
    href: '/staff/reviews',
    icon: PostAddIcon,
    title: 'Quản lý Review'
  },
  {
    href: '/staff/events',
    icon: PostAddIcon,
    title: 'Quản lý sự kiện'
  },
  {
    href: '/staff/ticket',
    icon: PostAddIcon,
    title: 'Quản lý vé'
  },
  {
    href: '/staff/bills/',
    icon: PostAddIcon,
    title: 'Quản lý hóa đơn, thanh toán'
  },
  {
    href: '/staff/book/',
    icon: PostAddIcon,
    title: 'Đặt cho người dùng'
  },
  {
    href: '/staff/showtimes',
    icon: PostAddIcon,
    title: 'Quản lý lịch chiếu'
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    // top: 64,
    position:'relative',
    
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

export default function NavBar({ onMobileClose, openMobile }) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [userStaff, setUserStaff]= useState();
  const { currentUser } = useSelector((state) => state.authReducer);

  useEffect(() => {
    dispatch({
      type: GET_INFO_USER_REQUEST
    })
    usersApi.getThongTinTaiKhoan()
      .then(result => {
        // console.log("getThongTinTaiKhoan: ", result);
        setUserStaff(result.data.data)
        dispatch({
          type: GET_INFO_USER_SUCCESS,
          payload: {
            data: result.data,
          }
        })
      }
      )
      .catch(
        error => {
          dispatch({
            type: GET_INFO_USER_FAIL,
            payload: {
              error: error.response?.data?.data ? error.response.data?.data : error.message,
            }
          })
        }
      )
  },[])

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const user = {
    avatar: userStaff?.image,
    jobTitle: 'Nhân viên',
    name: userStaff?.name,
  };

  const handleUser = () => {
    history.push("/taikhoan")
  }


  // đây là nội dung cột bên trái
  const content = (

    // cái này là div để dàn thành cột
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Divider />
{/* đây là phần logo avatar user và tên user */}
      <Box
        // căn giữa cột
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={3} // padding 2
      >
        <Tooltip title="User information">
          <Avatar
            className={classes.avatar}
            src={user.avatar}
            onClick={handleUser}
          />
        </Tooltip>
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
      </Box>
      {/* đây là phần menu lựa chọn */}
      <Box p={2}>
        <List>
          {items.map((item) => (
            // NavItem hiện thị ra icon và title
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              // icon={item.icon}
            />
          ))}
        </List>
      </Box>

    </Box>
    
  );

  return (
    <>
      {/* đây là giao diện mobile */}
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile} // đóng mở tùy thuộc vào bạn click
          variant="temporary" // kiểu temporary có một lớp phủ mờ hiện ra cho đến khi bạn chọn xong thì Drawer mới đóng lại
        >
          {content}
        </Drawer>

      </Hidden>
      {/* đây là giao diện desktop */}
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open // luôn luôn hiện Drawer
          variant="persistent" // kiểu persistent không có lớp phủ mờ khi hiện drawer
        >
          {content}
        </Drawer>
      </Hidden>

    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

// export default NavBar;

