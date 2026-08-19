import React, { useEffect, useState } from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import useStyles from './style'
import RightSection from './RightSection';
import theatersApi from '../../../api/theatersApi';
import moviesApi from '../../../api/moviesApi';

export default function LichChieuDesktop({ data }) {

  const [rap, setRap] = useState({
    rapRender: [],
    cumRapChieuData: [],
    danhSachPhim:[],
  });
  const [phim, setPhim] = useState([]);

  const classes = useStyles();

  const [value, setValue] = React.useState(); //cho mặc định để hiển thị sẵn
  const [value1, setValue1] = React.useState(); //cho mặc định để hiển thị sẵn
  const [idRap, setIdRap] = React.useState(); //cho mặc định để hiển thị sẵn
  const [idPhim, setIdPhim] = React.useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange1 = (event, newValue) => {
    setValue1(newValue);
    // console.log("dkshbdjhs",value1);
  };

  const handlerOn = (event) => {
    // console.log("Chọn phim: ",event);
    setIdPhim(event)
    // setValue1(event);
  };

  const handlerOn2 = (event) => {
    // console.log("Chọn rạp ",event);
    setIdRap(event)
    // setValue1(event);
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


  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value1}
        onChange={handleChange1}
        classes={{ root: classes.leftSection, indicator: classes.indicator }}
      >
        <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn phim</h5>
        {phim?.map((phim, i) => (
          <Tab disableRipple key={i} onClick={(i) => handlerOn(phim?.id)} classes={{ wrapper: classes.wrapper, root: classes.tabRoot }} label={
            <>
              <img className={classes.logo} src={phim?.smallImageURl} alt="logoTheater" />
              <span>{phim?.name}</span>
            </>
          } />
        ))}
      </Tabs>
      <Tabs
        orientation="vertical"  
        variant="scrollable"
        value={value}
        onChange={handleChange}
        classes={{ root: classes.leftSection, indicator: classes.indicator }}
      >
        <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn rạp</h5>
        {/* xuất ra các cái branch */}
        {rap?.cumRapChieuData?.map(theater => (
          <Tab disableRipple key={theater.id}
          onClick={() => handlerOn2(theater.id)} 
          classes={{ wrapper: classes.wrapper, root: classes.tabRoot }} label={
            <>
              <img className={classes.logo} src={theater.imgURL} alt="logoTheater" />
              <span>{theater.name}</span>
            </>
          } />
        ))}
      </Tabs>
      {/* Để xuất ra các cái thông tin brach cụ thể */}
      <div className={classes.rightSection}>
        {rap?.cumRapChieuData?.length === 0 && <p style={{ padding: 10 }}>Không có lịch chiếu!</p>}
        <h5 style={{textAlign:"center", paddingTop:"1rem", color:"red", fontWeight:"bolder"}}>Chọn ngày có sẵn bên dưới</h5>
        {!idPhim ? <p style={{ padding: 10, fontWeight:"700", fontSize:"large", backgroundColor:"black", color:"white", marginBottom:5 }}>Vui lòng chọn phim!</p> : null}
        {!idRap ? <p style={{ padding: 10, fontWeight:"700", fontSize:"large", backgroundColor:"black", color:"white" }}>Vui lòng chọn rạp!</p> : null}
        {rap?.cumRapChieuData?.map((theater, i) => (
          <div key={theater.id} style={{ display: value === i ? "block" : "none" }}>
            <RightSection idRap={idRap} idPhim={idPhim} /> 
          </div>
        ))}
      </div>
    </div >
  );
}


