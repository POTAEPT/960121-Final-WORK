import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import IndexPage from "./index";
import Filter from "./filter";
import CourseDetail from "./CourseDetail";
import Cart from "./cart";
import Summary from "./Summary";
import CheckoutForm from "./checkout";
import "./CSS/form.css";
import "./CSS/cart.css";
import "./CSS/ui-enhancements.css";

// ==========================================
// 1. Navigation Component (แถบเมนูด้านบน)
// ==========================================
function Navigation({ 
  searchInput, handleFilterChange, showFilters, setShowFilters, 
  filters, handleResetFilters, cartItems, removeFromCart 
}) {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // เช็คว่าปัจจุบันอยู่หน้าไหน เพื่อใช้ซ่อน/โชว์ UI บางส่วน
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";
  const isDetailPage = location.pathname.startsWith("/course/");
  const isCheckoutPage = location.pathname === "/checkout" || location.pathname === "/checkout-form";

  // เช็คสถานะการ Login จาก Token ใน LocalStorage
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar shadow sticky-top">
        <div className="container-fluid px-4">
          
          {/* Logo */}
          <Link className="navbar-brand fw-bold me-auto d-flex align-items-center" to="/" onClick={() => setIsCartOpen(false)}>
            <span className="text-white fs-3">Born to </span>
            <span className="fs-3 ms-1" style={{ color: "var(--navbar-hover)" }}>Do</span>       
          </Link>

          {/* ถ้าไม่ใช่หน้า Login/Signup ให้แสดงส่วนค้นหาและตะกร้า */}
          {!isAuthPage && (
            <>
              {/* แถบค้นหา (ซ่อนในหน้า Detail และ Checkout) */}
              {!isDetailPage && !isCheckoutPage && (
                <div className="d-flex mx-auto d-none d-lg-flex align-items-center" style={{ width: "40%", maxWidth: "600px" }}>
                  <div className="input-group" style={{ height: "40px" }}>
                    <input 
                      className="form-control shadow-none" 
                      type="search" 
                      name="search" 
                      placeholder="ค้นหาคอร์สเรียน..." 
                      value={searchInput} 
                      onChange={handleFilterChange} 
                      style={{ backgroundColor: "#121212", color: "white", border: "1px solid #303030", borderTopLeftRadius: "40px", borderBottomLeftRadius: "40px", paddingLeft: "20px" }} 
                    />
                    <button 
                      className="btn btn-dark d-flex align-items-center justify-content-center" 
                      type="button" 
                      style={{ width: "50px", backgroundColor: "#222", border: "1px solid #303030", borderLeft: "none", borderTopRightRadius: "40px", borderBottomRightRadius: "40px" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                    </button>
                  </div>
                  <button 
                    className={`btn ms-2 d-flex align-items-center justify-content-center shadow-none transition-all ${showFilters ? "btn-primary" : ""}`} 
                    onClick={() => setShowFilters(!showFilters)} 
                    style={{ borderRadius: "50%", width: "38px", height: "38px", padding: 0, backgroundColor: showFilters ? "var(--primary-color)" : "#222", border: "1px solid #303030", color: showFilters ? "white" : "#888" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/></svg>
                  </button>
                </div>
              )}

              {/* ส่วนขวา: ตะกร้า และ เมนู Login/Logout */}
              <div className="d-flex align-items-center">
                
                {/* ไอคอนตะกร้า */}
                <div className="cart-icon-wrapper me-3" onClick={() => setIsCartOpen(!isCartOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                  {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                  <Cart cartItems={cartItems} removeFromCart={removeFromCart} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>

                <button className="navbar-toggler border-white ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                  <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>  
                </button>

                {/* เมนู Login / Logout */}
                <div className="collapse navbar-collapse flex-grow-0" id="navbarNav">
                  <ul className="navbar-nav ms-auto align-items-center mt-3 mt-lg-0">
                    {isLoggedIn ? (
                      // โชว์ปุ่ม Sign Out ถ้ามี Token
                      <li className="nav-item">
                            <button 
                              onClick={handleLogout} 
                              className="btn btn-light mx-1 fw-bold shadow-sm" 
                              style={{ borderRadius: "10px", color: "#e63946" }}
                            >
                              Sign Out
                            </button>
                      </li>
                    ) : (
                      // โชว์ปุ่ม Sign In / Sign Up ถ้าไม่มี Token
                      <>
                        <li className="nav-item"><Link className="nav-link navbar-custom-btn mx-1" to="/signin">Sign In</Link></li>
                        <li className="nav-item mt-2 mt-lg-0"><Link className="nav-link navbar-custom-btn mx-1" to="/signup">Sign Up</Link></li>
                      </>
                    )}
                  </ul>
                </div>

              </div>
            </>
          )}
        </div>
      </nav>

      {/* แถบ Filter ค้นหา */}
      {showFilters && !isAuthPage && !isDetailPage && !isCheckoutPage && (
        <Filter filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
      )}
    </>
  );
}

// ==========================================
// 2. Main App Component (จัดการ State และ Routes)
// ==========================================
function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", category: "All", priceRange: 5000 });

  // จัดการตะกร้าสินค้า
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("bornToDoCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // บันทึกตะกร้าลง LocalStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("bornToDoCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ลอจิกค้นหาแบบหน่วงเวลา (Debounce)
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
            <Route path="/checkout" element={<Summary cartItems={cartItems} removeFromCart={removeFromCart} />} />
            <Route path="/checkout-form" element={<CheckoutForm />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;