import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./CSS/form.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // โชว์ Loading ระหว่างตรวจ Token
      Swal.fire({
        title: "กำลังตรวจสอบข้อมูล...",
        allowOutsideClick: false,
        background: '#1a1a1a', color: '#ffffff',
        didOpen: () => { Swal.showLoading(); }
      });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        // เก็บ Token
        localStorage.setItem("token", result.data.token);
        
        // แจ้งเตือนสำเร็จ แล้วปล่อยให้ปิดเองใน 1.5 วินาที
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ! 🚀',
          text: 'ยินดีต้อนรับกลับมาครับ',
          timer: 1500,
          showConfirmButton: false,
          background: '#1a1a1a', color: '#ffffff'
        }).then(() => {
          // บังคับรีเฟรช 1 รอบเพื่อให้ Navbar เปลี่ยนปุ่มเป็น Sign Out ทันที
          window.location.href = "/"; 
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: result.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          background: '#1a1a1a', color: '#ffffff', confirmButtonColor: '#e63946'
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'ระบบขัดข้อง',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
        background: '#1a1a1a', color: '#ffffff', confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" 
              className="form-control auth-input" 
              name="email" 
              placeholder="Enter your email"
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input 
              type="password" 
              className="form-control auth-input" 
              name="password" 
              placeholder="Enter your password"
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn shadow-sm">
            Log In
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="text-danger fw-bold text-decoration-none">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
