import React, { useEffect, useState, useRef } from "react";

import { DataGrid, GridToolbar, GridOverlay } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import RenderCellExpand from "./RenderCellExpand";
import slugify from "slugify";
import RefreshButton from "../../utilities/RefreshButton"
// import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useStyles } from "./styles";
import { getAllTicketByAdminStaff } from "../../reducers/actions/Ticket";
import { Button, Tooltip } from "@material-ui/core";
import formatDate from "../../utilities/formatDate";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <CircularProgress style={{ margin: "auto" }} />
    </GridOverlay>
  );
}

export default function TicketManagement() {
  const [ticketListDisplay, setTicketListDisplay] = useState([]);
  const classes = useStyles();
  // const  {enqueueSnackbar}  = useSnackbar();
   const 
    {
      allTicketList,
      loadingAllTicketList,
    }
   = useSelector((state) => state.ticketReducer);
  const dispatch = useDispatch();
  const [valueSearch, setValueSearch] = useState("");
  const clearSetSearch = useRef(0);
  // const isMobile = useMediaQuery("(max-width:768px)");

  const handleReload = () => {
    dispatch(getAllTicketByAdminStaff());
    // return
  }
  // useEffect(() => {
  //   if (allTicketList.length === 0){
  //     console.log("Load lại all ticket");
  //     dispatch(getAllTicketByAdminStaff());
  //   }
  // }, []); 
  
  useEffect(() => {
    if(allTicketList && allTicketList.length !== 0)
    {
    const ticketListDis = allTicketList.reduce((collect1, ticket) => {
        return [
          ...collect1,
          { ...ticket,
            tenNguoiDat: ticket?.bill?.user?.name,
            ngayDat: new Date(ticket?.bill?.createdTime.slice(0,10)).toLocaleDateString(),
            gioDat: new Date(ticket?.bill?.createdTime).toLocaleTimeString(),
              //   "en-US",
              //   { hour: "2-digit", minute: "2-digit" }
              // ),
            
            // {new Date(sticket?.bill?.createdTime).toLocaleTimeString(
            //   "en-US",
            //   { hour: "2-digit", minute: "2-digit" }
            // )}

            maVe: ticket?.bill?.id,
            phimDat:ticket?.schedule?.movie?.name,
            rapChieu: ticket?.schedule?.branch?.name,
            phongChieu:ticket?.schedule?.room?.name,
            gioChieu:ticket?.schedule?.startTime,
            ngayChieu:ticket?.schedule?.startDate,
            ghe:ticket?.seat?.name,
            hinhPhim:ticket?.schedule?.movie?.smallImageURl,
          },
        ];
      },[])
      // console.log("ticketListDis", ticketListDis);
      setTicketListDisplay(ticketListDis);
      }
  }, [allTicketList]);

  // console.log("allTicketList", allTicketList);

  const handleInputSearchChange = (props) => {
    clearTimeout(clearSetSearch.current);
    clearSetSearch.current = setTimeout(() => {
      setValueSearch(props);
    }, 500);
  };

  const onFilter = () => {
    // dùng useCallback, slugify bỏ dấu tiếng việt
    let searchTicketListDisplay = ticketListDisplay?.filter((ticket) => {
      const matchTenNguoiDat =
        slugify(ticket?.tenNguoiDat ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchPhimDat =
        slugify(ticket?.phimDat ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchNgayGioDat=
        slugify(ticket?.ngayGioDat ?? "", modifySlugify)?.indexOf(
          slugify(valueSearch, modifySlugify)
        ) !== -1;
      const matchGhe=
      slugify(ticket?.ghe ?? "", modifySlugify)?.indexOf(
        slugify(valueSearch, modifySlugify)
      ) !== -1;
      return matchTenNguoiDat || matchPhimDat || matchNgayGioDat || matchGhe;
    });
    // if (newImageUpdate.current && callApiChangeImageSuccess.current) {
    //   // hiển thị hình bằng base64 thay vì url, lỗi react không hiển thị đúng hình mới cập nhật(đã cập hình thanh công nhưng url backend trả về giữ nguyên đường dẫn)
    //   searchEventListDisplay = searchEventListDisplay?.map((event) => {
    //     if (event.id === newImageUpdate.current.id) {
    //       return { ...event, smallImageURl: newImageUpdate.current.smallImageURl};
    //     }
    //     return event;
    //   });
    // }
    return searchTicketListDisplay;
  };
  const columns = [
    {
      field: "maVe",
      headerName: "No",
      width: 80,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "ghe",
      headerName: "Ghế",
      width: 80,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "tenNguoiDat",
      headerName: "Người đặt",
      width: 170,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "phimDat",
      headerName: "Phim",
      width: 200,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    // {
    //   field: "hinhPhim",
    //   headerName: "Hình ảnh",
    //   width: 200,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    //   renderCell: (params) => RenderCellExpand(params),
    // },
    {
      field: "hinhPhim",
      headerName: "Ảnh",
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.row.hinhPhim}>
          <img
            style={{
              maxWidth: "100%",
              height: "100%",
              borderRadius: 4,
              marginRight: 15,
            }}
            src={params.row.hinhPhim}
          />
        </Tooltip>
      ),
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "gioDat",
      headerName: "Giờ đặt",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "ngayDat",
      headerName: "Ngày đặt",
      width: 110,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
      // valueFormatter: (params) => formatDate(params.value.slice(0, 10)).dateFull,
    },
    {
      field: "rapChieu",
      headerName: "Rạp",
      width: 200,
      headerAlign: "center",
      align: "left",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "phongChieu",
      headerName: "Phòng",
      width: 110,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },
    {
      field: "ngayChieu",
      headerName: "Ngày chiếu",
      width: 230,
      type: "date",
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      valueFormatter: (params) => formatDate(params.value.slice(0, 10)).dateFull,
      // valueFormatter: (params) => params.value.slice(0, 10),
    },
    {
      field: "gioChieu",
      headerName: "Giờ chiếu",
      width: 130,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: RenderCellExpand,
    },

  ];
  const modifySlugify = { lower: true, locale: "vi" };

  const handlerError = () =>{
    console.log("Vô handler error");
  }

  return (
    <div style={{ height: "80vh", width: "100%", backgroundColor:"white"}}>
      <div className={classes.control}>
        <div className="row">
          <div className={`col-12 col-md-6 ${classes.itemCtro}`}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Tìm vé..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                style={{color:"black"}}
                onChange={(evt) => handleInputSearchChange(evt.target.value)}
              />
          </div>
          </div>
          <div className={`col-12 col-md-6 ${classes.itemCtro}`} onClick={handleReload}>
            <RefreshButton />
          </div>
        </div>
      </div>
      {ticketListDisplay === undefined ? 
        handlerError() :
        <DataGrid
        className={classes.rootDataGrid}
        rows={onFilter()}
        columns={columns}
        pageSize={25}
        rowsPerPageOptions={[10, 25, 50]}
        // hiện loading khi
        loading={
          loadingAllTicketList 
        }
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
        }}
        // sort
        sortModel={[{ field: "tenNguoiDat", sort: "asc" }]}
      /> 
      }
      
      {/* <Dialog open={openModal}>
        <DialogTitle onClose={() => setOpenModal(false)}>
          {selectedPhim?.current?.brief
            ? `Edit: ${selectedPhim?.current?.brief}`
            : "Add new"}
        </DialogTitle>
        <DialogContent dividers>
          <FormAddEvent
            selectedPhim={selectedPhim.current}
            onUpdate={onUpdate}
            onAddMovie={onAddMovie}
          />
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
