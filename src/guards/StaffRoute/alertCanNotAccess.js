import React, { useEffect } from 'react'
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

export default function AlertCanNotAccess() {
  const history = useHistory();
  useEffect(() => {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      title: 'Oops...',
      text: 'Bạn không có quyền truy cập trang Nhân viên!',
      confirmButtonText: `Trở về`,
    }).then((result) => {
      if (result.isConfirmed) {
        history.replace('/')
      }
    })
  }, [])
  return (
    <></>
  )
}
