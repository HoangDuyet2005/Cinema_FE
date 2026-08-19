import React from 'react';
import { FAKE_AVATAR } from '../../../constants/config';

const formatNumber = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
}).format;

export default function AnnotationTemplate(annotation) {
  // console.log(annotation);
  const { data } = annotation;
  // console.log(data);
  return (
    <svg className="annotation" style={{fontSize: "12px"}}>
      <image href={data?.image ? data?.image : FAKE_AVATAR} width="60" height="40" />
      <rect x={0} y={0} className="border" 
        style={{
          width: "60px",
          height: "40px",
          stroke: "rgba(191, 191, 191, 0.25)",
          strokeWidth: "1px",
          fill: "transparent"
        }}>
      </rect>
      <text x="70" y="25" className="state"
        style={{
          fonWeight: "500",
          fontSize: "14px",
        }}
      >{annotation?.argument}</text>
      <text x="0" y="60">
        <tspan className="caption" style={{fontWeight: "500"}}>Tiêu dùng:</tspan>
        <tspan className="capital" dx="5">{formatNumber(data?.incomeAmount)}</tspan>
        <tspan dy="14" x="0" className="caption"
          style={{fontWeight: "500"}}
        >Số lượng vé:</tspan>
        <tspan className="population" dx="5">{data?.ticketAmount}</tspan>
        <tspan dx="5">vé</tspan>
        <tspan dy="14" x="0" className="caption" style={{fontWeight: "500"}}>Giao dịch:</tspan>
        <tspan className="area" dx="5">{data?.transactionCount}</tspan>
        {/* <tspan dx="5">lần</tspan> */}
      </text>
    </svg>
  );
}
