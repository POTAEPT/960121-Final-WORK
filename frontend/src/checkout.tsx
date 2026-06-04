import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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
    
    // Numeric-only validation for phone
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. ตรวจสอบเบอร์โทร
    if (formData.phone.length < 9) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้องนะครับ',
        background: '#1a1a1a',
        color: '#ffffff'
      });
      return;
    }

    // 2. ดึง Token เพื่อยืนยันตัวตน
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'เซสชันหมดอายุ',
        text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้งก่อนทำรายการ',
        background: '#1a1a1a',
        color: '#ffffff'
      }).then(() => {
        navigate("/signin");
      });
      return;
    }

    // 3. โชว์ Loading สวยๆ ระหว่างรอเซิร์ฟเวอร์
    Swal.fire({
      title: "กำลังประมวลผลการจอง...",
      text: "ระบบกำลังจัดสรรที่นั่งให้คุณ กรุณารอสักครู่",
      background: '#1a1a1a',
      color: '#ffffff',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      // 4. ลอจิกยิง API: ใช้ Loop ยิงจองทีละคอร์สตามของในตะกร้า
      for (const item of cartItems) {
        const response = await fetch("http://localhost:8080/api/bookings", { // 🚨 เช็ค PORT ให้ตรงกับ Backend ของเต้ด้วยนะครับ
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ classId: item.id }) // ส่ง ID คอร์สไปให้หลังบ้าน
        });

        const result = await response.json();

        // ดัก Error จาก Gatekeeper หลังบ้าน
        if (response.status === 409) {
          throw new Error(`คอร์ส "${item.courseName || item.title}" ที่นั่งเต็มแล้ว!`);
        } else if (!response.ok) {
          throw new Error(result.message || `เกิดข้อผิดพลาดในการจองคอร์ส ${item.courseName || item.title}`);
        }
      }

      // 5. ถ้า Loop จบโดยไม่ error แสดงว่าจองสำเร็จหมด!
      Swal.fire({
        icon: "success",
        title: "ชำระเงินและจองที่นั่งสำเร็จ! 🎉",
        text: "ขอบคุณที่เลือกเรียนกับเรา ลิงก์เข้าเรียนถูกส่งไปที่อีเมลแล้วครับ",
        confirmButtonColor: "#e63946",
        background: '#1a1a1a',
        color: '#ffffff'
      }).then(() => {
        // เคลียร์ตะกร้า และพากลับหน้าแรก
        localStorage.removeItem("bornToDoCart");
        navigate("/");
        window.location.reload(); // รีเฟรชให้ Navbar รีเซ็ตตะกร้าเป็น 0
      });

    } catch (err: any) {
      // 6. ถ้าเจอ Error (เช่นที่นั่งเต็มระหว่างทาง) ให้เด้งบอก
      Swal.fire({
        icon: "error",
        title: "จองไม่สำเร็จ",
        text: err.message || "ระบบขัดข้อง ไม่สามารถดำเนินการได้ในขณะนี้",
        confirmButtonColor: "#d33",
        background: '#1a1a1a',
        color: '#ffffff'
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center text-white">
        <div className="py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-cart-x mb-4 opacity-50" viewBox="0 0 16 16">
            <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
          <h2 className="mb-4 fw-bold text-white">กรุณาเลือกคอร์สเรียนก่อนทำรายการ</h2>
          <button className="btn btn-primary btn-lg px-5" style={{ borderRadius: "30px" }} onClick={() => navigate("/")}>กลับไปหน้าหลัก</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5 text-white animate-fade-in">
      <div className="d-flex align-items-center mb-4 border-bottom border-secondary pb-3">
        <button className="btn btn-outline-light btn-sm me-3" onClick={() => navigate(-1)} style={{ borderRadius: "50%", width: "32px", height: "32px", padding: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
        </button>
        <h2 className="fw-bold mb-0 text-white">ข้อมูลการชำระเงินและจองที่นั่ง</h2>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark border-secondary p-4 shadow-lg" style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h5 className="mb-4 fw-bold d-flex align-items-center text-white">
              <span className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "24px", height: "24px", fontSize: "14px" }}>1</span>
              ข้อมูลส่วนตัวผู้จอง
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-light small fw-bold">ชื่อ</label>
                  <input type="text" name="firstName" className="form-control bg-dark text-white border-secondary py-2" required placeholder="สมชาย" value={formData.firstName} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#555" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-light small fw-bold">นามสกุล</label>
                  <input type="text" name="lastName" className="form-control bg-dark text-white border-secondary py-2" required placeholder="ใจดี" value={formData.lastName} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#555" }} />
                </div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-light small fw-bold">อีเมล</label>
                  <input type="email" name="email" className="form-control bg-dark text-white border-secondary py-2" required placeholder="somchai@example.com" value={formData.email} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#555" }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-light small fw-bold">เบอร์โทรศัพท์ (ใส่เฉพาะตัวเลข)</label>
                  <input type="tel" name="phone" className="form-control bg-dark text-white border-secondary py-2" required placeholder="0812345678" value={formData.phone} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#555" }} />
                </div>
              </div>

              <h5 className="mb-4 fw-bold d-flex align-items-center text-white">
                <span className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "24px", height: "24px", fontSize: "14px" }}>2</span>
                รายละเอียดการจอง
              </h5>
              <div className="mb-4">
                <label className="form-label text-light small fw-bold">ระบุเลขที่นั่ง หรือความต้องการพิเศษ</label>
                <textarea name="seatPreference" className="form-control bg-dark text-white border-secondary py-2" rows={3} placeholder="เช่น แถว A ที่นั่ง 05 หรือ ขอใกล้ทางเดิน" value={formData.seatPreference} onChange={handleChange} style={{ borderRadius: "10px", borderColor: "#555" }}></textarea>
              </div>
              
              <h5 className="mb-4 fw-bold d-flex align-items-center text-white">
                <span className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "24px", height: "24px", fontSize: "14px" }}>3</span>
                วิธีการชำระเงิน
              </h5>
              <div className="row g-3 mb-5">
                <div className="col-md-6">
                  <div 
                    className={`card p-3 h-100 transition-all ${formData.paymentMethod === "qr" ? "border-primary shadow-primary" : "border-secondary"}`} 
                    style={{ 
                      cursor: "pointer", 
                      borderRadius: "15px", 
                      backgroundColor: formData.paymentMethod === "qr" ? "rgba(13, 110, 253, 0.2)" : "#1a1a1a",
                      borderWidth: "2px"
                    }} 
                    onClick={() => setFormData({...formData, paymentMethod: "qr"})}
                  >
                    <div className="form-check p-0 m-0 d-flex align-items-center">
                      <input className="form-check-input ms-0 me-3 mt-0" type="radio" name="paymentMethod" checked={formData.paymentMethod === "qr"} onChange={() => {}} />
                      <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-qr-code-scan me-2 text-primary" viewBox="0 0 16 16"><path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z"/><path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z"/><path d="M7 9H2v5h5V9ZM3 10h3v3H3v-3Zm8-1h1v1h-1V9Z"/><path d="M9 2h5v5H9V2Zm1 1h3v3h-3V3Zm2 8h1v1h-1v-1Z"/><path d="M9 9h1v1H9V9Zm3 0h1v1h-1V9Zm-2 2h1v1h-1v-1Zm2 2h1v1h-1v-1Zm-2-2h1v1h-1v-1Zm0 2h1v1h-1v-1ZM13 8h1v1h-1V8Zm1 1h1v1h-1V9Zm-1 1h1v1h-1v-1Zm1 1h1v1h-1v-1ZM9 13h1v1H9v-1Zm1 1h1v1h-1v-1Z"/></svg>
                        <label className="form-check-label fw-bold text-white mb-0" style={{ cursor: "pointer" }}>PromptPay / QR Code</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div 
                    className={`card p-3 h-100 transition-all ${formData.paymentMethod === "credit" ? "border-primary shadow-primary" : "border-secondary"}`} 
                    style={{ 
                      cursor: "pointer", 
                      borderRadius: "15px", 
                      backgroundColor: formData.paymentMethod === "credit" ? "rgba(13, 110, 253, 0.2)" : "#1a1a1a",
                      borderWidth: "2px"
                    }} 
                    onClick={() => setFormData({...formData, paymentMethod: "credit"})}
                  >
                    <div className="form-check p-0 m-0 d-flex align-items-center">
                      <input className="form-check-input ms-0 me-3 mt-0" type="radio" name="paymentMethod" checked={formData.paymentMethod === "credit"} onChange={() => {}} />
                      <div className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-credit-card me-2 text-primary" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/><path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/></svg>
                        <label className="form-check-label fw-bold text-white mb-0" style={{ cursor: "pointer" }}>บัตรเครดิต / เดบิต</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="btn btn-danger btn-lg w-100 fw-bold shadow-lg py-3" style={{ borderRadius: "12px", fontSize: "1.1rem" }}>
                ยืนยันการจองและชำระเงิน ฿{totalPrice.toLocaleString()}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 shadow-lg sticky-top" style={{ borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", top: "100px" }}>
            <h5 className="fw-bold mb-4 d-flex justify-content-between align-items-center text-white">
              สรุปรายการจอง
              <span className="badge bg-secondary rounded-pill fw-normal text-white" style={{ fontSize: "0.7rem" }}>{cartItems.length} รายการ</span>
            </h5>
            <div className="cart-items-mini mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {cartItems.map((item: any) => (
                <div key={item.id} className="d-flex justify-content-between mb-3 align-items-center p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <div className="d-flex align-items-center">
                    <img src={item.image} className="rounded me-2" style={{ width: "60px", height: "35px", objectFit: "cover" }} alt="" />
                    <div style={{ fontSize: "0.85rem" }}>
                      <div className="fw-bold text-truncate text-white" style={{ maxWidth: "120px" }}>{item.courseName}</div>
                      <div className="text-light small">1 ที่นั่ง</div>
                    </div>
                  </div>
                  <div className="text-warning fw-bold" style={{ fontSize: "0.9rem" }}>฿{item.price?.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <hr className="border-secondary mb-4" />
            <div className="d-flex justify-content-between mb-2">
              <span className="text-light small">ยอดรวมสินค้า:</span>
              <span className="small text-white">฿{totalPrice.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-4 fs-4 fw-bold text-white">
              <span>รวมทั้งสิ้น:</span>
              <span className="text-warning">฿{totalPrice.toLocaleString()}</span>
            </div>
            <div className="alert alert-info py-2 px-3 border-0 bg-opacity-10" style={{ borderRadius: "10px", backgroundColor: "rgba(13, 202, 240, 0.1)", color: "#74defb", fontSize: "0.8rem" }}>
              <div className="d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill me-2 mt-1" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
                <div className="text-white">กรุณาตรวจสอบข้อมูลชื่อ-นามสกุล และคอร์สที่เลือกให้ถูกต้องก่อนชำระเงิน</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
