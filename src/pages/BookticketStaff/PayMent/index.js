import React, { useState, useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import useStyles from "./style";
import formatDate from "../../../utilities/formatDate";
import { bookTicket } from "../../../reducers/actions/BookTicket";
import {
  SET_DATA_PAYMENT,
  SET_READY_PAYMENT,
} from "../../../reducers/constants/BookTicket";
import { logger } from "workbox-core/_private";
import bookingApi from "../../../api/bookingApi";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const makeObjError = (name, value, dataSubmit) => {
  // kiểm tra và set lỗi rỗng
  let newErrors = {
    ...dataSubmit.errors,
    [name]:
      value?.trim() === ""
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} not be empty!`
        : "",
  };

  // kiểm tra và set lỗi sai định dạng
  //eslint-disable-next-line
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //eslint-disable-next-line
  const regexNumber =
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
  if (name === "email" && value) {
    if (!regexEmail.test(value)) {
      newErrors[name] = "Email not valid";
    }
  }
  if (name === "phone" && value) {
    if (!regexNumber.test(value)) {
      newErrors[name] = "Phone not valid";
    }
  }
  return newErrors;
};

export default function PayMent() {
  const {
    listSeat,
    amount,
    email,
    phone,
    paymentMethod,
    isReadyPayment,
    isMobile,
    danhSachVe,
    danhSachPhongVe: { thongTinPhim },
    maLichChieu,
    taiKhoanNguoiDung,
    isSelectedSeat,
    listSeatSelected,
    loadingBookingTicket,
    successBookingTicketMessage,
    errorBookTicketMessage,
    thongTinPhongVe,
  } = useSelector((state) => state.bookTicketReducer);
  console.log(maLichChieu, danhSachVe, taiKhoanNguoiDung);
  console.log("danhSachVe: ",danhSachVe);
  const dispatch = useDispatch();
  const emailRef = useRef();
  const phoneRef = useRef(); // dùng useRef để dom tớ element
  let variClear = useRef(""); // dùng useRef để lưu lại giá trị setTimeout
  const [dataFocus, setDataFocus] = useState({ phone: false, email: false });
  const [dataSubmit, setdataSubmit] = useState({
    values: {
      email: email,
      phone: phone,
      // paymentMethod: paymentMethod,
      thongTinPhongVe: thongTinPhongVe,
    },
    errors: {
      email: "",
      phone: "",
    },
  });
  const classes = useStyles({
    isSelectedSeat,
    isReadyPayment,
    isMobile,
    dataFocus,
    dataSubmit,
  });

  const [thongTin, setThongTin] = useState()
  const param = useParams();

  const onChange = (e) => {
    // khi onchange update values và validation
    let { name, value } = e.target;
    let newValues = { ...dataSubmit.values, [name]: value };
    let newErrors = makeObjError(name, value, dataSubmit);
    setdataSubmit((dataSubmit) => ({
      ...dataSubmit,
      values: newValues,
      errors: newErrors,
    }));
  };

  console.log(listSeatSelected);
  
  console.log(param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong);
  useEffect(() => {
    // lấy thongTinPhim và danhSachGhe
    // dispatch(getListSeat(param.maLichChieu));
    bookingApi.getLichChieuChiTietHeThong(param.maPhim, param.maRap, param.ngayChieu, param.gioChieu, param.maPhong)
    .then((response) =>{
      console.log(response.data.data);
      setThongTin(response.data);
      // dispatch({
      //   type: GET_LISTSEAT_SUCCESS,
      //   payload: { data: response.data.data }
      // })
    })
    .catch((err) => {
      console.log(err);
    })
    // return () => {
    //   // xóa dữ liệu khi đóng hủy component
    //   dispatch({ type: RESET_DATA_BOOKTICKET });
    // };
  }, []);

  useEffect(() => {
    // sau 0.5s mới đẩy data lên redux để tăng hiệu năng
    clearTimeout(variClear);
    variClear.current = setTimeout(() => {
      dispatch({
        type: SET_DATA_PAYMENT,
        payload: {
          email: dataSubmit.values.email,
          phone: dataSubmit.values.phone,
          // paymentMethod: dataSubmit.values.paymentMethod,
        },
      });
      // khi không có lỗi và đủ dữ liệu thì set data sẵn sàng đặt vé và ngược lại, set activeStep = 1 nếu đủ dữ liệu và chưa đặt vé
      if (
        !dataSubmit.errors.email &&
        !dataSubmit.errors.phone &&
        dataSubmit.values.email &&
        dataSubmit.values.phone &&
        // dataSubmit.values.paymentMethod &&
        isSelectedSeat
      ) {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: true },
        });
      } else {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: false },
        });
      }
    }, 500);
    return () => clearTimeout(variClear.current);
  }, [dataSubmit, isSelectedSeat]);

  useEffect(() => {
    // cập nhật lại data email, phone và validation khi reload
    let emailErrors = makeObjError(emailRef.current.name, email, dataSubmit);
    // let phoneErrors = makeObjError(phoneRef.current.name, phone, dataSubmit);
    setdataSubmit((dataSubmit) => ({
      ...dataSubmit,
      values: {
        email: email,
        phone: phone,
        // paymentMethod: paymentMethod,
      },
      // errors: { email: emailErrors.email, phone: phoneErrors.phone },
    }));
  }, [listSeat]); // khi reload listSeat sẽ được cập nhật kèm theo, email, phone mặc định của tài khoản

  // const SwalConfirm = () => {
  //   Swal.fire({
  //     title: 'Bạn có chắc chắn muốn đặt nó?',
  //     showDenyButton: true,
  //     showCancelButton: true,
  //     confirmButtonText: 'Có',
  //     denyButtonText: 'Không, chưa chắc',
  //     customClass: {
  //       actions: 'my-actions',
  //       cancelButton: 'order-1 right-gap',
  //       confirmButton: 'order-2',
  //       denyButton: 'order-3',
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire('Đã đặt!', '', 'success')
  //     } else if (result.isDenied) {
  //       Swal.fire('Okay, do not book!', '', 'info')
  //     }
  //   })
    
  // }
  const handleBookTicket = () => {
    Swal.fire({
      title: 'Bạn có chắc muốn đặt?',
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Đặt ngay',
      denyButtonText: 'Không!',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          isReadyPayment &&
          !loadingBookingTicket &&
          !successBookingTicketMessage &&
          !errorBookTicketMessage
        ) {
          let userId = taiKhoanNguoiDung
          let scheduleId = maLichChieu
          // let list=[]
          // for(var i=0;i<listSeatIds.length;i++){
          //   list.push({id:listSeatIds[i]})
          // }
          let listSeatIds=[]
          for(var i = 0;i < danhSachVe.length; i++){
            listSeatIds.push(danhSachVe[i].id)
          }
          console.log("Gửi đi: ",userId, scheduleId, listSeatIds);
          dispatch(bookTicket({userId, scheduleId, listSeatIds} ));
        }
        Swal.fire('Đặt vé thành công!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Okay, đã hủy đặt vé!', '', 'info')
      }
    })

    // khi đủ dữ liệu và chưa có lần đặt vé nào trước đó thì mới cho đặt vé


      // SwalConfirm()

      
      // dispatch(bookTicket({ maLichChieu: 40396, danhSachVe: [{ maGhe: 9122569, giaVe: 75000 }], taiKhoanNguoiDung }))
    
  };
  const onFocus = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: true });
  };
  const onBlur = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: false });
  };
  // let listSeatIds = [10,11]
  // let list=[]
  // for(var i=0;i<listSeatIds.length;i++){
  //   list.push({id:listSeatIds[i]})
  // }
  console.log(thongTin?.data?.content[0]);

  return (
    <aside className={classes.payMent}>
      <div>
        {/* tổng tiền */}
        <p className={`${classes.amount} ${classes.payMentItem}`}>
          {`${amount.toLocaleString("vi-VI")} đ`}
        </p>

        {/* thông tin phim và rạp */}
        <div className={classes.payMentItem}>
          <p className={classes.tenPhim}>{thongTin?.data?.content[0]?.movie?.name}</p>
          <p>{thongTin?.data?.content[0]?.branch.name}</p>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <p>Phòng:</p>
            <span>{thongTin?.data?.content[0]?.room?.name}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <p>Ngày chiếu:</p>
            <span>{formatDate(thongTin?.data?.content[0]?.startDate).dateFull}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <p>Giờ chiếu:</p>
            <span>{thongTin?.data?.content[0]?.startTime}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <p>Thời lượng:</p>
            <span>{thongTin?.data?.content[0]?.movie?.duration} Minutes</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <p>Thể loại: </p>
            <span>{thongTin?.data?.content[0]?.movie?.categories}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <p>Ngôn ngữ: </p>
            <span>{thongTin?.data?.content[0]?.movie?.language}</span>
          </div>
        </div>

        {/* ghế đã chọn */}
        <div className={`${classes.seatInfo} ${classes.payMentItem}`}>
          <span>{`Ghế: ${listSeatSelected?.join(", ")}`}</span>
          <p className={classes.amountLittle}>
            {`${amount.toLocaleString("vi-VI")} đ`}
          </p>
        </div>

        {/* email */}
        <div className={classes.payMentItem}>
          <label className={classes.labelEmail}>E-Mail</label>
          <input
            type="text"
            name="email"
            ref={emailRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.email}
            className={classes.fillInEmail}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.email}</p>
        </div>

        {/* phone */}
        {/* <div className={classes.payMentItem}>
          <label className={classes.labelPhone}>Phone</label>
          <input
            type="number"
            name="phone"
            ref={phoneRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.phone}
            className={classes.fillInPhone}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.phone}</p>
        </div> */}

        {/* Mã giảm giá */}
        {/* <div className={classes.payMentItem}>
          <label className={classes.label}>Mã giảm giá</label>
          <input
            type="text"
            value="Tạm thời không hỗ trợ..."
            readOnly
            className={classes.fillIn}
          />
          <button className={classes.btnDiscount} disabled>
            Áp dụng
          </button>
        </div> */}

        {/* hình thức thanh toán */}
        <div className={classes.selectedPayMentMethod}>
          {/* <label className={classes.label}>Phương thức thanh toán</label>
          <p className={classes.toggleNotice}>
              Vui lòng chọn ghế để hiển thị Phương thức thanh toán...
          </p> */}

          <div className={classes.formPayment}>
            {/* <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="ZaloPay"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "ZaloPay"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/zalo.jpg"
                alt="zalopay"
              />
              <label>ZaloPay</label>
            </div> */}
            {/* <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="Visa, Master, JCB"
                onChange={onChange}
                checked={
                  dataSubmit.values.paymentMethod === "Visa, Master, JCB"
                }
              />
              <img
                className={classes.img}
                src="/img/bookticket/visa.png"
                alt="visa"
              />
              <label>Visa, Master, JCB</label>
            </div> */}
            {/* <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="ATM nội địa"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "ATM nội địa"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/atm.png"
                alt="atm"
              />
              <label>Thẻ ATM nội địa</label>
            </div> */}
            {/* <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="Pay at the counter"
                onChange={onChange}
                checked={
                  dataSubmit.values.paymentMethod === "Pay at the counter"
                }
              />
              <img
                className={classes.img}
                src="/img/bookticket/cuahang.png"
                alt="cuahang"
              />
              <label>Pay at the counter</label>
            </div> */}
          </div>
        </div>

        {/* đặt vé */}
        <div className={classes.bottomSection}>
          <button
            className={classes.btnDatVe}
            disabled={!isReadyPayment}
            onClick={handleBookTicket}
          >
            <p className={classes.txtDatVe}>ĐẶT NGAY</p>
          </button>
        </div>
      </div>

      {/* notice */}
      <div className={classes.notice}>
        {/* <img
          className={classes.imgNotice}
          src="/img/bookticket/exclamation.png"
          alt="notice"
        /> */}
        {/* <span>Tickets purchased cannot be exchanged or refunded</span>
        <p>
          Ticket code will be sent via text message{" "}
          <span className={classes.contactColor}></span> (Email) or{" "}
          <span className={classes.contactColor}>Email</span> đã nhập.
        </p> */}
      </div>
    </aside>
  );
}
