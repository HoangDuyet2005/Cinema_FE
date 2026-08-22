import React, { useEffect, useState } from "react";
import billsApi from "../../../api/billsApi";
import { Statistic, Row, Col, Typography } from "antd";
import { Chart } from "react-google-charts";

const { Title, Text } = Typography;

export default function DepositsHetHan() {
  const [data, setData] = useState({
    totalTransaction: 0,
  });

  const [data2, setData2] = useState({
    totalIncome: 0,
    totalTransaction: 0,
    dayTransactionReports: [],
  });

  useEffect(() => {
    billsApi.getBillDashBoard()
      .then((res) => {
        setData(res?.data || {});
      })
      .catch((err) => console.log(err));

    billsApi.getBillDashBoardHetHan()
      .then((res) => {
        setData2(res?.data || {});
      })
      .catch((err) => console.log(err));
  }, []);

  const chartData = [
    ["Loại", "Số lượng"],
    ["GD thành công", data?.totalTransaction || 0],
    ["GD thất bại", data2?.totalTransaction || 0],
  ];

  const options = {
    title: "Tỷ lệ giao dịch thất bại",
    pieHole: 0.4,
    colors: ['#52c41a', '#f5222d'],
    chartArea: { width: '100%', height: '80%' },
    legend: { position: 'bottom' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title level={5} style={{ color: '#8c8c8c', marginBottom: 16 }}>Giá trị vé hết hạn</Title>
      
      <Statistic 
        value={data2?.totalIncome || 0} 
        precision={0} 
        suffix="VND" 
        valueStyle={{ color: '#cf1322', fontSize: '32px', fontWeight: 'bold' }} 
      />
      
      <Text type="secondary" style={{ marginBottom: 16 }}>Từ 01/12/2022 - 01/12/2023</Text>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Statistic title="GD thất bại" value={data2?.totalTransaction || 0} valueStyle={{ color: '#cf1322', fontSize: '18px' }} />
        </Col>
        <Col span={12}>
          <Statistic title="Số ngày GD" value={data2?.dayTransactionReports?.length || 0} suffix="ngày" valueStyle={{ fontSize: '18px' }} />
        </Col>
      </Row>

      <div style={{ flex: 1, minHeight: 200 }}>
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width={"100%"}
          height={"100%"}
        />
      </div>
    </div>
  );
}
