import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProTable } from "@ant-design/pro-components";
import { Button, Modal, Popconfirm, message, Tag, Image, Space } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

import {
  getReviewsList,
  postAddReview,
  putReviewUpdate,
  resetReviewList,
} from "../../reducers/actions/ReviewsManagement";
import { deleteMovie } from "../../reducers/actions/Movie";
import reviewsApi from "../../api/reviewsApi";
import slugify from "slugify";

export default function ReviewsManagement() {
  const dispatch = useDispatch();
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const selectedPhim = useRef(null);

  const {
    reviewList,
    loadingReviewList,
    loadingDelete,
    successDelete,
    successUpdateReview,
    successAddReview,
  } = useSelector((state) => state.reviewsManagementReducer);

  useEffect(() => {
    if (
      !reviewList ||
      successUpdateReview ||
      successDelete ||
      successAddReview
    ) {
      dispatch(getReviewsList());
    }
  }, [successUpdateReview, successDelete, successAddReview, dispatch, reviewList]);

  useEffect(() => {
    return () => {
      dispatch(resetReviewList());
    };
  }, [dispatch]);

  const handleReload = () => {
    dispatch(getReviewsList());
    setSearchParams({});
  };

  const onXemQua = (reviewItem) => {
    selectedPhim.current = reviewItem;
    setOpenPreviewModal(true);
  };

  const handleDuyet = (reviewItem) => {
    if (!loadingDelete) {
      reviewsApi
        .putDuyetReview(reviewItem.id)
        .then(() => {
          message.success("Đã duyệt bài viết thành công!");
          dispatch(getReviewsList());
        })
        .catch((err) => {
          message.error("Lỗi khi duyệt bài viết!");
          console.log(err);
        });
    }
  };

  const handleTuChoi = (reviewItem) => {
    if (!loadingDelete) {
      reviewsApi
        .putTuChoiReview(reviewItem.id)
        .then(() => {
          message.success("Đã từ chối bài viết!");
          dispatch(getReviewsList());
        })
        .catch((err) => {
          message.error("Lỗi khi từ chối bài viết!");
          console.log(err);
        });
    }
  };

  const handleDelete = (reviewItem) => {
    if (!loadingDelete) {
      reviewsApi
        .deleteReview(reviewItem.id)
        .then(() => {
          message.success("Đã xóa bài viết thành công!");
          dispatch(getReviewsList());
        })
        .catch((err) => {
          message.error("Lỗi khi xóa bài viết!");
          console.log(err);
        });
    }
  };

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!reviewList?.data?.content) return [];
    return reviewList.data.content.filter((review) => {
      if (!searchParams.title) return true;
      const matchTitle = slugify(review?.title ?? "", modifySlugify)?.indexOf(slugify(searchParams.title, modifySlugify)) !== -1;
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
      title: "Hành động",
      valueType: "option",
      width: 320,
      render: (text, record) => [
        <Space key="actions" wrap>
          <Button
            type="default"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onXemQua(record)}
          >
            Xem qua
          </Button>
          
          <Popconfirm
            title="Duyệt bài viết này?"
            description="Bạn có chắc chắn muốn duyệt cho bài viết này hiển thị không?"
            onConfirm={() => handleDuyet(record)}
            okText="Duyệt ngay"
            cancelText="Hủy"
          >
            <Button type="primary" icon={<CheckOutlined />} size="small">
              Duyệt
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Từ chối bài viết?"
            description="Bài viết sẽ bị đánh dấu là từ chối."
            onConfirm={() => handleTuChoi(record)}
            okText="Từ chối"
            cancelText="Hủy"
          >
            <Button type="default" danger icon={<CloseOutlined />} size="small">
              Từ chối
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Xóa bài viết?"
            description="Bạn không thể khôi phục sau khi xóa."
            onConfirm={() => handleDelete(record)}
            okText="Xóa ngay"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ],
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <ProTable
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loadingReviewList}
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
        headerTitle="Danh sách Đánh giá / Bài viết"
      />

      <Modal
        title={selectedPhim.current?.brief || "Nội dung bài viết"}
        open={openPreviewModal}
        onCancel={() => setOpenPreviewModal(false)}
        footer={[
          <Button key="close" onClick={() => setOpenPreviewModal(false)}>
            Đóng
          </Button>
        ]}
        width={800}
        bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
        destroyOnClose
      >
        <div 
          dangerouslySetInnerHTML={{ __html: selectedPhim.current?.description }} 
          style={{ padding: 16 }}
        />
      </Modal>
    </div>
  );
}
