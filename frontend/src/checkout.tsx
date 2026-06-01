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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 9) {
      alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
      return;
    }
    alert("การชำระเงินและจองที่นั่งสำเร็จ! ข้อมูลการจองของคุณถูกส่งไปยังอีเมลแล้ว");
    localStorage.removeItem("bornToDoCart");
    navigate("/");
    window.location.reload();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <div className="py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-octagon mb-4 opacity-25" viewBox="0 0 16 16">
            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          <h2 className="mb-4 fw-bold">กรุณาทำตามขั้นตอนการจองให้ถูกต้อง</h2>
          <button className="btn btn-primary btn-lg px-5" style={{ borderRadius: "30px" }} onClick={() => navigate("/")}>กลับไปหน้าหลัก</button>
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
              <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
            </div>
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: "35px", height: "35px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>
              </div>
              <span className="small text-muted">ตรวจสอบรายการ</span>
            </div>
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: "35px", height: "35px" }}>2</div>
              <span className="small fw-bold">ชำระเงิน</span>
            </div>
            <div className="text-center position-relative" style={{ zIndex: 1 }}>
              <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 shadow" style={{ width: "35px", height: "35px" }}>3</div>
              <span className="small text-muted">สำเร็จ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary p-4 shadow-lg mb-4" style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h5 className="mb-4 fw-bold d-flex align-items-center text-white">
              <span className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "32px", height: "32px", fontSize: "16px" }}>1</span>
              ข้อมูลผู้สมัครเรียน
            </h5>
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-light small fw-bold">ชื่อจริง</label>
                  <input type="text" name="firstName" className="form-control bg-dark text-white border-secondary py-3" required placeholder="สมชาย" value={formData.firstName} onChange={handleChange} style={{ borderRadius: "12px" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-light small fw-bold">นามสกุล</label>
                  <input type="text" name="lastName" className="form-control bg-dark text-white border-secondary py-3" required placeholder="ใจดี" value={formData.lastName} onChange={handleChange} style={{ borderRadius: "12px" }} />
                </div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-md-7">
                  <label className="form-label text-light small fw-bold">อีเมลสำหรับรับรายละเอียดคอร์ส</label>
                  <input type="email" name="email" className="form-control bg-dark text-white border-secondary py-3" required placeholder="example@born-to-do.com" value={formData.email} onChange={handleChange} style={{ borderRadius: "12px" }} />
                </div>
                <div className="col-md-5">
                  <label className="form-label text-light small fw-bold">เบอร์โทรศัพท์มือถือ</label>
                  <input type="tel" name="phone" className="form-control bg-dark text-white border-secondary py-3" required placeholder="08XXXXXXXX" value={formData.phone} onChange={handleChange} style={{ borderRadius: "12px" }} />
                </div>
              </div>

              <h5 className="mb-4 mt-5 fw-bold d-flex align-items-center text-white">
                <span className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "32px", height: "32px", fontSize: "16px" }}>2</span>
                รายละเอียดที่นั่ง / คำขอพิเศษ
              </h5>
              <div className="mb-4">
                <textarea name="seatPreference" className="form-control bg-dark text-white border-secondary py-3" rows={3} placeholder="ระบุเลขที่นั่งที่คุณต้องการ หรือแจ้งความต้องการพิเศษ (ถ้ามี)..." value={formData.seatPreference} onChange={handleChange} style={{ borderRadius: "12px" }}></textarea>
              </div>
              
              <h5 className="mb-4 mt-5 fw-bold d-flex align-items-center text-white">
                <span className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "32px", height: "32px", fontSize: "16px" }}>3</span>
                ช่องทางชำระเงิน
              </h5>
              <div className="row g-3 mb-2">
                <div className="col-md-6">
                  <div 
                    className={`card p-4 h-100 transition-all ${formData.paymentMethod === "qr" ? "border-primary shadow-primary" : "border-secondary"}`} 
                    style={{ 
                      cursor: "pointer", 
                      borderRadius: "18px", 
                      backgroundColor: formData.paymentMethod === "qr" ? "rgba(13, 110, 253, 0.15)" : "#161616",
                      borderWidth: "2px"
                    }} 
                    onClick={() => setFormData({...formData, paymentMethod: "qr"})}
                  >
                    <div className="d-flex align-items-center">
                      <div className="form-check p-0 m-0">
                        <input className="form-check-input ms-0 me-3" type="radio" name="paymentMethod" checked={formData.paymentMethod === "qr"} onChange={() => {}} style={{ width: "20px", height: "20px" }} />
                      </div>
                      <div className="text-center flex-grow-1">
                        <div className="mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-qr-code text-primary" viewBox="0 0 16 16"><path d="M2 2h2v2H2V2Z"/><path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"/><path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z"/><path d="M10 0v6h6V0h-6Zm5 1v4h4V1h-4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z"/><path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z"/></svg>
                        </div>
                        <div className="fw-bold text-white">PromptPay QR</div>
                        <div className="small text-muted">โอนผ่านธนาคารทันที</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div 
                    className={`card p-4 h-100 transition-all ${formData.paymentMethod === "credit" ? "border-primary shadow-primary" : "border-secondary"}`} 
                    style={{ 
                      cursor: "pointer", 
                      borderRadius: "18px", 
                      backgroundColor: formData.paymentMethod === "credit" ? "rgba(13, 110, 253, 0.15)" : "#161616",
                      borderWidth: "2px"
                    }} 
                    onClick={() => setFormData({...formData, paymentMethod: "credit"})}
                  >
                    <div className="d-flex align-items-center">
                      <div className="form-check p-0 m-0">
                        <input className="form-check-input ms-0 me-3" type="radio" name="paymentMethod" checked={formData.paymentMethod === "credit"} onChange={() => {}} style={{ width: "20px", height: "20px" }} />
                      </div>
                      <div className="text-center flex-grow-1">
                        <div className="mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-credit-card-2-front text-primary" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H4zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/><path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/></svg>
                        </div>
                        <div className="fw-bold text-white">Credit / Debit Card</div>
                        <div className="small text-muted">VISA, Mastercard, JCB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-lg sticky-top" style={{ borderRadius: "20px", border: "1px solid #444", top: "100px", overflow: "hidden" }}>
            {/* Ticket Header Decoration */}
            <div className="position-absolute top-0 start-0 w-100 bg-primary" style={{ height: "6px" }}></div>
            
            <h5 className="fw-bold mb-4 d-flex justify-content-between align-items-center text-white">
              สรุปรายการจอง
              <span className="badge bg-primary rounded-pill fw-normal text-white" style={{ fontSize: "0.75rem" }}>{cartItems.length} รายการ</span>
            </h5>
            
            <div className="cart-items-mini mb-4" style={{ maxHeight: "350px", overflowY: "auto" }}>
              {cartItems.map((item: any) => (
                <div key={item.id} className="d-flex align-items-center mb-3 p-2 rounded-3" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <img src={item.image} className="rounded me-3" style={{ width: "70px", height: "40px", objectFit: "cover" }} alt="" />
                  <div className="flex-grow-1 min-width-0">
                    <div className="fw-bold text-truncate text-white small">{item.courseName}</div>
                    <div className="text-warning fw-bold small">฿{item.price?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 mb-4 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-50">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light small opacity-50">ยอดรวมราคาปกติ</span>
                <span className="small text-white text-decoration-line-through">฿{(totalPrice * 1.2).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-light small opacity-50">ส่วนลดแคมเปญ</span>
                <span className="small text-success fw-bold">- ฿{(totalPrice * 0.2).toLocaleString()}</span>
              </div>
              <hr className="border-secondary opacity-25" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white fw-bold">ยอดชำระสุทธิ</span>
                <span className="text-warning fs-3 fw-bold">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              className="btn btn-danger btn-lg w-100 fw-bold shadow-lg py-3 mb-3" 
              style={{ borderRadius: "15px", fontSize: "1.1rem" }}
            >
              ชำระเงินตอนนี้
            </button>
            
            <div className="text-center">
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                โดยการคลิกปุ่มชำระเงิน คุณยอมรับ <span className="text-decoration-underline" style={{ cursor: "pointer" }}>เงื่อนไขการจอง</span> ของทางเรา
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
