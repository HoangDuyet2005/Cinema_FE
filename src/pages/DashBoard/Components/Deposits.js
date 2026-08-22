import React from "react";
import { Statistic, Row, Col, Typography } from "antd";
import { Chart } from "react-google-charts";

const { Title, Text } = Typography;

export default function Deposits({ dashboardData, dates }) {
  const data = dashboardData || {};

  const chartData = [
    ["Loại", "Số lượng"],
    ["Số lượng vé", data?.totalTicket || 0],
    ["Số lượng giao dịch", data?.totalTransaction || 0],
  ];

  const options = {
    pieHole: 0.4,
    is3D: false,
    colors: ['#1890ff', '#fa8c16'],
    legend: 'bottom',
    chartArea: { width: '100%', height: '80%' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title level={5} style={{ color: '#8c8c8c', margin: 0, marginBottom: 16 }}>
        Tổng Quan Cơ Cấu Giao Dịch
      </Title>
      
      {dates && dates.length === 2 && (
        <Text type="secondary" style={{ marginBottom: 16 }}>
          Từ {dates[0].format("DD/MM/YYYY")} - {dates[1].format("DD/MM/YYYY")}
        </Text>
      )}
      
      {data?.totalTicket === 0 && data?.totalTransaction === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Không có dữ liệu hiển thị!</div>
      ) : (
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
      )}
    </div>
  );
}
