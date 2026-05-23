import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import "./CSS/form.css";
    
     function App() {
       return (
         <Router>
          <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
            {/* Navbar แบบ YouTube Lite */}
            <nav className="navbar navbar-expand-lg custom-navbar shadow sticky-top">
              <div className="container-fluid px-4">
                <Link className="navbar-brand fw-bold fs-4 me-auto" to="/">
                  <span className="text-white">RED</span>
                  <span style={{ color: "var(--navbar-hover)" }}>TUBE</span>
                </Link>
   
                {/* ช่องค้นหาตรงกลาง */}
               <form className="d-flex mx-auto w-50 d-none d-lg-flex">
                  <input
                   className="form-control me-2"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                    style={{ backgroundColor: "#121212", color: "white", border: "1px solid #3d3d3d" }}
                  />
                  <button className="btn btn-dark border-secondary" type="submit">🔍</button>
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
                <Route path="/" element={
                  <div>
                    <h3 className="text-white fw-bold mb-4">Recommended</h3>
                    {/* ตัวอย่าง Video Grid */}
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div className="col" key={item}>
                          <div className="card h-100 border-0 bg-transparent">
                            <div className="rounded" style={{ backgroundColor: "#333", aspectRatio: "16/9", width:"100%" }}></div>
                            <div className="card-body px-0 pt-2 pb-0">
                              <h6 className="card-title text-white mb-1">Video Title Example {item}</h6>
                              <p className="card-text text-muted mb-0" style={{ fontSize: "0.9rem" }}>Channel Name</p>
                              <p className="card-text text-muted" style={{ fontSize: "0.85rem" }}>120K views • 2 daysago</p>
                            </div>
                          </div>
                        </div>
                     ))}
                    </div>
                  </div>
                } />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </div>
          </div>
        </Router>
      );
    }
   
    export default App;