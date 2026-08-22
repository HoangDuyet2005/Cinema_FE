import React from "react";
import { ProTable } from "@ant-design/pro-components";
import { Tag } from "antd";

export default function Orders({ userDashboardData }) {
  const data = userDashboardData || [];

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Tên",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
      ellipsis: true,
    },
    {
      title: "Số Lượng giao dịch",
      dataIndex: "transactionCount",
    },
    {
      title: "Số Vé Đã mua",
      dataIndex: "ticketAmount",
    },
    {
      title: "Số tiền Chi tiêu",
      dataIndex: "incomeAmount",
      render: (value) => (
        <Tag color="green">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <h5 style={{ color: "#1890ff", textTransform: "uppercase", fontWeight: "bold", margin: 0 }}>
          Khách hàng thân thiết
        </h5>
      </div>
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
          pageSize: 5,
        }}
        search={false}
        dateFormatter="string"
        headerTitle="Khách hàng có giao dịch"
        toolBarRender={false}
        scroll={{ x: 'max-content' }}
        size="small"
      />
    </div>
  );
}
