import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProTable } from "@ant-design/pro-components";
import { Button, Image, message, Popconfirm, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons";

import { getListBranchByAdminStaff } from "../../reducers/actions/Branch";
import slugify from "slugify";
import FormAddEdit from "./FormAddEdit";

export default function BranchManagement() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const selectedBranch = useRef(null);
  const actionRef = useRef();

  const { branchList, loadingBranchList } = useSelector(
    (state) => state.branchManagementReducer
  );

  useEffect(() => {
    if (!branchList) {
      dispatch(getListBranchByAdminStaff());
    }
  }, [branchList, dispatch]);

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!branchList) return [];
    return branchList.filter((branch) => {
      if (!searchParams.name) return true;
      const matchName = slugify(branch?.name ?? "", modifySlugify)?.indexOf(slugify(searchParams.name, modifySlugify)) !== -1;
      const matchPhone = slugify(branch?.phoneNo ?? "", modifySlugify)?.indexOf(slugify(searchParams.name, modifySlugify)) !== -1;
      const matchAddress = slugify(branch?.address ?? "", modifySlugify)?.indexOf(slugify(searchParams.name, modifySlugify)) !== -1;
      return matchName || matchPhone || matchAddress;
    });
  };

  const handleFeatureNotImplemented = () => {
    message.info("Tính năng xóa đang được phát triển trên Backend!");
  };

  const handleEdit = (branch) => {
    selectedBranch.current = branch;
    setOpenModal(true);
  };

  const handleAdd = () => {
    selectedBranch.current = null;
    setOpenModal(true);
  };

  const handleReload = () => {
    dispatch(getListBranchByAdminStaff());
    setSearchParams({});
  };

  const onUpdate = (updatedBranch) => {
    setOpenModal(false);
    dispatch(getListBranchByAdminStaff());
  };

  const onAdd = (newBranch) => {
    setOpenModal(false);
    dispatch(getListBranchByAdminStaff());
  };

  const columns = [
    {
      title: "Mã chi nhánh",
      dataIndex: "id",
      search: false,
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
    },
    {
      title: "Hình ảnh",
      dataIndex: "imgURL",
      search: false,
      render: (text) => (
        <Image
          width={80}
          height={60}
          src={text}
          fallback="https://via.placeholder.com/80x60?text=No+Image"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      copyable: true,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      search: false,
      ellipsis: true,
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNo",
      search: false,
      sorter: (a, b) => (a.phoneNo || "").localeCompare(b.phoneNo || ""),
    },
    {
      title: "Hành động",
      valueType: "option",
      render: (text, record) => [
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        >
          Sửa
        </Button>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa chi nhánh này?"
          onConfirm={handleFeatureNotImplemented}
          okText="Có"
          cancelText="Không"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loadingBranchList}
        onSubmit={(params) => setSearchParams(params)}
        onReset={() => setSearchParams({})}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: "auto",
        }}
        dateFormatter="string"
        headerTitle="Danh sách Chi nhánh rạp"
        toolBarRender={() => [
          <Button key="reload" type="default" icon={<ReloadOutlined />} onClick={handleReload}>
            Làm mới
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm chi nhánh
          </Button>,
        ]}
      />

      <Modal
        title={selectedBranch?.current?.name ? `Sửa chi nhánh: ${selectedBranch?.current?.name}` : "Thêm chi nhánh mới"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {openModal && (
          <FormAddEdit
            key={selectedBranch.current?.id || "add"}
            selectedBranch={selectedBranch.current}
            onUpdate={onUpdate}
            onAdd={onAdd}
          />
        )}
      </Modal>
    </div>
  );
}
