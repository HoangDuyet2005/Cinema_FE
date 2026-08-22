import React from "react";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  ValueAxis,
  Title as ChartTitle,
  Export,
  Tooltip,
  Border,
  Grid,
} from 'devextreme-react/chart';
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function ChartSideBySide({ dashboardData }) {
  const data = dashboardData || {};

  return (
    <Card 
      bordered={false} 
      style={{ height: '100%', borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12)' }}
    >
      <Title level={5} style={{ marginBottom: 24, color: '#1890ff', textTransform: 'uppercase' }}>
        Biểu đồ Giao dịch hằng ngày
      </Title>
      
      {data?.dayTransactionReports?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Không có dữ liệu hiển thị!</div>
      ) : (
        <Chart
          id="chart"
          palette="Violet"
          dataSource={data.dayTransactionReports || []}
        >
          <CommonSeriesSettings
            argumentField="dateTran"
            type="bar"
            hoverMode="allArgumentPoints"
            selectionMode="allArgumentPoints"
          >
            <Border visible={true} />
          </CommonSeriesSettings>
          
          <Series
            argumentField="dateTran"
            valueField="ticketAmount"
            name="Số lượng vé"
            type="bar"
            color="#ffaa66"
            axis="ticketAmount"
          />
          <Series
            valueField="incomeAmount"
            name="Doanh thu"
            type="bar"
            color="#03a9f4"
            axis="incomeAmount"
          />
          
          <ValueAxis name="ticketAmount" position="left" title="Số Lượng vé" >
            <Grid visible={true} />
          </ValueAxis>
          <ValueAxis name="incomeAmount" position="right" title="Doanh thu">
            <Grid visible={true} />
          </ValueAxis>

          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          <Export enabled={true} />
          <Tooltip enabled={true} />
        </Chart>
      )}
    </Card>
  );
}