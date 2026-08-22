import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProTable } from "@ant-design/pro-components";
import { Button, Modal, Popconfirm, message, Tag, Image } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
  getEventsList,
  postAddEvent,
  putEventUpdate,
  resetEventList,
} from "../../reducers/actions/EventsManagement";
import { deleteMovie } from "../../reducers/actions/Movie";

import FormAddEvent from "./FormAddEvent";
import formatDate from "../../utilities/formatDate";
import slugify from "slugify";

export default function EventsManagement() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const selectedPhim = useRef(null);
  const actionRef = useRef();

  const {
    eventList,
    loadingEventList,
    loadingDelete,
    errorDelete,
    successDelete,
    successUpdateEvent,
    loadingAddEvent,
    successAddEvent,
  } = useSelector((state) => state.eventsManagementReducer);

  useEffect(() => {
    if (
      !eventList ||
      successUpdateEvent ||
      successDelete ||
      errorDelete ||
      successAddEvent
    ) {
      dispatch(getEventsList());
    }
  }, [successUpdateEvent, successDelete, errorDelete, successAddEvent, dispatch, eventList]);

  useEffect(() => {
    if (successDelete) message.success("Đã xóa sự kiện thành công!");
    if (successUpdateEvent) message.success("Cập nhật sự kiện thành công!");
    if (successAddEvent) message.success("Thêm sự kiện thành công!");
  }, [successDelete, successUpdateEvent, successAddEvent]);

  useEffect(() => {
    return () => {
      dispatch(resetEventList());
    };
  }, [dispatch]);

  const handleDeleteOne = (maPhim) => {
    if (!loadingDelete) {
      // NOTE: Using deleteMovie action as per the original code logic
      dispatch(deleteMovie(maPhim));
    }
  };

  const handleEdit = (eventItem) => {
    selectedPhim.current = eventItem;
    setOpenModal(true);
  };

  const handleAddMovie = () => {
    selectedPhim.current = {
      brief: "",
      description: "",
      image1: "",
      title: "",
      mainImage: "",
      status: "",
      type: "",
    };
    setOpenModal(true);
  };

  const onUpdate = (movieObj) => {
    dispatch(putEventUpdate(movieObj));
    setOpenModal(false);
  };

  const onAddMovie = (movieObj) => {
    if (!loadingAddEvent) {
      dispatch(postAddEvent(movieObj));
    }
    setOpenModal(false);
  };

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!eventList?.data?.content) return [];
    return eventList.data.content.filter((event) => {
      if (!searchParams.title) return true;
      const matchTitle = slugify(event?.title ?? "", modifySlugify)?.indexOf(slugify(searchParams.title, modifySlugify)) !== -1;
      return matchTitle;
    });
  };

  const renderStatus = (status) => {
    switch (status) {
      case "DENY":
        return <Tag color="red">Bị từ chối</Tag>;
      case "CREATE":
        return <Tag color="gold">Chờ duyệt</Tag>;
      case "DELETE":
        return <Tag color="default">Đã xóa</Tag>;
      default:
        return <Tag color="green">Đã được duyệt</Tag>;
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "mainImage",
      search: false,
      render: (text) => (
        <Image
          width={100}
          height={60}
          src={text}
          fallback="https://via.placeholder.com/100x60?text=No+Image"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      copyable: true,
      ellipsis: true,
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Loại",
      dataIndex: "type",
      search: false,
      render: (text) => <Tag color="blue">{text}</Tag>,
      sorter: (a, b) => (a.type || "").localeCompare(b.type || ""),
    },
    {
      title: "Người viết",
      dataIndex: "createdBy",
      search: false,
      sorter: (a, b) => (a.createdBy || "").localeCompare(b.createdBy || ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      search: false,
      render: (text) => renderStatus(text),
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      search: false,
      render: (text) => (text ? formatDate(text.slice(0, 10)).dateFull : ""),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
          title="Bạn có chắc chắn muốn xóa sự kiện này?"
          onConfirm={() => handleDeleteOne(record.id)}
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
        loading={loadingEventList}
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
        headerTitle="Danh sách Sự kiện"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMovie}
          >
            Thêm sự kiện
          </Button>,
        ]}
      />

      <Modal
        title={selectedPhim?.current?.brief ? `Chỉnh sửa: ${selectedPhim?.current?.brief}` : "Tạo sự kiện mới"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {openModal && (
          <FormAddEvent
            key={selectedPhim.current?.id || "add_event"}
            selectedPhim={selectedPhim.current}
            onUpdate={onUpdate}
            onAddMovie={onAddMovie}
          />
        )}
      </Modal>
    </div>
  );
}
