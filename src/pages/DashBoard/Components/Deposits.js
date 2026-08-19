import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import billsApi from "./../../../api/billsApi"

import { Chart } from "react-google-charts";


const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function Deposits() {

  const [data, setData] = useState({
    totalIncome:"",
    totalTicket:"",
    totalTransaction:"",
    listDateTran:[],
  })

  useEffect(() => {
    billsApi.getBillDashBoard()
    .then((res) =>{
      console.log(res);
      setData(
        res?.data
      )
    })
    .catch((err) =>{
      console.log(err);
    })
  },[])

  const data1 = [
    ["Task", "Hours per Day"],
    ["Số vé được đặt", data?.totalTicket],
    ["Số vé Giao dịch", data?.totalTransaction],
  ];
  const options = {
    title: "Tỷ lệ số vé GD/Số vé được đặt",
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Doanh thu đạt được</Title>
      <Typography component="p" variant="h4">
        {`${data?.totalIncome.toLocaleString("vi-VI")} VND`}
        {/* {data?.totalIncome}VND */}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext} >
        Từ 01/12/2022 - 01/12/2023
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext} variant="h6">
        Số vé được đặt: <span style={{color:"red"}}>{data?.totalTicket}{" "} vé</span>
        {/* {`${data?.totalTicket?.toLocaleString("vi-VI")} đ`} */}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext} variant="h6">
        Số GD thành công: <span style={{color:"red"}}>{data?.totalTransaction}</span>
      </Typography>
      {/* <div>
        <Link color="primary" href="javascript:;">
          Xem chi tiết
        </Link>
      </div> */}

    <Chart
      chartType="PieChart"
      data={data1}
      options={options}
      width={"100%"}
      height={"200px"}
    />
  </React.Fragment>
  );
}
