import React, { useEffect, useState } from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import useStyles from './style'
import RightSection from './RightSection';
import theatersApi from '../../../api/theatersApi';
import moviesApi from '../../../api/moviesApi';
import { useSelector } from 'react-redux';
import ItemCumRap from '../../../components/ItemCumRap';

export default function LichChieuDesktopTheoNgay() {

  const [rap, setRap] = useState({
    rapRender: [],
    cumRapChieuData: [],
    danhSachPhim:[],
  });
  const { theaterList: theaterRender, errorTheaterList } = useSelector(
    (state) => state.theaterReducer
  );
  const [phim, setPhim] = useState([]);

  const classes = useStyles();

  const [value, setValue] = React.useState(0);
  const [value1, setValue1] = React.useState(0);
  const [idPhim, setIdPhim] = React.useState(7);
  const [ngay, setNgay] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeNgay = (event, newValue) => {
    setNgay(newValue);
  };


  const handleChange1 = (event, newValue) => {
    setValue1(newValue);
    // console.log("dkshbdjhs",value1);
  };

  const handlerOn = (event) => {
    // console.log(event);
    setIdPhim(event)
    // setValue1(event);
  };

  const [data, setData] = useState({

    maPhim:"",
    maRap:"",
    maPhong:"",

    setPhim: "",
    rapRender: [],
    cumRapChieuData: [],

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
  })

  const handleSelectNgayChieu =(e) =>{
    // console.log(e.target.value);
    handleChangeNgay(false);
    setData((data) => ({
      ...data,
      maPhim:"",
      maRap:"",
      maPhong:"",
  
      setPhim: "",
      rapRender: [],
      cumRapChieuData: theaterRender?.data?.content,
  
      // handleSelectRap
      setRap: "",
      ngayChieuRender: [],
      lichChieuPhimData: [],
  
      // handleSelectNgayXem
      setNgayXem: e.target.value,
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
  
      // handleSelectSuatChieu
      setSuatChieu: "",
      maLichChieu: "",
    }))
  }

  const handleChonRap = (theater) =>{
    // console.log("vừa chọn: ", theater.id);

    setData((data) => ({
      ...data,
      maPhim:"",
      maRap:theater.id,
      maPhong:"",
  
      setPhim: "",
      rapRender: [],
      cumRapChieuData: theaterRender?.data?.content,
  
      // handleSelectRap
      setRap: theater.name,
      ngayChieuRender: [],
      lichChieuPhimData: [],
  
      // handleSelectNgayXem
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
  
      // handleSelectSuatChieu
      setSuatChieu: "",
      maLichChieu: "",
    }))
    theatersApi.getThongTinLichChieuHeThongRapTheoNgayVaRap(data.maRap, data.setNgayXem)
    .then((response) => {
      // console.log("all lịch chiếu: ",response?.data?.data?.content);
      const lichChieuPhimData = response?.data?.data?.content
      const cumPhimRender = lichChieuPhimData.map((item) => {
        return item.movie.name
      });
      const phimChieuRenderRemoveDuplicates = [...new Set(cumPhimRender)]; 
      setData((data) => ({
        ...data,
        cumPhim: phimChieuRenderRemoveDuplicates,
        cumPhimRender,
        lichChieuPhimData:lichChieuPhimData
      }));
    })
    .catch((err) => {
      // console.log(err);
    });
  }

  const handlerChonPhim = (phim) => { //chọn phim á
    setData((data) => ({
      ...data,
      // reset
      setPhim:phim,
      suatChieuRender: [],
      lichChieuPhimDataSelected: [],
      // lichChieuPhimData: [],
      setSuatChieu: "",
      maLichChieu: "",
      // cumPhim:[],
      // cumPhimRender:[],
      // maPhim:""
    }));
   
    // console.log(phim);

    const indexSelect = data.lichChieuPhimData.findIndex(
      (item) => item.movie.name === phim
      
    ); 
    // lấy ra lichChieuPhimData của một cụm rạp đã chọn, item lichChieuPhimData có thể giống ngày nhưng khác giờ chiếu
    // console.log("indexSelect: ", data?.lichChieuPhimData[indexSelect]?.movie?.id);
    // console.log("set id phim chọn: ", indexSelect);
    // setIdPhim(data.lichChieuPhimData[indexSelect].movie.id)
    // console.log(idPhim);
    theatersApi.getThongTinLichCoNgay(data.lichChieuPhimData[indexSelect].movie.id, data.maRap, data.setNgayXem)
    .then((response) => {
      // console.log("all ngày chiếu: ",response.data.data.content);
      const lichChieuPhimDataSelected = response.data.data.content
      const suatChieuRender = lichChieuPhimDataSelected.map((item) => {
        // if(new Date(item.startDate).getTime() > new Date().getTime())
        return item;
      });

      // const filteredArray = suatChieuRender.filter((element) => {
      //   return element !== undefined;
      // });
      // console.log("filteredArray: ", filteredArray);
      
      setData((data) => ({
        ...data,
        suatChieuRender,
        lichChieuPhimDataSelected,
        maPhim:data?.lichChieuPhimData[indexSelect]?.movie?.id,
      }));
    })
    .catch((err) => {
      // console.log(err);
    });


  };


  useEffect(() => {
    moviesApi.getDanhSachPhim()
      .then((response) => {
        // console.log("all Phim: ",response);
        setPhim(response?.data?.data);
        // const cumRapChieuData= response?.data?.data?.reduce(
        //   (colect, item) => {
        //     console.log(item);
        //     return [...colect, item];
        //   },
        //   []
        // );
        // const rapRender = cumRapChieuData
        // const rapRender = cumRapChieuData.map((item) => item)
        // setRap((rap) => ({
        //   ...rap,
        //   rapRender,
        //   cumRapChieuData,
        // }));
      })
      .catch((err) => {
        // console.log(err);
      });
  },[])

  // console.log(value1, value);
  
  useEffect(() => {
    theatersApi.getThongTinLichChieuHeThongRap()
      .then((response) => {
        // console.log("all branch: ",response);
        setRap(response?.data?.data?.content);
        const cumRapChieuData= response?.data?.data?.content?.reduce(
          (colect, item) => {
            // console.log(item);
            return [...colect, item];
          },
          []
        );
        // const rapRender = cumRapChieuData
        const rapRender = cumRapChieuData.map((item) => item)
        setRap((rap) => ({
          ...rap,
          rapRender,
          cumRapChieuData,
        }));
      })
      .catch((err) => {
        // console.log(err);
      });
  },[])

  // console.log("data: ",data);

  var todayDate = new Date().toISOString().slice(0, 10);
  // console.log(todayDate);
  var day = new Date()
  // console.log(day.getDate());
  var newday = day.getDate() + 7
  day.setDate(newday)
  // console.log(day.toISOString().slice(0, 10));
  var afterDate = day.toISOString().slice(0, 10)

  return (
    <div className={classes.root}>
      <div>
      <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn ngày</h5>
      <input
          type="date"
          style={{ width: 200, fontSize:"1.5rem", fontWeight:"bold", marginLeft:"10px", textAlign:"center"}}
          min= {todayDate}
          max= {afterDate}
          required
          onChange={(e) => {
            handleSelectNgayChieu(e);  
          }}
        />
      </div>

      <Tabs
        orientation="vertical"  
        variant="scrollable"
        value={value}
        onChange={handleChange}

        classes={{ root: classes.leftSection, indicator: classes.indicator }}
      >
        {/* xuất ra các cái branch */}
        <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn rạp</h5>
        {rap?.cumRapChieuData?.map(theater => (
          <Tab disableRipple key={theater.id}
          // value={theater.name}
          disabled={ngay}
          onClick={() => handleChonRap(theater)}
          classes={{ wrapper: classes.wrapper, root: classes.tabRoot }} label={
            <>
              <img className={classes.logo} src={theater.imgURL} alt="logoTheater" />
              <span>{theater.name}</span>
            </>
          } />
        ))}
      </Tabs>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value1}
        onChange={handleChange1}
        classes={{ root: classes.leftSection, indicator: classes.indicator }}
      >
        <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn phim</h5>
        {data?.cumPhim?.map((phim, i) => (
          <Tab disableRipple key={i}classes={{ wrapper: classes.wrapper, root: classes.tabRoot }} 
          onClick={() => handlerChonPhim(phim)}
          label={
            <>
              {/* <img className={classes.logo} src={phim?.smallImageURl} alt="logoTheater" /> */}
              <span>{phim}</span>
            </>
          } />
        ))}
      </Tabs>
      {/* Để xuất ra các cái thông tin brach cụ thể */}
      <Tabs
        orientation="vertical"  
        variant="scrollable"
        value={value}
        onChange={handleChange}
        classes={{ root: classes.rightSection, indicator: classes.indicator }}
      >
        {/* xuất ra các cái branch */}
        <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn suất</h5>
        {/* {rap?.cumRapChieuData?.map(theater => (
          <Tab disableRipple key={theater.id} 
          classes={{ wrapper: classes.wrapper, root: classes.tabRoot }} label={
            <>
              <img className={classes.logo} src={theater.imgURL} alt="logoTheater" />
              <span>{theater.name}</span>
            </>
          } />
        ))} */}
        {
          data?.suatChieuRender?.map((lichChieu) => (
            <>
                <ItemCumRap
                key={lichChieu?.id}
                tenCumRap={lichChieu?.room?.name}
                maLichChieu={lichChieu?.id}
                lichChieuPhim={lichChieu}
                diaChi={lichChieu?.branch?.address}
                defaultExpanded={true}
                maPhim={lichChieu?.movie?.id}
                ngayChieu={lichChieu?.startDate}
                maPhong={lichChieu?.room?.id}
                gioChieu={lichChieu?.startTime}
                maRap={lichChieu?.branch?.id}
                giaVe={lichChieu?.price}
                />    
            </>
          ))
        }
      </Tabs>

      {/* <div className={classes.rightSection}>
        {rap?.cumRapChieuData?.length === 0 && <p style={{ padding: 10 }}>Không có lịch chiếu!</p>}
        {rap?.cumRapChieuData?.map((theater, i) => (
          // <div key={theater.id} style={{ display: value === i ? "block" : "none" }}>
          <div key={theater.id} style={{ display: value === i ? "block" : "none" }}>
            <RightSection branch={theater} idRap={theater.id} idPhim={idPhim} /> 
          </div>
        ))}
      </div> */}
    </div >
  );
}


