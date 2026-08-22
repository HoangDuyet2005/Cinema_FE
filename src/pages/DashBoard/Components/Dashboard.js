import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import { DatePicker, Select, Button, Statistic, Row, Col, Card, message } from "antd";
import moment from "moment";
import * as XLSX from "xlsx";

import billsApi from "../../../api/billsApi";
import branchApi from "../../../api/branchApi";
import moviesApi from "../../../api/moviesApi";

import Deposits from "./Deposits";
import Orders from "./Orders";
import ChartSideBySide from "./ChartSideBySide";
import TicketPerDay from "./TicketPerDay";
import UserDash from "./UserDash";
import Ranking from "./Ranking";
import TopMovies from "./TopMovies";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

function Copyright() {
  const classes = useStyles();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        WORLD CINEMA Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  paper: {
    padding: "0.5rem",
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: "auto",
  },
  filterBar: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    flexWrap: "wrap",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12)",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  // Filters State
  const [dates, setDates] = useState([moment().subtract(30, "days"), moment()]);
  const [branchId, setBranchId] = useState(0);
  const [movieId, setMovieId] = useState(0);

  // Dropdown Data
  const [branches, setBranches] = useState([]);
  const [movies, setMovies] = useState([]);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState({});
  const [userDashboardData, setUserDashboardData] = useState([]);

  useEffect(() => {
    // Load dropdowns
    branchApi.getListBranchByAdminStaff().then((res) => {
      setBranches(res?.data?.data || []);
    }).catch(() => setBranches([]));
    
    moviesApi.getTatCaDanhSachPhimDangSapDaChieu().then((res) => {
      setMovies(res?.data?.data || []);
    }).catch(() => setMovies([]));
  }, []);

  const handleFilter = () => {
    if (!dates || dates.length !== 2) {
      message.error("Vui lòng chọn khoảng thời gian hợp lệ!");
      return;
    }
    const fromDate = dates[0].format("YYYY-MM-DD");
    const toDate = dates[1].format("YYYY-MM-DD");

    if (dates[0].isAfter(dates[1])) {
      message.error("Khoảng thời gian không hợp lệ!");
      return;
    }

    // Fetch Bill Dashboard
    billsApi.getBillDashBoard(fromDate, toDate, branchId, movieId)
      .then((res) => {
        setDashboardData(res.data);
      })
      .catch((err) => {
        message.error("Lỗi khi tải dữ liệu thống kê giao dịch!");
      });

    // Fetch User Dashboard
    billsApi.getBillDashBoardSortAZ(fromDate, toDate, branchId, movieId)
      .then((res) => {
        setUserDashboardData(res.data);
      })
      .catch((err) => {
        message.error("Lỗi khi tải dữ liệu thống kê người dùng!");
      });
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, []);

  const handleExport = () => {
    if (!dashboardData || !dashboardData.dayTransactionReports) {
      message.warning("Không có dữ liệu để xuất!");
      return;
    }

    const reportData = dashboardData.dayTransactionReports.map((item) => ({
      "Ngày": item.dateTran,
      "Số giao dịch": item.transactionCount,
      "Số vé bán ra": item.ticketAmount,
      "Doanh thu (VND)": item.incomeAmount,
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ThongKe");
    XLSX.writeFile(wb, `BaoCao_DoanhThu_${moment().format("DDMMYYYY")}.xlsx`);
  };

  return (
    <div className={classes.root} style={{ marginLeft: "1rem", marginRight: "1rem" }}>
      <CssBaseline />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        
        {/* Bộ lọc */}
        <div className={classes.filterBar}>
          <RangePicker 
            value={dates} 
            onChange={(val) => setDates(val)} 
            format="DD/MM/YYYY" 
            allowClear={false} 
            style={{ width: 250 }} 
          />
          <Select
            showSearch
            placeholder="Chọn cụm rạp"
            value={branchId}
            onChange={(val) => setBranchId(val)}
            style={{ width: 200 }}
            optionFilterProp="children"
          >
            <Option value={0}>Tất cả cụm rạp</Option>
            {branches.map((b) => (
              <Option key={b.id} value={b.id}>{b.name}</Option>
            ))}
          </Select>
          <Select
            showSearch
            placeholder="Chọn phim"
            value={movieId}
            onChange={(val) => setMovieId(val)}
            style={{ width: 200 }}
            optionFilterProp="children"
          >
            <Option value={0}>Tất cả phim</Option>
            {movies.map((m) => (
              <Option key={m.id} value={m.id}>{m.name}</Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleFilter}>
            Áp dụng
          </Button>
          <Button type="default" onClick={handleExport} style={{ marginLeft: "auto" }}>
            Xuất báo cáo
          </Button>
        </div>

        {/* Tổng quan chỉ số */}
        <Grid container spacing={3} style={{ marginBottom: 24 }}>
          <Grid item xs={12} md={4}>
            <Card style={{ borderRadius: 8 }}>
              <Statistic 
                title="Tổng doanh thu" 
                value={dashboardData.totalIncome || 0} 
                precision={0} 
                suffix="VND" 
                valueStyle={{ color: '#3f8600' }} 
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ borderRadius: 8 }}>
              <Statistic 
                title="Tổng vé bán ra" 
                value={dashboardData.totalTicket || 0} 
                valueStyle={{ color: '#1890ff' }} 
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card style={{ borderRadius: 8 }}>
              <Statistic 
                title="Tỷ lệ lấp đầy trung bình" 
                value={dashboardData.averageOccupancyRate || 0} 
                precision={2} 
                suffix="%" 
                valueStyle={{ color: '#cf1322' }} 
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Top 5 Phim & User */}
          <Grid item xs={12} md={6}>
            <TopMovies data={dashboardData.topMovies} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={fixedHeightPaper}>
              <Ranking userDashboardData={userDashboardData} />
            </Paper>
          </Grid>

          {/* Biểu đồ */}
          <Grid item xs={12} md={6} lg={12}>
            <Paper className={fixedHeightPaper}>
              <TicketPerDay dashboardData={dashboardData} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <Paper className={fixedHeightPaper}>
              <ChartSideBySide dashboardData={dashboardData} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Paper className={fixedHeightPaper}>
              <Deposits dashboardData={dashboardData} dates={dates} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Paper className={fixedHeightPaper}>
              <UserDash userDashboardData={userDashboardData} dates={dates} />
            </Paper>
          </Grid>

          {/* Khách hàng thân thiết */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Orders userDashboardData={userDashboardData} dates={dates} />
            </Paper>
          </Grid>
        </Grid>

        <Copyright />
      </main>
    </div>
  );
}
