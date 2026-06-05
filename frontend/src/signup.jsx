import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./CSS/form.css";

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ดักจับรหัสผ่านไม่ตรงกัน
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณายืนยันรหัสผ่านให้ถูกต้องอีกครั้งครับ',
        background: '#1a1a1a', color: '#ffffff', confirmButtonColor: '#e63946'
      });
      return;
    }
    
    try {
      // โชว์ Loading ระหว่างส่งข้อมูล
      Swal.fire({
        title: "กำลังสร้างบัญชี...",
        text: "โปรดรอสักครู่ ระบบกำลังลงทะเบียนให้คุณ",
        allowOutsideClick: false,
        background: '#1a1a1a', color: '#ffffff',
        didOpen: () => { Swal.showLoading(); }
      });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username, 
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ! 🎉',
          text: 'ยินดีต้อนรับสู่ Born to Do กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน',
          background: '#1a1a1a', color: '#ffffff', confirmButtonColor: '#0d6efd'
        }).then(() => {
          navigate("/signin"); // พาไปหน้าล็อกอินแบบสมูทๆ
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถสมัครได้',
          text: result.message || 'เกิดข้อผิดพลาดบางอย่าง',
          background: '#1a1a1a', color: '#ffffff', confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'ระบบขัดข้อง',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ในขณะนี้',
        background: '#1a1a1a', color: '#ffffff', confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Username</label>
            <input 
              type="text" 
              className="form-control auth-input" 
              name="username" 
              placeholder="Choose a username"
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </div>
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
              placeholder="Create a password"
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-control auth-input" 
              name="confirmPassword" 
              placeholder="Repeat your password"
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn shadow-sm">
            Sign Up
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/signin" className="text-danger fw-bold text-decoration-none">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
