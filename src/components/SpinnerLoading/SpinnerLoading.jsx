import React from "react";
import "./SpinnerLoading.scss";

export default function SpinnerLoading() {
  return (
    <div className="world-cinema-loader">
      {/* 1. Logo World Cinema phát sáng */}
      <div className="logo-wrapper">
        <img
          src="/img/world-cinema-logo.png"
          alt="World Cinema Logo"
          className="logo-img"
        />
      </div>

      {/* 2. Dòng chữ thương hiệu */}
      <div className="brand-text">WORLD CINEMA</div>

      {/* 3. Thanh tiến trình cam chạy mượt mà */}
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
}