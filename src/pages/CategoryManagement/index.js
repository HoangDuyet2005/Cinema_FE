import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProTable } from "@ant-design/pro-components";
import { Button, Modal, message } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

import { addCategoryUpload, getListCategoryByAdminStaff } from "../../reducers/actions/Category";
import FormAdd from "./FormAdd";
import slugify from "slugify";

export default function CategoryManagement() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const selectedPhim = useRef(null);

  const { cateList, loadingCateList, loadingAddUploadCate } = useSelector(
    (state) => state.categoryManagementReducer
  );

  useEffect(() => {
    if (!cateList || loadingCateList) {
      dispatch(getListCategoryByAdminStaff());
    }
  }, [cateList, dispatch]);

  const handleReload = () => {
    dispatch(getListCategoryByAdminStaff());
    setSearchParams({});
    message.success("Đã làm mới danh mục");
  };

  const handleAddCate = () => {
    selectedPhim.current = {
      id: "",
      name: "",
    };
    setOpenModal(true);
  };

  const onAddCate = (cateObj) => {
    if (!loadingAddUploadCate) {
      dispatch(addCategoryUpload(cateObj?.name));
      message.success("Đã yêu cầu thêm danh mục");
    }
    setOpenModal(false);
  };

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!cateList) return [];
    return cateList.filter((cate) => {
      if (!searchParams.name) return true;
      const matchName = slugify(cate?.name ?? "", modifySlugify)?.indexOf(slugify(searchParams.name, modifySlugify)) !== -1;
      return matchName;
    });
  };

  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "id",
      search: false,
      sorter: (a, b) => (a.id || "").localeCompare(b.id || ""),
      width: 400,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      copyable: true,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      width: 600,
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <ProTable
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loadingCateList}
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
        headerTitle="Danh sách Danh mục bài viết"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCate}
            loading={loadingAddUploadCate}
          >
            Thêm danh mục
          </Button>,
        ]}
      />

      <Modal
        title={selectedPhim?.current?.name ? `Sửa: ${selectedPhim?.current?.name}` : "Tạo danh mục mới"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        {openModal && (
          <FormAdd
            key={selectedPhim.current?.id || "add_cate"}
            selectedPhim={selectedPhim.current}
            onAddCate={onAddCate}
          />
        )}
      </Modal>
    </div>
  );
}
