import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import billsApi from "../../../api/billsApi"

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

  const [data2, setData2] = useState({
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

  useEffect(() => {
    billsApi.getBillDashBoardHetHan()
    .then((res) =>{
      console.log("đứhbsjhda",res);
      setData2(
        res?.data
      )
    })
    .catch((err) =>{
      console.log(err);
    })
  },[])

  const data1 = [
    ["Task", "Hours per Day"],
    ["Số lượng giao dịch thành công", data?.totalTransaction],
    ["Số lượng giao dịch thất bại", data2?.totalTransaction],
  ];
  const options = {
    title: "Tỷ lệ giao dịch thất bại",
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Giá trị vé hết hạn</Title>
      <Typography component="p" variant="h4">
        {/* {data2?.totalIncome}VND */}
        {`${data2?.totalIncome.toLocaleString("vi-VI")} VND`}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        Từ 01/12/2022 - 01/12/2023
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext} variant="h6">
        GD không thành công: <span style={{color:"red"}}>{data2?.totalTransaction}</span>
      </Typography>

      <Typography color="textSecondary" className={classes.depositContext} variant="h6">
        Số ngày giao dịch: <span style={{color:"red"}}>{data2?.dayTransactionReports?.length}{" "}ngày</span>
      </Typography>

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
