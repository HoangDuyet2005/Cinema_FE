import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersList, resetUserList } from "../../../reducers/actions/UsersManagement";
import { Statistic, Row, Col, Typography } from "antd";
import { Chart } from "react-google-charts";

const { Title, Text } = Typography;

export default function UserDash({ userDashboardData, dates }) {
  const dispatch = useDispatch();
  
  const { usersList } = useSelector((state) => state.usersManagementReducer);

  useEffect(() => {
    if (!usersList) {
      dispatch(getUsersList());
    }
    return () => dispatch(resetUserList());
  }, [dispatch, usersList]);

  const totalUsers = usersList?.data?.length || 0;
  const activeUsers = userDashboardData?.length || 0;
  
  const chartData = [
    ["Loại", "Số lượng"],
    ["Chưa giao dịch", totalUsers - activeUsers > 0 ? totalUsers - activeUsers : 0],
    ["Đã giao dịch", activeUsers],
  ];

  const options = {
    pieHole: 0.4,
    is3D: false,
    colors: ['#d9d9d9', '#fa8c16'],
    legend: 'bottom',
    chartArea: { width: '100%', height: '80%' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title level={5} style={{ color: '#8c8c8c', margin: 0, marginBottom: 16 }}>Tỷ Lệ Đăng Ký Người Dùng</Title>
      
      {dates && dates.length === 2 && (
        <Text type="secondary" style={{ marginBottom: 16 }}>
          Từ {dates[0].format("DD/MM/YYYY")} - {dates[1].format("DD/MM/YYYY")}
        </Text>
      )}
      
      <Row gutter={16} style={{ flexGrow: 1 }}>
        <Col span={24} style={{ height: '300px' }}>
          <Chart
            chartType="PieChart"
            width="100%"
            height="100%"
            data={chartData}
            options={options}
          />
        </Col>
      </Row>
    </div>
  );
}
