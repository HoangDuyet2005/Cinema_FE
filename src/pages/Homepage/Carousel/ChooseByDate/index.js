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

import theatersApi from "../../../../api/theatersApi";
import useStyles from "./styles";
import { HIDDEN_SEARCHTICKET } from "../../../../constants/config";
import { INIT_DATA } from "../../../../reducers/constants/BookTicket";

export default function ChooseByDate() {
  const { movieList: movieRender, errorMovieList } = useSelector(
    (state) => state.movieReducer
  );
  const { theaterList: theaterRender, errorTheaterList } = useSelector(
    (state) => state.theaterReducer
  );
  // console.log(theaterRender);

  const {
    thongTinPhongVe,
  } = useSelector((state) => state.bookTicketReducer);

  // console.log(movieRender);
  const [idPhim, setIdPhim]=useState('');
  const [idRap, setIdRap]=useState('');
  const history = useHistory();
  const [movie, setMovie] = useState([]);
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

  const handleSelectNgayChieu = (e) =>{
    setData((data) => ({ //4
      ...data,
      setPhim: "",
      startRequest: true,
      /* auto open disabled */
      // reset
      rapRender: theaterRender?.data?.content,
      cumRapChieuData: theaterRender?.data?.content,
      setRap: "",
      ngayChieuRender: [],
      lichChieuPhimData: [],
      setNgayXem: e.target.value,
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
      cumPhim:[],
      cumPhimRender:[],
    }));
    setIdPhim("")
    // theatersApi.getThongTinLichChieuHeThongRapTheoRap(phim.id)  //5
    //   .then((response) => { //6
    //     console.log("all phim: ",response); //7
    //     setData((data) => ({ ...data, startRequest: false })); //8
    //     setMovie(response?.data?.data?.content);//9
    //     const cumPhimData= response?.data?.data?.content?.reduce( //10
    //       (colect, item) => {
    //         console.log(item);
    //         return [...colect, item];
    //       },
    //       []
    //     );
        // // const rapRender = cumRapChieuData
        //lọc trùng
        // cumPhimData.reduce((unique, item) =>{
        //   return unique.includes(item.movie.name) ? unique : [...unique, item.movie.name]
        // },[])
       
        // const rapRender = cumRapChieuData.map((item) => item) //11
        // setData((data) => ({ //12
        //   ...data,
        //   rapRender,
        //   cumData,
        // }));
        
    //   })
    //   .catch((err) => { //13
    //     console.log(err); //14
    //   });
  }
  // sau khi click chọn phim, cần duyệt lấy tất cả cumRapChieu lưu vào cumRapChieuData để xử lý
  // input: maPhim
  // output: setPhim(maPhim), rapRender(maPhim)[tenCumRap], cumRapChieuData(maPhim)[{lichChieuPhim}],
  // const handleSelectPhim = (phim) => {  //1
  //   if (!phim) { // 2
  //     return undefined;  //3
  //   }
  //   console.log(phim);
  //   setData((data) => ({ //4
  //     ...data,
  //     setPhim: "",
  //     startRequest: true,
  //     /* auto open disabled */
  //     // reset
  //     rapRender: [],
  //     cumRapChieuData: [],
  //     setRap: phim,
  //     ngayChieuRender: [],
  //     lichChieuPhimData: [],
  //     setNgayXem: "",
  //     suatChieuRender: [],
  //     lichChieuPhimDataSelected: [],
  //     setSuatChieu: "",
  //     maLichChieu: "",
 
  //   }));
  //   // theatersApi
  //   //   .getThongTinLichChieuPhim(phim.id)
  //   //   .then((result) => {
  //   //     console.log(result?.data);
  //   //     setData((data) => ({ ...data, startRequest: false }));
  //   //     const cumRapChieuData= result?.data?.content?.reduce(
  //   //       (colect, item) => {
  //   //         console.log(item);
  //   //         return [...colect, item];
  //   //       },
  //   //       []
  //   //     );
  //   //     // const cumRapChieuData} = result.data.content;
  //   //     console.log("cumRapChieuData", cumRapChieuData);
  //   //     // const rapRender = cumRapChieuData
  //   //     const rapRender = cumRapChieuData.map((item) => item)
  //   //     setData((data) => ({
  //   //       ...data,
  //   //       rapRender,
  //   //       cumRapChieuData,
  //   //     }));
        
  //   //   })
  //   //   .catch(function (error) {
  //   //     if (error.response) {
  //   //       setData((data) => ({ ...data, errorCallApi: error.response.data }));
  //   //     } else if (error.request) {
  //   //       setData((data) => ({ ...data, errorCallApi: error.message }));
  //   //     }
  //   //   });
  //     // lấy rạp
  //     theatersApi.getThongTinLichChieuHeThongRapTheoRap(phim.id)  //5
  //     .then((response) => { //6
  //       console.log("all phim: ",response); //7
  //       setData((data) => ({ ...data, startRequest: false })); //8
  //       setMovie(response?.data?.data?.content);//9
  //       const cumPhimData= response?.data?.data?.content?.reduce( //10
  //         (colect, item) => {
  //           console.log(item);
  //           return [...colect, item];
  //         },
  //         []
  //       );
  //       // // const rapRender = cumRapChieuData
  //       //lọc trùng
  //       // cumPhimData.reduce((unique, item) =>{
  //       //   return unique.includes(item.movie.name) ? unique : [...unique, item.movie.name]
  //       // },[])
       
  //       const phimRender = cumPhimData.map((item) => item) //11
  //       setData((data) => ({ //12
  //         ...data,
  //         phimRender,
  //         cumPhimData,
  //       }));
        
  //     })
  //     .catch((err) => { //13
  //       console.log(err); //14
  //     });
  // };

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
      // setNgayXem: "",
      suatChieuRender: [],
      setPhim:"",
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
      cumPhim: [],
      cumPhimRender:[],
      maRap:"",
      maPhim:""
    }));
    const indexSelect = data.cumRapChieuData.findIndex(
      (item) => item.name === e.target.value
      
    ); // lấy ra lichChieuPhimData của một cụm rạp đã chọn, item lichChieuPhimData có thể giống ngày nhưng khác giờ chiếu
    // console.log(indexSelect)

    console.log("mã rạp nè: ", data.cumRapChieuData[indexSelect].id);
    // console.log("set rạp: ", e.target.value);
    setIdRap(data.cumRapChieuData[indexSelect].id)
    // console.log(idRap);
    theatersApi.getThongTinLichChieuHeThongRapTheoNgayVaRap(data.cumRapChieuData[indexSelect].id, data.setNgayXem)
    .then((response) => {
      console.log("all lịch chiếu: ",response?.data?.data?.content);
      const lichChieuPhimData = response?.data?.data?.content
      const cumPhimRender = lichChieuPhimData.map((item) => {
        return item.movie.name 
      });
      const phimChieuRenderRemoveDuplicates = [...new Set(cumPhimRender)]; 
      setData((data) => ({
        ...data,
        cumPhim: phimChieuRenderRemoveDuplicates,
        cumPhimRender,
        maRap: data.cumRapChieuData[indexSelect].id,
        maPhim:"",
        lichChieuPhimData:lichChieuPhimData
      }));
    })
    .catch((err) => {
      console.log(err);
    });
  };

  // sau khi click chọn ngày, cần lọc ra lịch chiếu tương ứng, thêm giờ để render
  // input: ngayChieu, lichChieuPhimData
  // output: setNgayXem(ngayChieu), suatChieuRender(lichChieuPhimDataSelected)[suatChieu], lichChieuPhimDataSelected(ngayChieu,lichChieuPhimData)[{ngayChieuGioChieu: "2019-01-01T10:10:00", maLichChieu: "16099"}],
  const handleSelectNgayXem = (e) => { //chọn phim á
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
      /* auto open disabled */
      // reset
      setPhim:e.target.value,
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      setSuatChieu: "",
      maLichChieu: "",
      // cumPhim:[],
      // cumPhimRender:[],
      maPhim:""
    }));
   
    console.log(e.target.value);

    const indexSelect = data.lichChieuPhimData.findIndex(
      (item) => item.movie.name === e.target.value
      
    ); 
    // lấy ra lichChieuPhimData của một cụm rạp đã chọn, item lichChieuPhimData có thể giống ngày nhưng khác giờ chiếu
    // console.log("indexSelect: ", data?.lichChieuPhimDataSelected[indexSelect]?.movie?.id);
    console.log("set id phim chọn: ", indexSelect);
    setIdPhim(data.lichChieuPhimData[indexSelect].movie.id)
    console.log(idPhim);
    theatersApi.getThongTinLichCoNgay(data.lichChieuPhimData[indexSelect].movie.id, idRap, data.setNgayXem)
    .then((response) => {
      console.log("all lịch chiếu: ",response.data.data.content);
      const lichChieuPhimDataSelected = (response.data.data.content || []).filter(item => item.startDate === e.target.value || (item.startDate && item.startDate.slice(0, 10) === e.target.value))
      const suatChieuRender = lichChieuPhimDataSelected.map((item) => {
        return item;
      });
      setData((data) => ({
        ...data,
        suatChieuRender,
        lichChieuPhimDataSelected,
        maPhim:idPhim,
      }));
    })
    .catch((err) => {
      console.log(err);
    });


  };
  console.log(data);
  // input: suatChieu
  // output: setSuatChieu(suatChieu), maLichChieu(suatChieu)[maLichChieu]

  // Chọn suất chiếu nè--------------
  const handleSelectSuatChieu = (e) => {
    setData((data) => ({
      ...data,
      setSuatChieu: e.target.value,
      // reset
      maLichChieu: "",
      maRap:"",
      maPhong:"",
      maPhim:""
    }));
    const indexMaLichChieuSelect = data.lichChieuPhimData.findIndex(
      (item) => item.startTime.slice(0,8) === e.target.value
    );
    // console.log('====================================');
    // console.log(data?.lichChieuPhimDataSelected[indexMaLichChieuSelect]?.movie?.id);
    // console.log('====================================');
    // Lấy được cái mã lịch chiếu rồi
    // Lấy được cái mã lịch chiếu rồi
    // Lấy được cái mã lịch chiếu rồi
    const maLichChieu =data?.lichChieuPhimData[indexMaLichChieuSelect]?.id;
    const maRap = data?.lichChieuPhimData[indexMaLichChieuSelect]?.branch?.id;
    const maPhong = data?.lichChieuPhimData[indexMaLichChieuSelect]?.room?.id;
    const maPhim = data?.lichChieuPhimData[indexMaLichChieuSelect]?.movie?.id;
    // console.log("maPhim: ", maPhim);
    setData((data) => ({ ...data, maLichChieu, maRap, maPhong, maPhim }));
    
    dispatch({
      type: INIT_DATA,
      payload: {
        ...data,
        thongTinPhongVe: data,
      },
      });
    console.log(thongTinPhongVe);
  };

  useEffect(() =>{
    dispatch({
      type: INIT_DATA,
      payload: {
        ...data,
        thongTinPhongVe: data,
      },
      });
    // console.log(thongTinPhongVe);
  },[data])

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

  var todayDate = new Date().toISOString().slice(0, 10);
  // console.log(todayDate);
  var day = new Date()
  // console.log(day.getDate());
  var newday = day.getDate() + 7
  day.setDate(newday)
  // console.log(day.toISOString().slice(0, 10));
  var afterDate = day.toISOString().slice(0, 10)

  return (
    <div className={classes.search} id="searchTickets">
      <FormControl focused={false} className={classes.itemFirst}>
        <div style={{display: "flex", alignItems: "center"}}><span style={{display: "flex", justifyContent: "center", alignItems: "center", minWidth: 24, minHeight: 24, borderRadius: "50%", backgroundColor: "#e87722", color: "white", marginRight: 8, fontSize: 14, fontWeight: "bold"}}>1</span><input type="date"
          style={{ height:"100%", fontWeight:"bold", cursor:"pointer"}}
          min= {todayDate}
          max= {afterDate}
          required
          onChange={(e) => {
            handleSelectNgayChieu(e);  
          }}
          
          // onChange={(e) => {console.log(e.target.value);}}
          
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
          noOptionsText="Không tìm thấy!" /></div>
      </FormControl>
{/* rạp-------- */}
      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`} style={{ opacity: data.setNgayXem ? 1 : 0.5 }}
        focused={false} >
        <Select
          open={data?.openCtr?.rap}
          onClose={handleCloseRap}
          onOpen={handleOpenRap}
          onChange={handleSelectRap}
          value={data?.setRap} // tenCumRap
          renderValue={(value) => (<div style={{display: 'flex', alignItems: 'center'}}><span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>2</span>{value ? value : "Rạp"}</div>)} // hiển thị giá trị đã chọn
          displayEmpty
          IconComponent={ExpandMoreIcon}
          MenuProps={menuProps}
        >
          <MenuItem
            value=""
            style={{ display: data?.rapRender?.length > 0 ? "none" : "block" }}
            classes={{ root: classes.menu__item }}
          >
            {data?.setRap
              ? `${
                  data?.startRequest
                    ? data?.errorCallApi
                      ? data?.errorCallApi
                      : "Đang tìm rạp!"
                    : "Không có rạp chiếu, vui lòng chọn ngày khác!"
                }`
              : "Vui lòng chọn ngày!"}
          </MenuItem>
          {data?.rapRender?.map((item) => (
            <MenuItem
              value={item?.name}
              key={item.id}
              classes={{
                root: classes.menu__item,
                selected: classes["menu__item--selected"],
              }}
            >
              {item?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`} style={{ opacity: data.setPhim ? 1 : 0.5 }}
        focused={false} >
        <Select
          open={data.openCtr.ngayXem}
          onClose={handleCloseNgayXem}
          onOpen={handleOpenNgayXem}
          onChange={handleSelectNgayXem}
          value={data.setPhim} // ngayChieu
          renderValue={(value) => (<div style={{display: 'flex', alignItems: 'center'}}><span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>3</span>{value ? value : "Chọn phim"}</div>)}
          displayEmpty
          IconComponent={ExpandMoreIcon}
          MenuProps={menuProps}
        >
          <MenuItem
            value=""
            style={{
              display: data?.cumPhimRender?.length > 0 ? "none" : "block",
            }}
            classes={{ root: classes.menu__item }}
          >
            {/* {data?.lichChieuPhimData?.length === 0 && "Không có phim được chiếu!"} */}
            {/* {
            data.setRap && data.cumPhim.length === 0 ? "Không phim nào, vui lòng chọn rạp khác" : null
            } */}
            Không có lịch chiếu!
          </MenuItem>
          {data?.cumPhimRender?.map((phim) => (
            <MenuItem
              value={phim}
              key={phim}
              classes={{
                root: classes.menu__item,
                selected: classes["menu__item--selected"],
              }}
            >
              {/* <div>{formatDate(ngayChieu).dayToday}</div>
              <div>{formatDate(ngayChieu).dateShort}</div> */}
              {phim}
            </MenuItem>
          ))}

        </Select>
      </FormControl>

