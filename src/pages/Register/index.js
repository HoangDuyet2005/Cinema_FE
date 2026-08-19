import React, { useEffect, useState } from "react";

import { useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { register, resetErrorLoginRegister } from "../../reducers/actions/Auth";

export default function Register() {
  const useStyles = makeStyles((theme) => ({
    eye: {
      position: "absolute",
      top: 107,
      right: 20,
      cursor: "pointer",
      color: "#000",
    },
    eye1: {
      position: "absolute",
      top: 185,
      right: 20,
      cursor: "pointer",
      color: "#000",
    },
    text: {
      textAlign: "center",
      fontSize:"3rem",
      marginBottom: "30px",
    },
  }));

  const { responseRegister, loadingRegister, errorRegister } = useSelector(
    (state) => state.authReducer
  );
  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [typePassword1, settypePassword1] = useState("password");
  const [typePassword2, settypePassword2] = useState("password");
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (responseRegister) {
      // đăng ký thành công thì đăng nhập, responseRegister để bỏ qua componentditmount
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Bạn đã đăng ký thành công!",
        showConfirmButton: false,
        timer: 2000,
      });
      history.push("/dangnhap", location.state);
    }
  }, [responseRegister]);
  useEffect(() => {
    return () => {
      dispatch(resetErrorLoginRegister());
    };
  }, []);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const signupUserSchema = yup.object().shape({
    username: yup.string().required("*Không được bỏ trống !"),
    password: yup.string().required("*Không được bỏ trống !"),
    repassword: yup.string().required("*Không được bỏ trống !"),
    email: yup
      .string()
      .required("*Không được bỏ trống !")
      .email("* Email không hợp lệ !"),
    // soDt: yup
    //   .string()
    //   .required("*Số điện thoại không được bỏ trống !")
    //   .matches(phoneRegExp, "Số điện thoại không hợp lệ!"),
    name: yup.string().required("*Không được bỏ trống !"),
  });

  const handleSubmit = (user) => {
    // trường hợp nào thì cho đăng ký(return true): loadingRegister=false và responseRegister=null
    console.log(`user`, user);

    const info = {
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    }

    if (!loadingRegister && !responseRegister) {
      if(user.password === user.repassword)
      {
        dispatch(register(info));
      }
      else {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          title: 'Lỗi...',
          text: 'Mật khẩu không khớp!',
          confirmButtonText: `Nhập lại`,
        })
      }
    }
  };
  const handleToggleHidePassword1 = () => {
    if (typePassword1 === "password") {
      settypePassword1("text");
    } else {
      settypePassword1("password");
    }
  };
  const handleToggleHidePassword2 = () => {
    if (typePassword2 === "password") {
      settypePassword2("text");
    } else {
      settypePassword2("password");
    }
  };

  return (
    <div className="text-light" style={{ padding: "20px 32px 30px" }}>
      <div className="container">
        {/* <img
          src={logoTix}
          alt="logoTix"
          style={{
            width: "200px",
            marginBottom: "10px",
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        /> */}
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Đăng ký tài khoản để trải nghiệm dịch vụ tuyệt vời!
        </p>
      </div>
      <Formik
        initialValues={{
          username: "",
          password: "",
          email: "",
          name: "",
        }}
        validationSchema={signupUserSchema} // validationSchdema:  thu vien yup nhập sai ko submit được
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form className="col-sm-10 mx-auto">
            <div className="form-group">
              <label>Tên tài khoản&nbsp;</label>
              <ErrorMessage
                name="username"
                render={(msg) => <span className="text-danger">{msg}</span>}
              />
              <Field name="username" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Mật khẩu&nbsp;</label>
              <ErrorMessage
                name="password"
                render={(msg) => <span className="text-danger">{msg}</span>}
              />
              <Field name="password" type={typePassword1} className="form-control" />
              <div
                className={classes.eye}
                onClick={handleToggleHidePassword1}
              >
                {typePassword1 !== "password" ? (
                  <i className="fa fa-eye-slash" style={{"color":"black"}}></i>
                ) : (
                  <i className="fa fa-eye" style={{"color":"black"}}></i>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Nhập lại mật khẩu&nbsp;</label>
              <ErrorMessage
                name="repassword"
                render={(msg) => <span className="text-danger">{msg}</span>}
              />
              <Field name="repassword" type={typePassword2} className="form-control" />
              <div
                className={classes.eye1}
                onClick={handleToggleHidePassword2}
              >
                {typePassword2 !== "password" ? (
                  <i className="fa fa-eye-slash" style={{"color":"black"}}></i>
                ) : (
                  <i className="fa fa-eye" style={{"color":"black"}}></i>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Họ và tên&nbsp;</label>
              <ErrorMessage
                name="name"
                render={(msg) => <span className="text-danger">{msg}</span>}
              />
              <Field name="name" type="text" className="form-control" />
            </div>

            <div className="form-group">
              <label>Email&nbsp;</label>
              <ErrorMessage
                name="email"
                render={(msg) => <span className="text-danger">{msg}</span>}
              />
              <Field name="email" type="email" className="form-control" />
            </div>
            {/* <div className="form-group">
              <label>Loại tài khoản&nbsp;</label>
              <div>
                <label>
                  <Field type="radio" name="maLoaiNguoiDung" value="KhachHang" />
                  Khách Hàng
                </label>
                <label>
                  <Field type="radio" name="maLoaiNguoiDung" value="QuanTri" />
                  Quản Trị
                </label>
              </div>
            </div> */}
            <div className="text-center p-2">
              <button
                type="submit"
                className="btn btn-success"
                disable={loadingRegister.toString()}
              >
                Đăng ký
              </button>
              {/* error from api */}
              {errorRegister && (
                <div className="alert alert-danger">
                  <span>{errorRegister}</span>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
