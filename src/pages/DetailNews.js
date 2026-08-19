import React, { useState, useEffect, useMemo } from "react";
import { qLyPhimService } from "../services/QuanLyPhimServices";
import NewsDetailComponent from "../components/NewsDetailComponent/ReviewsDetailComponent";
import SpinnerLoading from "../components/SpinnerLoading/SpinnerLoading";
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function DetailNews() {
  const { maTin } = useParams();
  // console.log("slug:  ",maTin);
  let [tinTuc, setTinTuc] = useState([]);
  const [loading, $loading] = useState(true);
  const maTinTuc = maTin;
  const history = useHistory();

  useMemo(() => {
    qLyPhimService.layChiTietTinTucSlug(maTinTuc).then((result) => {
      setTimeout(() => {
        setTinTuc(result.data);
        $loading(false);
      }, 1500);
    })
    .catch((err) => {
      // console.log(err.response.data);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        title: 'Oops...',
        text: 'Không tìm thấy bài viết!!',
        confirmButtonText: `Về trang chủ`,
      }).then((result) => {
        if (result.isConfirmed) {
          history.replace('/')
        }
      })
    })
  }, [maTinTuc]);

  let [danhSachTinTuc, setDanhSachTinTuc] = useState([]);

  useEffect(() => {
    qLyPhimService
      .layTinTuc()
      .then((res) => {
        setTimeout(() => {
          setDanhSachTinTuc(res.data);
          $loading(false);
        }, 1500);
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  }, []);

  return (
    <>
      {loading ? (
        <SpinnerLoading />
      ) : (
        <NewsDetailComponent tinTuc={tinTuc} danhSachTinTuc={danhSachTinTuc} />
      )}
      </>
  );
}
