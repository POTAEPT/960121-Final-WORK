import React, { useState } from "react";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign In Data:", formData);
  };

  return (
    <div className="form-container">
      <div className="card shadow p-4 border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 fw-bold" style={{color: "var(--primary-color)"}}>Sign In</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm" style={{borderRadius: "10px"}}>
            Sign In
          </button>
        </form>
        <div className="text-center mt-4">
          <small className="text-muted">
            Don't have an account? <a href="/signup" className="text-decoration-none fw-bold" style={{color: "var(--primary-color)"}}>Sign Up</a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
