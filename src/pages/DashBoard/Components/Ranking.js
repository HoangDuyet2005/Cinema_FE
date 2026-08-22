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
} from 'devextreme-react/chart';
import AnnotationTemplate from './AnnotationTemplate.js';
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function Ranking({ userDashboardData }) {
  const data = userDashboardData || [];
  
  // Sort and get top 5 users based on incomeAmount
  const top5Users = [...data].sort((a, b) => b.incomeAmount - a.incomeAmount).slice(0, 5);

  return (
    <Card 
      bordered={false} 
      style={{ height: '100%', borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12)' }}
    >
      <Title level={5} style={{ marginBottom: 24, color: '#1890ff', textTransform: 'uppercase' }}>
        Top 5 người dùng chi tiêu nhiều nhất
      </Title>
      
      {top5Users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>Không có dữ liệu hiển thị!</div>
      ) : (
        <Chart
          id="chart"
          dataSource={top5Users}
        >
          <CommonSeriesSettings
            argumentField="name"
            type="bar"
            hoverMode="allArgumentPoints"
            selectionMode="allArgumentPoints"
          >
          </CommonSeriesSettings>
          
          <Series
            argumentField="name"
            valueField="incomeAmount"
            name="Doanh thu"
            type="bar"
            color="#ffaa66"
          />

          <Margin bottom={20} />
          
          <ArgumentAxis
            valueMarginsEnabled={false}
            discreteAxisDivisionMode="crossLabels"
          >
            <Grid visible={true} />
          </ArgumentAxis>
          <Legend
            verticalAlignment="bottom"
            horizontalAlignment="center"
            itemTextPosition="bottom"
          />
          <Export enabled={true} />
          <Tooltip
            enabled={true}
          />
        </Chart>
      )}
    </Card>
  );
}
