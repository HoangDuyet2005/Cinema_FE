
import React from 'react';
import { Redirect, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import AlertCanNotAccess from './alertCanNotAccess';
import usersApi from '../../api/usersApi';
import { LOGIN_SUCCESS } from '../../reducers/constants/Auth';

function AdminRoute(props) {
  const { currentUser } = useSelector((state) => state.authReducer);
  // console.log("Admin-----: ", currentUser);
  const { component: ComponentAdmin, ...rest } = props;
  let location = useLocation();
  return (
    <Route {...rest} render={(routeProps) => {
      if (currentUser) { if (currentUser.data === undefined) { return <div>Đang tải thông tin...</div>; }
        // if (currentUser) {
        if (currentUser?.data?.role?.includes("ROLE_ADMIN")) { 
          return <ComponentAdmin {...routeProps} />
        }
        return <AlertCanNotAccess />
      }
      return <Redirect to={{
        pathname: "/dangnhap",
        state: location.pathname,
      }} />
    }} />
  )
}
export default AdminRoute;