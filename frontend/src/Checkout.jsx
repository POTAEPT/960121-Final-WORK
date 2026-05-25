import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/cart.css";

const Checkout = ({ cartItems, removeFromCart }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // จำลองการยิง POST ไปยัง API หลังบ้าน
      const response = await fetch("https://api.example.com/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          total: totalPrice,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.status === 409) {
        // ดักรับกรณีเซิร์ฟเวอร์ส่ง Status 409 (Conflict)
        setErrorMessage("ขออภัย! มีคนจองที่นั่งในคอร์สนี้เต็มก่อนคุณ หรือคุณเคยจองคอร์สนี้ไปแล้ว");
        return;
      }

      if (!response.ok) {
        throw new Error("การส่งข้อมูลล้มเหลว");
      }

      // ถ้าสำเร็จ
      alert("ยืนยันการจองสำเร็จ! เราได้รับข้อมูลของคุณแล้ว");
      // ล้างตะกร้า หรือพาไปหน้าความสำเร็จ (ในที่นี้จำลองว่าสำเร็จ)
      // window.localStorage.removeItem("bornToDoCart");
      navigate("/");

    } catch (error) {
      // กรณี Error อื่นๆ เช่น Network พัง (ในที่นี้เราจำลอง API ดังนั้นมันจะเข้า Catch เสมอ)
      // ผมจะจำลองสถานการณ์ 409 ให้ดูเป็นตัวอย่างถ้าคุณต้องการทดสอบ UI
      console.error("Payment Error:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <h2 className="mb-4">ยังไม่มีรายการในตะกร้า</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>กลับไปเลือกคอร์ส</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5 text-white animate-fade-in">
      <h2 className="fw-bold mb-4 border-bottom border-secondary pb-3 text-white">ยืนยันการจองที่นั่งเรียน</h2>
      
      {/* UI แจ้งเตือนกรณีเกิด Error (รวมถึง 409) */}
      {errorMessage && (
        <div className="alert alert-danger d-flex align-items-center border-0 shadow-sm mb-4" style={{ borderRadius: "12px", backgroundColor: "rgba(220, 53, 69, 0.2)", color: "#ff8a8a" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-exclamation-triangle-fill me-3" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <div>
            <strong>เกิดข้อผิดพลาด:</strong> {errorMessage}
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary shadow-sm" style={{ borderRadius: "15px" }}>
            <div className="card-body p-0">
              {cartItems.map((item) => (
                <div 
                  className="d-flex align-items-center p-3 border-bottom border-secondary" 
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/course/${item.id}`)}
                >
                  <img src={item.image} className="rounded" style={{ width: "120px", height: "70px", objectFit: "cover" }} alt="" />
                  <div className="ms-4 flex-grow-1">
                    <h5 className="mb-1 fw-bold text-white">{item.courseName}</h5>
                    <div className="text-warning fw-bold fs-5">฿{item.price?.toLocaleString()}</div>
                  </div>
                  <button className="btn btn-outline-danger btn-sm px-3" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>ลบ</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ borderRadius: "15px", border: "1px solid #444" }}>
            <h5 className="fw-bold mb-4 text-white">สรุปยอดชำระเงิน</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">จำนวนคอร์ส:</span>
              <span>{cartItems.length} รายการ</span>
            </div>
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
              <span>รวมทั้งสิ้น:</span>
              <span className="text-warning">฿{totalPrice.toLocaleString()}</span>
            </div>
            
            {/* ปุ่มยืนยันพร้อม Loading State */}
            <button 
              className="btn btn-danger btn-lg w-100 fw-bold mb-3 shadow" 
              style={{ borderRadius: "10px" }}
              onClick={handleConfirmPayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  กำลังตรวจสอบ...
                </>
              ) : "ยืนยันการชำระเงิน"}
            </button>
            
            <p className="text-center small text-muted">ปลอดภัยด้วยการเข้ารหัส SSL 256-bit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
