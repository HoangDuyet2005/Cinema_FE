
import React, { useEffect, useState } from 'react';

import { SnackbarProvider } from 'notistack';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useDispatch, useSelector } from "react-redux";

import NavBar from './NavBar';
import NavAdminStaff from './NavAdminStaff/Sidebar'
import TopBar from './TopBar';
import usersApi from '../../api/usersApi';
import { GET_INFO_USER_FAIL, GET_INFO_USER_REQUEST, GET_INFO_USER_SUCCESS } from '../../reducers/constants/UsersManagement';
import { LOGIN_FAIL, LOGIN_SUCCESS } from '../../reducers/constants/Auth';

export default function AdminLayout(props) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authReducer);
  // console.log(currentUser);
  // const { currentUser } = useSelector((state) => state.usersManagementReducer);
  // console.log(currentUser);
  const [userAdmin, setUserAdmin]= useState();
  // if (currentUser?.maLoaiNguoiDung !== "QuanTri") { // nếu không phải tài khoản quản trị thì ẩn đi giao diện AdminLayout, vẫn truyền vào children để hiện thông báo trong children
  //   return <>{props.children}</>
  // }

  // useEffect(() => {
  //   dispatch({
  //     type: GET_INFO_USER_REQUEST
  //   })
  //   usersApi.getThongTinTaiKhoan()
  //     .then(result => {
  //       console.log("getThongTinTaiKhoan: ", result);
  //       setUserAdmin(result.data.data)
  //       dispatch({
  //         type: GET_INFO_USER_SUCCESS,
  //         payload: {
  //           data: result.data.data,
  //         }
  //       })
  //     }
  //     )
  //     .catch(
  //       error => {
  //         dispatch({
  //           type: GET_INFO_USER_FAIL,
  //           payload: {
  //             error: error.response?.data?.data ? error.response.data?.data : error.message,
  //           }
  //         })
  //       }
  //     )
  // },[])
  const [cUser , setCUser] = useState();
  useEffect(() => {
    usersApi.getThongTinTaiKhoan()
    .then((response) =>{
      // console.log("AMIN LAYOUT: ", response?.data);
      setCUser(response?.data);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          data: response?.data,
        },
      });
    })
    .catch((error) => {
      // console.log(error);
      dispatch({
        type: LOGIN_FAIL,
        payload: {
          error: error.response?.data?.data ? error.response?.data?.data : error.message,
        },
      });
    })
    // console.log(setUserLog.data);
    // localStorage.setItem('userInfo', JSON.stringify({...cUser}))
    // localStorage.setItem('userLogin', JSON.stringify(...setUserLog.data))
  },[])

  // console.log(cUser);
  // currentUser = userAdmin;
  // if (currentUser?.data?.role === "[ROLE_ADMIN]") { // nếu không phải tài khoản quản trị thì ẩn đi giao diện AdminLayout, vẫn truyền vào children để hiện thông báo trong children
  //   return <>{props.children}</>
  // }
  if (!currentUser?.data?.role === "[ROLE_STAFF]") { // nếu không phải tài khoản quản trị thì ẩn đi giao diện AdminLayout, vẫn truyền vào children để hiện thông báo trong children
    return <>{props.children}</>
  }
  return (
    // package notistack: popup thông báo nhỏ gọn
    <SnackbarProvider maxSnack={3}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} style={{backgroundColor:"white", color:"black"}}/>
      <div className="row">
        <div style={{ width: 255, backgroundColor:"white"}}>
          {/* đây là phần NavBar nằm bên trái, có thể đóng mở khi màn hình nhỏ */}
          <NavBar
            onMobileClose={() => setMobileNavOpen(false)}
            openMobile={isMobileNavOpen}
          />
          {/* <NavAdminStaff/> */}
        </div>
        <div style={{ width: isMobile ? "100%" : "calc(100% - 255px)",backgroundColor:"white", height:"100vh" }}>
          {/* đây là nội dung chính: UserManagement, MoviesManagement, ReateShowtime */}
          {props.children}
        </div>
      </div>
    </SnackbarProvider>
  )
}

