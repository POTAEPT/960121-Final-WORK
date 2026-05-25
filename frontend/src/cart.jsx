import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { bookings as bookingsApi } from './api';

const CartPage = () => {
  const { items, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setLoading(true);
    setBookingStatus('processing');
    const res = [];

    for (const item of items) {
      try {
        const data = await bookingsApi.create(item.id);
        res.push({ id: item.id, name: item.name, success: true, message: data.message });
      } catch (err) {
        res.push({ id: item.id, name: item.name, success: false, message: err.data?.error || err.message });
      }
    }

    clearCart();
    setResults(res);
    setBookingStatus('done');
    setLoading(false);
  };

  if (items.length === 0 && !results.length) {
    return (
      <div className="container mt-5 text-center">
        <div className="card border-0 shadow p-5" style={{ backgroundColor: 'var(--form-bg)', borderRadius: '15px' }}>
          <h4 className="text-white mb-3">ตะกร้าของคุณว่างเปล่า</h4>
          <p className="text-muted mb-4">เพิ่มคลาสเรียนที่สนใจลงในตะกร้าเพื่อทำการจอง</p>
          <Link to="/" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>เรียกดูคลาสเรียน</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 px-4 pb-5">
      <h4 className="text-white fw-bold mb-4">ตะกร้าสะสมรายการจอง ({items.length} รายการ)</h4>

      {bookingStatus === 'done' && (
        <div className="card border-0 shadow mb-4 p-4" style={{ backgroundColor: 'var(--form-bg)', borderRadius: '15px' }}>
          <h5 className="text-white mb-3">ผลการจอง</h5>
          {results.map((r) => (
            <div key={r.id} className={`alert ${r.success ? 'alert-success' : 'alert-danger'} py-2 mb-2`}>
              <strong>{r.name}</strong>: {r.message}
            </div>
          ))}
          <button className="btn btn-outline-secondary mt-2" onClick={() => { clearCart(); setResults([]); setBookingStatus(null); }}>
            กลับไปหน้าหลัก
          </button>
        </div>
      )}

      <div className="row g-3">
        {items.map((item) => (
          <div className="col-12" key={item.id}>
            <div className="card border-0 shadow h-100" style={{ backgroundColor: 'var(--form-bg)', borderRadius: '12px' }}>
              <div className="card-body d-flex align-items-center gap-3">
                <img src={item.image_url} alt={item.name}
                  style={{ width: '100px', height: '70px', borderRadius: '8px', objectFit: 'cover' }} />
                <div className="flex-grow-1">
                  <h6 className="text-white fw-bold mb-1">{item.name}</h6>
                  <small className="text-muted">{item.instructor} | {item.schedule}</small>
                </div>
                <div className="text-end">
                  <div className="text-white fw-bold mb-1">฿{item.price.toLocaleString()}</div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}
                    disabled={bookingStatus === 'processing'}>
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && bookingStatus !== 'done' && (
        <div className="card border-0 shadow mt-4 p-4" style={{ backgroundColor: 'var(--form-bg)', borderRadius: '15px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted">รวมทั้งหมด:</span>
              <span className="text-white fw-bold fs-5 ms-2">฿{totalPrice.toLocaleString()}</span>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={clearCart} disabled={loading}>ล้างทั้งหมด</button>
              <button className="btn btn-primary px-4" style={{ borderRadius: '10px' }}
                onClick={handleCheckout} disabled={loading}>
                {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการจอง'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
