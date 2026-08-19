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
import Action from "./Action";
import ThumbnailYoutube from "./ThumbnailYoutube";
import Form from "./Form";
import FormAdd from "./FormAdd";
import Swal from "sweetalert2";
import formatDate from "../../utilities/formatDate";
import { getListBranchByAdminStaff } from "../../reducers/actions/Branch";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function BranchManagement() {
  const [branchListDisplay, setBranchListDisplay] = useState([]);
  console.log("branchListDisplay: ", branchListDisplay);

  const classes = useStyles();
  const  {enqueueSnackbar}  = useSnackbar();
  let {
    branchList,
    loadingBranchList,
    loadingAddUploadBranch
    // errorCateList,
  } = useSelector((state) => state.branchManagementReducer);

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
      !branchList ||
      loadingBranchList
      // errorCateList
    ) {
      dispatch(getListBranchByAdminStaff());
    }
  }, [
    branchList,
    loadingBranchList,
    // errorCateList,
  ]); // khi vừa thêm phim mới xong mà xóa liên backend sẽ báo lỗi xóa không được nhưng thực chất đã xóa thành công > errorDeleteMovie nhưng vẫn tiến hành làm mới lại danh sách

  const handleReload = () => {
    dispatch(getListBranchByAdminStaff());
    // return
  }
  console.log("branchList: ", branchList);
  // useEffect(() => {
  //   return () => {
  //     dispatch(resetMoviesManagement());
  //   };
  // }, []);

  useEffect(() => {
    if (branchList) {
      let newBranchListDisplay = branchList?.map((branch) => ({
        ...branch,
        hanhDong: "",
        id: branch?.id,
        address: branch?.address,
        imgURL: branch?.imgURL,
        name: branch?.name,
        phoneNo: branch?.phoneNo,
      }));
      setBranchListDisplay(newBranchListDisplay);
    }
  }, [branchList]);

  // useEffect(() => {
  //   // delete movie xong thì thông báo
  //   if (errorDeleteMovie === "Delete Success but backend return error") {
  //     successDeleteMovie = "Delete Success !";
  //   }
  //   if (successDeleteMovie) {
  //     enqueueSnackbar(successDeleteMovie, { variant: "success" });
  //     return;
  //   }
  //   if (errorDeleteMovie) {
  //     enqueueSnackbar(errorDeleteMovie, { variant: "error" });
  //   }
  // }, [errorDeleteMovie, successDeleteMovie]);

  // useEffect(() => {
  //   if (successUpdateMovie || successUpdateNoneImageMovie) {
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

  // useEffect(() => {
  //   if (successAddUploadMovie) {
  //     enqueueSnackbar(
  //       `Add new movie successfully: ${successAddUploadMovie.name}`,
  //       { variant: "success" }
  //     );
  //   }
  //   if (errorAddUploadMovie) {
  //     enqueueSnackbar(errorAddUploadMovie, { variant: "error" });
  //   }
  // }, [successAddUploadMovie, errorAddUploadMovie]);

  // xóa một phim
  // const handleDeleteOne = (maPhim) => {
  //   const swalWithBootstrapButtons = Swal.mixin({
  //     customClass: {
  //       confirmButton: 'btn btn-success',
  //       cancelButton: 'btn btn-danger'
  //     },
  //     buttonsStyling: false
  //   })
    
  //   swalWithBootstrapButtons.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel!',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       if (!loadingDeleteMovie) {
  //         // nếu click xóa liên tục một user
  //         dispatch(deleteMovie(maPhim));
  //         // window.location.reload();
  //       }
  //       swalWithBootstrapButtons.fire(
  //         'Deleted!',
  //         'Your file has been deleted.',
  //         'success'
  //       )
  //     } else if (
  //       /* Read more about handling dismissals below */
  //       result.dismiss === Swal.DismissReason.cancel
  //     ) {
  //       swalWithBootstrapButtons.fire(
  //         'Cancelled',
  //         'Your movie is safe :)',
  //         'error'
  //       )
  //     }
  //   })

  // };
  // const handleEdit = (phimItem) => {
  //   selectedPhim.current = phimItem;
  //   setOpenModal(true);
  // };

  // const onUpdate = (movieObj, hinhAnh, fakeImage) => {
  //   if (loadingUpdateMovie || loadingUpdateNoneImageMovie) {
  //     return undefined;
  //   }
  //   setOpenModal(false);
  //   newImageUpdate.current = fakeImage;
  //   if (typeof hinhAnh === "string") {
  //     // nếu dùng updateMovieUpload sẽ bị reset danhGia về 10
  //     const movieUpdate = movieListDisplay?.find(
  //       (movie) => movie.id === fakeImage.id
  //     ); // lẩy ra url gốc, tránh gửi base64 tới backend
  //     movieObj.smallImageURl = movieUpdate.smallImageURl;
  //     dispatch(updateMovie(movieObj));
  //     return undefined;
  //   }
  //   dispatch(updateMovieUpload(movieObj));
  // };
  // const onAddBranch = (branchObj) => {
  //   console.log("cateObj: nhận được", branchObj);
  //   if (!loadingAddUploadBranch) {
  //     dispatch(addBranchUpload(branchObj?.name));
  //   }
  //   setOpenModal(false);
  // };
  
  // const handleAddMovie = () => {
  //   const emtySelectedPhim = {
  //     id: "",
  //     name: "",
  //   };
  //   selectedPhim.current = emtySelectedPhim;
  //   setOpenModal(true);
  // };

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  console.log("branchListDisplay", branchListDisplay);
  const onFilter = () => {
    // dùng useCallback, slugify bỏ dấu tiếng việt
    let searchBranchListDisplay = branchListDisplay?.filter((branch) => {
      // không matchID được nha, không match số được
      // const matchId =
      //   slugify(cate?.id ?? "", modifySlugify)?.indexOf(
      //     slugify(valueSearch, modifySlugify)
      //   ) !== -1;
      const matchName =
        slugify(branch?.name ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchPhone =
        slugify(branch?.phoneNo ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchAddress =
        slugify(branch?.address ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      return matchName || matchPhone || matchAddress;
    });
    if (newImageUpdate.current && callApiChangeImageSuccess.current) {
      // hiển thị hình bằng base64 thay vì url, lỗi react không hiển thị đúng hình mới cập nhật(đã cập hình thanh công nhưng url backend trả về giữ nguyên đường dẫn)
      searchBranchListDisplay = searchBranchListDisplay?.map((branch) => {
        if (branch.id === newImageUpdate.current.id) {
          return { ...branch, imgURL: newImageUpdate.current.imgURL};
        }
        return branch;
      });
    }
    return searchBranchListDisplay;
  };


  const columns = [
    // {
    //   field: "hanhDong",
    //   headerName: "Action",
    //   width: 130,
    //   // renderCell: (params) => (
    //   //   <Action
    //   //     onEdit={handleEdit}
    //   //     onDeleted={handleDeleteOne}
    //   //     phimItem={params.row}
    //   //   />
    //   // ),
    //   headerAlign: "center",
    //   align: "left",
    //   headerClassName: "custom-header",
    // },
    {
      field: "id",
      headerName: "Mã chi nhánh",
      width: 180,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "name",
      headerName: "Tên chi nhánh",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "imgURL",
      headerName: "Hình ảnh",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => RenderCellExpand(params),
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "phoneNo",
      headerName: "Số điện thoại",
      width: 200,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
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
              // onClick={handleAddMovie}
              // disabled={loadingAddUploadCate}
              startIcon={<AddBoxIcon />}
            >
              Thêm chi nhánh
            </Button>
          </div> */}
          <div className={`col-12 col-md-6 ${classes.itemCtro}`}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Tìm kiếm rạp..."
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
          loadingBranchList
        }
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        sortModel={[{ field: "id", sort: "asc" }]}
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
            // onUpdate={onUpdate}
            // onAddCate={onAddCate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
