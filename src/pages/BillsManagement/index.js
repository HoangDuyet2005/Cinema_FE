import React, { useEffect, useState, useRef } from "react";

import { DataGrid, GridToolbar, GridOverlay } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Dialog from "@material-ui/core/Dialog";
// import AddBoxIcon from "@material-ui/icons/AddBox";
import RenderCellExpand from "./RenderCellExpand";
import slugify from "slugify";
// import DialogActions from '@mui/material/DialogActions';
// import Fab from "@material-ui/core/Fab";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import RefreshButton from "../../utilities/RefreshButton"
import DetailPopup from "./PopUp/PopUp";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';


import { useStyles, DialogContent, DialogTitle } from "./styles";
// import {
//   getMovieListManagement,
//   deleteMovie,
//   updateMovieUpload,
//   resetMoviesManagement,
//   updateMovie,
//   addMovieUpload,
// } from "../../reducers/actions/Movie";
import Action from "./Action";
// import ThumbnailYoutube from "./ThumbnailYoutube";
// import Form from "./Form";
// import FormAddEvent from "./FormAddEvent";
import Swal from "sweetalert2";
import { getBillsList, getBillsTTTaiQuay, postAddBill, putBillUpdate, resetBillList } from "../../reducers/actions/Bill";
import { Tooltip } from "@material-ui/core";
import { DialogContentText } from "@mui/material";
import Slide from '@mui/material/Slide';
import billsApi from "../../api/billsApi";
import formatDate from "../../utilities/formatDate";
import reviewsApi from "../../api/billsApi";


// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function BillsManagement() {
  const [billListDisplay, setBillListDisplay] = useState([]);
  const [billListLoc, setBillListLoc] = useState([]);
  // console.log("billListDisplay: ", billListDisplay);
  const classes = useStyles();
  const  {enqueueSnackbar}  = useSnackbar();
  const [toggle, setToggle] = useState(false)

  let {
    billList,
    loadingBillList,
    loadingDelete,
    // errorDelete,
    // successDelete,
    // successUpdateBill,
    // errorUpdateBill,
    loadingUpdateBill,
    // loadingAddBill,
    // successAddBill,
    // errorAddBill,
    // loadingUpdateNoneImageMovie,
    // successUpdateNoneImageMovie,
    // errorUpdateNoneImageMovie,
    billListTTTaiQuay,
    loadingBillListTTTaiQuay,
    errorBillListTTTaiQuay,
  } = useSelector((state) => state.billsManagementReducer);
  
  // console.log(billListTTTaiQuay);
  const dispatch = useDispatch();
  const newImageUpdate = useRef("");
  const callApiChangeImageSuccess = useRef(false);
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  const [openModal, setOpenModal] = React.useState(false);
  const selectedPhim = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [listBill, setListBill] = useState([])
  useEffect(() => {
    if (
      !billListTTTaiQuay
    ) {
      dispatch(getBillsTTTaiQuay());
    }
  }, []); // khi vừa thêm phim mới xong mà xóa liên backend sẽ báo lỗi xóa không được nhưng thực chất đã xóa thành công > errorDeleteMovie nhưng vẫn tiến hành làm mới lại danh sách
  // useEffect(() => {
  //   return () => {
  //     dispatch(resetBillList());
  //   };
  // }, []);
  useEffect(() => {
    if (billListTTTaiQuay || billListTTTaiQuay?.length) {
      const newBillListDisplay = billListTTTaiQuay?.map((bill, index) => ({
        ...bill,
        hanhDong: "",
        id: bill?.id,
        email:bill?.user?.email,
        idUser:bill?.user?.id,
        imageUser:bill?.user?.image,
        nameUser:bill?.user?.name,
        usernameUser:bill?.user?.username,
        status:bill.status,
        createdTime:`${formatDate(bill?.createdTime.slice(
          0,
          10
        )).dateFull}, ${bill?.createdTime.slice(11, 19)}`,
      }));
      setBillListDisplay(newBillListDisplay);

      // let newBillListLoc = billList?.data?.reduce((bill) => {
      //   if(bill?.type === "REVIEWS") {
      //     return bill
      //   }
      // });
      // setBillListLoc(newBillListLoc);
    }

  }, []);
  const [ticketDetail, setTicketDetail] = useState({})

  const getTicketDetail = (id) => {
    reviewsApi.getBillByID(id).then((response) => { setTicketDetail(response.data); setToggle(true) })
  }

  const handleEdit = (billItem) => {
    selectedPhim.current = billItem;
    // console.log(selectedPhim.current);
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Chắc chắn thanh toán?',
      text: "Hãy kiểm tra kĩ trước khi thanh toán!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thanh toán ngay!',
      cancelButtonText: 'Không, dừng lại!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (!loadingDelete) {
          // nếu click xóa liên tục một user
          // dispatch(deleteMovie(maPhim));
          // window.location.reload();
          billsApi.postThanhToan(billItem.id)
          .then((res) =>{
            // console.log(res);
            swalWithBootstrapButtons.fire(
              'Đã thanh toán!',
              'DONE.',
              'success'
            )
          })
          .catch((err) => {
            // console.log(err);
            swalWithBootstrapButtons.fire(
              'Bill đã quá hạn',
              'Không thể thanh toán!',
              'error'
            )
          })
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Đã dừng',
          'Kiểm tra thông tin và nội dung!',
          'error'
        )
      }
    })
    // setOpenModal(true);
  };

  const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = (user) => {
    setOpen(false);
  };


  const handleReload = () => {
    dispatch(getBillsTTTaiQuay());
  }

  // const handleAddMovie = () => {
  //   const emtySelectedBill = {
  //     createdTime:"",
  //     price:"",
  //     status : "",
  //     email:"",
  //     idUser:"",
  //     id:"",
  //     imageUser:"",
  //     nameUser:"",
  //     usernameUser:""
  //   };
  //   selectedPhim.current = emtySelectedBill;
  //   setOpenModal(true);
  // };

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  const onFilter = () => {
    // dùng useCallback, slugify bỏ dấu tiếng việt
    let searchBillListDisplay = billListDisplay?.filter((bill) => {
      const matchTenPhim =
        slugify(bill?.brief ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchMoTa =
        slugify(bill?.status ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchNgayKhoiChieu =
        slugify(bill?.type ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return matchTenPhim || matchMoTa || matchNgayKhoiChieu;
    });
    if (newImageUpdate.current && callApiChangeImageSuccess.current) {
      // hiển thị hình bằng base64 thay vì url, lỗi react không hiển thị đúng hình mới cập nhật(đã cập hình thanh công nhưng url backend trả về giữ nguyên đường dẫn)
      searchBillListDisplay = searchBillListDisplay?.map((bill) => {
        if (bill.id === newImageUpdate.current.id) {
          return { ...bill, smallImageURl: newImageUpdate.current.smallImageURl};
        }
        return bill;
      });
    }
    return searchBillListDisplay;
  };

  const columns = [
    {
      field: "hanhDong",
      headerName: "Thanh toán",
      width: 150,
      // renderCell: (params) => (
      //   <Action
      //     onEdit={handleEdit}
      //     // onDeleted={handleDelete}
      //     phimItem={params.row}
      //     // onXemQua={onXemQua}
      //     // onTuChoi={handleTuChoi}
      //   />
      // ),
      // renderCell: (params) => {
      //   if (params.row.status === "WAITING_PAYMENT") {
      //     return (
      //       <Action
      //         onEdit={handleEdit}
      //         // onDeleted={handleDelete}
      //         phimItem={params.row}
      //         // onXemQua={onXemQua}
      //         // onTuChoi={handleTuChoi}
      //       />
      //     );
      //   } else if (params.row.status === "SUCCESS")
      //   {
      //     return "Đã thanh toán"
      //   }
      //   else return "Hết hạn thanh toán"
      // },
      renderCell: (params) => {
        if (params.row.status === "WAITING_PAYMENT") {
          return (
            <Action
              onEdit={handleEdit}
              // onDeleted={handleDelete}
              phimItem={params.row}
              // onXemQua={onXemQua}
              // onTuChoi={handleTuChoi}
            />
          );
        } else {
          return (
            <button
              style={{ fontSize: "15px" }}
              onClick={() => {
                getTicketDetail(params.row.id);
              }}
              className="btn btn-primary"
            >
              Xem chi tiết
            </button>
          );
        }
      },

      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
    },
    {
      field: "createdTime",
      headerName: "Thời gian đặt",
      width: 280,
      type: "dateTime",
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      // hide: true,
    },
    {
      field: "price",
      headerName: "Giá (vnđ)",
      type: "number",
      width: 130,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      // renderCell: RenderCellExpand,
    },
    {
      field: "usernameUser",
      headerName: "Tài khoản người đặt",
      width: 180,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "nameUser",
      headerName: "Tên người đặt",
      width: 100,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
      hide: true,
    },
    
    {
      field: "status",
      headerName: "Trạng thái",
      width: 180,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      // renderCell: RenderCellExpand,
      renderCell: (params) => {
        if (params.row.status === "WAITING_PAYMENT") {
          return "Chờ thanh toán"
        } else if (params.row.status === "SUCCESS")
        {
          return "Đã thanh toán"
        }
        else return "Hết hạn thanh toán"
      },
    },
    {
      field: "id",
      headerName: "Mã hóa đơn",
      width: 130,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "idUser",
      headerName: "ID đặt",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
      hide:true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    // {
    //   field: "imageUser",
    //   headerName: "Hình ảnh",
    //   width: 200,
    //   renderCell: (params) => (
    //     <Tooltip title={params.row.mainImage}>
    //       <img
    //         style={{
    //           maxWidth: "100%",
    //           height: "100%",
    //           borderRadius: 4,
    //           marginRight: 15,
    //         }}
    //         src={params.row.mainImage}
    //       />
    //     </Tooltip>
    //   ),
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    
    // {
    //   field: "releaseDate",
    //   headerName: "Release Date",
    //   width: 160,
    //   type: "date",
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    //   valueFormatter: (params) => params.value.slice(0, 10),
    // },
    // {
    //   field: "rated",
    //   headerName: "Rated",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    // { field: "id", hide: true, width: 130 },
    // { field: "categories", hide: true, width: 130 },
    // { field: "duration", hide: true, width: 200, renderCell: RenderCellExpand },
  ];
  const modifySlugify = { lower: true, locale: "vi" };
  return (
    <div style={{ height: "80vh", width: "100%", backgroundColor:"white"}}>
      <div className={classes.control}>
        <div className="row">
          {/* <div className={`col-12 col-md-6 ${classes.itemCtro}`}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addMovie}
              onClick={handleAddMovie}
              disabled={loadingAddBill}
              startIcon={<AddBoxIcon />}
            >
              Thêm sự kiện, khuyến mãi
            </Button>
          </div> */}
          <div className={`col-12 col-md-6 ${classes.itemCtro}`}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Tìm kiếm..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                style={{color:"black"}}
                onChange={(evt) => handleInputSearchChange(evt.target.value)}
              />
            </div>
          </div>
          <div className={`col-12 col-md-2 ${classes.itemCtro}`} onClick={handleReload}>
            <RefreshButton />
          </div>
        </div>
      </div>
      <DataGrid
        className={classes.rootDataGrid}
        rows={onFilter()}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50]}
        // hiện loading khi
        loading={
          loadingUpdateBill ||
          loadingDelete ||
          loadingBillListTTTaiQuay 
          // loadingUpdateNoneImageMovie
        }
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        sortModel={[{ field: "nameUser", sort: "asc" }]}
      />

      {toggle && <div style={{ position: "fixed", borderRadius: "5px", top: "15%", left: "10%", backgroundColor: "white", zIndex: "10000", width: "80%", height: "70%", overflow: "scroll", border:"2px solid black" }}>
        <DetailPopup ThongTin={ticketDetail} />
        <div onClick={() => setToggle(false)} style={{ position: "absolute", right: "0px", top: "0px", backgroundColor: "red", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}><CloseFullscreenIcon /></div>
      </div>}

      <Dialog open={openModal}>
        <DialogTitle onClose={() => setOpenModal(false)}>
          {selectedPhim?.current?.brief
            ? `Chỉnh sửa: ${selectedPhim?.current?.brief}`
            : "Tạo mới"}
        </DialogTitle>
        <DialogContent dividers>
          {/* <FormAddBill
            selectedPhim={selectedPhim.current}
            onUpdate={onUpdate}
            onAddMovie={onAddMovie}
          /> */}
        </DialogContent>
      </Dialog>
          
    </div>
  );
}