{/* Chọn xuất chiếu nè */}
      <FormControl
        className={`${classes["search__item--next"]} ${classes.search__item}`} style={{ opacity: data.setRap ? 1 : 0.5 }}
        focused={false} >
        <Select
          open={data.openCtr.suatChieu}
          onClose={handleCloseSuatChieu}
          onOpen={handleOpenSuatChieu}
          onChange={handleSelectSuatChieu}
          value={data.setSuatChieu} // suatChieu
          renderValue={(value) => (<div style={{display: 'flex', alignItems: 'center'}}><span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 24, minHeight: 24, borderRadius: '50%', backgroundColor: '#e87722', color: 'white', marginRight: 8, fontSize: 14, fontWeight: 'bold'}}>4</span>{value ? value : "Suất chiếu"}</div>)}
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
              {suatChieu.room.name} chiếu lúc {suatChieu.startTime}
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
              `/datvechitiet/${data?.maLichChieu}/${data?.maRap}/${data?.maPhim}/${data?.setNgayXem}/${data.maPhong}/${data?.setSuatChieu}`,
              `/datvechitiet/${data?.maLichChieu}/${data?.maRap}/${data?.maPhim}/${data?.setNgayXem}/${data.maPhong}/${data?.setSuatChieu}`
            )
          }
        >
          Mua vé nhanh
        </Button>
      </FormControl>
    </div>
  );
}

ChooseByDate.propTypes = {
  smDown: PropTypes.bool,
};
