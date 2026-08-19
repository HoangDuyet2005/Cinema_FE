import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";
import billsApi from "../../../api/billsApi"
import { useDispatch, useSelector } from "react-redux";
import { getUsersList, resetUserList } from "../../../reducers/actions/UsersManagement";

import { Chart } from "react-google-charts";


const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

export default function UserDash() {
    const dispatch = useDispatch();

    const {
        usersList,
      } = useSelector((state) => state.usersManagementReducer);

  useEffect(() => {
    // get list user lần đầu
    if (!usersList) {
      dispatch(getUsersList());
    }
    return () => dispatch(resetUserList());
  }, []);


    const [data3, setData3] = useState({})

    useEffect(() => {
    billsApi.getBillDashBoardSortAZ()
    .then((res) =>{
        console.log("Êhhehehe",res);
        setData3(
        res?.data
        )
    })
    .catch((err) =>{
        console.log(err);
    })
    },[])

    const data4 = [
      ["Task", "Hours per Day"],
      ["Số lượng tài khoản đăng ký", usersList?.data?.length],
      ["Số khách dùng dịch vụ", data3?.length],
      ["Số khách chưa dùng DV đặt vé", usersList?.data?.length - data3?.length],
    ];
    const options = {
      title: "Tỷ lệ khách hàng dùng dịch vụ",
    };


  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Số lượng người dùng đăng ký</Title>
      <Typography component="p" variant="h4">
        {/* {data2?.totalIncome}VND */}
        {usersList?.data?.length}{" "}người
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        Từ 01/12/2022 - 01/12/2023
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext} variant="h6">
        Số người dùng dùng dịch vụ: <span style={{color:"red"}}>{data3?.length}{" "} người</span>
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext} variant="h6">
        Số người dùng chưa đặt vé: <span style={{color:"red"}}>{usersList?.data?.length - data3?.length}{" "} người</span>
      </Typography>

      <Chart
      chartType="PieChart"
      data={data4}
      options={options}
      width={"100%"}
      height={"200px"}
    />
    </React.Fragment>
  );
}
