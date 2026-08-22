import React, { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Image, Tag, Button, Modal, Tooltip } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import { getAllScheduleListManagement, getMovieListManagement } from "../../reducers/actions/Movie";
import FormAddShowtime from "./FormAddShowtime";
import formatDate from "../../utilities/formatDate";
import slugify from "slugify";

export default function CreateShowTime() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [lichChieuDisplay, setLichChieuDisplay] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  const { scheduleList2, loadingScheduleList2 } = useSelector((state) => state.movieReducer);

  useEffect(() => {
    dispatch(getMovieListManagement());
    dispatch(getAllScheduleListManagement());
  }, [dispatch]);

  useEffect(() => {
    if (scheduleList2?.data) {
      const showTimeList = scheduleList2.data.map((lichChieu) => ({
        ...lichChieu,
        tenCumRap: lichChieu?.branch?.name,
        maLichChieu: lichChieu?.id,
        diaChi: lichChieu?.branch?.address,
        maPhim: lichChieu?.movie?.id,
        logo: lichChieu?.branch?.imgURL,
        tenPhim: lichChieu?.movie?.name,
        maPhong: lichChieu?.room?.id,
        id: lichChieu?.id,
        giaVe: lichChieu?.price,
        ngayChieuGioChieu: `${formatDate(lichChieu?.startDate.slice(0, 10)).dateFull}, ${lichChieu?.startTime.slice(0, 8)}`,
      }));
      setLichChieuDisplay(showTimeList);
    }
  }, [scheduleList2]);

  const handleReload = () => {
    dispatch(getAllScheduleListManagement());
    setSearchParams({});
  };

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!lichChieuDisplay) return [];
    return lichChieuDisplay.filter((lichChieu) => {
      const keyword = searchParams.keyword || "";
      if (!keyword) return true;
      const matchTenRap = slugify(lichChieu?.tenCumRap ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchTenPhim = slugify(lichChieu?.tenPhim ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchDiaChi = slugify(lichChieu?.diaChi ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      return matchTenRap || matchTenPhim || matchDiaChi;
    });
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      search: false,
      width: 100,
      render: (text, record) => (
        <Tooltip title={record.tenCumRap}>
          <Image
            width={60}
            height={60}
            src={text}
            fallback="https://via.placeholder.com/60x60?text=No+Image"
            style={{ objectFit: "contain", borderRadius: 4 }}
          />
        </Tooltip>
      ),
    },
    {
      title: "Tìm kiếm",
      dataIndex: "keyword",
      hideInTable: true,
      fieldProps: {
        placeholder: "Tìm rạp, phim, địa chỉ...",
      }
    },
    {
      title: "Chi nhánh",
      dataIndex: "tenCumRap",
      search: false,
      width: 200,
      sorter: (a, b) => (a.tenCumRap || "").localeCompare(b.tenCumRap || ""),
    },
    {
      title: "Địa chỉ",
      dataIndex: "diaChi",
      search: false,
      ellipsis: true,
    },
    {
      title: "Phim",
      dataIndex: "tenPhim",
      search: false,
      width: 250,
      sorter: (a, b) => (a.tenPhim || "").localeCompare(b.tenPhim || ""),
    },
    {
      title: "Phòng",
      dataIndex: "maPhong",
      search: false,
      width: 90,
      render: (text) => <Tag color="blue">Phòng {text}</Tag>,
      sorter: (a, b) => a.maPhong - b.maPhong,
    },
    {
      title: "Showtime",
      dataIndex: "ngayChieuGioChieu",
      search: false,
      width: 200,
      sorter: (a, b) => (a.ngayChieuGioChieu || "").localeCompare(b.ngayChieuGioChieu || ""),
    },
    {
      title: "Giá vé",
      dataIndex: "giaVe",
      search: false,
      width: 130,
      render: (text) => (
        <Tag color="green">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)}
        </Tag>
      ),
      sorter: (a, b) => a.giaVe - b.giaVe,
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <ProTable
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loadingScheduleList2}
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
        headerTitle="Danh sách Lịch chiếu"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(true)}
          >
            Thêm lịch chiếu
          </Button>,
        ]}
      />

      <Modal
        title="Thêm Lịch Chiếu Mới"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <FormAddShowtime 
          onCancel={() => setOpenModal(false)} 
          onRefresh={handleReload}
        />
      </Modal>
    </div>
  );
}
