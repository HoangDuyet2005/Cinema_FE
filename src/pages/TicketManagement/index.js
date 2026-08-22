import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ProTable } from "@ant-design/pro-components";
import { Image, Tag } from "antd";

import { getAllTicketByAdminStaff } from "../../reducers/actions/Ticket";
import formatDate from "../../utilities/formatDate";
import slugify from "slugify";

export default function TicketManagement() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState({});
  const [ticketListDisplay, setTicketListDisplay] = useState([]);

  const { allTicketList, loadingAllTicketList } = useSelector(
    (state) => state.ticketReducer
  );

  useEffect(() => {
    dispatch(getAllTicketByAdminStaff());
  }, [dispatch]);

  useEffect(() => {
    if (allTicketList && allTicketList.length !== 0) {
      const ticketListDis = allTicketList.map((ticket) => {
        return {
          ...ticket,
          tenNguoiDat: ticket?.bill?.user?.name,
          ngayDat: ticket?.bill?.createdTime ? new Date(ticket?.bill?.createdTime.slice(0, 10)).toLocaleDateString() : "",
          gioDat: ticket?.bill?.createdTime ? new Date(ticket?.bill?.createdTime).toLocaleTimeString() : "",
          maVe: ticket?.bill?.id,
          phimDat: ticket?.schedule?.movie?.name,
          rapChieu: ticket?.schedule?.branch?.name,
          phongChieu: ticket?.schedule?.room?.name,
          gioChieu: ticket?.schedule?.startTime,
          ngayChieu: ticket?.schedule?.startDate,
          ghe: ticket?.seat?.name,
          hinhPhim: ticket?.schedule?.movie?.smallImageURl,
        };
      });
      setTicketListDisplay(ticketListDis);
    }
  }, [allTicketList]);

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!ticketListDisplay) return [];
    return ticketListDisplay.filter((ticket) => {
      // Tìm kiếm tổng hợp theo từ khóa trong searchParams (mặc định ProTable dùng key 'keyword' nếu ta config đúng, nhưng ở đây dùng nhiều trường or gộp lại)
      const keyword = searchParams.keyword || "";
      if (!keyword) return true;
      const matchTenNguoiDat = slugify(ticket?.tenNguoiDat ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchPhimDat = slugify(ticket?.phimDat ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchGhe = slugify(ticket?.ghe ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      return matchTenNguoiDat || matchPhimDat || matchGhe;
    });
  };

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "maVe",
      search: false,
      width: 100,
      sorter: (a, b) => a.maVe - b.maVe,
    },
    {
      title: "Ghế",
      dataIndex: "ghe",
      search: false,
      width: 80,
      render: (text) => <Tag color="orange">{text}</Tag>,
      sorter: (a, b) => (a.ghe || "").localeCompare(b.ghe || ""),
    },
    {
      title: "Người đặt",
      dataIndex: "tenNguoiDat",
      copyable: true,
      sorter: (a, b) => (a.tenNguoiDat || "").localeCompare(b.tenNguoiDat || ""),
      // Cấu hình thanh tìm kiếm mặc định dùng chung 1 ô keyword
      hideInSearch: true,
    },
    {
      title: "Tìm kiếm vé",
      dataIndex: "keyword",
      hideInTable: true, // Ẩn khỏi bảng, chỉ dùng để hiện ở thanh search
      fieldProps: {
        placeholder: "Tìm theo Người đặt, Phim, Ghế...",
      }
    },
    {
      title: "Phim",
      dataIndex: "phimDat",
      search: false,
      ellipsis: true,
      sorter: (a, b) => (a.phimDat || "").localeCompare(b.phimDat || ""),
    },
    {
      title: "Ảnh",
      dataIndex: "hinhPhim",
      search: false,
      width: 80,
      render: (text) => (
        <Image
          width={60}
          height={80}
          src={text}
          fallback="https://via.placeholder.com/60x80?text=No+Image"
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      ),
    },
    {
      title: "Ngày/Giờ đặt",
      dataIndex: "ngayDat",
      search: false,
      width: 150,
      render: (text, record) => (
        <div>
          <div>{record.ngayDat}</div>
          <div style={{ fontSize: "12px", color: "gray" }}>{record.gioDat}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.bill?.createdTime || 0) - new Date(b.bill?.createdTime || 0),
    },
    {
      title: "Rạp",
      dataIndex: "rapChieu",
      search: false,
      ellipsis: true,
      sorter: (a, b) => (a.rapChieu || "").localeCompare(b.rapChieu || ""),
    },
    {
      title: "Phòng",
      dataIndex: "phongChieu",
      search: false,
      width: 100,
      sorter: (a, b) => (a.phongChieu || "").localeCompare(b.phongChieu || ""),
    },
    {
      title: "Lịch chiếu",
      dataIndex: "ngayChieu",
      search: false,
      width: 160,
      render: (text, record) => (
        <div>
          <div>{text ? formatDate(text.slice(0, 10)).dateFull : ""}</div>
          <div style={{ fontSize: "12px", color: "#1890ff", fontWeight: "bold" }}>{record.gioChieu}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.ngayChieu || 0) - new Date(b.ngayChieu || 0),
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
      <ProTable
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id" // Dùng id của ticket làm key
        loading={loadingAllTicketList}
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
        headerTitle="Danh sách Vé Đã Đặt"
      />
    </div>
  );
}
