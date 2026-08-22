import React from "react";
import { Card, Typography, List, Avatar } from "antd";

const { Title, Text } = Typography;

export default function TopMovies({ data }) {
  return (
    <Card 
      bordered={false} 
      style={{ height: '100%', borderRadius: 8, boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12)' }}
    >
      <Title level={5} style={{ marginBottom: 24, color: '#1890ff', textTransform: 'uppercase' }}>
        Top 5 phim doanh thu cao nhất
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={data || []}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{index + 1}</Avatar>}
              title={<Text strong>{item.name}</Text>}
              description={`Số vé: ${item.ticketAmount}`}
            />
            <div>
              <Text strong style={{ color: '#3f8600' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.incomeAmount)}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
