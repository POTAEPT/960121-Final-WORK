import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/form.css";

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords don't match");
    console.log("Sign Up Data:", formData);
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
