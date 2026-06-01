import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const totalPrice = cartItems.reduce((acc: number, item: any) => acc + (item.price || 0), 0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "qr",
    seatPreference: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("การชำระเงินและจองที่นั่งสำเร็จ!");
    localStorage.removeItem("bornToDoCart");
    // Redirect to home or success page
    navigate("/");
    window.location.reload();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <h2 className="mb-4">กรุณาเลือกคอร์สเรียนก่อนทำรายการชำระเงิน</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>กลับไปหน้าหลัก</button>
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5 text-white animate-fade-in">
      <h2 className="fw-bold mb-4 border-bottom border-secondary pb-3 text-white">ข้อมูลการชำระเงินและจองที่นั่ง</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ borderRadius: "15px", border: "1px solid #444" }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold">ชื่อ</label>
                  <input type="text" name="firstName" className="form-control bg-dark text-white border-secondary" required placeholder="สมชาย" onChange={handleChange} style={{ borderRadius: "8px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-bold">นามสกุล</label>
                  <input type="text" name="lastName" className="form-control bg-dark text-white border-secondary" required placeholder="ใจดี" onChange={handleChange} style={{ borderRadius: "8px" }} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">อีเมล</label>
                <input type="email" name="email" className="form-control bg-dark text-white border-secondary" required placeholder="somchai@example.com" onChange={handleChange} style={{ borderRadius: "8px" }} />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">เบอร์โทรศัพท์</label>
                <input type="tel" name="phone" className="form-control bg-dark text-white border-secondary" required placeholder="0812345678" onChange={handleChange} style={{ borderRadius: "8px" }} />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">ระบุเลขที่นั่ง หรือความต้องการพิเศษ</label>
                <textarea name="seatPreference" className="form-control bg-dark text-white border-secondary" rows={2} placeholder="เช่น แถว A ที่นั่ง 05" onChange={(e: any) => handleChange(e)} style={{ borderRadius: "8px" }}></textarea>
              </div>
              
              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold mb-3">เลือกวิธีการชำระเงิน</label>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className={`card p-3 border-secondary ${formData.paymentMethod === "qr" ? "bg-primary border-primary" : "bg-dark"}`} style={{ cursor: "pointer", borderRadius: "10px" }} onClick={() => setFormData({...formData, paymentMethod: "qr"})}>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="paymentMethod" checked={formData.paymentMethod === "qr"} onChange={() => {}} />
                        <label className="form-check-label fw-bold">PromptPay / QR Code</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={`card p-3 border-secondary ${formData.paymentMethod === "credit" ? "bg-primary border-primary" : "bg-dark"}`} style={{ cursor: "pointer", borderRadius: "10px" }} onClick={() => setFormData({...formData, paymentMethod: "credit"})}>
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="paymentMethod" checked={formData.paymentMethod === "credit"} onChange={() => {}} />
                        <label className="form-check-label fw-bold">บัตรเครดิต / เดบิต</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn btn-danger btn-lg w-100 fw-bold shadow mt-2" style={{ borderRadius: "10px" }}>
                ยืนยันการจองและชำระเงิน ฿{totalPrice.toLocaleString()}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ borderRadius: "15px", border: "1px solid #444" }}>
            <h5 className="fw-bold mb-4">รายการคอร์สที่จอง</h5>
            {cartItems.map((item: any) => (
              <div key={item.id} className="d-flex justify-content-between mb-3 align-items-center">
                <div className="d-flex align-items-center">
                  <img src={item.image} className="rounded me-2" style={{ width: "50px", height: "30px", objectFit: "cover" }} alt="" />
                  <div className="small fw-bold">{item.courseName}</div>
                </div>
                <div className="text-warning small fw-bold">฿{item.price?.toLocaleString()}</div>
              </div>
            ))}
            <hr className="border-secondary" />
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">จำนวนรายการ:</span>
              <span>{cartItems.length} คอร์ส</span>
            </div>
            <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
              <span>รวมทั้งสิ้น:</span>
              <span className="text-warning">฿{totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-center small text-muted">กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
