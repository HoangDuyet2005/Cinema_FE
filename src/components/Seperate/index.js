import React from 'react'
// import post from "../../assets/posterBG.jpg"

export default function index() {
  const style = {
    height: "80px",
    maxWidth: 940,
    margin: "auto",
    width: "100%",
    background:"url(../../assets/posterBG.jpg)",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat"
  }
  return (
    <div style={style}></div>
  )
}
