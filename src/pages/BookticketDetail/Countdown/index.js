import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Countdown, { zeroPad } from "react-countdown";
import { TIMEOUT } from "../../../reducers/constants/BookTicket";

export default function Index() {
  const param = useParams();
  const dispatch = useDispatch();
  const { loadingBookingTicket, successBookingTicketMessage, errorBookTicketMessage, activeStep } =
    useSelector((state) => state.bookTicketReducer);

  const schedKey = `booking_deadline_${param?.maLichChieu || "default"}`;

  const targetDate = useMemo(() => {
    let saved = sessionStorage.getItem(schedKey);
    let deadline = saved ? parseInt(saved, 10) : null;
    const now = Date.now();

    // Nếu chưa có hoặc đã quá hạn từ trước -> tạo mới 5 phút (300.000ms)
    if (!deadline || deadline <= now) {
      deadline = now + 300000;
      sessionStorage.setItem(schedKey, String(deadline));
    }
    return deadline;
  }, [schedKey]);

  const handleTimeOut = () => {
    sessionStorage.removeItem(schedKey);
    // Chỉ kích hoạt timeout khi chưa hoàn tất thanh toán
    if (activeStep < 3 && !loadingBookingTicket && !(successBookingTicketMessage || errorBookTicketMessage)) {
      dispatch({
        type: TIMEOUT,
      });
    }
  };

  return (
    <Countdown
      date={targetDate}
      renderer={({ minutes, seconds }) => (
        <span>
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )}
      onComplete={handleTimeOut}
    />
  );
}