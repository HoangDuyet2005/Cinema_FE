import React, { useEffect, useState, useRef } from "react";

import { DataGrid, GridToolbar, GridOverlay } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Dialog from "@material-ui/core/Dialog";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RenderCellExpand from "./RenderCellExpand";
import slugify from "slugify";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import RefreshButton from "../../utilities/RefreshButton"

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
import FormAdd from "./FormAdd";
import Swal from "sweetalert2";
import formatDate from "../../utilities/formatDate";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function MoviesManagement() {
  const [movieListDisplay, setMovieListDisplay] = useState([]);
  console.log("movieListDisplay: ", movieListDisplay);
  const classes = useStyles();
  const  {enqueueSnackbar}  = useSnackbar();
  let {
    movieList2,
    loadingMovieList2,
    loadingDeleteMovie,
    errorDeleteMovie,
    successDeleteMovie,
    successUpdateMovie,
    errorUpdateMovie,
    loadingUpdateMovie,
    loadingAddUploadMovie,
    successAddUploadMovie,
    errorAddUploadMovie,
    loadingUpdateNoneImageMovie,
    successUpdateNoneImageMovie,
    errorUpdateNoneImageMovie,
  } = useSelector((state) => state.movieReducer);
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
      !movieList2 ||
      successUpdateMovie ||
      successUpdateNoneImageMovie ||
      successDeleteMovie ||
      errorDeleteMovie ||
      successAddUploadMovie
    ) {
      dispatch(getMovieListManagement());
    }
  }, [
    successUpdateMovie,
    successUpdateNoneImageMovie,
    successDeleteMovie,
    errorDeleteMovie,
    successAddUploadMovie,
  ]); // khi vừa thêm phim mới xong mà xóa liên backend sẽ báo lỗi xóa không được nhưng thực chất đã xóa thành công > errorDeleteMovie nhưng vẫn tiến hành làm mới lại danh sách

  const handleReload = () => {
    dispatch(getMovieListManagement());
    // return
  }

  useEffect(() => {
    return () => {
      dispatch(resetMoviesManagement());
    };
  }, []);
  useEffect(() => {
    if (movieList2) {
      let newMovieListDisplay = movieList2?.data?.map((movie) => ({
        ...movie,
        hanhDong: "",
        id: movie.id,
      }));
      setMovieListDisplay(newMovieListDisplay);
    }
  }, [movieList2]);

  useEffect(() => {
    // delete movie xong thì thông báo
    if (errorDeleteMovie === "Delete Success but backend return error") {
      successDeleteMovie = "Delete Success !";
    }
    if (successDeleteMovie) {
      enqueueSnackbar(successDeleteMovie, { variant: "success" });
      return;
    }
    if (errorDeleteMovie) {
      enqueueSnackbar(errorDeleteMovie, { variant: "error" });
    }
  }, [errorDeleteMovie, successDeleteMovie]);

  useEffect(() => {
    if (successUpdateMovie || successUpdateNoneImageMovie) {
      callApiChangeImageSuccess.current = true;
      enqueueSnackbar(
        `Update successfully: ${successUpdateMovie.name ?? ""}${
          successUpdateNoneImageMovie.name ?? ""
        }`,
        { variant: "success" }
      );
    }
    if (errorUpdateMovie || errorUpdateNoneImageMovie) {
      callApiChangeImageSuccess.current = false;
      enqueueSnackbar(
        `${errorUpdateMovie ?? ""}${errorUpdateNoneImageMovie ?? ""}`,
        { variant: "error" }
      );
    }
  }, [
    successUpdateMovie,
    errorUpdateMovie,
    successUpdateNoneImageMovie,
    errorUpdateNoneImageMovie,
  ]);

  useEffect(() => {
    if (successAddUploadMovie) {
      enqueueSnackbar(
        `Thêm mới thành công: ${successAddUploadMovie.name}`,
        { variant: "success" }
      );
    }
    if (errorAddUploadMovie) {
      enqueueSnackbar(errorAddUploadMovie, { variant: "error" });
    }
  }, [successAddUploadMovie, errorAddUploadMovie]);

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
      text: "Bạn không thể trở lại sau khi xóa!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Vâng, xóa!',
      cancelButtonText: 'Hủy!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (!loadingDeleteMovie) {
          // nếu click xóa liên tục một user
          dispatch(deleteMovie(maPhim));
          // window.location.reload();
        }
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
          'Your movie is safe :)',
          'error'
        )
      }
    })

  };
  const handleEdit = (phimItem) => {
    selectedPhim.current = phimItem;
    setOpenModal(true);
  };

  const onUpdate = (movieObj, hinhAnh, fakeImage) => {
    if (loadingUpdateMovie || loadingUpdateNoneImageMovie) {
      return undefined;
    }
    console.log('====================================');
    console.log("Trả về onUpdate: ", movieObj);
    console.log('====================================');
    setOpenModal(false);
    newImageUpdate.current = fakeImage;
    // movieObj.isShowing = trangThai
    console.log('====================================');
    console.log(movieObj);
    console.log('====================================');

    if (typeof hinhAnh === "string") {
      // nếu dùng updateMovieUpload sẽ bị reset danhGia về 10
      const movieUpdate = movieListDisplay?.find(
        (movie) => movie.id === fakeImage.id
      ); // lẩy ra url gốc, tránh gửi base64 tới backend
      movieObj.smallImageURl = movieUpdate.smallImageURl;
      dispatch(updateMovie(movieObj));
      return undefined;
    }
    dispatch(updateMovieUpload(movieObj));
  };
  const onAddMovie = (movieObj) => {
    if (!loadingAddUploadMovie) {
      console.log("Thêm mới phim này:", movieObj);
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
    selectedPhim.current = emtySelectedPhim;
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
    let searchMovieListDisplay = movieListDisplay?.filter((movie) => {
      const matchTenPhim =
        slugify(movie.name ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchMoTa =
        slugify(movie.longDescription ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchNgayKhoiChieu =
        slugify(movie.releaseDate ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return matchTenPhim || matchMoTa || matchNgayKhoiChieu;
    });
    if (newImageUpdate.current && callApiChangeImageSuccess.current) {
      // hiển thị hình bằng base64 thay vì url, lỗi react không hiển thị đúng hình mới cập nhật(đã cập hình thanh công nhưng url backend trả về giữ nguyên đường dẫn)
      searchMovieListDisplay = searchMovieListDisplay?.map((movie) => {
        if (movie.id === newImageUpdate.current.id) {
          return { ...movie, smallImageURl: newImageUpdate.current.smallImageURl};
        }
        return movie;
      });
    }
    return searchMovieListDisplay;
  };

  const columns = [
    {
      field: "hanhDong",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <Action
          onEdit={handleEdit}
          onDeleted={handleDeleteOne}
          phimItem={params.row}
        />
      ),
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
    },
    {
      field: "name",
      headerName: "Tên phim",
      width: 250,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "trailerURL",
      headerName: "Trailer",
      width: 130,
      renderCell: (params) => (
        <div style={{ display: "inline-block" }}>
          <ThumbnailYoutube urlYoutube={params.row.trailerURL} />
        </div>
      ),
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
    {
      field: "longDescription",
      headerName: "Mô tả",
      width: 170,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "releaseDate",
      headerName: "Ngày khởi chiếu",
      width: 190,
      type: "date",
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      valueFormatter: (params) => formatDate(params.value.slice(0, 10)).dateFull,
    },
    {
      field: "rated",
      headerName: "Đánh giá",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    { field: "id", hide: true, width: 130 },
    { field: "categories", hide: true, width: 130 },
    { field: "duration", hide: true, width: 200, renderCell: RenderCellExpand },
  ];
  const modifySlugify = { lower: true, locale: "vi" };
  return (
    <div style={{ height: "80vh", width: "100%", backgroundColor:"white"}}>
      <div className={classes.control}>
        <div className="row">
          <div className={`col-2 col-md-3 ${classes.itemCtro}`}>
            <Button
              variant="contained"
              color="primary"
              className={classes.addMovie}
              onClick={handleAddMovie}
              disabled={loadingAddUploadMovie}
              startIcon={<AddBoxIcon />}
            >
              Thêm phim
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
                placeholder="Tìm kiếm phim..."
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
          loadingUpdateMovie ||
          loadingDeleteMovie ||
          loadingMovieList2 ||
          loadingUpdateNoneImageMovie
        }
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        sortModel={[{ field: "name", sort: "asc" }]}
      />
      <Dialog open={openModal}>
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
      </Dialog>
    </div>
  );
}
