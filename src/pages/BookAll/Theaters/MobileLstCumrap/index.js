import React, { memo } from 'react'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useStyles, Accordion, AccordionSummary, AccordionDetails } from './style'
// import ItemPhim from './ItemPhim';
import TenCumRap from '../../../../components/TenCumRap';
import Address from '../../../../components/ItemCumRap/Address';

import FakeImgTheater from '../../../../components/FakeImgTheater/fakeImgTheater';

function MobileLstCumRap({ lstCumRap }) { 
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (index) => (event, newExpanded) => {
    setExpanded(newExpanded ? index : false);
  };

  return (
    // Này là sửa item = lstCumRap
    <div className={classes.rootCumRap}>
      {/* {lstCumRap?.map((item, index) => ( */}
        <Accordion key={lstCumRap?.name} style={{ direction: "ltr" }} square expanded={expanded === lstCumRap.id} onChange={handleChange(lstCumRap.id)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FakeImgTheater nameTheater={lstCumRap?.name} imgStyle={classes.imgTheater} />
            <div className={classes.wrapInfo} >
              <TenCumRap tenCumRap={lstCumRap?.name} testSize={12} />
              <Address maLichChieu={lstCumRap?.id} diaChiAlreadyExist={lstCumRap?.address} />
            </div>
            <div style={{ clear: "both" }}></div>
          </AccordionSummary>
          {/* <AccordionDetails >
            {(expanded === index) && item?.danhSachPhim?.map((phim) => (
              <ItemPhim key={phim?.tenPhim} phim={phim} />
            ))}
          </AccordionDetails> */}
        </Accordion>
       {/* ))} */}
    </div>
  )
}
export default memo(MobileLstCumRap)
