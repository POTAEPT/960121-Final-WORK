import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import IndexPage from "./index";
import Filter from "./filter";
import CourseDetail from "./CourseDetail";
import Cart from "./cart";
import Checkout from "./Checkout";
import "./CSS/form.css";
import "./CSS/cart.css";

function Navigation({ searchInput, handleFilterChange, showFilters, setShowFilters, filters, handleResetFilters, cartItems, removeFromCart }) {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // ตรวจสอบว่าเป็นหน้า Auth หรือไม่
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  const isDetailPage = location.pathname.startsWith("/course/");
  const isCheckoutPage = location.pathname === "/checkout";

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar shadow sticky-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold me-auto d-flex align-items-center" to="/" onClick={() => setIsCartOpen(false)}>
            <span className="text-white fs-3">Born to </span>
            <span className="fs-3 ms-1" style={{ color: "var(--navbar-hover)" }}>Do</span>
          </Link>

          {/* ถ้าไม่ใช่หน้า Auth ให้แสดงส่วนควบคุมทั้งหมด */}
          {!isAuthPage && (
            <>
              {/* ช่องค้นหาและปุ่ม Filter (แสดงเฉพาะหน้า Home) */}
              {!isDetailPage && !isCheckoutPage && (
                <div className="d-flex mx-auto d-none d-lg-flex align-items-center" style={{ width: "40%", maxWidth: "600px" }}>
                  <div className="input-group" style={{ height: "40px" }}>
                    <input className="form-control shadow-none" type="search" name="search" placeholder="ค้นหาคอร์สเรียน..." value={searchInput} onChange={handleFilterChange} style={{ backgroundColor: "#121212", color: "white", border: "1px solid #303030", borderTopLeftRadius: "40px", borderBottomLeftRadius: "40px", paddingLeft: "20px" }} />
                    <button className="btn btn-dark d-flex align-items-center justify-content-center" type="button" style={{ width: "50px", backgroundColor: "#222", border: "1px solid #303030", borderLeft: "none", borderTopRightRadius: "40px", borderBottomRightRadius: "40px" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                    </button>
                  </div>
                  <button className={`btn ms-2 d-flex align-items-center justify-content-center shadow-none transition-all ${showFilters ? "btn-primary" : ""}`} onClick={() => setShowFilters(!showFilters)} style={{ borderRadius: "50%", width: "38px", height: "38px", padding: 0, backgroundColor: showFilters ? "var(--primary-color)" : "#222", border: "1px solid #303030", color: showFilters ? "white" : "#888" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/></svg>
                  </button>
                </div>
              )}

              <div className="d-flex align-items-center">
                {/* ตะกร้าสินค้า */}
                <div className="cart-icon-wrapper me-3" onClick={() => setIsCartOpen(!isCartOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                  {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                  <Cart cartItems={cartItems} removeFromCart={removeFromCart} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>

                {/* ปุ่ม Hamburger (มือถือ) */}
                <button className="navbar-toggler border-white ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
                </button>

                {/* ปุ่ม Sign In / Sign Up */}
                <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
                  <ul className="navbar-nav ms-auto align-items-center mt-3 mt-lg-0">
                    <li className="nav-item"><Link className="nav-link navbar-custom-btn mx-1" to="/signin">Sign In</Link></li>
                    <li className="nav-item mt-2 mt-lg-0"><Link className="nav-link navbar-custom-btn mx-1" to="/signup">Sign Up</Link></li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {showFilters && !isAuthPage && !isDetailPage && !isCheckoutPage && (
        <Filter filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
      )}
    </>
  );
}

function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "All", priceRange: 5000 });

  useEffect(() => {
    const timer = setTimeout(() => setFilters(prev => ({ ...prev, search: searchInput })), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const addToCart = (course) => {
    if (!cartItems.find(item => item.id === course.id)) {
      setCartItems([...cartItems, course]);
    }
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item.id !== id));

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") setSearchInput(value);
    else setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setFilters({ search: "", category: "All", priceRange: 5000 });
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
        <Navigation 
          searchInput={searchInput}
          handleFilterChange={handleFilterChange}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          handleResetFilters={handleResetFilters}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
        />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<IndexPage filters={filters} addToCart={addToCart} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/course/:id" element={<CourseDetail addToCart={addToCart} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} removeFromCart={removeFromCart} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
