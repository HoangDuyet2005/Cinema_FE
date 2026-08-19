import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomPopper from "./popper";

// import theatersApi from "../../../../api/theatersApi";
import useStyles from "./styles";
// import formatDate from "../../../../utilities/formatDate";
import { HIDDEN_SEARCHTICKET } from "../../../constants/config";
import { INIT_DATA } from "../../../reducers/constants/BookTicket";
import theatersApi from "../../../api/theatersApi";
import formatDate from "../../../utilities/formatDate";

export default function Choose() {
  const { movieList: movieRender, errorMovieList } = useSelector(
    (state) => state.movieReducer
  );
  const {
    thongTinPhongVe,
  } = useSelector((state) => state.bookTicketReducer);

  // console.log(movieRender);
  const [idPhim, setIdPhim]=useState('');
  const [idRap, setIdRap]=useState('');
  const history = useHistory();
  const [branch, setBranch] = useState([]);
  const down992px = useMediaQuery(HIDDEN_SEARCHTICKET);
  const [data, setData] = useState({
    // handleSelectPhim
    setPhim: "",
    rapRender: [],
    cumRapChieuData: [],
    startRequest: false, // lựa chọn giữa hiện thị "đang tìm" hay "không tìm thấy"
    errorCallApi: "",

    // handleSelectRap
    setRap: "",
    ngayChieuRender: [],
    lichChieuPhimData: [],

    // handleSelectNgayXem
    setNgayXem: "",
    suatChieuRender: [],
    lichChieuPhimDataSelected: [],

    // handleSelectSuatChieu
    setSuatChieu: "",
    maLichChieu: "",

    // handleOpen
    openCtr: { phim: false, rap: false, ngayXem: false, suatChieu: false },
    // element:
    rootElementPopup: null,
  });
  const [topPopup, setTopPopup] = useState(false);
  const classes = useStyles({
    down992px,
    openPhim: data.openCtr.phim || data.setPhim?.maPhim,
  });
  const [currentPhimPopup, setcurrentPhimPopup] = useState(null);

  const dispatch = useDispatch()
  // popup item phim lật như thế nào(lên hay xuống) thì set các popup khác lật như thế ấy, item phim dùng popper, item còn lại dùng popover
  useEffect(() => {

    let mounted = true;
    if (!data.openCtr.phim) {
      return undefined;
    }
    setTimeout(() => {
      const placementPopup = document.querySelector(
        'div[role="presentation"].MuiAutocomplete-popper'
      );
      if (placementPopup?.getAttribute("x-placement") === "bottom" && mounted) {
        setTopPopup(false);
      } else if (
        placementPopup?.getAttribute("x-placement") === "top" &&
        mounted
      ) {
        setTopPopup(true);
      }
      // đưa elememt xuống popup thứ hai để định vị Popper
      setData((data) => ({
        ...data,
        rootElementPopup: placementPopup,
      }));
    }, 50);
    return () => {
      mounted = false;
    };
  }, [data.openCtr.phim]);

  const handleOpenPhim = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, phim: true },
    }));
  };
  const handleOpenRap = () => {
    setData((data) => ({ ...data, openCtr: { ...data.openCtr, rap: true } }));
  };
  const handleOpenNgayXem = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, ngayXem: true },
    }));
  };
  const handleOpenSuatChieu = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, suatChieu: true },
    }));
  };
  const handleClosePhim = () => {
    setData((data) => ({ ...data, openCtr: { ...data.openCtr, phim: false } }));
  };
  const handleCloseRap = () => {
    setData((data) => ({ ...data, openCtr: { ...data.openCtr, rap: false } }));
  };
  const handleCloseNgayXem = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, ngayXem: false },
    }));
  };
  const handleCloseSuatChieu = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, suatChieu: false },
    }));
  };

  // sau khi click chọn phim, cần duyệt lấy tất cả cumRapChieu lưu vào cumRapChieuData để xử lý
  // input: maPhim
  // output: setPhim(maPhim), rapRender(maPhim)[tenCumRap], cumRapChieuData(maPhim)[{lichChieuPhim}],
  const handleSelectPhim = (phim) => {  //1
    if (!phim) { // 2
      return undefined;  //3
    }
    setData((data) => ({ //4
      ...data,
      setPhim: phim,
      startRequest: true,
      openCtr: { ...data.openCtr, rap: true },
      // reset
      rapRender: [],
      cumRapChieuData: [],
      setRap: "",
      ngayChieuRender: [],
      lichChieuPhimData: [],
      setNgayXem: "",
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
    }));
    // theatersApi
    //   .getThongTinLichChieuPhim(phim.id)
    //   .then((result) => {
    //     console.log(result?.data);
    //     setData((data) => ({ ...data, startRequest: false }));
    //     const cumRapChieuData= result?.data?.content?.reduce(
    //       (colect, item) => {
    //         console.log(item);
    //         return [...colect, item];
    //       },
    //       []
    //     );
    //     // const cumRapChieuData} = result.data.content;
    //     console.log("cumRapChieuData", cumRapChieuData);
    //     // const rapRender = cumRapChieuData
    //     const rapRender = cumRapChieuData.map((item) => item)
    //     setData((data) => ({
    //       ...data,
    //       rapRender,
    //       cumRapChieuData,
    //     }));
        
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       setData((data) => ({ ...data, errorCallApi: error.response.data }));
    //     } else if (error.request) {
    //       setData((data) => ({ ...data, errorCallApi: error.message }));
    //     }
    //   });
      // lấy rạp
      theatersApi.getThongTinLichChieuHeThongRap()  //5
      .then((response) => { //6
        // console.log("all branch: ",response); //7
        setData((data) => ({ ...data, startRequest: false })); //8
        setBranch(response?.data?.data?.content);//9
        const cumRapChieuData= response?.data?.data?.content?.reduce( //10
          (colect, item) => {
            // console.log(item);
            return [...colect, item];
          },
          []
        );
        // const rapRender = cumRapChieuData
        const rapRender = cumRapChieuData.map((item) => item) //11
        setData((data) => ({ //12
          ...data,
          rapRender,
          cumRapChieuData,
        }));
      })
      .catch((err) => { //13
        // console.log(err); //14
      });
  };



  // sau khi click chọn Rạp, cần lấy ra prop lichChieuPhim của Rạp đã chọn > lọc ra ngày chiếu để hiển thị
  // input: tenCumRap, cumRapChieuData
  // output: setRap(tenCumRap), ngayChieuRender(tenCumRap,cumRapChieuData)[ngayChieu], lichChieuPhimData(tenCumRap,cumRapChieuData)[{ngayChieuGioChieu: "2019-01-01T10:10:00"}]
  const handleSelectRap = (e) => {
    setData((data) => ({
      ...data,
      setRap: e.target.value,
      openCtr: { ...data.openCtr, ngayXem: true },
      // reset
      ngayChieuRender: [],
      lichChieuPhimData: [],
      setNgayXem: "",
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
    }));
    const indexSelect = data.cumRapChieuData.findIndex(
      (item) => item.name === e.target.value
      
    ); // lấy ra lichChieuPhimData của một cụm rạp đã chọn, item lichChieuPhimData có thể giống ngày nhưng khác giờ chiếu
    // console.log("indexSelect: ", data.cumRapChieuData[indexSelect].id);
    setIdRap(data.cumRapChieuData[indexSelect].id)
    // console.log("set phim: ", data.setPhim.id);
    setIdPhim(data.setPhim.id)

    theatersApi.getThongTinLichChieuPhim(data.setPhim.id, data.cumRapChieuData[indexSelect].id)
    .then((response) => {
      // console.log("all lịch chiếu: ",response.data.data.content);
      const lichChieuPhimData = response.data.data.content
      const ngayChieuRender = lichChieuPhimData.map((item) => {
        return item.startDate.slice(0, 10); // tạo mảng mới với item là "2020-12-17" cắt ra từ 2020-12-17T10:10:00
      });
      const ngayChieuRenderRemoveDuplicates = [...new Set(ngayChieuRender)]; // xóa đi phần tử trùng lặp để hiển thị
      setData((data) => ({
        ...data,
        ngayChieuRender: ngayChieuRenderRemoveDuplicates,
        lichChieuPhimData,
      }));
    })
    .catch((err) => {
      // console.log(err);
    });
  };

  // sau khi click chọn ngày, cần lọc ra lịch chiếu tương ứng, thêm giờ để render
  // input: ngayChieu, lichChieuPhimData
  // output: setNgayXem(ngayChieu), suatChieuRender(lichChieuPhimDataSelected)[suatChieu], lichChieuPhimDataSelected(ngayChieu,lichChieuPhimData)[{ngayChieuGioChieu: "2019-01-01T10:10:00", maLichChieu: "16099"}],
  const handleSelectNgayXem = (e) => {
    // setData((data) => ({
    //   ...data,
    //   setNgayXem: e.target.value,
    //   openCtr: { ...data.openCtr, suatChieu: true },
    //   // reset
    //   suatChieuRender: [],
    //   lichChieuPhimDataSelected: [],
    //   setSuatChieu: "",
    //   maLichChieu: "",
    // }));

    // const lichChieuPhimDataSelected = data.lichChieuPhimData.filter((item) => {
    //   // lấy tất cả item có ngày chiếu giống với ngày chiếu đã chọn
    //   if (item.ngayChieuGioChieu.slice(0, 10) === e.target.value) {
    //     return true;
    //   }
    //   return false;
    // });
    // const suatChieuRender = lichChieuPhimDataSelected.map((item) => {
    //   // cắt lấy giờ chiếu trong ngayChieuGioChieu: "2019-01-01T20:00:00" > "20:00"
    //   return item.ngayChieuGioChieu.slice(11, 16);
    // });
    // setData((data) => ({
    //   ...data,
    //   suatChieuRender,
    //   lichChieuPhimDataSelected,
    // }));

    setData((data) => ({
      ...data,
      setNgayXem: e.target.value,
      openCtr: { ...data.openCtr, suatChieu: true },
      // reset
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
    }));

    const indexSelect = data.lichChieuPhimData.findIndex(
      (item) => item.startDate === e.target.value
      
    ); // lấy ra lichChieuPhimData của một cụm rạp đã chọn, item lichChieuPhimData có thể giống ngày nhưng khác giờ chiếu
    // console.log("indexSelect: ", data.cumRapChieuData[indexSelect].id);
    // console.log("set phim: ", data.setPhim.id);

    theatersApi.getThongTinLichChieuPhim(idPhim, idRap)
    .then((response) => {
      // console.log("all lịch chiếu: ",response.data.data.content);
      const lichChieuPhimDataSelected = response.data.data.content
      const suatChieuRender = lichChieuPhimDataSelected.map((item) => {
        return item;
      });
      setData((data) => ({
        ...data,
        suatChieuRender,
        lichChieuPhimDataSelected,
      }));
    })
    .catch((err) => {
      // console.log(err);
    });


  };

  // input: suatChieu
  // output: setSuatChieu(suatChieu), maLichChieu(suatChieu)[maLichChieu]

  // Chọn suất chiếu nè--------------
  const handleSelectSuatChieu = (e) => {
    setData((data) => ({
      ...data,
      setSuatChieu: e.target.value,
      // reset
      maLichChieu: "",
    }));
    const indexMaLichChieuSelect = data.lichChieuPhimDataSelected.findIndex(
      (item) => item.startTime.slice(0, 8) === e.target.value
    );
    // Lấy được cái mã lịch chiếu rồi
    // Lấy được cái mã lịch chiếu rồi
    // Lấy được cái mã lịch chiếu rồi
    const maLichChieu =
      data.lichChieuPhimDataSelected[indexMaLichChieuSelect].id;

    const maRap = data.lichChieuPhimDataSelected[indexMaLichChieuSelect].branch.id;
    const maPhong = data.lichChieuPhimDataSelected[indexMaLichChieuSelect].room.id;
    // console.log("maPhong: ", maPhong);
    setData((data) => ({ ...data, maLichChieu, maRap, maPhong }));
    
    dispatch({
      type: INIT_DATA,
      payload: {
        // ...data,
        thongTinPhongVe: data,
      },
      });
      // console.log(thongTinPhongVe);
  };

  const setNewPhim = (maPhim) => {
    setcurrentPhimPopup(maPhim);
  };
  // quy định nó sẽ lật như thế nào
  const menuProps = {
    // props và class của menu(Popover)
    classes: { paper: classes.menu },
    getContentAnchorEl: null, // không có dòng này popup "đang tìm rạp" bị set ở vị trí chính giữa
    anchorOrigin: {
      vertical: topPopup ? "top" : "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: topPopup ? "bottom" : "top",
      horizontal: "left",
    },
  };

  // console.log("data",data);

  if (errorMovieList) {
    return <p>{errorMovieList}</p>;
  }

  return (
    <div className={classes.search} id="searchTickets">
      <FormControl focused={false} className={classes.itemFirst}>
        <Autocomplete
          options={movieRender.data}
          getOptionLabel={(option) => option.name}
          style={{ width: 300 }}
          renderInput={(params) => {
            // <SearchIcon />
            return (
              <TextField
                {...params}
                label="Find movie..."
                variant="standard"
                className={classes.textField}
              />
            );
          }}
          renderOption={(phim) => (
            <CustomPopper
              key={phim.name}
              phim={phim}
              setNewPhim={setNewPhim}
              currentPhimPopup={currentPhimPopup}
              rootElementPopup={data.rootElementPopup}
            />
          )}
          popupIcon={<ExpandMoreIcon />}
          value={data.setPhim ? data.setPhim : null}
          onChange={(event, phim) => {
            handleSelectPhim(phim);
          }}
          classes={{
            popupIndicator: classes.popupIndicator,
            option: classes.menu__item,
            listbox: classes.listbox,
            paper: classes.paper,
            noOptions: classes.noOptions,
          }}
          open={data.openCtr.phim} // control open
          onClose={handleClosePhim}
          onOpen={handleOpenPhim}
          blurOnSelect
          noOptionsText="Not found!"
        />
      </FormControl>
{/* rạp-------- */}
      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`}
        focused={false}
      >
        <Select
          open={data?.openCtr?.rap}
          onClose={handleCloseRap}
          onOpen={handleOpenRap}
          onChange={handleSelectRap}
          value={data?.setRap} // tenCumRap
          renderValue={(value) => `${value ? value : "Branch"}`} // hiển thị giá trị đã chọn
          displayEmpty
          IconComponent={ExpandMoreIcon}
          MenuProps={menuProps}
        >
          <MenuItem
            value=""
            style={{ display: data.rapRender.length > 0 ? "none" : "block" }}
            classes={{ root: classes.menu__item }}
          >
            {data?.setPhim
              ? `${
                  data?.startRequest
                    ? data?.errorCallApi
                      ? data?.errorCallApi
                      : "Finding theater!"
                    : "No schedule, please choose orther film!"
                }`
              : "Please choose film!"}
          </MenuItem>
          {data?.rapRender?.map((item) => (
            <MenuItem
              value={item.name}
              key={item.id}
              classes={{
                root: classes.menu__item,
                selected: classes["menu__item--selected"],
              }}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`}
        focused={false}
      >
        <Select
          open={data.openCtr.ngayXem}
          onClose={handleCloseNgayXem}
          onOpen={handleOpenNgayXem}
          onChange={handleSelectNgayXem}
          value={data.setNgayXem} // ngayChieu
          renderValue={(value) => `${value ? value : "ShowDate"}`}
          displayEmpty
          IconComponent={ExpandMoreIcon}
          MenuProps={menuProps}
        >
          <MenuItem
            value=""
            style={{
              display: data.ngayChieuRender.length > 0 ? "none" : "block",
            }}
            classes={{ root: classes.menu__item }}
          >
            No Schedule!
          </MenuItem>
          {data.ngayChieuRender.map((ngayChieu) => (
            <MenuItem
              value={ngayChieu}
              key={ngayChieu}
              classes={{
                root: classes.menu__item,
                selected: classes["menu__item--selected"],
              }}
            >
              <div>{formatDate(ngayChieu).dayToday}</div>
              <div>{formatDate(ngayChieu).dateShort}</div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

{/* Chọn xuất chiếu nè */}
      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`}
        focused={false}
      >
        <Select
          open={data.openCtr.suatChieu}
          onClose={handleCloseSuatChieu}
          onOpen={handleOpenSuatChieu}
          onChange={handleSelectSuatChieu}
          value={data.setSuatChieu} // suatChieu
          renderValue={(value) => `${value ? value : "Showtime"}`}
          displayEmpty
          IconComponent={ExpandMoreIcon}
          MenuProps={menuProps}
        >
          <MenuItem
            value=""
            style={{
              display: data.suatChieuRender.length > 0 ? "none" : "block",
            }}
            classes={{ root: classes.menu__item }}
          >
            No Scheudle!
          </MenuItem>
          {data.suatChieuRender.map((suatChieu) => (
            <MenuItem
              value={suatChieu.startTime}
              key={suatChieu.id}
              classes={{
                root: classes.menu__item,
                selected: classes["menu__item--selected"],
              }}
            > 
              {suatChieu.room.name}:{suatChieu.startTime}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className={classes["search__item--next"]}>
        <Button
          disabled={!data.maLichChieu} // khi không có dữ liệu > disabled cần set true
          classes={{
            root: classes.btn,
            disabled: classes.btnDisabled,
          }}
          onClick={() =>
            history.push(
              `/datvechitiet/${data?.maLichChieu}/${data?.maRap}/${data?.setPhim?.id}/${data?.setNgayXem}/${data.maPhong}/${data?.setSuatChieu}`,
              `/datvechitiet/${data?.maLichChieu}/${data?.maRap}/${data?.setPhim?.id}/${data?.setNgayXem}/${data.maPhong}/${data?.setSuatChieu}`
            )
          }
        >
          Book
        </Button>
      </FormControl>
    </div>
  );
}

Choose.propTypes = {
  smDown: PropTypes.bool,
};
