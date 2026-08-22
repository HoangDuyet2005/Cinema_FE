import React from "react";
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  Export,
  Legend,
  Margin,
  Title as ChartTitle,
  Subtitle,
  Tooltip,
  Grid,
  Tick,
} from 'devextreme-react/chart';
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function TicketPerDay({ dashboardData }) {
  const data = dashboardData || {};

  return (
    <Card 
      bordered={false} 
      style={{ height: '100%', borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12)' }}
    >
      <Title level={5} style={{ marginBottom: 24, color: '#1890ff', textTransform: 'uppercase' }}>
        Số lượng giao dịch theo ngày
      </Title>
      
      {data?.dayTransactionReports?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Không có dữ liệu hiển thị!</div>
      ) : (
        <Chart
          palette="Violet"
          dataSource={data.dayTransactionReports || []}
        >
          <CommonSeriesSettings
            argumentField="dateTran"
            type="line"
          />
          <Series key="transactionCount" valueField="transactionCount" name="Số lượng Giao dịch" />
          <Margin bottom={20} />
          <ArgumentAxis
            valueMarginsEnabled={false}
            discreteAxisDivisionMode="crossLabels"
          >
            <Grid visible={true} />
            <Tick visible={true} />
          </ArgumentAxis>
          <Legend
            verticalAlignment="bottom"
            horizontalAlignment="center"
            itemTextPosition="bottom"
          />
          <Export enabled={true} />
          <Tooltip enabled={true} />
        </Chart>
      )}
    </Card>
  );
}