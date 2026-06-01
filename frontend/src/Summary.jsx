import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/cart.css";

const Summary = ({ cartItems, removeFromCart }) => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  const handleConfirmPayment = () => {
    navigate("/checkout-form", { state: { cartItems } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <div className="py-5">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-basket3 mb-4 opacity-25" viewBox="0 0 16 16">
             <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .687-.172zM3.383 6 5.17 2.156 6.735 6H3.383zM11 6 9.43 2.156 7.643 6H11zm-3.173 2H8a.5.5 0 0 1 .5.5v3.975l.822-.305a.5.5 0 0 1 .354.936l-1.5 0.556a.5.5 0 0 1-.352 0l-1.5-0.556a.5.5 0 0 1 .354-.936l.822.305V8.5a.5.5 0 0 1 .5-.5z"/>
           </svg>
           <h2 className="mb-4 fw-bold">ยังไม่มีรายการคอร์สที่เลือก</h2>
           <button className="btn btn-primary btn-lg px-5" style={{ borderRadius: "30px" }} onClick={() => navigate("/")}>กลับไปเลือกคอร์ส</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5 text-white animate-fade-in">
      {/* Progress Steps */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="d-flex justify-content-between position-relative">
            <div className="progress position-absolute top-50 start-0 w-100" style={{ height: "2px", zIndex: 0, marginTop: "-1px" }}>
              <div className="progress-bar bg-primary" style={{ width: "50%" }}></div>
            </div>
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: "35px", height: "35px" }}>1</div>
              <span className="small fw-bold">ตรวจสอบรายการ</span>
            </div>
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: "35px", height: "35px" }}>2</div>
              <span className="small text-muted">ชำระเงิน</span>
            </div>
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: "35px", height: "35px" }}>3</div>
              <span className="small text-muted">สำเร็จ</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="fw-bold mb-4 d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cart-check-fill me-3 text-primary" viewBox="0 0 16 16">
          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM4 14a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm7 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.354-7.646a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
        </svg>
        ตรวจสอบรายการจองของคุณ
      </h2>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary shadow-lg" style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="card-body p-0">
              {cartItems.map((item, index) => (
                <div
                  className={`d-flex align-items-center p-4 ${index !== cartItems.length - 1 ? "border-bottom border-secondary" : ""}`}
                  key={item.id}
                  style={{ transition: "background 0.3s" }}
                >
                  <div className="position-relative">
                    <img src={item.image} className="rounded-3 shadow-sm" style={{ width: "140px", height: "80px", objectFit: "cover" }} alt="" />
                    <span className="position-absolute top-0 start-0 badge bg-danger m-1" style={{ fontSize: "0.6rem" }}>SELECTED</span>
                  </div>
                  <div className="ms-4 flex-grow-1">
                    <h5 className="mb-1 fw-bold text-white">{item.courseName}</h5>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-opacity-10 bg-primary text-primary border border-primary border-opacity-25 me-2" style={{ fontSize: "0.7rem" }}>คอร์สออนไลน์</span>
                      <span className="text-muted small">1 ที่นั่ง</span>
                    </div>
                  </div>
                  <div className="text-end me-4">
                    <div className="text-warning fw-bold fs-5">฿{item.price?.toLocaleString()}</div>
                    <div className="text-muted small text-decoration-line-through">฿{(item.price * 1.2).toLocaleString()}</div>
                  </div>
                  <button 
                    className="btn btn-outline-danger btn-sm p-2" 
                    onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                    style={{ borderRadius: "10px", width: "35px", height: "35px", display: "flex", alignItems: "center", justifyCenter: "center" }}
                    title="ลบออกจากรายการ"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 d-flex justify-content-between align-items-center p-3 rounded-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px dashed #444" }}>
            <div className="text-light small">
              <span className="text-success me-2">●</span>
              ราคานี้รวมภาษีมูลค่าเพิ่มแล้ว และคุณจะได้รับใบเสร็จหลังชำระเงิน
            </div>
            <button className="btn btn-link text-decoration-none text-danger fw-bold btn-sm" onClick={() => navigate("/")}>+ เพิ่มคอร์สอื่น</button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-lg sticky-top" style={{ borderRadius: "20px", border: "1px solid #444", top: "100px" }}>
            <h5 className="fw-bold mb-4 text-white">สรุปยอดชำระ</h5>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">จำนวนรายการ:</span>
              <span className="fw-bold">{cartItems.length} คอร์ส</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">ส่วนลดพิเศษ:</span>
              <span className="text-success fw-bold">- ฿{(totalPrice * 0.2).toLocaleString()}</span>
            </div>
            <hr className="border-secondary mb-4" />
            <div className="d-flex justify-content-between mb-4 align-items-end">
              <div>
                <div className="text-muted small mb-1">ยอดชำระสุทธิ</div>
                <div className="fs-2 fw-bold text-warning" style={{ lineHeight: 1 }}>฿{totalPrice.toLocaleString()}</div>
              </div>
              <div className="text-muted small">ประหยัดไป 20%</div>
            </div>

            <button
              className="btn btn-danger btn-lg w-100 fw-bold mb-3 shadow-lg py-3"
              style={{ borderRadius: "15px", fontSize: "1.1rem" }}
              onClick={handleConfirmPayment}
            >
              ดำเนินการชำระเงิน
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-right ms-2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>

            <div className="text-center small text-muted">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-shield-lock-fill me-2 text-success" viewBox="0 0 16 16"><path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.775 11.775 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24c.304-.143.662-.352 1.048-.625a11.773 11.773 0 0 0 2.517-2.453c1.678-2.195 2.861-5.513 2.265-9.99a1.541 1.541 0 0 0-1.044-1.263 62.456 62.456 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"/></svg>
                Secure 256-bit SSL Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
