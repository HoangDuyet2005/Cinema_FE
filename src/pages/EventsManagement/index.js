import React, { useEffect, useState, useRef } from "react";

import { DataGrid, GridToolbar, GridOverlay } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import RefreshButton from "../../utilities/RefreshButton"
import InputBase from "@material-ui/core/InputBase";
import Dialog from "@material-ui/core/Dialog";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RenderCellExpand from "./RenderCellExpand";
import slugify from "slugify";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useStyles, DialogContent, DialogTitle } from "./styles";
import {
  getMovieListManagement,
  deleteMovie,
  updateMovieUpload,
  resetMoviesManagement,
  updateMovie,
  addMovieUpload,
} from "../../reducers/actions/Movie";
import Action from "./Action";
import ThumbnailYoutube from "./ThumbnailYoutube";
import Form from "./Form";
import FormAddEvent from "./FormAddEvent";
import Swal from "sweetalert2";
import { getEventsList, postAddEvent, putEventUpdate, resetEventList } from "../../reducers/actions/EventsManagement";
import { Tooltip } from "@material-ui/core";
import renderCellExpand from "./RenderCellExpand";
import formatDate from "../../utilities/formatDate";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function MoviesManagement() {
  const [eventListDisplay, setEventListDisplay] = useState([]);
  console.log("eventListDisplay: ", eventListDisplay);
  const classes = useStyles();
  const  {enqueueSnackbar}  = useSnackbar();
  let {
    eventList,
    loadingEventList,
    loadingDelete,
    errorDelete,
    successDelete,
    successUpdateEvent,
    errorUpdateEvent,
    loadingUpdateEvent,
    loadingAddEvent,
    successAddEvent,
    errorAddEvent,
    // loadingUpdateNoneImageMovie,
    // successUpdateNoneImageMovie,
    // errorUpdateNoneImageMovie,
  } = useSelector((state) => state.eventsManagementReducer);
  const dispatch = useDispatch();
  const newImageUpdate = useRef("");
  const callApiChangeImageSuccess = useRef(false);
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  const [openModal, setOpenModal] = React.useState(false);
  const selectedPhim = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  useEffect(() => {
    if (
      !eventList ||
      successUpdateEvent ||
      // successUpdateNoneImageMovie ||
      successDelete ||
      errorDelete ||
      successAddEvent
    ) {
      dispatch(getEventsList());
    }
  }, [
    // successUpdateEvent,
    // // successUpdateNoneImageMovie,
    // successDelete,
    // errorDelete,
    // successAddEvent,
  ]); // khi vừa thêm phim mới xong mà xóa liên backend sẽ báo lỗi xóa không được nhưng thực chất đã xóa thành công > errorDeleteMovie nhưng vẫn tiến hành làm mới lại danh sách

  useEffect(() => {
    return () => {
      dispatch(resetEventList());
    };
  }, []);
  useEffect(() => {
    if (eventList) {
      let newEventListDisplay = eventList?.data?.content?.map((event) => ({
        ...event,
        hanhDong: "",
        id: event.id,
        createdAt:`${formatDate(event?.createdAt.slice(
          0,
          10
        )).dateFull}, ${event?.createdAt.slice(11, 19)}`,
      }));
      setEventListDisplay(newEventListDisplay);
    }
  }, [eventList]);

  useEffect(() => {
    // delete movie xong thì thông báo
    if (errorDelete === "Delete Success but backend return error") {
      successDelete = "Delete Success !";
    }
    if (successDelete) {
      enqueueSnackbar(successDelete, { variant: "success" });
      return;
    }
    if (errorDelete) {
      enqueueSnackbar(errorDelete, { variant: "error" });
    }
  }, [errorDelete, successDelete]);

  // useEffect(() => {
  //   if (successUpdate || successUpdateNoneImageMovie) {
  //     callApiChangeImageSuccess.current = true;
  //     enqueueSnackbar(
  //       `Update successfully: ${successUpdateMovie.name ?? ""}${
  //         successUpdateNoneImageMovie.name ?? ""
  //       }`,
  //       { variant: "success" }
  //     );
  //   }
  //   if (errorUpdateMovie || errorUpdateNoneImageMovie) {
  //     callApiChangeImageSuccess.current = false;
  //     enqueueSnackbar(
  //       `${errorUpdateMovie ?? ""}${errorUpdateNoneImageMovie ?? ""}`,
  //       { variant: "error" }
  //     );
  //   }
  // }, [
  //   successUpdateMovie,
  //   errorUpdateMovie,
  //   successUpdateNoneImageMovie,
  //   errorUpdateNoneImageMovie,
  // ]);

  useEffect(() => {
    if (successAddEvent) {
      enqueueSnackbar(
        `Thêm mới thành công: ${successAddEvent.brief}`,
        { variant: "success" }
      );
    }
    if (errorAddEvent) {
      enqueueSnackbar(errorAddEvent, { variant: "error" });
    }
  }, [successAddEvent, errorAddEvent]);

  // xóa một phim
  const handleDeleteOne = (maPhim) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Bạn có chắc không?',
      text: "Bạn sẽ không thể trở về nếu chọn!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Vâng, xóa!',
      cancelButtonText: 'Hủy!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (!loadingDelete) {
          // nếu click xóa liên tục một user
          dispatch(deleteMovie(maPhim));
          // window.location.reload();
        }
        swalWithBootstrapButtons.fire(
          'Đã xoá!',
          'Bạn đã xoá nó.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Đã huỷ',
          'Huỷ đặt hàng này :)',
          'error'
        )
      }
    })

  };
  const handleEdit = (eventItem) => {
    selectedPhim.current = eventItem;
    setOpenModal(true);
  };

  const onUpdate = (movieObj, hinhAnh, fakeImage) => {
  dispatch(putEventUpdate(movieObj));
  setOpenModal(false);
  // enqueueSnackbar("Thành công", { variant: "success" });
  }

  const handleReload = () => {
    dispatch(getEventsList());
  }

  const onAddMovie = (movieObj) => {
    console.log("Dữ liệu event thêm: ", movieObj);
    if (!loadingAddEvent) {
      dispatch(postAddEvent(movieObj));
      // enqueueSnackbar("Thành công", { variant: "success" });
    }
    setOpenModal(false);
  };
  const handleAddMovie = () => {
    const emtySelectedEvent = {
      brief:"",
      description: "",
      image1 : "",
      title:"",
      mainImage:"",
      status:"",
      type:"",
    };
    selectedPhim.current = emtySelectedEvent;
    setOpenModal(true);
  };

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  const onFilter = () => {
    // dùng useCallback, slugify bỏ dấu tiếng việt
    let searchEventListDisplay = eventListDisplay?.filter((event) => {
      const matchTenPhim =
        slugify(event?.brief ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchMoTa =
        slugify(event?.status ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchNgayKhoiChieu =
        slugify(event?.type ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return matchTenPhim || matchMoTa || matchNgayKhoiChieu;
    });
    if (newImageUpdate.current && callApiChangeImageSuccess.current) {
      // hiển thị hình bằng base64 thay vì url, lỗi react không hiển thị đúng hình mới cập nhật(đã cập hình thanh công nhưng url backend trả về giữ nguyên đường dẫn)
      searchEventListDisplay = searchEventListDisplay?.map((event) => {
        if (event.id === newImageUpdate.current.id) {
          return { ...event, smallImageURl: newImageUpdate.current.smallImageURl};
        }
        return event;
      });
    }
    return searchEventListDisplay;
  };

  const columns = [
    {
      field: "hanhDong",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <Action
          onEdit={handleEdit}
          // onDeleted={handleDeleteOne}
          phimItem={params.row}
        />
      ),
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
    },
    {
      field: "brief",
      headerName: "Tên sự kiện",
      width: 250,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
      hide: true,
    },
    {
      field: "title",
      headerName: "Tiêu đề",
      width: 380,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "createdBy",
      headerName: "Người viết",
      width: 150,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 250,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
      hide:true,
    },
    {
      field: "mainImage",
      headerName: "Hình ảnh",
      width: 200,
      // renderCell: (params) => (
      //   <Tooltip title={params.row.mainImage}>
      //     <img
      //       style={{
      //         maxWidth: "100%",
      //         height: "100%",
      //         borderRadius: 4,
      //         marginRight: 15,
      //       }}
      //       src={params.row.mainImage}
      //     />
      //   </Tooltip>
      // ),
      renderCell: (params) => RenderCellExpand(params),
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
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
        if (params.row.status === "DENY") {
          return "Bị từ chối"
        } else if (params.row.status === "CREATE")
        {
          return "Chờ duyệt"
        } else if (params.row.status === "DELETE")
        {
          return "Đã xóa"
        }
        else return "Đã được duyệt"
      },
      hide: true,
    },
    {
      field: "type",
      headerName: "Loại",
      width: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 280,
      type: "dateTime",
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      // renderCell: RenderCellExpand,
      // hide: true,
    },
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
          <div className={`col-3 col-md-4 ${classes.itemCtro}`}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addMovie}
              onClick={handleAddMovie}
              disabled={loadingAddEvent}
              startIcon={<AddBoxIcon />}
            >
              Thêm sự kiện, khuyến mãi
            </Button>
          </div>
          <div className={`col-12 col-md-2 ${classes.itemCtro}`} onClick={handleReload}>
            <RefreshButton />
          </div>
          <div className={`col-12 col-md-4 ${classes.itemCtro}`}>
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
          loadingUpdateEvent ||
          loadingDelete ||
          loadingEventList 
          // loadingUpdateNoneImageMovie
        }
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        sortModel={[{ field: "brief", sort: "asc" }]}
      />
      <Dialog open={openModal}>
        <DialogTitle onClose={() => setOpenModal(false)}>
          {selectedPhim?.current?.brief
            ? `Chỉnh sửa: ${selectedPhim?.current?.brief}`
            : "Tạo mới"}
        </DialogTitle>
        <DialogContent dividers>
          <FormAddEvent
            selectedPhim={selectedPhim.current}
            onUpdate={onUpdate}
            onAddMovie={onAddMovie}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
