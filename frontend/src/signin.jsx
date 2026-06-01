import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/form.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. ยิง Request ไปหา API เข้าสู่ระบบ
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ข้อมูลชุดนี้ชื่อตรงกันเป๊ะ โยนไปได้เลย
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        // 2. 🚨 หัวใจของ State & Continuity: เก็บ JWT Token ลง localStorage
        localStorage.setItem("token", result.data.token);
        
        alert("เข้าสู่ระบบสำเร็จ!");
        // พากลับไปหน้าแรกสุด
        window.location.href = "/"; 
      } else {
        alert(`เข้าสู่ระบบไม่สำเร็จ: ${result.message}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
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
