import React, { useEffect, useState, useRef } from "react";

import { DataGrid, GridToolbar, GridOverlay } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import RenderCellExpand from "./RenderCellExpand";
import slugify from "slugify";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useStyles } from "./styles";
import {
  deleteMovie,
  updateMovieUpload,
  resetMoviesManagement,
  updateMovie,
  addMovieUpload,
  getScheduleListManagement,
  resetScheduleManagement,
  getMovieListManagement,
} from "../../reducers/actions/Movie";
import Action from "./Action";
import ThumbnailYoutube from "./ThumbnailYoutube";
import FormAdd from "./FormAdd";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import BtnGoToCheckoutByStaff from "./BtnGoToCheckOut";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function BookByStaff() {
  // const [movieListDisplay, setMovieListDisplay] = useState([]);
  // console.log("movieListDisplay: ", movieListDisplay);

  const [scheduleListDisplay, setScheduleListDisplay] = useState([]);


  const classes = useStyles();
  const  {enqueueSnackbar}  = useSnackbar();
  const {
    scheduleList2,
    loadingScheduleList2,
    loadingDeleteSchedule,
    errorDeleteSchedule,
    successDeleteSchedule,
    successUpdateSchedule,
    errorUpdateSchedule,
    loadingUpdateSchedule,
    loadingAddUploadSchedule,
    successAddUploadSchedule,
    errorAddUploadSchedule,
    loadingUpdateNoneImageSchedule,
    successUpdateNoneImageSchedule,
    errorUpdateNoneImageSchedule,
  } = useSelector((state) => state.movieReducer);
  // console.log(scheduleList2);
  const dispatch = useDispatch();
  const newImageUpdate = useRef("");
  const callApiChangeImageSuccess = useRef(false);
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  const [openModal, setOpenModal] = React.useState(false);
  const selectedSchedule = useRef(null);
  const [branch, setBranch] = React.useState('');
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleChange = (event) => {
    setBranch(event.target.value);
    dispatch(getScheduleListManagement(event?.target?.value?.toString()))
  };

  // console.log("Rạp: ", branch);

  useEffect(() => {
    if (
      !scheduleList2 ||
      successUpdateSchedule ||
      successUpdateNoneImageSchedule ||
      successDeleteSchedule ||
      errorDeleteSchedule ||
      successAddUploadSchedule
    ) {
      // dispatch(getMovieListManagement());
      // console.log("branch: ",branch);
      dispatch(getScheduleListManagement(branch?.toString()))
    }
    else dispatch(getScheduleListManagement(branch?.toString()))

  }, [branch]); // khi vừa thêm phim mới xong mà xóa liên backend sẽ báo lỗi xóa không được nhưng thực chất đã xóa thành công > errorDeleteMovie nhưng vẫn tiến hành làm mới lại danh sách
  
  // useEffect(() => {
  //     dispatch(getScheduleListManagement((branch.toString())))
  //     // console.log("scheduleList2: ",scheduleList2);
  //     // setScheduleListDisplay(scheduleList2)
  // }, [branch]);

  // useEffect(() => {
  //   // return () => {
  //   //   dispatch(resetScheduleManagement());
  //   // };
  //   if (
  //     !scheduleList2
  //   ) {
  //     dispatch(getScheduleListManagement());
  //   }
  // }, []);

  //này mới chọn để hiển thị trên màn hình khi chọn branch nè
  useEffect(() => {
    if (scheduleList2?.length) {
      let newScheduleListDisplay = scheduleList2?.map((schedule) => ({
        ...schedule,
        hanhDong: "",
        id: schedule.id,
        movieName: schedule.movie.name,
        time:schedule.movie.duration,
        nameRoom:schedule.room.name,
        totalArea:schedule.room.totalArea,
        idRoom:schedule.room.id,
        idRap:schedule.branch.id,
        idPhim:schedule.movie.id,
        smallImageURl: schedule.movie.smallImageURl
      }));
      setScheduleListDisplay(newScheduleListDisplay);
    }

  }, [scheduleList2]);

  // console.log("lịch 2:", scheduleListDisplay);
  // useEffect(() => {
  //   // delete movie xong thì thông báo
  //   if (errorDeleteSchedule === "Delete Success but backend return error") {
  //     successDeleteSchedule = "Delete Success !";
  //   }
  //   if (successDeleteSchedule) {
  //     enqueueSnackbar(successDeleteSchedule, { variant: "success" });
  //     return;
  //   }
  //   if (errorDeleteSchedule) {
  //     enqueueSnackbar(errorDeleteSchedule, { variant: "error" });
  //   }
  // }, [errorDeleteSchedule, successDeleteSchedule]);

  useEffect(() => {
    if (successUpdateSchedule || successUpdateNoneImageSchedule) {
      callApiChangeImageSuccess.current = true;
      enqueueSnackbar(
        `Update successfully: ${successUpdateSchedule.name ?? ""}${
          successUpdateNoneImageSchedule.name ?? ""
        }`,
        { variant: "success" }
      );
    }
    if (errorUpdateSchedule || errorUpdateNoneImageSchedule) {
      callApiChangeImageSuccess.current = false;
      enqueueSnackbar(
        `${errorUpdateSchedule ?? ""}${errorUpdateNoneImageSchedule ?? ""}`,
        { variant: "error" }
      );
    }
  }, []);
  // console.log("scheduleListDisplay: ", scheduleListDisplay);
  useEffect(() => {
    if (successAddUploadSchedule) {
      enqueueSnackbar(
        `Add new Schedule successfully: ${successAddUploadSchedule.name}`,
        { variant: "success" }
      );
    }
    if (errorAddUploadSchedule) {
      enqueueSnackbar(errorAddUploadSchedule, { variant: "error" });
    }
  }, []);

  // xóa một phim
  const handleDeleteOne = (maPhim) => {
    if (!loadingDeleteSchedule) {
      // nếu click xóa liên tục một user
      // dispatch(deleteMovie(maPhim));
      // window.location.reload();
    }
  };
  const handleEdit = (phimItem) => {
    selectedSchedule.current = phimItem;
    setOpenModal(true);
  };

  const handleBook = (phimItem) => {
    // console.log("Book lịch chiếu thứ: ", phimItem);
    
    // selectedSchedule.current = phimItem;
    // setOpenModal(true);
  };

  const onUpdate = (movieObj, hinhAnh, fakeImage) => {
    if (loadingUpdateSchedule || loadingUpdateNoneImageSchedule) {
      return undefined;
    }
    setOpenModal(false);
    newImageUpdate.current = fakeImage;
    if (typeof hinhAnh === "string") {
      // nếu dùng updateMovieUpload sẽ bị reset danhGia về 10
      const scheduleUpdate = scheduleListDisplay?.find(
        (movie) => movie.id === fakeImage.id
      ); // lẩy ra url gốc, tránh gửi base64 tới backend
      movieObj.smallImageURl = scheduleUpdate.smallImageURl;
      dispatch(updateMovie(movieObj));
      return undefined;
    }
    dispatch(updateMovieUpload(movieObj));
  };
  const onAddMovie = (movieObj) => {
    if (!loadingAddUploadSchedule) {
      dispatch(addMovieUpload(movieObj));
    }
    setOpenModal(false);
  };
  const handleAddMovie = () => {
    const emtySelectedPhim = {
      id: "",
      name: "",
      smallImageURl: "",
      longDescription: "",
      shortDescription: "",
      largeImageURL: "",
      director: "",
      actors: "",
      categories: "",
      releaseDate: "",
      duration: "",
      trailerURL: "",
      language: "",
      rated: "",
      isShowing: null,
    };
    selectedSchedule.current = emtySelectedPhim;
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
    let searchScheduleListDisplay = scheduleListDisplay?.filter((schedule) => {
      const matchTenPhim =
        slugify(schedule.movie.name ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchMoTa =
        slugify(schedule.movie.longDescription ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchNgayKhoiChieu =
        slugify(schedule.movie.releaseDate ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return matchTenPhim || matchMoTa || matchNgayKhoiChieu;
    });
    if (newImageUpdate.current && callApiChangeImageSuccess.current) {
      // hiển thị hình bằng base64 thay vì url, lỗi react không hiển thị đúng hình mới cập nhật(đã cập hình thanh công nhưng url backend trả về giữ nguyên đường dẫn)
      searchScheduleListDisplay = searchScheduleListDisplay?.map((schedule) => {
        if (schedule.id === newImageUpdate.current.id) {
          return { ...schedule, smallImageURl: newImageUpdate.current.smallImageURl};
        }
        return schedule;
      });
    }
    return searchScheduleListDisplay;
  };

  const columns = [
    {
      field: "hanhDong",
      headerName: "Book",
      width: 100,
      // renderCell: (params) => (
      //   <Action
      //     // onEdit={handleEdit}
      //     // onDeleted={handleDeleteOne}
      //     onBook={handleBook}
      //     phimItem={params.row.id}
      //   />
      // ),
      renderCell:(params) =>(
        <BtnGoToCheckoutByStaff 
        lichChieuTheoPhim={params.row.startTime}
        duration={params.row.time} //duration
        idLich={params.row.id}
        maPhim={params.row.idPhim}
        ngayChieu={params.row.startDate}
        maPhong={params.row.idRoom}
        gioChieu={params.row.startTime}
        maRap={params.row.idRap} 
       />
      ),
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
    },
    {
      field: "movieName",
      headerName: "Phim",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "smallImageURl",
      headerName: "Hình ảnh",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => RenderCellExpand(params),
    },
    // {
    //   field: "startDate",
    //   headerName: "Start Date",
    //   width: 130,
    //   headerAlign: "center",
    //   align: "left",
    //   headerClassName: "custom-header",
    //   renderCell: RenderCellExpand,
    // },
    {
      field: "startDate",
      headerName: "Ngày Chiếu",
      width: 160,
      type: "date",
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      valueFormatter: (params) => params.value.slice(0, 10),
    },
    {
      field: "startTime",
      headerName: "Giờ chiếu",
      width: 120,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "price",
      headerName: "Giá vé",
      width: 110,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },

    {
      field: "time",
      headerName: "(m)",
      width: 110,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },

    {
      field: "nameRoom",
      headerName: "Phòng",
      width: 110,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },

    {
      field: "totalArea",
      headerName: "Số ghế",
      width: 110,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },

    {
      field: "idRoom",
      headerName: "Mã phòng",
      width: 110,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },

    // {
    //   field: "trailerURL",
    //   headerName: "Trailer",
    //   width: 130,
    //   renderCell: (params) => (
    //     <div style={{ display: "inline-block" }}>
    //       <ThumbnailYoutube urlYoutube={params.row.trailerURL} />
    //     </div>
    //   ),
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    // {
    //   field: "smallImageURl",
    //   headerName: "Image",
    //   width: 200,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    //   renderCell: (params) => RenderCellExpand(params),
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
      
      // { field: "id", hide: true, width: 130, headerClassName: "custom-header", },
    // { field: "categories", hide: true, width: 130 },
    // { field: "duration", hide: true, width: 200, renderCell: RenderCellExpand },
  ];

  const modifySlugify = { lower: true, locale: "vi" };
  const handlerError = () =>{
    // console.log("Vô handler error");
  }
  return (
    <div style={{ height: "80vh", width: "100%", backgroundColor:"white"}}>
      <div className={classes.control}>
        <div className="row">
          <div className={`col-12 col-md-6 ${classes.itemCtro}`}>
            {/* <Button
              variant="outlined"
              color="success"
              className={classes.addMovie}
              onClick={handleAddMovie}
              disabled={loadingAddUploadMovie}
              startIcon={<AddBoxIcon />}
            >
              Book for user
            </Button> */}
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Rạp</InputLabel>
                <Select 
                  className={classes.addMovie}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={branch}
                  label="branch"
                  onChange={handleChange}
                >
                  <MenuItem value={1}>WORLD CINEMA Hà Đông</MenuItem>
                  <MenuItem value={2}>WORLD CINEMA Thủ Đức</MenuItem>
                  <MenuItem value={3}>WORLD CINEMA Ba Đình</MenuItem>
                  <MenuItem value={4}>WORLD CINEMA Phạm Hùng</MenuItem>
                </Select>
              </FormControl>  
          </div>
          <div className={`col-12 col-md-6 ${classes.itemCtro}`}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Tìm lịch chiếu..."
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
      {scheduleListDisplay === undefined ? 
        handlerError() :
      <DataGrid
        className={classes.rootDataGrid}
        rows={onFilter()}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50]}
        // hiện loading khi
        loading={
          loadingUpdateSchedule ||
          loadingDeleteSchedule ||
          loadingScheduleList2 ||
          loadingUpdateNoneImageSchedule
        }
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        // sortModel={[{ field: "name", sort: "asc" }]}
      />
      }

      {/* <Dialog open={openModal}>
        <DialogTitle onClose={() => setOpenModal(false)}>
          {selectedPhim?.current?.name
            ? `Edit: ${selectedPhim?.current?.name}`
            : "Add new"}
        </DialogTitle>
        <DialogContent dividers>
          <FormAdd
            selectedPhim={selectedPhim.current}
            onUpdate={onUpdate}
            onAddMovie={onAddMovie}
          />
        </DialogContent>
      </Dialog> */}
    </div>
  );
}

