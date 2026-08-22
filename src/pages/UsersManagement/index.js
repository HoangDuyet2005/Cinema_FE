import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProTable, ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Space, Tag, Avatar } from 'antd';
import { PlusOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import {
  getUsersList,
  deleteUser,
  putUserUpdate,
  postAddUser,
  postAddStaff,
} from '../../reducers/actions/UsersManagement';
import { FAKE_AVATAR } from '../../constants/config';

export default function UsersManagement() {
  const dispatch = useDispatch();
  const actionRef = useRef();
  
  const { usersList, loadingUsersList, successDelete, successUpdateUser, successAddUser } = useSelector(
    (state) => state.usersManagementReducer
  );

  useEffect(() => {
    dispatch(getUsersList());
  }, [dispatch]);

  // Re-fetch when mutations succeed
  useEffect(() => {
    if (successDelete || successUpdateUser || successAddUser) {
      dispatch(getUsersList());
      message.success('Thao tác thành công!');
    }
  }, [successDelete, successUpdateUser, successAddUser, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const handleUpdate = (record) => {
    const data = {
      id: record.id,
      image: record.image || "",
      name: record.name,
      updatedAt: new Date()
    };
    dispatch(putUserUpdate(data));
  };

  const handleAdd = async (values, isStaff) => {
    const dataAdd = {
      name: values.name,
      email: values.email,
      username: values.username,
      password: "123456" // Default password
    };
    if (isStaff) {
      dispatch(postAddStaff(dataAdd));
    } else {
      dispatch(postAddUser(dataAdd));
    }
    return true;
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      valueType: 'avatar',
      search: false,
      render: (dom, record) => (
        <Avatar src={record.image || FAKE_AVATAR} size="large" />
      ),
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      copyable: true,
      editable: false,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      search: false,
      editable: false,
      render: (_, record) => {
        let color = record.role === 'ROLE_ADMIN' ? 'volcano' : record.role === 'ROLE_STAFF' ? 'green' : 'geekblue';
        return <Tag color={color}>{record.role || 'ROLE_USER'}</Tag>;
      },
    },
    {
      title: 'Hành động',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc muốn xóa người dùng này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <a style={{ color: 'red' }}>Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      dataSource={usersList?.data || []}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      loading={loadingUsersList}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="Danh sách Người Dùng"
      editable={{
        type: 'multiple',
        onSave: async (key, row) => {
          handleUpdate(row);
        },
      }}
      toolBarRender={() => [
        <ModalForm
          title="Thêm Nhân Viên Mới"
          trigger={
            <Button type="primary" icon={<UserAddOutlined />}>
              Thêm Nhân Viên
            </Button>
          }
          onFinish={async (values) => {
            await handleAdd(values, true);
            return true;
          }}
        >
          <ProFormText name="username" label="Tài khoản" rules={[{ required: true }]} />
          <ProFormText name="name" label="Họ và tên" rules={[{ required: true }]} />
          <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
        </ModalForm>,
        <ModalForm
          title="Thêm Khách Hàng Mới"
          trigger={
            <Button type="default" icon={<PlusOutlined />}>
              Thêm Khách Hàng
            </Button>
          }
          onFinish={async (values) => {
            await handleAdd(values, false);
            return true;
          }}
        >
          <ProFormText name="username" label="Tài khoản" rules={[{ required: true }]} />
          <ProFormText name="name" label="Họ và tên" rules={[{ required: true }]} />
          <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
        </ModalForm>,
      ]}
    />
  );
}
