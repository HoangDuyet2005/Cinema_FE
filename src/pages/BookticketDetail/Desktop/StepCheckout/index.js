import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import bookingApi from "../../../../api/bookingApi";

export default function StepCheckout() {
  const history = useHistory();
  const dispatch = useDispatch();
  const param = useParams();

  const activeStep = useSelector((state) => state.bookTicketReducer.activeStep);
  const currentUser = useSelector((state) => state.authReducer.currentUser);
  const currentUserId = currentUser?.data?.id || currentUser?.id || 1;

  // 5 bước chuẩn chuỗi rạp:
  // 0: Chọn phim / Rạp / Suất (Đã hoàn thành trước khi vào trang này)
  // 1: Chọn ghế (Step 0 trong reducer)
  // 2: Chọn thức ăn (Step 1 trong reducer)
  // 3: Thanh toán (Step 2 trong reducer)
  // 4: Xác nhận (Step 3 trong reducer)
  const steps = [
    { id: 0, label: "Chọn phim / Rạp / Suất", isPassedAlways: true, clickable: true },
    { id: 1, label: "Chọn ghế", stepIdx: 0 },
    { id: 2, label: "Chọn thức ăn", stepIdx: 1 },
    { id: 3, label: "Thanh toán", stepIdx: 2 },
    { id: 4, label: "Xác nhận", stepIdx: 3 },
  ];

  const handleStepClick = (step) => {
    if (step.id === 0) {
      history.goBack();
    } else if (step.stepIdx !== undefined && step.stepIdx < activeStep) {
      if (step.stepIdx === 0 && param?.maLichChieu) {
        // Khi bấm quay lại bước chọn ghế trên stepper, giải phóng ghế đang giữ
        bookingApi
          .releaseSeats({
            scheduleId: Number(param.maLichChieu),
            seatIds: [],
            userId: Number(currentUserId),
          })
          .catch(() => {});
      }
      dispatch({ type: "SET_STEP", payload: { activeStep: step.stepIdx } });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #004b91",
        padding: "16px 24px 12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        marginBottom: "2px",
      }}
    >
      {/* 5 Bước Đặt Vé (Stepper) */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px", margin: "0 auto" }}>
        {steps.map((step) => {
          const isCurrent =
            (step.id === 1 && activeStep === 0) ||
            (step.id === 2 && activeStep === 1) ||
            (step.id === 3 && activeStep === 2) ||
            (step.id === 4 && activeStep === 3);

          const isPassed =
            step.isPassedAlways ||
            (step.stepIdx !== undefined && step.stepIdx < activeStep);

          let stepColor = "#94a3b8"; // Chưa tới lượt (xám nhạt)
          if (isCurrent) {
            stepColor = "#004b91"; // Đang ở bước này (xanh đậm navy)
          } else if (isPassed) {
            stepColor = "#0284c7"; // Đã qua rồi (xanh da trời sáng)
          }

          return (
            <div
              key={step.id}
              onClick={() => handleStepClick(step)}
              style={{
                position: "relative",
                paddingBottom: "8px",
                cursor: step.clickable || isPassed ? "pointer" : "default",
                fontSize: "14px",
                fontWeight: isCurrent ? "700" : isPassed ? "600" : "500",
                color: stepColor,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (isPassed && !isCurrent) {
                  e.currentTarget.style.color = "#0369a1";
                }
              }}
              onMouseLeave={(e) => {
                if (isPassed && !isCurrent) {
                  e.currentTarget.style.color = "#0284c7";
                }
              }}
            >
              {step.label}
              {isCurrent && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-14px",
                    left: "0",
                    width: "100%",
                    height: "3px",
                    backgroundColor: "#004b91",
                    borderRadius: "2px",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Thông tin tài khoản người dùng */}
      {currentUser && (
        <div
          onClick={() => history.push("/taikhoan")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            padding: "4px 10px",
            borderRadius: "20px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <img
            src={currentUser?.data?.image || "https://i.pravatar.cc/150?img=68"}
            alt="avatar"
            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
            {currentUser?.data?.name || "Tài khoản"}
          </span>
        </div>
      )}
    </div>
  );
}