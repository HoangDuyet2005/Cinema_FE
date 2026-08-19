import React, { memo, useEffect } from 'react';

import LstPhim from '../LstPhim'
import useStyles from './style'
import { underLine, customScrollbar } from '../../../../styles/materialUi'
import FakeImgTheater from '../../../../components/FakeImgTheater/fakeImgTheater';
import TenCumRap from '../../../../components/TenCumRap';
import moviesApi from '../../../../api/moviesApi';

function LstCumRap(props) {
  const { lstCumRap, color } = props;
  console.log(lstCumRap);
  const [valueCumRap, setValueCumRap] = React.useState(0);
  const [danhSachPhim, setDanhSachPhim] = React.useState([]);
  const classes = useStyles({ underLine, customScrollbar, color });
  const handleChangeCumRap = (e) => {
    setValueCumRap(Number(e.currentTarget.getAttribute("index")));
  };
  useEffect(() =>{
    moviesApi.getDanhSachPhim()
    .then((res) => {
      setDanhSachPhim(res.data.data);
    })
    .catch((err) =>{
      console.log(err);
    })
  },[])

  return (
    <div className={classes.flexCumRap}>
      <div className={classes.lstCumRap}>
        {/* {lstCumRap?.map((cumRap, index) =>
        ( */}
          <div className={classes.cumRap} index={lstCumRap.id} onClick={(e,) => handleChangeCumRap(e)} key={lstCumRap.id} style={{ opacity: valueCumRap === lstCumRap.id ? '1' : '.5' }}>
            <FakeImgTheater nameTheater={lstCumRap.name} imgStyle={classes.cumRap__img} />
            <div className={classes.cumRap__info}>
              <TenCumRap tenCumRap={lstCumRap.name} giaVe={70000} />
              <p className={classes.cumRap__address}>{lstCumRap.address}</p>
            </div>
          </div>
        {/* ) */}
        {/* )} */}
      </div>
      {/* {lstCumRap.map((cumRap, index) => ( */}
        {/* <LstPhim lstPhim={lstCumRap.danhSachPhim} key={lstCumRap.id} hidden={valueCumRap !== lstCumRap.id} /> */}
        <LstPhim idRap={lstCumRap.id} key={lstCumRap.id} hidden={valueCumRap !== lstCumRap.id} listSachPhim={danhSachPhim}/>
      {/* ))} */}
    </div>
  );
}
export default memo(LstCumRap)

