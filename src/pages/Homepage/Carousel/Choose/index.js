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

import theatersApi from "../../../../api/theatersApi";
import useStyles from "./styles";
import formatDate from "../../../../utilities/formatDate";
import { HIDDEN_SEARCHTICKET } from "../../../../constants/config";
import { INIT_DATA } from "../../../../reducers/constants/BookTicket";

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
      openCtr: { ...data.openCtr, phim: true }
    }));
  };
  const handleOpenRap = () => {
    setData((data) => ({ ...data, openCtr: { ...data.openCtr, rap: true } }));
  };
  const handleOpenNgayXem = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, ngayXem: true }
    }));
  };
  const handleOpenSuatChieu = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, suatChieu: true }
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
      /* auto open disabled */
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
    
      theatersApi.getThongTinLichChieuHeThongRap()  //5
      .then((response) => { //6
        console.log("all branch: ",response); //7
        setData((data) => ({ ...data, startRequest: false })); //8
        setBranch(response?.data?.data?.content);//9
        const cumRapChieuData= response?.data?.data?.content?.reduce( //10
          (colect, item) => {
            console.log(item);
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
        console.log(err); //14
      });
  };



  // sau khi click chọn Rạp, cần lấy ra prop lichChieuPhim của Rạp đã chọn > lọc ra ngày chiếu để hiển thị
  // input: tenCumRap, cumRapChieuData
  // output: setRap(tenCumRap), ngayChieuRender(tenCumRap,cumRapChieuData)[ngayChieu], lichChieuPhimData(tenCumRap,cumRapChieuData)[{ngayChieuGioChieu: "2019-01-01T10:10:00"}]
  const handleSelectRap = (e) => {
    setData((data) => ({
      ...data,
      setRap: e.target.value,
      /* auto open disabled */
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
    console.log("indexSelect: ", data.cumRapChieuData[indexSelect].id);
    setIdRap(data.cumRapChieuData[indexSelect].id)
    console.log("set phim: ", data.setPhim.id);
    setIdPhim(data.setPhim.id)

    theatersApi.getThongTinLichChieuPhim(data.setPhim.id, data.cumRapChieuData[indexSelect].id)
    .then((response) => {
      console.log("all lịch chiếu: ",response.data.data.content);
      const lichChieuPhimData = response.data?.data?.content || [];
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      const ngayChieuRender = lichChieuPhimData
        .filter((item) => {
          const sDate = item.startDate ? item.startDate.slice(0, 10) : '';
          if (sDate < todayStr) return false;
          if (sDate === todayStr && item.startTime && item.startTime < currentTimeStr) return false;
          return true;
        })
        .map((item) => item.startDate.slice(0, 10));

      const ngayChieuRenderRemoveDuplicates = [...new Set(ngayChieuRender)].sort();

      setData((data) => ({
        ...data,
        ngayChieuRender: ngayChieuRenderRemoveDuplicates,
        lichChieuPhimData,
      }));
    })
    .catch((err) => {
      console.log(err);
    });
  };

  // sau khi click chọn ngày, cần lọc ra lịch chiếu tương ứng, thêm giờ để render
  // input: ngayChieu, lichChieuPhimData
  // output: setNgayXem(ngayChieu), suatChieuRender(lichChieuPhimDataSelected)[suatChieu], lichChieuPhimDataSelected(ngayChieu,lichChieuPhimData)[{ngayChieuGioChieu: "2019-01-01T10:10:00", maLichChieu: "16099"}],
  const handleSelectNgayXem = (e) => {
    // setData((data) => ({
    //   ...data,
    //   setNgayXem: e.target.value,
    //   /* auto open disabled */
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
      /* auto open disabled */
      // reset
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
    }));

    const indexSelect = data.lichChieuPhimData.findIndex(
      (item) => item.startDate === e.target.value
      
    ); // lấy ra lichChieuPhimData của một cụm rạp đã chọn, item lichChieuPhimData có thể giống ngày nhưng khác giờ chiếu
    console.log("indexSelect: ", data.lichChieuPhimData[indexSelect].startDate);
    // console.log("set phim: ", data.setPhim.id);

    theatersApi.getThongTinLichCoNgay(idPhim, idRap, data.lichChieuPhimData[indexSelect].startDate)
    .then((response) => {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      const rawList = response.data?.data?.content || [];
      const lichChieuPhimDataSelected = rawList.filter(item => {
        const dStr = item.startDate ? item.startDate.slice(0, 10) : '';
        if (dStr !== e.target.value) return false;
        if (e.target.value === todayStr && item.startTime && item.startTime < currentTimeStr) return false;
        return true;
      });
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
      console.log(err);
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
    console.log("maPhong: ", maPhong);
    setData((data) => ({ ...data, maLichChieu, maRap, maPhong }));
    
    dispatch({
      type: INIT_DATA,
      payload: {
        // ...data,
        thongTinPhongVe: data,
      },
      });
      console.log(thongTinPhongVe);
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
                placeholder="Chọn Phim"
                InputProps={{ ...params.InputProps, startAdornment: ( <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>1</span> ) }}
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
          noOptionsText="Không tìm thấy!"
        />
      </FormControl>
{/* rạp-------- */}
      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`} style={{ opacity: data.setPhim ? 1 : 0.5 }}
        focused={false} >
        <Select
          open={data?.openCtr?.rap}
          onClose={handleCloseRap}
          onOpen={handleOpenRap}
          onChange={handleSelectRap}
          value={data?.setRap} // tenCumRap
          renderValue={(value) => (<div style={{display: 'flex', alignItems: 'center'}}><span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>2</span>{value ? value : "Chọn Rạp"}</div>)} // hiển thị giá trị đã chọn
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
                      : "Đang tìm rạp!"
                    : "Không có rạp, vui lòng chọn lại phim!"
                }`
              : "Vui lòng chọn phim!"}
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
        className={`${classes["search__item--next"]} ${classes.search__item}`} style={{ opacity: data.setRap ? 1 : 0.5 }}
        focused={false} >
        <Select
          open={data.openCtr.ngayXem}
          onClose={handleCloseNgayXem}
          onOpen={handleOpenNgayXem}
          onChange={handleSelectNgayXem}
          value={data.setNgayXem} // ngayChieu
          renderValue={(value) => (<div style={{display: 'flex', alignItems: 'center'}}><span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>3</span>{value ? value : "Chọn Ngày"}</div>)}
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
            Không có lịch chiếu!
          </MenuItem>
          {data?.ngayChieuRender?.map((ngayChieu) => (
            <MenuItem
              value={ngayChieu}
              key={ngayChieu}
              classes={{
                root: classes.menu__item,
                selected: classes["menu__item--selected"],
              }}
            >
              {/* {
                new Date(ngayChieu) && new Date(ngayChieu).getTime() > new Date().getTime() ?     
                  <div>
                    {formatDate(ngayChieu)?.dayToday}, {" "}
                    {formatDate(ngayChieu)?.dateShort}
                  </div> 
                  : ""
              } */}
              <div>{formatDate(ngayChieu).dateFull}</div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

{/* Chọn xuất chiếu nè */}
      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`} style={{ opacity: data.setNgayXem ? 1 : 0.5 }}
        focused={false} >
        <Select
          open={data.openCtr.suatChieu}
          onClose={handleCloseSuatChieu}
          onOpen={handleOpenSuatChieu}
          onChange={handleSelectSuatChieu}
          value={data.setSuatChieu} // suatChieu
          renderValue={(value) => (<div style={{display: 'flex', alignItems: 'center'}}><span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>4</span>{value ? value : "Chọn Suất"}</div>)}
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
            Không có lịch chiếu!
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
              {suatChieu.room.name} ({suatChieu.format || suatChieu.room?.format || "2D"}) chiếu lúc {suatChieu.startTime}
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
          Mua vé nhanh
        </Button>
      </FormControl>
    </div>
  );
}

Choose.propTypes = {
  smDown: PropTypes.bool,
};
