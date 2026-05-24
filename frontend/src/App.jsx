import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import IndexPage from "./index";
import "./CSS/form.css";

function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg custom-navbar shadow sticky-top">
          <div className="container-fluid px-4">
            <Link className="navbar-brand fw-bold me-auto d-flex align-items-center" to="/">
              <span className="text-white fs-3">Born to </span>
              <span className="fs-3 ms-1" style={{ color: "var(--navbar-hover)" }}>Do</span>
            </Link>

            {/* ช่องค้นหา */}
            <form className="d-flex mx-auto w-50 d-none d-lg-flex">
              <input 
                className="form-control me-2" 
                type="search" 
                placeholder="ค้นหาคอร์สเรียน..." 
                style={{ backgroundColor: "#121212", color: "white", border: "1px solid #3d3d3d", borderRadius: "20px", padding: "5px 15px" }}
              />
              <button className="btn btn-dark border-secondary" type="submit" style={{ borderRadius: "20px" }}>🔍</button>
            </form>

            <button
              className="navbar-toggler border-white ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
            </button>

            <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center mt-3 mt-lg-0">
                <li className="nav-item">
                  <Link className="nav-link navbar-custom-btn mx-1" to="/signin">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item mt-2 mt-lg-0">
                  <Link className="nav-link navbar-custom-btn mx-1" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <div className="container-fluid mt-4 px-4 pb-5">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
