import React, { useState, useEffect } from "react";
import { qLyPhimService } from "../services/QuanLyPhimServices";
import NewsDetailComponent from "../components/NewsDetailComponent/ReviewsDetailComponent";
import SpinnerLoading from "../components/SpinnerLoading/SpinnerLoading";
import { useHistory, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

export default function DetailNews() {
  const { maTin } = useParams();
  const location = useLocation();
  const [tinTuc, setTinTuc] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (!maTin) return;
    setLoading(true);

    const rawUrlStr = String(maTin) + (location.search || "");
    const decodedSlug = decodeURIComponent(rawUrlStr);

    let targetId = null;
    const match = decodedSlug.match(/p(\d+)$/i) || decodedSlug.match(/-p(\d+)$/i) || decodedSlug.match(/p(\d+)/i) || decodedSlug.match(/(\d+)$/);
    if (match) {
      targetId = match[1];
    } else if (!isNaN(rawUrlStr) && rawUrlStr.trim() !== "") {
      targetId = rawUrlStr.trim();
    }

    const fetchPromise = targetId
      ? qLyPhimService.layChiTietTinTuc(targetId).catch(() => qLyPhimService.layChiTietTinTucSlug(encodeURIComponent(decodedSlug)))
      : qLyPhimService.layChiTietTinTucSlug(encodeURIComponent(decodedSlug));

    fetchPromise
      .then((result) => {
        setTinTuc(result.data?.data || result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading article:", err);
        setLoading(false);
        Swal.fire({
          allowOutsideClick: false,
          icon: "error",
          title: "Oops...",
          text: "Không tìm thấy bài viết!",
          confirmButtonText: `Về trang chủ`,
        }).then((res) => {
          if (res.isConfirmed) {
            history.replace("/");
          }
        });
      });
  }, [maTin, location.search, history]);

  if (loading) {
    return <SpinnerLoading />;
  }

  const isPromo = tinTuc?.type === "NEWS" || tinTuc?.type === "EVENTS";

  return <NewsDetailComponent tinTuc={tinTuc} isPromotion={isPromo} />;
}