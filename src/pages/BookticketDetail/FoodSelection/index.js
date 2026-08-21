import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bookingApi from "../../../api/bookingApi";
import Countdown from "../Countdown";

export default function FoodSelection() {
  const dispatch = useDispatch();
  const { selectedFoods } = useSelector((state) => state.bookTicketReducer);
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    bookingApi
      .getConcessions()
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        setFoodList(list);
        const initialQty = {};
        list.forEach((item) => {
          const found = (selectedFoods || []).find((f) => f.id === item.id);
          initialQty[item.id] = found ? found.quantity : 0;
        });
        setQuantities(initialQty);
      })
      .catch((err) => {
        console.log("Lỗi tải combo bắp nước:", err);
      });
  }, []);

  const handleUpdateQuantity = (item, delta) => {
    const current = quantities[item.id] || 0;
    const nextQty = Math.max(0, current + delta);
    const updatedQuantities = { ...quantities, [item.id]: nextQty };
    setQuantities(updatedQuantities);

    // Cập nhật selectedFoods và foodAmount vào Redux
    const updatedSelectedFoods = foodList
      .filter((f) => updatedQuantities[f.id] > 0)
      .map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        quantity: updatedQuantities[f.id],
        imageUrl: f.imageUrl,
      }));

    const foodAmount = updatedSelectedFoods.reduce(
      (sum, f) => sum + f.price * f.quantity,
      0
    );

    dispatch({
      type: "SET_SELECTED_FOODS",
      payload: {
        selectedFoods: updatedSelectedFoods,
        foodAmount,
      },
    });
  };

  return (
    <div style={{ backgroundColor: "#ffffff", padding: "20px 24px", minHeight: "80vh" }}>
      {/* Tiêu đề trang & Đồng hồ đếm ngược giữ ghế */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: "16px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
          Chọn Combo / Sản phẩm
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#ea580c", fontWeight: "600" }}>
            Thời gian giữ ghế:
          </span>
          <div style={{ color: "#ea580c", fontWeight: "800", fontSize: "16px" }}>
            <Countdown />
          </div>
        </div>
      </div>

      {/* Danh sách các sản phẩm Combo / Thức ăn / Nước uống */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {foodList.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
            Đang tải danh mục bắp nước & combo...
          </div>
        ) : (
          foodList.map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  border: "1px solid #f1f5f9",
                  borderRadius: "10px",
                  backgroundColor: qty > 0 ? "#fffaf5" : "#ffffff",
                  transition: "all 0.2s ease",
                  boxShadow: qty > 0 ? "0 2px 10px rgba(234, 88, 12, 0.08)" : "none",
                }}
              >
                {/* Cột trái: Hình ảnh sản phẩm + Thông tin mô tả */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1 }}>
                  <img
                    src={item.imageUrl || "https://cdn.galaxycine.vn/media/2023/11/30/combo-2-big-extra_1701334812391.png"}
                    alt={item.name}
                    style={{
                      width: "85px",
                      height: "85px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      backgroundColor: "#f8fafc",
                      padding: "4px",
                    }}
                  />
                  <div style={{ maxWidth: "520px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: "0 0 6px 0" }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                      {item.description}
                    </p>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>
                      Giá: <span style={{ color: "#ea580c" }}>{item.price?.toLocaleString("vi-VN")} đ</span>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Bộ đếm số lượng [-] [ 0 ] [+] */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={() => handleUpdateQuantity(item, -1)}
                    disabled={qty === 0}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: qty === 0 ? "#f8fafc" : "#ffffff",
                      color: qty === 0 ? "#94a3b8" : "#1e293b",
                      fontSize: "18px",
                      fontWeight: "700",
                      cursor: qty === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      outline: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      minWidth: "24px",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "800",
                      color: qty > 0 ? "#ea580c" : "#1e293b",
                    }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item, 1)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      color: "#1e293b",
                      fontSize: "18px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      outline: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}