import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ใช้ useEffect เพื่อให้ Popup เด้งขึ้นมาจังหวะที่โดนถีบกลับ
  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบ',
        text: 'กรุณาเข้าสู่ระบบก่อนเข้าถึงหน้านี้🔒',
        confirmButtonText: 'ไปหน้าล็อกอิน',
        confirmButtonColor: '#e63946', // สีแดงให้เข้ากับธีม
        background: '#1a1a1a', // พื้นหลังสีดำ
        color: '#ffffff',
      });
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;