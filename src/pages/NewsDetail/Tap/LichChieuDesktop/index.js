import React, { useEffect, useState } from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import useStyles from './style'
import RightSection from './RightSection';
import theatersApi from '../../../../api/theatersApi';

export default function LichChieuDesktop({ data }) {

  const [rap, setRap] = useState({
    rapRender: [],
    cumRapChieuData: [],
  });

  const classes = useStyles();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    theatersApi.getThongTinLichChieuHeThongRap()
      .then((response) => {
        console.log("all branch: ",response);
        setRap(response?.data?.data?.content);
        const cumRapChieuData= response?.data?.data?.content?.reduce(
          (colect, item) => {
            console.log(item);
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
        console.log(err);
      });
  },[])

  console.log("Rạp: ",rap);

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        classes={{ root: classes.leftSection, indicator: classes.indicator }}
      >
        {/* xuất ra các cái branch */}
        {rap?.cumRapChieuData?.map(theater => (
          <Tab disableRipple key={theater.id} classes={{ wrapper: classes.wrapper, root: classes.tabRoot }} label={
            <>
              <img className={classes.logo} src={theater.imgURL} alt="logoTheater" />
              <span>{theater.name}</span>
            </>
          } />
        ))}
      </Tabs>
      {/* Để xuất ra các cái thông tin brach cụ thể */}
      <div className={classes.rightSection}>
        {rap?.cumRapChieuData?.length === 0 && <p style={{ padding: 10 }}>No show time for this film!</p>}
        {rap?.cumRapChieuData?.map((theater, i) => (
          <div key={theater.id} style={{ display: value === i ? "block" : "none" }}>
            <RightSection branch={theater} idRap={theater.id} />
          </div>
        ))}
      </div>
    </div >
  );
}


