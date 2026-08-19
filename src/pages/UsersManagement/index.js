import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";

import { DataGrid, GridOverlay, GridToolbar } from "@material-ui/data-grid";
import { nanoid } from "nanoid";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useSnackbar } from "notistack";
import ButtonDelete from "./ButtonDelete";
import CachedIcon from "@material-ui/icons/Cached";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import EditIcon from "@material-ui/icons/Edit";
import slugify from "slugify";

import useStyles from "./styles";
import {
  deleteUser,
  getUsersList,
  resetUserList,
  putUserUpdate,
  postAddUser,
  setStatusIsExistUserModified,
  postAddStaff,
} from "../../reducers/actions/UsersManagement";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Swal from "sweetalert2";
import renderCellExpand from "../UsersManagement/RenderCellExpand";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function UsersManagement() {
  const [editRowsModel, setEditRowsModel] = useState({});
  const classes = useStyles();
  const [usersListDisplay, setUsersListDisplay] = useState([]);
  const  {enqueueSnackbar}  = useSnackbar();
  const [selectionModel, setSelectionModel] = useState([]);
  const [userListDelete, setUserListDelete] = useState({
    triggerDelete: false,
    userListDelete: [],
    cancel: false,
  });
  const [userListmodified, setUserListmodified] = useState({
    triggerUpdate: false,
    userListmodified: [],
    cancel: false,
  });
  const {
    usersList,
    loadingUsersList,
    errorUsersList,
    successDelete,
    errorDelete,
    loadingDelete,
    successUpdateUser,
    errorUpdateUser,
    loadingAddUser,
    successAddUser,
    errorAddUser,
  } = useSelector((state) => state.usersManagementReducer);
  console.log("usersList:", usersList);
  const dispatch = useDispatch();
  const [btnReFresh, setBtnReFresh] = useState("");
  const [sortBy, setsortBy] = useState({ field: "role", sort: "asc" });
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  const [addUser, setaddUser] = useState({
    data: [
      {
        id: "",
        username: "",
        email: "",
        name: "",
        image: "",
        role: "",
        followers: "",
        contentCreator: "",
        createdAt:"",
        updatedAt:"",
      },
    ],
    toggle: false,
    readyAdd: false,
    isFilledIn: false,
  });

  useEffect(() => {
    // get list user lần đầu
    if (!usersList) {
      dispatch(getUsersList());
    }
    return () => dispatch(resetUserList());
  }, []);
  useEffect(() => {
    // xóa hoặc update thành công thì refresh list user
    if (successDelete || successUpdateUser || btnReFresh || successAddUser) {
      dispatch(getUsersList());
    }
  }, [successDelete, successUpdateUser, btnReFresh, successAddUser]);


  useEffect(() => {
    if (userListmodified.userListmodified.length || addUser.isFilledIn) {
      dispatch(setStatusIsExistUserModified(true));
    } else {
      dispatch(setStatusIsExistUserModified(false));
    }
  }, [userListmodified.userListmodified, addUser.isFilledIn]);


// console.log("userListmodified", userListmodified);
  useEffect(() => {
    // dispatch(getUsersList()) thành công thì thêm props vào item để hiển thị theo yêu cầu DataGrid
    if (usersList?.data?.length) {
      let newUsersListDisplay;
      if (userListmodified.userListmodified.length) {
        // nếu nhấn cancel và vẫn còn một số user chưa update thì giữ lại data dang chỉnh sửa
        const userListmodifiedRest = userListmodified.userListmodified;
        newUsersListDisplay = usersList?.data?.map(function (userNew) {
          let userModified = this.find(
            (user) => user.role === userNew.role
          );
          if (userModified) {
            userModified = { ...userModified };
            // delete userModified.maNhom;
            return {
              ...userModified,
              id: userModified.id,
              xoa: "",
              role:
                userModified.role === "ROLE_STAFF" ? true : false,
              ismodify: true,
            };
          }
          return {
            ...userNew,
            xoa: "",
            id: userNew.id,
            role:
              userNew.role === "ROLE_STAFF" ? true : false,
            ismodify: false,
          };
        }, userListmodifiedRest);
      } else {
        newUsersListDisplay = usersList?.data?.map((user, i) => ({
          ...user,
          xoa: "",
          id: user.id,
          image: user.image,
          role: user.role === "ROLE_STAFF" ? true : false,
          ismodify: false,
        })); // id là prop bắt buộc
      }
      setUsersListDisplay(newUsersListDisplay);
    }
  }, [usersList]);

  useEffect(() => {
    // deleteUser xong thì thông báo
    if (userListDelete.cancel) {
      return;
    }
    if (successDelete) {
      setUserListDelete((data) => ({ ...data, triggerDelete: nanoid(6) })); // kích hoạt xóa tiếp user tiếp theo
      enqueueSnackbar(successDelete, { variant: "success" });
      return;
    }
    if (errorDelete) {
      setUserListDelete((data) => ({ ...data, triggerDelete: nanoid(6) }));
      enqueueSnackbar(errorDelete, { variant: "error" });
    }
  }, [successDelete, errorDelete]);

  useEffect(() => {
    // update user xong thì thông báo
    if (userListmodified.cancel) {
      return;
    }
    if (successUpdateUser) {
      setUserListmodified((data) => ({ ...data, triggerUpdate: nanoid(6) }));
      // enqueueSnackbar("Update successfully!", { variant: "success" });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Update Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    }
    if (errorUpdateUser) {
      setUserListmodified((data) => ({ ...data, triggerUpdate: nanoid(6) }));
      // enqueueSnackbar(errorUpdateUser, { variant: "error" });
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Update Error",
        showConfirmButton: false,
        timer: 1500,
      });

    }
  }, [successUpdateUser, errorUpdateUser]);

  useEffect(() => {
    // add user xong thì thông báo
    if (successAddUser) {
      enqueueSnackbar(
        `Successfully!`,
        { variant: "success" }
      );
      // Swal.fire({
      //   position: "center",
      //   icon: "success",
      //   title: "Add User Successfully",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });

    }
    if (errorAddUser) {
      enqueueSnackbar(errorAddUser, { variant: "error" });
        // Swal.fire({
        //   position: "center",
        //   icon: "error",
        //   title: "Add User Error",
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
    }
    setaddUser({
      data: [
        {
          id: "",
          username: "",
          email: "",
          name: "",
          image: "",
          role: "",        
          contentCreator: "",   
          createdAt:"",
          updatedAt:"",
        },
      ],
      toggle: false,
      readyAdd: false,
      isFilledIn: false,
    });
  }, [successAddUser, errorAddUser]);

  useEffect(() => {
    // ý tưởng là tiến hành delete từng user trong danh sách mỗi khi hoàn thành call api cho đến khi hết user trong danh dách
    if (userListDelete.userListDelete.length) {
      // nếu mảng còn phần tử
      let newUserListDelete = [...userListDelete.userListDelete]; // copy
      const userDelete = newUserListDelete.shift(); // cắt ra, và xóa luôn phần tử đầu trong mảng
      setUserListDelete((data) => ({
        ...data,
        userListDelete: newUserListDelete,
      })); // set array
      setSelectionModel(() => newUserListDelete);
      dispatch(deleteUser(userDelete)); // delete
      return;
    }
    if (userListDelete.userListDelete.length === 0) {
      // nếu mảng hết phần tử
      setUserListDelete({
        triggerDelete: false,
        userListDelete: [],
        cancel: false,
      });
      dispatch(resetUserList());
      setSelectionModel([]);
    }
  }, [userListDelete.triggerDelete]); // chỉ khi được kích hoạt thì mới thực hiện xóa tiếp user, nếu dùng chung successDelete, errorDelete làm trigger có thể lỗi do kết quả của useEffect trên phụ thuộc vào successDelete, errorDelete

  useEffect(() => {
    if (userListmodified?.userListmodified?.length) {
      let newUserListmodified = [...userListmodified.userListmodified];

      const userUpdate = newUserListmodified.shift();

      setUserListmodified((data) => ({
        ...data,
        userListmodified: newUserListmodified,
      }));
      const dataTruyen = {
        id : userUpdate.id, 
        image: "", 
        name: userUpdate.name,
        updatedAt: new Date()
      }
      dispatch(putUserUpdate(dataTruyen));
      return;
    }
    if (userListmodified.userListmodified.length === 0) {
      setUserListmodified({
        triggerUpdate: false,
        userListmodified: [],
        cancel: false,
      });
      dispatch(resetUserList());
    }
  }, [userListmodified.triggerUpdate]);

  const handleEditCellChange = useCallback(
    ({ id, field, props }) => {
      if (field === "email") {
        const data = props; // Fix eslint value is missing in prop-types for JS files
        const isValid = validateEmail(data.value);
        const newState = {};
        newState[id] = {
          ...editRowsModel[id],
          email: { ...props, error: !isValid },
        };
        setEditRowsModel((state) => ({ ...state, ...newState }));
        if (!validateEmail(props.value)) {
          // nếu email sai thì thoát không lưu
          return;
        }
      }
      if (addUser.toggle) {
        setaddUser((data) => ({
          ...data,
          data: [{ ...data.data[0], [field]: props.value }],
        }));
      }
    },
    [editRowsModel, addUser.toggle]
  );

  // handleEditCellChangeCommitted thực thi mỗi khi cell change được commit(không lỗi validation)
  // so sánh với giá trị trước khi chỉnh sửa, nếu khác biệt thì thêm user vào danh sách chuẩn bị update, nếu không khác biệt thì xóa khỏi danh sách hoặc không làm gì
  const handleEditCellChangeCommitted = useCallback(
    ({ id, field, props: { value } }) => {
      if (addUser.toggle) {
        const isFilledIn =
          addUser.data[0].username !== "" ||
          // addUser.data[0].createdAt !== "" ||
          addUser.data[0].name !== "" ||
          addUser.data[0].email !== "" 
          // addUser.data[0].soDt !== "" ||
          // addUser.data[0].role === true;
        const readyAdd =
          addUser.data[0].username !== "" &&
          // addUser.data[0].createdAt !== "" &&
          addUser.data[0].name !== "" &&
          addUser.data[0].email !== "" 
          // addUser.data[0].role === true;
          // addUser.data[0].soDt !== "";
        setaddUser((data) => ({ ...data, readyAdd, isFilledIn }));
        console.log(addUser);
        return; // không thực hiệc các việc bên dưới nếu đang ở màn hình addUser
      }
      const userOriginal = usersList?.data?.find((user) => user.id === id); // lấy ra phần tử chưa được chỉnh sửa
      const valueDisplay = value;
      let valueModified = value;
      if (field === "ROLE_USER") {
        valueModified = value ? "ROLE_ADMIN" : "ROLE_USER";
      }
      const isChange = userOriginal[field] === valueModified ? false : true; // liệu có thay đổi
      const indexUserExist = userListmodified.userListmodified.findIndex(
        (user) => user.id === id
      ); // user vừa chỉnh có được lưu trước đó?
      if (isChange) {
        // nếu có khác biệt
        // xử lý hiển thị: set row đã modify, set lại value mới
        const updatedUsersListDisplay = usersListDisplay.map((row) => {
          if (row.id === id) {
            return { ...row, ismodify: true, [field]: valueDisplay };
          }
          return row;
        });
        setUsersListDisplay(updatedUsersListDisplay);
        // xử lý userListmodified
        if (indexUserExist !== -1) {
          // nếu đã tồn tại user modify
          const newUserListmodified = userListmodified.userListmodified.map(
            (user) => {
              // sửa lại phần khác biệt
              if (user.id === id) {
                return { ...user, [field]: valueModified };
              }
              return user;
            }
          );
          setUserListmodified((data) => ({
            ...data,
            userListmodified: newUserListmodified,
          }));
          return;
        }
        setUserListmodified((data) => ({
          ...data,
          userListmodified: [
            ...userListmodified.userListmodified,
            { ...userOriginal, [field]: valueModified },
          ],
        })); // nếu chưa tồn tại thì push vào
        return;
      }
      if (indexUserExist !== -1) {
        // nếu không khác biệt và có trong danh sách modify
        let userModified = userListmodified.userListmodified[indexUserExist];
        userModified = { ...userModified, [field]: valueModified };
        // const isMatKhauChange = userModified.createdAt !== userOriginal.createdAt;
        const isEmailChange = userModified.email !== userOriginal.email;
        // const isSoDtChange = userModified.soDt !== userOriginal.soDt;
        const isMaLoaiNguoiDungChange =
          userModified.role !== userOriginal.role;
        const isHoTenChange = userModified.name !== userOriginal.name;
        const ismodify =
          // isMatKhauChange ||
          isEmailChange ||
          // isSoDtChange ||
          isMaLoaiNguoiDungChange ||
          isHoTenChange;
        // xử lý display
        const updatedUsersListDisplay = usersListDisplay.map((row) => {
          if (row.id === id) {//.taiKhoan
            return { ...row, ismodify, [field]: valueDisplay };
          }
          return row;
        });
        setUsersListDisplay(updatedUsersListDisplay);

        // nếu ismodify = true thì cập nhật userListmodified
        if (ismodify) {
          const newUserListmodified = userListmodified.userListmodified.map(
            (user) => {
              if (user.id === id) {//.taiKhoan
                return { ...userModified };
              }
              return user;
            }
          );
          setUserListmodified((data) => ({
            ...data,
            userListmodified: newUserListmodified,
          }));
          return;
        }
        // nếu ismodify = false thì xóa user khỏi userListmodified
        const newUserListmodified = userListmodified.userListmodified.filter(
          (user) => user.id !== id
        ); // xóa ra khỏi mảng
        setUserListmodified((data) => ({
          ...data,
          userListmodified: newUserListmodified,
        }));
      }
    },
    [usersListDisplay, usersList, userListmodified, addUser]
  );

  const handleRefreshUserListResetChanged = () => {
    setUserListmodified({
      triggerUpdate: false,
      userListmodified: [],
      cancel: false,
    });
    setBtnReFresh(nanoid(6));
  };

  // xóa một user
  const handleDeleteOne = (taiKhoan) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        if (loadingDelete) {
          // nếu click xóa liên tục một user
          console.log("Xoa lien tuc");
          return;
        }
        console.log("taiKhoan: ", taiKhoan);
        dispatch(deleteUser(taiKhoan));

        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your user is safe :)',
          'error'
        )
      }
    })

  };
  // xóa nhiều user
  const handleDeleteMultiple = () => {
    if (userListDelete.triggerDelete !== false) {
      setUserListDelete((data) => ({
        ...data,
        cancel: true,
        triggerDelete: false,
      }));
      return;
    }
    setUserListDelete((data) => ({
      ...data,
      triggerDelete: nanoid(6),
      cancel: false,
    }));
  };
  // update nhiều user
  const handleUpdateMultiple = () => {
    if (userListmodified.triggerUpdate !== false) {
      setUserListmodified((data) => ({
        ...data,
        cancel: true,
        triggerUpdate: false,
      }));
      return;
    }
    setUserListmodified((data) => ({
      ...data,
      triggerUpdate: nanoid(6),
      cancel: false,
    }));
  };

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  const handleToggleAddNhanVien = () => {
    if (!addUser.isFilledIn) {
      // nếu chưa điền thì toggle
      setaddUser((data) => ({ ...data, toggle: !addUser.toggle }));
      return;
    }
    if (addUser.readyAdd && !loadingAddUser) {
      // nếu đã điền và đã sãn sàng
      const userAdd = { ...addUser.data[0] };
      console.log(addUser);
      delete userAdd.id;
      const dataAdd = {
        name: userAdd.name,
        email: userAdd.email,
        username:userAdd.username,
        password:"123456"
      }
      dispatch(postAddStaff(dataAdd)); 
    }
  };


  const handleToggleAddUser = () => {
    if (!addUser.isFilledIn) {
      // nếu chưa điền thì toggle
      setaddUser((data) => ({ ...data, toggle: !addUser.toggle }));
      return;
    }
    if (addUser.readyAdd && !loadingAddUser) {
      // nếu đã điền và đã sãn sàng
      const userAdd = { ...addUser.data[0] };
      console.log(addUser);
      delete userAdd.id;
      const dataAdd = {
        name: userAdd.name,
        email: userAdd.email,
        username:userAdd.username,
        password:"123456"
      }
      dispatch(postAddUser(dataAdd));
    }
  };

  const onFilter = () => {
    const searchUsersListDisplay = usersListDisplay.filter((user) => {
      const matchTaiKhoan =
        slugify(user.username ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      // const matchMatKhau =
      //   slugify(user.createdAt ?? "", modifySlugify)?.indexOf(
      //     slugify(valueSearch, modifySlugify)
      //   ) !== -1;
      const matchEmail =
        slugify(user.email ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      // const matchSoDt =
      //   slugify(user.soDt ?? "", modifySlugify)?.indexOf(
      //     slugify(valueSearch, modifySlugify)
      //   ) !== -1;
      const matchHoTen =
        slugify(user.name ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return (
        // matchTaiKhoan || matchMatKhau || matchEmail || matchHoTen
        matchTaiKhoan || matchEmail || matchHoTen
      );
    });
    return searchUsersListDisplay;
  };

  const sortModel = useMemo(() => {
    return [
      {
        field: sortBy.field,
        sort: sortBy.sort,
      },
    ];
  }, [sortBy]);

  const columns = useMemo(
    () =>
      // cột tài khoản không được chỉnh sửa, backend dùng "taiKhoan" để định danh user
      [
        {
          field: "id",
          headerName: "Xóa",
          width: 100,
          renderCell: (params) => (
            <ButtonDelete
              onDeleted={handleDeleteOne}
              taiKhoan={params.row.id}
            />
          ),
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
          hide: addUser.toggle,
        },
        {
          field: "username",
          headerName: "Tên tài khoản",
          width: 180,
          editable: addUser.toggle,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "image",
          headerName: "Ảnh",
          width: 130,
          // renderCell: (params) => (
          //   <Tooltip title={params.row.image}>
          //     <img
          //       style={{
          //         maxWidth: "100%",
          //         height: "100%",
          //         borderRadius: 4,
          //         marginRight: 15,
          //       }}
          //       src={params.row.image}
          //     />
          //   </Tooltip>
          // ),
          renderCell: (params) => renderCellExpand(params),
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
        },
        // {
        //   field: "createdAt",
        //   headerName: "Create At",
        //   width: 300,
        //   editable: true,
        //   headerAlign: "center",
        //   align: "left",
        //   headerClassName: "custom-header",
        // },
        {
          field: "name",
          headerName: "Họ và tên",
          width: 250,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "email",
          headerName: "Email",
          width: 300,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
        },
        {
          field: "followers",
          headerName: "Followers",
          width: 200,
          editable: true,
          headerAlign: "center",
          align: "left",
          headerClassName: "custom-header",
          hide: true,

        },
        // {
        //   field: "soDt",
        //   headerName: "Số điện thoại",
        //   width: 200,
        //   editable: true,
        //   type: "number",
        //   headerAlign: "center",
        //   align: "left",
        //   headerClassName: "custom-header",
        // },
        {
          field: "role",
          headerName: "Nhân viên",
          width: 145,
          editable: true,
          type: "boolean",
          headerAlign: "center",
          align: "center",
          headerClassName: "custom-header",
        },
        // {
        //   field: "contentCreator",
        //   headerName: "Content Creator",
        //   width: 145,
        //   editable: true,
        //   type: "boolean",
        //   headerAlign: "center",
        //   align: "center",
        //   headerClassName: "custom-header",
        // },
        {
          field: "ismodify",
          width: 0,
          type: "boolean",
          headerClassName: "custom-header",
          hide: true,
        },
      ],
    [addUser.toggle]
  );

  const modifySlugify = { lower: true, locale: "vi" };

  if (errorUsersList) {
    return <h1>{errorUsersList}</h1>;
  }

  return (
    <div style={{ height: "77vh", width: "100%"}}>
      <div className="container-fluid pb-3">
        <div className="row">
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="secondary"
              disabled={userListDelete.userListDelete.length ? false : true}
              className={classes.button}
              startIcon={
                userListDelete.triggerDelete === false ? (
                  <DeleteIcon />
                ) : (
                  <CircularProgress size={20} color="inherit" />
                )
              }
              onClick={handleDeleteMultiple}
            >
              {userListDelete.triggerDelete === false ? "delete" : "don't delete"}{" "}
              {userListDelete.userListDelete.length} user
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              disabled={userListmodified.userListmodified.length ? false : true}
              className={classes.button}
              onClick={handleUpdateMultiple}
              startIcon={
                userListmodified.triggerUpdate === false ? (
                  <CloudUploadIcon />
                ) : (
                  <CircularProgress size={20} color="inherit" />
                )
              }
            >
              {userListmodified.triggerUpdate === false
                ? "update"
                : "cancel"}{" "}
              {userListmodified.userListmodified.length} user
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              className={`${classes.addUser} ${classes.button}`}
              onClick={handleToggleAddNhanVien}
              disabled={
                addUser.toggle
                  ? addUser.isFilledIn
                    ? addUser.readyAdd
                      ? false
                      : true
                    : false
                  : false
              }
              startIcon={
                addUser.toggle ? (
                  addUser.isFilledIn ? (
                    <PersonAddIcon />
                  ) : (
                    <EditIcon />
                  )
                ) : (
                  <PersonAddIcon />
                )
              }
            >
              {addUser.toggle
                ? addUser.isFilledIn
                  ? "THÊM NHÂN VIÊN"
                  : "QUẢN LÝ NGƯỜI DÙNG"
                : "THÊM NHÂN VIÊN"}
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              className={`${classes.addUser} ${classes.button}`}
              onClick={handleToggleAddUser}
              disabled={
                addUser.toggle
                  ? addUser.isFilledIn
                    ? addUser.readyAdd
                      ? false
                      : true
                    : false
                  : false
              }
              startIcon={
                addUser.toggle ? (
                  addUser.isFilledIn ? (
                    <PersonAddIcon />
                  ) : (
                    <EditIcon />
                  )
                ) : (
                  <PersonAddIcon />
                )
              }
            >
              {addUser.toggle
                ? addUser.isFilledIn
                  ? "THÊM KHÁCH HÀNG"
                  : "QUẢN LÝ NGƯỜI DÙNG"
                : "THÊM KHÁCH HÀNG"}
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              // className={`${classes.userKhachHang} ${classes.button}`}
              className={classes.button}
              onClick={() =>
                setsortBy({ field: "role", sort: "asc" })
              }
            >
              tài khoản người dùng
            </Button>
          </div>
          {/* <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              className={`${classes.userModified} ${classes.button}`}
              onClick={() => setsortBy({ field: "ismodify", sort: "desc" })}
            >
              Modified Users
            </Button>
          </div> */}
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleRefreshUserListResetChanged}
              startIcon={<CachedIcon />}
            >
              Refresh
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <Button
              variant="contained"
              // className={`${classes.userQuanTri} ${classes.button}`}
              color="primary"
              className={classes.button}
              onClick={() =>
                setsortBy({ field: "role", sort: "desc" })
              }
            >
              TÀI KHOẢN NHÂN VIÊN
            </Button>
          </div>
          <div className="col-12 pt-3 col-sm-6 col-md-4 col-lg-3">
            <div className={`${classes.search} ${classes.button}`}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={(evt) => handleInputSearchChange(evt.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <DataGrid
        className={classes.rootDataGrid}
        rows={addUser.toggle ? addUser.data : onFilter()}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[25, 50, 100]}
        // css màu cho tài khoản QuanTri hoặc KhachHang: thay đổi tên class row dựa trên giá trị prop riêng biệt của row
        // getRowClassName={(params) => {
        //   return `isStaff--${params
        //     .getValue("ROLE_STAFF")
        //     .toString()} isStaff--${params.getValue("isStaff")?.toString()}`;
        // }}
        // bật checkbox
        checkboxSelection={!addUser.toggle}
        disableSelectionOnClick
        // khi click chọn từng phần tử phải lưu lại
        onSelectionModelChange={(newSelection) => {
          if (newSelection.selectionModel.length === 0) {
            setUserListDelete({
              triggerDelete: false,
              userListDelete: [],
              cancel: false,
            });
          }
          setUserListDelete((data) => ({
            ...data,
            userListDelete: newSelection.selectionModel,
          }));
          setSelectionModel(newSelection.selectionModel);
        }}
        selectionModel={selectionModel}
        // xử lý chỉnh sửa
        editRowsModel={editRowsModel}
        onEditCellChange={handleEditCellChange}
        onEditCellChangeCommitted={handleEditCellChangeCommitted}
        // hiện loading khi đang call api lấy userList
        loading={loadingUsersList}
        // components={{ LoadingOverlay: CustomLoadingOverlay }}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        sortModel={sortModel}
      />
    </div>
  );
}
