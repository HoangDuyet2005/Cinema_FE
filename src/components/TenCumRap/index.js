import React from 'react'

import useStyles from './style'
import { colorTheater } from '../../constants/theaterData'

export default function TenCumRap({ tenCumRap, testSize, giaVe}) {

  const classes = useStyles({ color: colorTheater[tenCumRap?.slice(0, 3).toUpperCase()], testSize })

  return <p className={classes.text__first}><span>{tenCumRap?.split("-")[0]}</span>
          {/* <span className={classes.text__second}> - GIÁ VÉ: 70.000đ </span></p> */}
          <span className={classes.text__second}> - Giá vé: {`${giaVe?.toLocaleString("vi-VI")}đ`}</span></p>
}
