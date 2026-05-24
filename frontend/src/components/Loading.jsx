import React from "react";

const Loading = ({ message = "กำลังโหลดข้อมูล..." }) => (
  <div className="container text-center mt-5 py-5 animate-fade-in">
    <div className="spinner-border text-danger mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="text-white fs-5">{message}</p>
  </div>
);

export default Loading;
