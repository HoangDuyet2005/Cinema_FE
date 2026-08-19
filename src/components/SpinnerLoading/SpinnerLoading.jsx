import React from "react";
import { CubeGrid } from "styled-loaders-react";
import "./SpinnerLoading.scss";
export default function SpinnerLoading() {
  return (
    <div className="loader">
      <CubeGrid color="#ff0000" size="70px" />
    </div>
  );
}
