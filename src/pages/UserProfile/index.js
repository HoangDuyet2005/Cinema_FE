import { NavLink, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import NavigationIcon from "@material-ui/icons/Navigation";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LockIcon from "@material-ui/icons/Lock";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { FAKE_AVATAR } from "../../constants/config";
import {
  getInfoUser,
  putUserChangePass,
  putUserUpdate,
} from "../../reducers/actions/UsersManagement";
import { getComment } from "../../reducers/actions/MovieDetail";
import usersApi from "../../api/usersApi";
import reviewsApi from "../../api/billsApi";
import bookingApi from "../../api/bookingApi";
import { getAllTicket } from "../../reducers/actions/Ticket";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { getBillsChuaThanhToan, getBillsUserId } from "../../reducers/actions/Bill";
import eventsApi from "../../api/eventsApi";
import "./styles.scss";
import DetailPopup from "./PopUp/PopUp";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { Book as BookIcon } from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  userProfileWrapper: {
    backgroundColor: "#f4f6f8",
    minHeight: "85vh",
    paddingTop: 30,
    paddingBottom: 60,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    paddingLeft: 16,
    paddingRight: 16,
  },
  leftCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    padding: "28px 20px",
    textAlign: "center",
    marginBottom: 24,
  },
  avatarImg: {
    width: 140,
    height: 140,
    borderRadius: 8,
    objectFit: "cover",
    margin: "0 auto 16px",
    display: "block",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  userName: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#222",
    marginBottom: 6,
  },
  userRoleBadge: {
    display: "inline-block",
    padding: "4px 14px",
    fontSize: "12px",
    fontWeight: 600,
    borderRadius: 16,
    backgroundColor: "#e8f0fe",
    color: "#034ea2",
    marginBottom: 18,
  },
  btnChangeAvatar: {
    backgroundColor: "#f2f4f7",
    color: "#333",
    fontWeight: 600,
    fontSize: "13px",
    padding: "8px 18px",
    borderRadius: 20,
    border: "1px solid #e0e0e0",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-block",
    "&:hover": {
      backgroundColor: "#e87722",
      color: "#ffffff",
      borderColor: "#e87722",
    },
  },
  btnAdminNav: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#034ea2",
    color: "#ffffff",
    fontWeight: 600,
    borderRadius: 8,
    padding: "8px 16px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#023774",
    },
  },
  rightCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  tabsHeader: {
    borderBottom: "1px solid #edf0f2",
    backgroundColor: "#ffffff",
  },
  galaxyTabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: "#034ea2",
      height: 3,
      borderRadius: "3px 3px 0 0",
    },
  },
  galaxyTab: {
    textTransform: "none",
    fontSize: "15px",
    fontWeight: 600,
    color: "#666",
    minWidth: 100,
    padding: "16px 20px",
    "&.Mui-selected": {
      color: "#034ea2",
      fontWeight: 700,
    },
    "&:hover": {
      color: "#034ea2",
    },
  },
  tabPanelContent: {
    padding: "32px 28px",
    [theme.breakpoints.down("sm")]: {
      padding: "20px 16px",
    },
  },
  fieldLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#444",
    marginBottom: 8,
    display: "block",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    borderRadius: 8,
    border: "1px solid #e8ebed",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
    "&:focus-within": {
      borderColor: "#034ea2",
      backgroundColor: "#ffffff",
    },
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    color: "#888",
    fontSize: 20,
  },
  customInput: {
    width: "100%",
    height: 46,
    paddingLeft: 46,
    paddingRight: 14,
    fontSize: "14px",
    fontWeight: 500,
    color: "#222",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    borderRadius: 8,
    "&::placeholder": {
      color: "#aaa",
    },
  },
  disabledInput: {
    backgroundColor: "transparent",
    color: "#666",
    cursor: "not-allowed",
  },
  changePassLink: {
    position: "absolute",
    right: 14,
    color: "#e87722",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    color: "#888",
    cursor: "pointer",
    fontSize: 18,
    "&:hover": {
      color: "#333",
    },
  },
  btnSubmitGalaxy: {
    backgroundColor: "#f58020",
    backgroundImage: "linear-gradient(135deg, #f58020, #e87722)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "15px",
    padding: "10px 36px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(232, 119, 34, 0.3)",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundImage: "linear-gradient(135deg, #e87722, #d66512)",
      boxShadow: "0 6px 16px rgba(232, 119, 34, 0.4)",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  tableWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #eef0f2",
  },
  table: {
    marginBottom: 0,
    "& th": {
      backgroundColor: "#f8f9fa",
      color: "#333",
      fontWeight: 600,
      fontSize: "14px",
      padding: "12px 16px",
      borderBottom: "2px solid #edf0f2",
      whiteSpace: "nowrap",
    },
    "& td": {
      padding: "14px 16px",
      verticalAlign: "middle",
      fontSize: "14px",
      color: "#444",
      borderBottom: "1px solid #f2f4f7",
      whiteSpace: "nowrap",
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && (
        <Box>
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

export default function Index() {
  const history = useHistory();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.authReducer);
  const { successInfoUser, loadingInfoUser, loadingUpdateUser } = useSelector(
    (state) => state.usersManagementReducer
  );

  const effectiveUser =
    successInfoUser?.data ||
    successInfoUser ||
    currentUser?.data ||
    currentUser ||
    {};
  const { billListChuaTT } = useSelector((state) => state.billsManagementReducer);

  const [value, setValue] = React.useState(0);
  const [typePassword, settypePassword] = useState("password");
  const [typePassword2, settypePassword2] = useState("password");
  const [typePassword3, settypePassword3] = useState("password");
  const [image, setImage] = useState(effectiveUser?.image || "");
  const [previewImage, setPreviewImage] = useState(effectiveUser?.image || "");
  const [isUploading, setIsUploading] = useState(false);
  const [savedArticle, setSavedArticle] = useState([]);
  const [wroteArticle, setWroteArticle] = useState([]);
  const [ticketDetail, setTicketDetail] = useState({});
  const [toggle, setToggle] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handlePayBill = async (amount, billId) => {
    try {
      const res = await bookingApi.createPaymentUrl(amount, billId);
      if (res?.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Lỗi tạo link thanh toán:", err);
      Swal.fire("Lỗi", "Không thể tạo liên kết thanh toán VNPay", "error");
    }
  };
  const getTicketDetail = (id) => {
    reviewsApi.getBillByID(id).then((response) => {
      setTicketDetail(response.data);
      setToggle(true);
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLikeClick2 = ({ id }) => {
    eventsApi.addSaveArticle({ userId: effectiveUser?.id, articleId: id });
  };

  useEffect(() => {
    dispatch(getInfoUser());
    dispatch(getComment());
  }, [dispatch]);

  useEffect(() => {
    const userId = effectiveUser?.id;
    if (userId) {
      dispatch(getBillsChuaThanhToan(userId));
      dispatch(getAllTicket(userId));
      dispatch(getBillsUserId(userId));
      eventsApi.getAllSavedArticle(userId).then((res) => {
        setSavedArticle(res?.data?.data?.content || res?.data?.data || res?.data || []);
      }).catch((e) => console.log(e));
      eventsApi.getAll().then((res) => {
        setWroteArticle(res?.data?.data?.content || res?.data?.data || res?.data || []);
      }).catch((e) => console.log(e));
    }
  }, [dispatch, effectiveUser?.id]);

  useEffect(() => {
    if (effectiveUser?.image) {
      setImage(effectiveUser.image);
      setPreviewImage(effectiveUser.image);
    }
  }, [effectiveUser?.image]);

  useEffect(() => {
    if (successInfoUser?.data?.username) {
      usersApi.getChiTietTaiKhoan(successInfoUser.data.username)
        .then((response) => {
          if (response.data?.data?.image) {
            setImage(response.data.data.image);
            setPreviewImage(response.data.data.image);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [successInfoUser?.data?.username]);

  const submitImage = async (fileToUpload) => {
    const file = fileToUpload || image;
    if (!file || typeof file === "string") return file;
    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "hh37brtc");
    data.append("cloud_name", "dfb5p3kus");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dfb5p3kus/image/upload", {
        method: "post",
        body: data,
      });
      const dataJson = await res.json();
      if (dataJson.secure_url) {
        setImage(dataJson.secure_url);
        setPreviewImage(dataJson.secure_url);
        setIsUploading(false);
        Swal.fire({
          icon: "success",
          title: "Tải ảnh lên thành công!",
          timer: 1200,
          showConfirmButton: false,
        });
        return dataJson.secure_url;
      }
    } catch (err) {
      console.log(err);
    }
    setIsUploading(false);
    return null;
  };

  const handleClickOpen = () => {
    setPreviewImage(image || successInfoUser?.data?.image || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeAnh = async (targetImg) => {
    let finalUrl = targetImg || image;
    if (finalUrl && typeof finalUrl === "object") {
      finalUrl = await submitImage(finalUrl);
      if (!finalUrl) {
        Swal.fire({
          icon: "error",
          title: "Tải ảnh thất bại, vui lòng thử lại!",
        });
        return;
      }
    }
    const user = {
      username: successInfoUser?.data?.username ?? "",
      password: successInfoUser?.data?.password ?? "",
      email: successInfoUser?.data?.email ?? "",
      id: successInfoUser?.data?.id ?? "",
      name: successInfoUser?.data?.name ?? "",
      image: finalUrl ?? "",
    };
    dispatch(putUserUpdate(user));
    setOpen(false);
  };

  const updateUserSchema = yup.object().shape({
    name: yup.string().required("*Không được bỏ trống họ và tên!"),
  });

  const updateUserSchemaPassword = yup.object().shape({
    oldpassword: yup.string().required("*Mật khẩu không được bỏ trống!"),
    newpassword: yup.string().required("*Mật khẩu không được bỏ trống!"),
    renewpassword: yup.string().required("*Mật khẩu không được bỏ trống!"),
  });

  const handleSubmit = (user) => {
    if (loadingUpdateUser) return;
    dispatch(putUserUpdate(user));
  };

  const handleSubmitChangePass = (pass) => {
    if (loadingUpdateUser) return;
    if (pass.newpassword === pass.renewpassword) {
      dispatch(putUserChangePass(pass.newpassword, pass.oldpassword, history));
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Mật khẩu xác nhận không khớp!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleToggleHidePassword = () => {
    settypePassword(typePassword === "password" ? "text" : "password");
  };
  const handleToggleHidePassword2 = () => {
    settypePassword2(typePassword2 === "password" ? "text" : "password");
  };
  const handleToggleHidePassword3 = () => {
    settypePassword3(typePassword3 === "password" ? "text" : "password");
  };

  const roleStr = JSON.stringify(effectiveUser?.role || effectiveUser?.roles || "");
  const roleText = roleStr.includes("ROLE_ADMIN")
    ? "Quản trị viên"
    : roleStr.includes("ROLE_STAFF")
    ? "Nhân viên"
    : "Thành viên";

  return (
    <div className={classes.userProfileWrapper}>
      <div className={classes.container}>
        <div className="row">
          {/* Cột Trái: Avatar & Thao tác */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className={classes.leftCard}>
              <img
                src={
                  (typeof previewImage === "string" && previewImage) ||
                  (typeof image === "string" && image) ||
                  effectiveUser?.image ||
                  FAKE_AVATAR
                }
                className={classes.avatarImg}
                alt="avatar"
              />
              <div className={classes.userName}>
                {effectiveUser?.name || effectiveUser?.username || "Tài khoản"}
              </div>
              <div className={classes.userRoleBadge}>{roleText}</div>

              <div>
                <button
                  type="button"
                  className={classes.btnChangeAvatar}
                  onClick={handleClickOpen}
                >
                  Đổi ảnh đại diện
                </button>
              </div>

              {/* Điều hướng Admin / Staff / Trang viết bài */}
              {successInfoUser?.data?.role?.includes("ROLE_ADMIN") && (
                <button
                  type="button"
                  className={classes.btnAdminNav}
                  onClick={() => history.push("/admin/movies")}
                >
                  <NavigationIcon style={{ fontSize: 18 }} />
                  Đến trang Admin
                </button>
              )}
              {successInfoUser?.data?.role?.includes("ROLE_STAFF") && (
                <button
                  type="button"
                  className={classes.btnAdminNav}
                  onClick={() => history.push("/staff/movies")}
                >
                  <NavigationIcon style={{ fontSize: 18 }} />
                  Trang nhân viên
                </button>
              )}
              {successInfoUser?.data?.role === "[ROLE_USER]" && (
                <button
                  type="button"
                  className={classes.btnAdminNav}
                  style={{ backgroundColor: "#e87722" }}
                  onClick={() => history.push(`/reviewer/${successInfoUser?.data?.username}`)}
                >
                  <NavigationIcon style={{ fontSize: 18 }} />
                  Trang viết bài
                </button>
              )}
            </div>

            {/* Dialog Đổi Avatar */}
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Chọn ảnh đại diện của bạn"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImage(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                </DialogContentText>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <img
                    src={
                      (typeof previewImage === "string" && previewImage) ||
                      (typeof image === "string" && image) ||
                      FAKE_AVATAR
                    }
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 8,
                      objectFit: "cover",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                    alt="avatar preview"
                  />
                </div>
              </DialogContent>
              <DialogActions style={{ padding: "16px 24px" }}>
                <Button onClick={handleClose} color="inherit">Hủy bỏ</Button>
                <Button
                  onClick={() => handleChangeAnh(image)}
                  disabled={isUploading}
                  variant="contained"
                  style={{ backgroundColor: "#e87722", color: "#fff" }}
                >
                  {isUploading ? "Đang xử lý..." : "Đồng ý"}
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          {/* Cột Phải: Tabs & Form */}
          <div className="col-12 col-md-8 col-lg-9">
            <div className={classes.rightCard}>
              <div className={classes.tabsHeader}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  className={classes.galaxyTabs}
                  variant={isDesktop ? "standard" : "scrollable"}
                  scrollButtons="auto"
                >
                  <Tab label="Thông Tin Cá Nhân" className={classes.galaxyTab} />
                  <Tab label="Lịch Sử Giao Dịch" className={classes.galaxyTab} />
                  <Tab label="Đổi Mật Khẩu" className={classes.galaxyTab} />
                  <Tab label="Bài Viết Đã Viết" className={classes.galaxyTab} />
                  <Tab label="Bài Viết Đã Lưu" className={classes.galaxyTab} />
                </Tabs>
              </div>

              <div className={classes.tabPanelContent}>
                {/* TAB 0: THÔNG TIN CÁ NHÂN (BỐ CỤC 2 CỘT GALAXY) */}
                <TabPanel value={value} index={0}>
                  <Formik
                    initialValues={{
                      username: effectiveUser?.username || "",
                      password: effectiveUser?.password || "",
                      email: effectiveUser?.email || "",
                      id: effectiveUser?.id || "",
                      name: effectiveUser?.name || effectiveUser?.username || "",
                      image: effectiveUser?.image || "",
                    }}
                    enableReinitialize
                    validationSchema={updateUserSchema}
                    onSubmit={handleSubmit}
                  >
                    {() => (
                      <Form>
                        <div className="row">
                          <div className="col-12 col-md-6 mb-4">
                            <label className={classes.fieldLabel}>Họ và tên</label>
                            <div className={classes.inputWrapper}>
                              <PersonIcon className={classes.inputIcon} />
                              <Field
                                name="name"
                                type="text"
                                className={classes.customInput}
                                placeholder="Nhập họ và tên"
                              />
                            </div>
                            <ErrorMessage
                              name="name"
                              render={(msg) => <small className="text-danger mt-1 d-block">{msg}</small>}
                            />
                          </div>

                          <div className="col-12 col-md-6 mb-4">
                            <label className={classes.fieldLabel}>Tên tài khoản</label>
                            <div className={classes.inputWrapper}>
                              <AccountCircleIcon className={classes.inputIcon} />
                              <Field
                                disabled
                                name="username"
                                type="text"
                                className={clsx(classes.customInput, classes.disabledInput)}
                              />
                            </div>
                          </div>

                          <div className="col-12 col-md-6 mb-4">
                            <label className={classes.fieldLabel}>Email</label>
                            <div className={classes.inputWrapper}>
                              <EmailIcon className={classes.inputIcon} />
                              <Field
                                disabled
                                name="email"
                                type="email"
                                className={clsx(classes.customInput, classes.disabledInput)}
                              />
                            </div>
                          </div>

                          <div className="col-12 col-md-6 mb-4">
                            <label className={classes.fieldLabel}>Mật khẩu</label>
                            <div className={classes.inputWrapper}>
                              <LockIcon className={classes.inputIcon} />
                              <input
                                type="password"
                                disabled
                                value="••••••••••••"
                                className={clsx(classes.customInput, classes.disabledInput)}
                              />
                              <span
                                className={classes.changePassLink}
                                onClick={() => setValue(2)}
                              >
                                Thay đổi
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right mt-2">
                          <button
                            type="submit"
                            className={classes.btnSubmitGalaxy}
                            disabled={loadingUpdateUser}
                          >
                            {loadingUpdateUser ? "Đang lưu..." : "Cập nhật"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </TabPanel>

                {/* TAB 1: LỊCH SỬ GIAO DỊCH */}
                <TabPanel value={value} index={1}>
                  <Dialog
                    open={toggle}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setToggle(false)}
                    maxWidth="md"
                    fullWidth
                  >
                    <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", padding: "14px 20px" }}>
                      <span style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b" }}>
                        Chi tiết vé xem phim #{ticketDetail?.data?.id || ticketDetail?.id || ""}
                      </span>
                      <Button
                        size="small"
                        onClick={() => setToggle(false)}
                        style={{ minWidth: "36px", color: "#64748b", fontSize: "16px" }}
                      >
                        ✕
                      </Button>
                    </DialogTitle>
                    <DialogContent style={{ padding: "10px 16px" }}>
                      <DetailPopup ThongTin={ticketDetail} />
                    </DialogContent>
                    <DialogActions style={{ padding: "12px 20px", borderTop: "1px solid #e2e8f0" }}>
                      <Button
                        onClick={() => setToggle(false)}
                        variant="contained"
                        style={{ backgroundColor: "#f26b38", color: "#fff", textTransform: "none", fontWeight: 600 }}
                      >
                        Đóng
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <div className={classes.tableWrapper}>
                    <div className="table-responsive">
                      <table className={clsx("table", classes.table)}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Thao tác</th>
                            <th>Mã thanh toán</th>
                            <th>Đặt lúc</th>
                            <th>Trạng thái</th>
                            <th>Số tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billListChuaTT && billListChuaTT.filter(b => b?.status === 'SUCCESS').length > 0 ? (
                            billListChuaTT.filter(b => b?.status === 'SUCCESS').map((bill, i) => (
                              <tr key={bill?.id || i}>
                                <td>{i + 1}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary mr-2"
                                    onClick={() => getTicketDetail(bill?.id)}
                                  >
                                    Xem chi tiết
                                  </button>

                                </td>
                                <td><strong>#{bill?.id}</strong></td>
                                <td>
                                  {new Date(bill?.createdTime).toLocaleDateString()},{" "}
                                  {new Date(bill?.createdTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                </td>
                                <td>
                                  {bill?.status === "WAITING_PAYMENT" && <span className="badge badge-secondary">Chưa hoàn tất</span>}
                                  {bill?.status === "SUCCESS" && <span className="badge badge-success">Đã thanh toán</span>}
                                  {bill?.status === "EXPIRATION" && <span className="badge badge-danger">Hết hạn</span>}
                                </td>
                                <td><strong>{new Intl.NumberFormat("vi-VN", { style: "decimal" }).format(bill?.price)} đ</strong></td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-4 text-muted">
                                Chưa có giao dịch nào
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabPanel>

                {/* TAB 2: ĐỔI MẬT KHẨU */}
                <TabPanel value={value} index={2}>
                  <Formik
                    initialValues={{
                      oldpassword: "",
                      newpassword: "",
                      renewpassword: "",
                    }}
                    enableReinitialize
                    validationSchema={updateUserSchemaPassword}
                    onSubmit={handleSubmitChangePass}
                  >
                    {() => (
                      <Form style={{ maxWidth: 600, margin: "0 auto" }}>
                        <div className="mb-4">
                          <label className={classes.fieldLabel}>Mật khẩu cũ</label>
                          <div className={classes.inputWrapper}>
                            <LockIcon className={classes.inputIcon} />
                            <Field
                              name="oldpassword"
                              type={typePassword}
                              className={classes.customInput}
                              placeholder="Nhập mật khẩu hiện tại"
                            />
                            <i
                              className={clsx(typePassword === "password" ? "fa fa-eye" : "fa fa-eye-slash", classes.eyeIcon)}
                              onClick={handleToggleHidePassword}
                            />
                          </div>
                          <ErrorMessage
                            name="oldpassword"
                            render={(msg) => <small className="text-danger mt-1 d-block">{msg}</small>}
                          />
                        </div>

                        <div className="mb-4">
                          <label className={classes.fieldLabel}>Mật khẩu mới</label>
                          <div className={classes.inputWrapper}>
                            <LockIcon className={classes.inputIcon} />
                            <Field
                              name="newpassword"
                              type={typePassword2}
                              className={classes.customInput}
                              placeholder="Nhập mật khẩu mới"
                            />
                            <i
                              className={clsx(typePassword2 === "password" ? "fa fa-eye" : "fa fa-eye-slash", classes.eyeIcon)}
                              onClick={handleToggleHidePassword2}
                            />
                          </div>
                          <ErrorMessage
                            name="newpassword"
                            render={(msg) => <small className="text-danger mt-1 d-block">{msg}</small>}
                          />
                        </div>

                        <div className="mb-4">
                          <label className={classes.fieldLabel}>Xác nhận mật khẩu mới</label>
                          <div className={classes.inputWrapper}>
                            <LockIcon className={classes.inputIcon} />
                            <Field
                              name="renewpassword"
                              type={typePassword3}
                              className={classes.customInput}
                              placeholder="Nhập lại mật khẩu mới"
                            />
                            <i
                              className={clsx(typePassword3 === "password" ? "fa fa-eye" : "fa fa-eye-slash", classes.eyeIcon)}
                              onClick={handleToggleHidePassword3}
                            />
                          </div>
                          <ErrorMessage
                            name="renewpassword"
                            render={(msg) => <small className="text-danger mt-1 d-block">{msg}</small>}
                          />
                        </div>

                        <div className="text-center mt-4">
                          <button
                            type="submit"
                            className={classes.btnSubmitGalaxy}
                            disabled={loadingUpdateUser}
                          >
                            {loadingUpdateUser ? "Đang xử lý..." : "Đổi mật khẩu"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </TabPanel>

                {/* TAB 3: BÀI VIẾT ĐÃ VIẾT */}
                <TabPanel value={value} index={3}>
                  <div className="article-container">
                    {wroteArticle && wroteArticle.length > 0 ? (
                      wroteArticle.map((item) => (
                        <NavLink
                          key={item.id}
                          className="items__text-link"
                          to={item.status === "APPROVE" ? `/review/${item?.slug || item?.id}` : "#"}
                        >
                          <div className="article-item">
                            <img
                              className="article-img"
                              src={item?.mainImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"}
                              alt={item?.title}
                            />
                            <div className="article-title">
                              <h4>{item?.title}</h4>
                            </div>
                            <div className="article-icon">
                              <span style={{ fontSize: 12, fontWeight: 600, color: item.status === "APPROVE" ? "#28a745" : "#ffc107" }}>
                                {item.status === "APPROVE" ? "Đã duyệt" : item.status === "CREATE" ? "Chờ duyệt" : item.status === "DENY" ? "Từ chối" : "Đã xóa"}
                              </span>
                            </div>
                          </div>
                        </NavLink>
                      ))
                    ) : (
                      <p className="text-muted text-center py-4 w-100">Chưa có bài viết nào.</p>
                    )}
                  </div>
                </TabPanel>

                {/* TAB 4: BÀI VIẾT ĐÃ LƯU */}
                <TabPanel value={value} index={4}>
                  <div className="article-container">
                    {savedArticle && savedArticle.length > 0 ? (
                      savedArticle.map((item) => (
                        <NavLink
                          key={item.id}
                          className="items__text-link"
                          to={`/review/${item?.slug || item?.id}`}
                        >
                          <div className="article-item">
                            <img
                              className="article-img"
                              src={item?.mainImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800"}
                              alt={item?.title}
                            />
                            <div className="article-title">
                              <h4>{item?.title}</h4>
                            </div>
                            <div className="article-icon">
                              <IconButton
                                size="small"
                                style={{ color: "#e50914" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLikeClick2({ id: item.id });
                                }}
                              >
                                <BookIcon fontSize="small" />
                              </IconButton>
                            </div>
                          </div>
                        </NavLink>
                      ))
                    ) : (
                      <p className="text-muted text-center py-4 w-100">Chưa có bài viết nào được lưu.</p>
                    )}
                  </div>
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loadingInfoUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: "flex",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1000,
          }}
        >
          <CircularProgress style={{ margin: "auto", color: "#e87722" }} />
        </div>
      )}
    </div>
  );
}