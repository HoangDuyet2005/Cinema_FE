import React, { useState, useEffect, useMemo } from "react";
import { qLyPhimService } from "../services/QuanLyPhimServices";
import SpinnerLoading from "../components/SpinnerLoading/SpinnerLoading";
import { useParams } from "react-router-dom";
import ReviewsDetailComponent from "../components/NewsDetailComponent/ReviewsDetailComponent";

export default function DetailReview() {
  const { maTin } = useParams();
  // console.log("slug:  ",maTin);
  let [tinTuc, setTinTuc] = useState([]);
  const [loading, $loading] = useState(true);
  const maTinTuc = maTin;
  useMemo(() => {
    qLyPhimService.layChiTietTinTucSlug(maTinTuc).then((result) => {
      setTimeout(() => {
        setTinTuc(result.data);
        $loading(false);
      }, 1500);
    });
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
        <ReviewsDetailComponent tinTuc={tinTuc} danhSachTinTuc={danhSachTinTuc} />
      )}
      </>
  );
}
