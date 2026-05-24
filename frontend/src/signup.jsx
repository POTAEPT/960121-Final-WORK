import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Sign Up Data:", formData);
  };

  return (
    <div className="form-container">
      <div className="card shadow p-4 border-0" style={{ maxWidth: "450px", width: "100%", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 fw-bold" style={{color: "var(--primary-color)"}}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm" style={{borderRadius: "10px", backgroundColor: "#dc3545", borderColor: "#dc3545"}}>
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <small className="text-muted">
            Already have an account? <a href="/signin" className="text-decoration-none fw-bold" style={{color: "var(--primary-color)"}}>Sign In</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
