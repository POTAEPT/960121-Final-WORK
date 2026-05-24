import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/cart.css";

const Checkout = ({ cartItems, removeFromCart }) => {
  const navigate = useNavigate();
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <h2 className="mb-4">ยังไม่มีรายการในตะกร้า</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>กลับไปเลือกคอร์ส</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5 text-white">
      <h2 className="fw-bold mb-4 border-bottom border-secondary pb-3">ยืนยันการจองที่นั่งเรียน</h2>
      <div className="row g-4">
        {/* รายการคอร์ส */}
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-body p-0">
              {cartItems.map((item) => (
                <div 
                  className="d-flex align-items-center p-3 border-bottom border-secondary course-item-checkout" 
                  key={item.id}
                  style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                  onClick={() => navigate(`/course/${item.id}`)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <img src={item.image} className="rounded" style={{ width: "120px", height: "70px", objectFit: "cover" }} alt="" />
                  <div className="ms-4 flex-grow-1">
                    <h5 className="mb-1 fw-bold text-white">{item.courseName}</h5>
                    <div className="small text-muted mb-2">กดเพื่อดูรายละเอียดคอร์สอีกครั้ง</div>
                    <div className="text-warning fw-bold fs-5">฿{item.price?.toLocaleString()}</div>
                  </div>
                  {/* เปลี่ยนจาก "ลบรายการ" เป็น "ลบ" */}
                  <button className="btn btn-outline-danger btn-sm px-3" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>ลบ</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* สรุปยอดเงิน */}
        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ borderRadius: "15px", border: "1px solid #444" }}>
            <h5 className="fw-bold mb-4">สรุปยอดชำระเงิน</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">จำนวนคอร์ส:</span>
              <span>{cartItems.length} รายการ</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
              <span>รวมทั้งสิ้น:</span>
              <span className="text-warning">฿{totalPrice.toLocaleString()}</span>
            </div>
            <button className="btn btn-danger btn-lg w-100 fw-bold mb-3 shadow" style={{ borderRadius: "10px" }}>
              ยืนยันการชำระเงิน
            </button>
            <p className="text-center small text-muted">ปลอดภัยด้วยการเข้ารหัส SSL 256-bit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
