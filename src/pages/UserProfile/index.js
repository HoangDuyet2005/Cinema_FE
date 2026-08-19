import { NavLink, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, makeStyles, Typography } from "@material-ui/core";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import AppBar from "@material-ui/core/AppBar";
import BookIcon from '@mui/icons-material/Book';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import NavigationIcon from "@material-ui/icons/Navigation";
import Fab from "@material-ui/core/Fab";
import CircularIntegration from "./../../utilities/CircularIntegration"
import { FAKE_AVATAR } from "../../constants/config";
import {
  getInfoUser,
  putUserChangePass,
  putUserUpdate,
  resetUserList,
} from "../../reducers/actions/UsersManagement";
import { getComment } from "../../reducers/actions/MovieDetail";
import usersApi from "../../api/usersApi";
import reviewsApi from "../../api/billsApi";
import { getAllTicket } from "../../reducers/actions/Ticket";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { getBillsChuaThanhToan, getBillsUserId } from "../../reducers/actions/Bill";
import formatDate from "../../utilities/formatDate";
import eventsApi from "../../api/eventsApi";
import "./styles.scss"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import DetailPopup from "./PopUp/PopUp";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import { Comment as CommentIcon, Gavel  as GavelIcon , Favorite as FavoriteIcon, Visibility as VisibilityIcon } from '@material-ui/icons';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent",
    color: "black",
    boxShadow: "none",
    "& .MuiTabs-indicator": {
      height: 0, // ẩn gạch dưới
    },
  },
  field: {
    maxWidth: 500,
    paddingRight: 16,
    paddingLeft: 16,
  },
  password: {
    position: "relative",
  },
  eye: {
    position: "absolute",
    top: 31,
    right: 9,
    cursor: "pointer",
  },
  tabButton: {
    opacity: 1,
    color: "#000",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    "& > span": {
      transition: "all 0.2s",
      "&:hover": {
        fontSize: "15px",
      },
    },
  },

  tabSelected: {
    color: "#fa5238",
  },
  td: {
    "& td": {
      whiteSpace: "nowrap",
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function TabPanel(props) {
  const { children, value, index, isDesktop, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && (
        <Box style={{ padding: isDesktop ? "24px" : "24px 0px 0px" }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function Index({ placeholder }) {
  const history = useHistory();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  const dispatch = useDispatch();
  const { successInfoUser, loadingInfoUser } = useSelector(
    (state) => state.usersManagementReducer
  );
  console.log("successInfoUser: ", successInfoUser);
  const { ticketList } = useSelector((state) => state.ticketReducer);
  // const { billListUserId } = useSelector((state) => state.billsManagementReducer);


  // console.log("Vé đã đặt",ticketList);
  // console.log("Bill đã đặt",billList);



  // const [dataShort, setdataShort] = useState({
  //   ticket: 0,
  //   posts: 0,
  //   likePosts: 0,
  //   total: 0,
  // });
  const { successUpdateUser, errorUpdateUser, loadingUpdateUser } = useSelector(
    (state) => state.usersManagementReducer
  );

  const {
    billListChuaTT,
  } = useSelector((state) => state.billsManagementReducer);

  console.log(billListChuaTT);

  const [value, setValue] = React.useState(0);
  const [typePassword, settypePassword] = useState("password");
  const [typePassword2, settypePassword2] = useState("password");
  const [typePassword3, settypePassword3] = useState("password");
  const [ticket, setTicket] = useState([]);
  const [image, setImage] = useState(successInfoUser?.data?.image)
  const [oldPass, setOldPass] = useState()
  const [newPass, setNewPass] = useState()
  const [savedArticle, setSavedArticle] = useState([])
  const [wroteArticle, setWroteArticle] = useState([])
  const [ticketDetail, setTicketDetail] = useState({})
  const [toggle, setToggle] = useState(false)

  const getTicketDetail = (id) => {
    reviewsApi.getBillByID(id).then((response) => { setTicketDetail(response.data); setToggle(true) })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleLikeClick2 = ({ id }) => {
    eventsApi.addSaveArticle({ userId: successInfoUser?.data?.id, articleId: id })
  };
  useEffect(() => {
    dispatch(getInfoUser());
    dispatch(getBillsChuaThanhToan(successInfoUser?.data?.id));
    dispatch(getAllTicket(successInfoUser?.data?.id))
    dispatch(getBillsUserId(successInfoUser?.data?.id))
    dispatch(getComment());

    return () => dispatch(resetUserList());
  }, [successInfoUser?.data?.id]);

  useEffect(() => {
    successInfoUser?.data?.id && 
    eventsApi.getAllSavedArticle(successInfoUser?.data?.id)
    .then(res => setSavedArticle(res?.data?.data?.content))

  }, [successInfoUser?.data?.id])

  useEffect(() => {
    successInfoUser?.data?.id && eventsApi.getAll().then(res => setWroteArticle(res?.data?.data))
  }, [successInfoUser?.data?.id])

  // console.log('====================================');
  // console.log(wroteArticle);
  // console.log('====================================');

  useEffect(() => {
    if (successUpdateUser) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cập nhật thành công",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [successUpdateUser]);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const updateUserSchema = yup.object().shape({
    // username: yup.string().required("*Username not be empty !"),
    // password: yup.string().required("*Password not be empty !"),
    // email: yup
    //   .string()
    //   .required("*Email not be empty !")
    //   .email("* Email invalid! "),
    // soDt: yup
    //   .string()
    //   .required("*Số điện thoại không được bỏ trống !")
    //   .matches(phoneRegExp, "Số điện thoại không hợp lệ!"),
    name: yup.string().required("*Không được bỏ trống tên !"),
  });

  const updateUserSchemaPassword = yup.object().shape({
    // username: yup.string().required("*Username not be empty !"),
    oldpassword: yup.string().required("*Mật khẩu không được bỏ trống !"),
    newpassword: yup.string().required("*Mật khẩu không được bỏ trống !"),
    renewpassword: yup.string().required("*Mật khẩu không được bỏ trống !"),
    // email: yup
    //   .string()
    //   .required("*Email not be empty !")
    //   .email("* Email invalid! "),
    // soDt: yup
    //   .string()
    //   .required("*Số điện thoại không được bỏ trống !")
    //   .matches(phoneRegExp, "Số điện thoại không hợp lệ!"),
    // name: yup.string().required("*Name not be empty !"),
  });

  const handleSubmit = (user) => {
    // console.log("Thông tin cập nhật: ", user);
    if (loadingUpdateUser) {
      console.log("Thoát");
      return;
    }
    console.log(user);
    dispatch(putUserUpdate(user));
  };

  const handleSubmitChangePass = (pass) => {

    console.log(pass);
    if (loadingUpdateUser) {
      console.log("Thoát");
      return;
    }
    if (pass.newpassword === pass.renewpassword) {
      dispatch(putUserChangePass(pass.newpassword, pass.oldpassword));
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Nhập sai mật khẩu vui lòng nhập lại!",
        showConfirmButton: false,
        timer: 1500,
      });
    }

  };
  const handleToggleHidePassword = () => {
    if (typePassword === "password") {
      settypePassword("text");
    } else {
      settypePassword("password");
    }
  };
  const handleToggleHidePassword2 = () => {
    if (typePassword2 === "password") {
      settypePassword2("text");
    } else {
      settypePassword2("password");
    }
  };
  const handleToggleHidePassword3 = () => {
    if (typePassword3 === "password") {
      settypePassword3("text");
    } else {
      settypePassword3("password");
    }
  };
  const handleChangePassword = (o, n) => {
    console.log(o, n);
  };

  const getIdSeat = (danhSachGhe) => {
    return danhSachGhe?.reduce((listSeat, seat) => {
      return [...listSeat, seat.name];
    }, [])
      .join(", ");
  };

  const submitImage = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "hh37brtc")
    data.append("cloud_name", "dfb5p3kus")

    fetch("https://api.cloudinary.com/v1_1/dfb5p3kus/image/upload", {
      method: "post",
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        setImage(data.secure_url)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handlerChangAvatar = () => {
    console.log("Đổi avatar");
  }

  useEffect(() => {
    usersApi.getChiTietTaiKhoan(successInfoUser?.data?.username)
      .then((response) => {
        console.log("Chi tiết USER: ", response);
        setImage(response.data?.data?.image)
      })
      .catch((err) => {
        console.log(err);
        return;
      })
  }, []);

  const handlerError = () => {
    return;
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  console.log(ticketList)
  const handleChangeAnh = (image) => {
    const user = {
      username: successInfoUser?.data?.username ?? "",
      password: successInfoUser?.data?.password ?? "",
      email: successInfoUser?.data?.email ?? "",
      id: successInfoUser?.data?.id ?? "",
      name: successInfoUser?.data?.name ?? "",
      image: image ?? "",
    }
    dispatch(putUserUpdate(user));
    console.log("vateee:", user);
    setOpen(false);
  };

  const handleClose = (user) => {
    setOpen(false);
  };

  console.log("avt cập nhật: ", image);

  return (
    <div className="bootstrap snippet mb-5 mx-4" style={{ "backgroundColor": "black" }}>
      <br />
      <div className="row">
        <div className="col-sm-2">
          <div className="text-center" style={{ marginTop: "15px" }}>
            <img
              src={successInfoUser?.data?.image ? successInfoUser?.data?.image : FAKE_AVATAR}
              // className={`avatar rounded-circle img-thumbnail ${
              //   isDesktop ? "w-60" : "w-30"
              // }`}
              style={{
                width: "100%",
                height: "100%",
                marginBottom: "1rem"
              }}
              alt="avatar"
            />
            <div className="text-center mb-2" style={{ paddingTop: "0.5" }}>
              <Fab
                variant="extended"
                color="secondary"
                size="medium"
                onClick={handleClickOpen}
              >
                Đổi ảnh đại diện
              </Fab>
            </div>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Chọn ảnh đại diện mà bạn thích nhất"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <input type="file" className="form-control" onChange={(e) => {

                    setImage(e.target.files[0])
                    // formikProp.setFieldValue("smallImageURl", srcImage)
                  }} />
                </DialogContentText>
              </DialogContent>

              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={image ? image : FAKE_AVATAR}
                      style={{
                        width: "40%",
                        height: "40%",
                        marginBottom: "1rem",
                      }}
                      // className={`avatar rounded-circle img-thumbnail center${
                      //   isDesktop ? "w-30" : "w-30"
                      // }`}
                      alt="avatar"
                    />
                  </div>
                </DialogContentText>
                {/* <Fab
                    variant="extended"
                    color="secondary"
                    size="medium"
                    onClick={submitImage}
                  >
                    Up ảnh
                </Fab> */}
                <div onClick={submitImage}>
                  <CircularIntegration data={"Tải ảnh lên"} />
                </div>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose}>Huỷ bỏ</Button>
                {/* <Button onClick={handleClose}>Đồng ý</Button> */}
                <Button onClick={(e) => handleChangeAnh(image)}>Đồng ý</Button>
              </DialogActions>
            </Dialog>
            <h1 className="my-2" style={{ "color": "white" }}>{successInfoUser?.data?.username}</h1>
          </div>
          {successInfoUser?.data?.role?.includes("ROLE_ADMIN") && (
            <div className="text-center mb-2">
              <Fab
                variant="extended"
                color="primary"
                onClick={() => history.push("/admin/movies")}
              >
                <NavigationIcon className={classes.extendedIcon} />
                Đến trang Admin
              </Fab>
            </div>
          )}
          {successInfoUser?.data?.role?.includes("ROLE_STAFF") && (
            <div className="text-center mb-2">
              <Fab
                variant="extended"
                color="primary"
                onClick={() => history.push("/staff/movies")}
              >
                <NavigationIcon className={classes.extendedIcon} />
                Trang nhân viên
              </Fab>
            </div>
          )}
          {successInfoUser?.data?.role === "[ROLE_USER]" && (
            <div className="text-center mb-2">
              <Fab
                variant="extended"
                color="primary"
                onClick={() => history.push(`/reviewer/${successInfoUser?.data?.username}`)}
              >
                <NavigationIcon className={classes.extendedIcon} />
                Trang cá nhân
              </Fab>
            </div>
          )}
          {/* <ul className="list-group">
            <li className="list-group-item text-muted">Activity</li>
            <li className="list-group-item text-right">
              <span className="float-left">
                <strong>Comment</strong>
              </span>
              {dataShort.posts}
            </li>
            <li className="list-group-item text-right">
              <span className="float-left">
                <strong>Comment be liked </strong>
              </span>
              {dataShort.likePosts}
            </li>
            <li className="list-group-item text-right">
              <span className="float-left">
                <strong>Count</strong>
              </span>
              {dataShort.ticket}
            </li>
            <li className="list-group-item text-right">
              <span className="float-left">
                <strong>Total $</strong>
              </span>
              {dataShort.total}
            </li>
          </ul> */}
        </div>
        <div className={`col-sm-10 py-3 px-0`}>
          <AppBar className={classes.appBar} position="static" style={{ backgroundColor: "orange", color: "white" }}>
            <Tabs value={value} onChange={handleChange} centered={!isDesktop}>
              <Tab
                disableRipple
                classes={{
                  root: classes.tabButton,
                  selected: classes.tabSelected,
                }}
                label="Hồ sơ"
              />
              <Tab
                disableRipple
                classes={{
                  root: classes.tabButton,
                  selected: classes.tabSelected,
                }}
                label="Lịch sử đặt vé"
              />
              <Tab
                disableRipple
                classes={{
                  root: classes.tabButton,
                  selected: classes.tabSelected,
                }}
                label="Đổi mật khẩu"
              />
              {/* <Tab
                disableRipple
                classes={{
                  root: classes.tabButton,
                  selected: classes.tabSelected,
                }}
                label="Thanh toán hoá đơn"
              /> */}
              <Tab
                disableRipple
                classes={{
                  root: classes.tabButton,
                  selected: classes.tabSelected,
                }}
                label="Bài viết đã viết"
              />
              <Tab
                disableRipple
                classes={{
                  root: classes.tabButton,
                  selected: classes.tabSelected,
                }}
                label="Bài viết đã lưu"
              />
            </Tabs>

          </AppBar>
          {/* -------------caapj nhật thong tin---------- */}
          <TabPanel value={value} index={0}>
            <Formik
              initialValues={{
                username: successInfoUser?.data?.username ?? "",
                password: successInfoUser?.data?.password ?? "",
                email: successInfoUser?.data?.email ?? "",
                id: successInfoUser?.data?.id ?? "",
                name: successInfoUser?.data?.name ?? "",
                image: successInfoUser?.data?.image ?? "",
              }}
              enableReinitialize // cho phép cập nhật giá trị initialValues
              validationSchema={updateUserSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form className={`${classes.field}`}>
                  {/* <div className="form-group"  style={{"color":"white"}}>
                    <label>Id User&nbsp;</label>
                    <ErrorMessage
                      name="id"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      disabled
                      name="id"
                      type="text"
                      className="form-control"
                      onChange={props.handleChange}
                    />
                  </div> */}

                  <div className="form-group" style={{ "color": "white" }}>
                    <label>Tài khoản&nbsp;</label>
                    <ErrorMessage
                      name="username"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      disabled
                      name="username"
                      type="text"
                      className="form-control"
                      onChange={props.handleChange}
                    />
                  </div>
                  {/* <div className={`form-group ${classes.password}`}>
                    <label>Password&nbsp;</label>
                    <ErrorMessage
                      name="password"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="password"
                      type={typePassword}
                      className="form-control"
                      onChange={props.handleChange}
                    />
                    <div
                      className={classes.eye}
                      onClick={handleToggleHidePassword}
                    >
                      {typePassword !== "password" ? (
                        <i className="fa fa-eye-slash"></i>
                      ) : (
                        <i className="fa fa-eye"></i>
                      )}
                    </div>
                  </div> */}
                  <div className="form-group" style={{ "color": "white" }}>
                    <label>Tên&nbsp;</label>
                    <ErrorMessage
                      name="name"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="name"
                      type="text"
                      className="form-control"
                      onChange={props.handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ "color": "white" }}>
                    <label>Email&nbsp;</label>
                    <ErrorMessage
                      name="email"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      disabled
                      name="email"
                      type="email"
                      className="form-control"
                      onChange={props.handleChange}
                    />
                  </div>
                  {/* <div className="form-group">
                    <label>Số điện thoại&nbsp;</label>
                    <ErrorMessage
                      name="soDt"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="soDt"
                      type="text"
                      className="form-control"
                      onChange={props.handleChange}
                    />
                  </div> */}
                  <div className="text-left">
                    <button
                      type="submit"
                      // type="button"
                      // onClick={() => handleSubmit()}
                      className="btn btn-danger"
                      disable={loadingUpdateUser.toString()}
                    >
                      Cập nhật
                    </button>
                    {errorUpdateUser && (
                      <div className="alert alert-danger">
                        <span>{errorUpdateUser}</span>
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </TabPanel>

          {/* này bên cái bảng kia */}
          {/* <TabPanel
            value={value}
            index={1}
            style={{ padding: isDesktop ? "0px 0px" : "0px 16px", backgroundColor: "white", borderRadius: "5px" }}
            isDesktop={isDesktop}
          >
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Review</th>
                    <th scope="col">Phim</th>
                    <th scope="col">Suất chiếu</th>
                    <th scope="col">Thời lượng</th>
                    <th scope="col">Ngày đặt</th>
                    <th scope="col">Rạp</th>
                    <th scope="col">Mã vé</th>
                    <th scope="col">Ghế</th>
                    <th scope="col">VNĐ</th>
                    <th scope="col">QR Code</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketList === [] ? handlerError() :
                    ticketList?.data?.map((sticket, i) => (
                      <tr key={sticket?.id} className={classes.td}>
                        <th scope="row">{i + 1}</th>
                        <td>
                          <a class="btn btn-primary"
                            href={`/phim/${sticket?.schedule?.movie?.id}/write-review`}
                            role="button">Viết Review
                          </a>
                        </td>
                        <td>{sticket?.schedule?.movie?.name}</td>
                        <td>{sticket?.schedule?.startTime}{", "}{formatDate(sticket?.schedule?.startDate).dateFull}</td>
                        <td>{sticket?.schedule?.movie?.duration}{" "}phút</td>
                        <td>
                          {new Date(sticket?.bill?.createdTime).toLocaleDateString()},{" "}
                          {new Date(sticket?.bill?.createdTime).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </td>
                        <td>
                          {sticket?.schedule?.room?.name},{" "}
                          {sticket?.schedule?.branch?.name}

                        </td>
                        <td>{sticket?.id}</td>
                        <td>{sticket?.seat?.name}</td>
                        <td>
                          {new Intl.NumberFormat("it-IT", {
                            style: "decimal",
                          }).format(sticket?.schedule?.price)}
                        </td>
                        <td>
                          <img
                            style={{ width: 50, height: 50 }}
                            src="https://www.1check.vn/qrcodegen/qr.png"
                            alt="QR code"
                          >
                          </img>
                        </td>
                      </tr>
                    ))
                      .reverse()}

                </tbody>
              </table>
            </div>
          </TabPanel> */}

          {/* Đổi mật khẩu */}
          <TabPanel value={value} index={2}>
            <Formik
              initialValues={{
                // username: successInfoUser?.username ?? "",
                oldpassword: "",
                newpassword: "",
                renewpassword: "",
                // email: successInfoUser?.email ?? "",
                // soDt: successInfoUser?.soDT ?? "",
                // maNhom: "GP09",
                // maLoaiNguoiDung: "KhachHang",
                // name: successInfoUser?.name ?? "",
              }}
              enableReinitialize // cho phép cập nhật giá trị initialValues
              validationSchema={updateUserSchemaPassword}
              onSubmit={handleSubmitChangePass}
            >
              {(props) => (
                <Form className={`${classes.field}`}>
                  <div className={`form-group ${classes.password}`} style={{ "color": "white" }}>
                    <label>Mật khẩu cũ&nbsp;</label>
                    <ErrorMessage
                      name="oldpassword"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="oldpassword"
                      type={typePassword}
                      className="form-control"
                      onChange={props.handleChange}
                    // value={this.props.values.oldpassword}
                    />
                    <div
                      className={classes.eye}
                      onClick={handleToggleHidePassword}
                    >
                      {typePassword !== "password" ? (
                        <i className="fa fa-eye-slash" style={{ "color": "black" }}></i>
                      ) : (
                        <i className="fa fa-eye" style={{ "color": "black" }}></i>
                      )}
                    </div>
                  </div>
                  <div className={`form-group ${classes.password}`} style={{ "color": "white" }}>
                    <label>Mật khẩu mới&nbsp;</label>
                    <ErrorMessage
                      name="newpassword"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="newpassword"
                      type={typePassword2}
                      className="form-control"
                      onChange={props.handleChange}
                    // value={value.newpassword}
                    />
                    <div
                      className={classes.eye}
                      onClick={handleToggleHidePassword2}
                    >
                      {typePassword2 !== "password" ? (
                        <i className="fa fa-eye-slash" style={{ "color": "black" }}></i>
                      ) : (
                        <i className="fa fa-eye" style={{ "color": "black" }}></i>
                      )}
                    </div>
                  </div>
                  <div className={`form-group ${classes.password}`} style={{ "color": "white" }}>
                    <label>Nhập lại mật khẩu mới&nbsp;</label>
                    <ErrorMessage
                      name="renewpassword"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="renewpassword"
                      type={typePassword3}
                      className="form-control"
                      onChange={props.handleChange}
                    // value={value.newpassword}
                    />
                    <div
                      className={classes.eye}
                      onClick={handleToggleHidePassword3}
                    >
                      {typePassword3 !== "password" ? (
                        <i className="fa fa-eye-slash" style={{ "color": "black" }}></i>
                      ) : (
                        <i className="fa fa-eye" style={{ "color": "black" }}></i>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disable={loadingUpdateUser.toString()}
                    // onClick={(e) => {handleChangePassword(value.oldpassword, value.newpassword)}}
                    >
                      Đổi mật khẩu
                    </button>
                    {errorUpdateUser && (
                      <div className="alert alert-danger">
                        <span>{errorUpdateUser}</span>
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </TabPanel>

          {/* Thanh toán hóa đơn */}
          <TabPanel
            value={value}
            index={1}
            style={{ padding: isDesktop ? "0px 0px" : "0px 16px", backgroundColor: "white", borderRadius: "5px" }}
            isDesktop={isDesktop}
          >
            <div className="table-responsive">
              {/* {toggle && <div style={{ position: "fixed", borderRadius: "10px", top: "15%", left: "10%", backgroundColor: "white", zIndex: "1000", width: "80%", height: "70%", overflow: "scroll" }}>
                <DetailPopup ThongTin={ticketDetail} />
                <div onClick={() => setToggle(false)} style={{ position: "absolute", right: "0px", top: "0px", backgroundColor: "red", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}><CloseFullscreenIcon /></div>
              </div>} */}
                {toggle && <div style={{ position: "fixed", borderRadius: "5px", top: "15%", left: "10%", backgroundColor: "white", zIndex: "10000", width: "80%", height: "70%", overflow: "scroll", border:"2px solid black" }}>
                  <DetailPopup ThongTin={ticketDetail} />
                  <div onClick={() => setToggle(false)} style={{ position: "absolute", right: "0px", top: "0px", backgroundColor: "red", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}><CloseFullscreenIcon /></div>
                </div>}
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Action</th>
                    <th scope="col">Mã thanh toán</th>
                    <th scope="col">Đặt lúc</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">VNĐ</th>
                  </tr>
                </thead>
                <tbody>
                  {billListChuaTT === [] ? handlerError() :
                    billListChuaTT?.map((billListChua, i) => (
                      <tr key={billListChua?.id} className={classes.td}>
                        <th scope="row">{i + 1}</th>
                        <td style={{ display: "flex", gap: "5px" }}>
                          <button style={{fontSize:"15px"}} onClick={() => { getTicketDetail(billListChua?.id) }} class="btn btn-primary"
                            >Xem chi tiết
                          </button>
                          {
                            billListChua?.status ==="WAITING_PAYMENT" ? 
                            <a class="btn btn-warning"
                            href={`/payment/${billListChua?.id}/${billListChua.price}`}
                            role="button"
                            style={{fontSize:"15px"}}
                            >Thanh toán
                            </a> : null
                          }
                        </td>
                        <td>{billListChua?.id}</td>
                        {/* <td>{sticket?.schedule?.movie?.name}</td>
                        <td>{sticket?.schedule?.movie?.duration}min</td> */}
                        <td>
                          {new Date(billListChua?.createdTime).toLocaleDateString()},{" "}
                          {new Date(billListChua?.createdTime).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </td>
                        {/* <td> */}
                        {/* {sticket?.schedule?.room?.name},{" "}
                          {sticket?.schedule?.branch?.name} */}

                        {/* {sticket?.schedule?.branch?.address} */}
                        {/* </td> */}
                        {/* <td>{getIdSeat(sticket.seat)}</td> */}
                        {/* <td>{sticket?.seat?.name}</td> */}
                        <td>
                          {billListChua?.status === "WAITING_PAYMENT" ? "Chờ thanh toán" : ""}
                          {billListChua?.status === "SUCCESS" ? "Đã thanh toán" : ""}
                          {billListChua?.status === "EXPIRATION" ? "Hết hạn thanh toán" : ""}
                        </td>
                        <td>
                          {new Intl.NumberFormat("it-IT", {
                            style: "decimal",
                          }).format(billListChua?.price)}
                        </td>
                        {/* <td>
                          <img
                          // src={sticket?.qrImageURL}
                          style={{width:50, height:50}}
                          src="https://www.1check.vn/qrcodegen/qr.png"
                          alt="QR code"
                          >
                          </img>
                        </td> */}
                        {/* <td>
                          {new Intl.NumberFormat("it-IT", {
                            style: "decimal",
                          }).format(sticket?.schedule?.price)}
                        </td> */}
                      </tr>
                    ))
                      .reverse()}

                </tbody>
              </table>
            </div>
          </TabPanel>

          {/* Danh sách yêu thicc */}
          <TabPanel
            value={value}
            index={4}
            style={{ padding: isDesktop ? "0px 0px" : "0px 16px", backgroundColor: "white", borderRadius: "5px" }}
            isDesktop={isDesktop}
          >
            <div className="table-responsive"><div className="article-container">
              {savedArticle?.length > 0 && savedArticle.map(item => {
                return <>
                  <NavLink
                    className="items__text-link"
                    to={`/review/${item?.slug}`}
                  >
                    <div className="article-item">
                      <img className="article-img" src={item.mainImage} alt=""></img>
                      <div className="article-title">

                        {item.title || (
                          <SkeletonTheme color="#202020" highlightColor="#111111">
                            <h4>
                              <Skeleton count={3} duration={2} />
                            </h4>
                          </SkeletonTheme>
                        )}
                      </div>
                      <div className="article-icon">
                        <IconButton aria-label="comment" style={{ color: "red" }}
                          onClick={() => {
                            handleLikeClick2({ id: item.id });
                          }}
                        >
                          <BookIcon />
                        </IconButton>
                      </div>
                    </div>
                  </NavLink>
                </>
              }
              )}
            </div>
            </div>
          </TabPanel>

          {/* Danh sách bài đã viết */}
          <TabPanel
            value={value}
            index={3}
            style={{ padding: isDesktop ? "0px 0px" : "0px 16px", backgroundColor: "white", borderRadius: "5px" }}
            isDesktop={isDesktop}
          >
            <div className="table-responsive"><div className="article-container">
              {wroteArticle?.length > 0 && wroteArticle.map(item => {
                return <>
                  <NavLink
                    className="items__text-link"
                    to={item.status === "APPROVE" ? `/review/${item?.slug}` : "#"}
                  >
                    <div className="article-item">
                      <img className="article-img" src={item?.mainImage} alt=""></img>
                      <div className="article-title">

                        {item?.title || (
                          <SkeletonTheme color="#202020" highlightColor="#111111">
                            <h2>
                              <Skeleton count={3} duration={2} />
                            </h2>
                          </SkeletonTheme>
                        )}
                      </div>
                      <div className="article-icon" style={{backgroundColor:"rgba(255,255,255, 0.5)"}}>
                        {/* <IconButton aria-label="comment" style={{ color: "red" }}
                          onClick={() => {
                            handleLikeClick2({ id: item.id });
                          }}
                        >
                          <BookIcon />
                        </IconButton> */}
                    

                      <IconButton aria-label="duyet" style={{ color: "blue" }}>
                        {/* <GavelIcon /> */}
                        <Typography>
                          {item.status === "DELETE" ? "Đã bị xóa":""}
                          {item.status === "DENY" ? "Chưa được duyệt":""}
                          {item.status === "CREATE" ? "Chờ duyệt":""}
                          {item.status === "APPROVE" ? "Đã được duyệt":""}
                        </Typography>
                      </IconButton>

                      <IconButton aria-label="Xem (icon hình con mắt)" style={{ color: "black" }}>
                        <VisibilityIcon />
                        <Typography>{item.view}</Typography>
                      </IconButton>

                      <IconButton aria-label="add to favorites" style={{ color: "black" }}>
                        <FavoriteIcon />
                        <Typography>{item.totalLike}</Typography>
                      </IconButton>

                        <IconButton aria-label="comment" style={{ color: "black" }}>
                          <CommentIcon />
                          <Typography>{item.totalComment}</Typography>
                        </IconButton>
                      </div>
                    </div>
                  </NavLink>
                </>
              }
              )}
            </div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={3}>
            {/* <Formik
              initialValues={{
                // username: successInfoUser?.username ?? "",
                oldpassword: "",
                newpassword: "",
                // email: successInfoUser?.email ?? "",
                // soDt: successInfoUser?.soDT ?? "",
                // maNhom: "GP09",
                // maLoaiNguoiDung: "KhachHang",
                // name: successInfoUser?.name ?? "",
              }}
              enableReinitialize // cho phép cập nhật giá trị initialValues
              validationSchema={updateUserSchemaPassword}
              onSubmit={handleSubmitChangePass}
            >
              {(props) => (
                <Form className={`${classes.field}`}>
                  <div className={`form-group ${classes.password}`}  style={{"color":"white"}}>
                    <label>Mật khẩu cũ&nbsp;</label>
                    <ErrorMessage
                      name="oldpassword"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="oldpassword"
                      type={typePassword}
                      className="form-control"
                      onChange={props.handleChange}
                      // value={this.props.values.oldpassword}
                    />
                    <div
                      className={classes.eye}
                      onClick={handleToggleHidePassword}
                    >
                      {typePassword !== "password" ? (
                        <i className="fa fa-eye-slash" style={{"color":"black"}}></i>
                      ) : (
                        <i className="fa fa-eye" style={{"color":"black"}}></i>
                      )}
                    </div>
                  </div>
                  <div className={`form-group ${classes.password}`}  style={{"color":"white"}}>
                    <label>Mật khẩu mới&nbsp;</label>
                    <ErrorMessage
                      name="newpassword"
                      render={(msg) => (
                        <span className="text-danger">{msg}</span>
                      )}
                    />
                    <Field
                      name="newpassword"
                      type={typePassword2}
                      className="form-control"
                      onChange={props.handleChange}
                      // value={value.newpassword}
                    />
                    <div
                      className={classes.eye}
                      onClick={handleToggleHidePassword2}
                    >
                      {typePassword2 !== "password" ? (
                        <i className="fa fa-eye-slash" style={{"color":"black"}}></i>
                      ) : (
                        <i className="fa fa-eye" style={{"color":"black"}}></i>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disable={loadingUpdateUser.toString()}
                      // onClick={(e) => {handleChangePassword(value.oldpassword, value.newpassword)}}
                    >
                      Đổi
                    </button>
                    {errorUpdateUser && (
                      <div className="alert alert-danger">
                        <span>{errorUpdateUser}</span>
                      </div>
                    )}
                  </div>
                </Form>
              )}
            </Formik> */}
          </TabPanel>
        </div>
      </div >
      {loadingInfoUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            backgroundColor: "rgb(255 255 255 / 67%)",
            zIndex: 1000,
          }}
        >
          <CircularProgress style={{ margin: "auto" }} />
        </div>
      )
      }
      {/* <ShowtimeUser /> */}
    </div >
  );
}
