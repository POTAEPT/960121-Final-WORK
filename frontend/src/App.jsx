import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import IndexPage from "./index";
import Filter from "./filter"; // Import Component ใหม่ที่แยกออกมา
import "./CSS/form.css";

function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    priceRange: 5000
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "All",
      priceRange: 5000
    });
  };

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

            <div className="d-flex mx-auto d-none d-lg-flex align-items-center" style={{ width: "50%", maxWidth: "700px" }}>
              <div className="input-group" style={{ height: "40px" }}>
                <input 
                  className="form-control" 
                  type="search" 
                  name="search"
                  placeholder="ค้นหาคอร์สเรียนที่คุณสนใจ..." 
                  value={filters.search}
                  onChange={handleFilterChange}
                  style={{ 
                    backgroundColor: "#121212", color: "white", border: "1px solid #303030", 
                    borderTopLeftRadius: "40px", borderBottomLeftRadius: "40px", paddingLeft: "25px"
                  }}
                />
                <button className="btn btn-dark border-secondary px-3" style={{ borderLeft: "none", backgroundColor: "#222" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                </button>
              </div>
              
              <button 
                className={`btn ms-2 d-flex align-items-center justify-content-center ${showFilters ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setShowFilters(!showFilters)}
                style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                </svg>
              </button>
            </div>

            <button className="navbar-toggler border-white ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
            </button>

            <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center mt-3 mt-lg-0">
                <li className="nav-item"><Link className="nav-link navbar-custom-btn mx-1" to="/signin">Sign In</Link></li>
                <li className="nav-item mt-2 mt-lg-0"><Link className="nav-link navbar-custom-btn mx-1" to="/signup">Sign Up</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* เรียกใช้งาน Component Filter ที่แยกออกมา */}
        {showFilters && (
          <Filter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onReset={handleResetFilters} 
          />
        )}

        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<IndexPage filters={filters} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
