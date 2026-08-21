import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bookingApi from "../../../api/bookingApi";

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
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "24px 28px",
        minHeight: "85vh",
        borderRadius: "8px",
        border: "1px solid #f1f5f9",
      }}
    >
      {/* Tiêu đề mục Chọn Combo / Sản phẩm */}
      <h2
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: "#1e293b",
          margin: "0 0 20px 0",
        }}
      >
        Chọn Combo / Sản phẩm
      </h2>

      {/* Danh sách các sản phẩm Combo / Thức ăn / Nước uống */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {foodList.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "14px" }}>
            Đang tải danh mục bắp nước & combo...
          </div>
        ) : (
          foodList.map((item, index) => {
            const qty = quantities[item.id] || 0;
            const isLast = index === foodList.length - 1;

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom: isLast ? "none" : "1px solid #f1f5f9",
                  gap: "16px",
                }}
              >
                {/* Cột trái: Hình ảnh sản phẩm (vuông nhẹ, nền sáng) */}
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      item.imageUrl ||
                      "https://cdn.galaxycine.vn/media/2023/11/30/combo-2-big-extra_1701334812391.png"
                    }
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Cột giữa: Tiêu đề + Mô tả chi tiết + Đơn giá */}
                <div style={{ flex: 1, paddingRight: "16px" }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#1e293b",
                      margin: "0 0 4px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      margin: "0 0 6px 0",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.description || item.name}
                  </p>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    Giá: {item.price?.toLocaleString("vi-VN")} <u>đ</u>
                  </div>
                </div>

                {/* Cột phải: Bộ đếm số lượng tinh gọn [ -  0  + ] */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  <button
                    onClick={() => handleUpdateQuantity(item, -1)}
                    disabled={qty === 0}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: qty === 0 ? "#cbd5e1" : "#475569",
                      fontSize: "18px",
                      fontWeight: "700",
                      cursor: qty === 0 ? "not-allowed" : "pointer",
                      padding: "4px 8px",
                      outline: "none",
                      userSelect: "none",
                      transition: "color 0.15s ease",
                    }}
                  >
                    —
                  </button>
                  <span
                    style={{
                      minWidth: "16px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1e293b",
                      userSelect: "none",
                    }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item, 1)}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#1e293b",
                      fontSize: "18px",
                      fontWeight: "700",
                      cursor: "pointer",
                      padding: "4px 8px",
                      outline: "none",
                      userSelect: "none",
                      transition: "color 0.15s ease",
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