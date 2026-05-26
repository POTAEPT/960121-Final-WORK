import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/form.css";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign In Data:", formData);
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
