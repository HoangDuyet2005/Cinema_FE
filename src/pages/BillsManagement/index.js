import React, { useEffect, useState, useRef } from "react";
import { ProTable } from "@ant-design/pro-components";
import { Tag, Button as AntButton } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

import Action from "./Action";
import slugify from "slugify";
import DetailPopup from "./PopUp/PopUp";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import Swal from "sweetalert2";
import { getBillsTTTaiQuay } from "../../reducers/actions/Bill";
import billsApi from "../../api/billsApi";
import formatDate from "../../utilities/formatDate";
import reviewsApi from "../../api/billsApi";

export default function BillsManagement() {
  const [billListDisplay, setBillListDisplay] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [toggle, setToggle] = useState(false);

  const {
    loadingDelete,
    loadingUpdateBill,
    billListTTTaiQuay,
    loadingBillListTTTaiQuay,
  } = useSelector((state) => state.billsManagementReducer);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBillsTTTaiQuay());
  }, [dispatch]);

  useEffect(() => {
    if (billListTTTaiQuay && billListTTTaiQuay.length > 0) {
      const newBillListDisplay = billListTTTaiQuay.map((bill) => ({
        ...bill,
        id: bill?.id,
        email: bill?.user?.email,
        idUser: bill?.user?.id,
        imageUser: bill?.user?.image,
        nameUser: bill?.user?.name,
        usernameUser: bill?.user?.username,
        status: bill.status,
        createdTime: `${formatDate(bill?.createdTime.slice(0, 10)).dateFull}, ${bill?.createdTime.slice(11, 19)}`,
      }));
      setBillListDisplay(newBillListDisplay);
    }
  }, [billListTTTaiQuay]);

  const [ticketDetail, setTicketDetail] = useState({});

  const getTicketDetail = (id) => {
    reviewsApi.getBillByID(id).then((response) => {
      setTicketDetail(response.data);
      setToggle(true);
    });
  };

  const handleEdit = (billItem) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: 'Chắc chắn thanh toán?',
      text: "Hãy kiểm tra kĩ trước khi thanh toán!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Thanh toán ngay!',
      cancelButtonText: 'Không, dừng lại!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (!loadingDelete) {
          billsApi.postThanhToan(billItem.id)
          .then((res) =>{
            swalWithBootstrapButtons.fire(
              'Đã thanh toán!',
              'Thành công.',
              'success'
            );
            dispatch(getBillsTTTaiQuay());
          })
          .catch((err) => {
            swalWithBootstrapButtons.fire(
              'Lỗi thanh toán',
              'Bill đã quá hạn hoặc có lỗi xảy ra!',
              'error'
            );
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Đã dừng',
          'Kiểm tra thông tin và nội dung!',
          'error'
        );
      }
    });
  };

  const modifySlugify = { lower: true, locale: "vi" };
  const getFilteredData = () => {
    if (!billListDisplay) return [];
    return billListDisplay.filter((bill) => {
      const keyword = searchParams.keyword || "";
      if (!keyword) return true;
      const matchEmail = slugify(bill?.email ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchUsername = slugify(bill?.usernameUser ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchName = slugify(bill?.nameUser ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      const matchStatus = slugify(bill?.status ?? "", modifySlugify)?.indexOf(slugify(keyword, modifySlugify)) !== -1;
      return matchEmail || matchUsername || matchName || matchStatus;
    });
  };

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "id",
      search: false,
      width: 120,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tìm kiếm",
      dataIndex: "keyword",
      hideInTable: true,
      fieldProps: {
        placeholder: "Tìm theo Username, Tên, Email...",
      }
    },
    {
      title: "Tài khoản",
      dataIndex: "usernameUser",
      search: false,
      width: 150,
      sorter: (a, b) => (a.usernameUser || "").localeCompare(b.usernameUser || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      search: false,
      ellipsis: true,
      sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    },
    {
      title: "Thời gian đặt",
      dataIndex: "createdTime",
      search: false,
      width: 180,
      sorter: (a, b) => (a.createdTime || "").localeCompare(b.createdTime || ""),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      search: false,
      width: 130,
      render: (text) => (
        <Tag color="green">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)}
        </Tag>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      search: false,
      width: 150,
      render: (text) => {
        if (text === "WAITING_PAYMENT") return <Tag color="orange">Chờ thanh toán</Tag>;
        if (text === "SUCCESS") return <Tag color="blue">Đã thanh toán</Tag>;
        return <Tag color="red">Hết hạn thanh toán</Tag>;
      },
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "Hành động",
      search: false,
      width: 150,
      render: (_, record) => {
        if (record.status === "WAITING_PAYMENT") {
          return (
            <Action
              onEdit={() => handleEdit(record)}
              phimItem={record}
            />
          );
        } else {
          return (
            <AntButton
              type="primary"
              size="small"
              onClick={() => getTicketDetail(record.id)}
            >
              Xem chi tiết
            </AntButton>
          );
        }
      },
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24, borderRadius: 8, height: "100%" }}>
      <ProTable
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        loading={loadingBillListTTTaiQuay || loadingUpdateBill || loadingDelete}
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
        headerTitle="Danh sách Hóa Đơn"
      />

      {toggle && (
        <div style={{ 
          position: "fixed", 
          borderRadius: "8px", 
          top: "10%", 
          left: "15%", 
          backgroundColor: "white", 
          zIndex: "10000", 
          width: "70%", 
          height: "80%", 
          overflow: "auto", 
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)" 
        }}>
          <DetailPopup ThongTin={ticketDetail} />
          <div 
            onClick={() => setToggle(false)} 
            style={{ 
              position: "absolute", 
              right: "16px", 
              top: "16px", 
              backgroundColor: "#ff4d4f", 
              color: "#fff",
              padding: "8px", 
              borderRadius: "50%",
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
          >
            <CloseFullscreenIcon fontSize="small" />
          </div>
        </div>
      )}
    </div>
  );
}
