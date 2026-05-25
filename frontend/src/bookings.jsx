import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { bookings as bookingsApi } from './api';

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    bookingsApi.getAll()
      .then((data) => setBookings(data.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center mt-5 text-white"><div className="spinner-border text-danger"></div></div>;
  }

  return (
    <div className="container mt-4 px-4 pb-5">
      <h4 className="text-white fw-bold mb-4">ประวัติการจองของฉัน</h4>

      {bookings.length === 0 ? (
        <div className="card border-0 shadow p-5 text-center" style={{ backgroundColor: 'var(--form-bg)', borderRadius: '15px' }}>
          <h5 className="text-white mb-3">ยังไม่มีการจอง</h5>
          <p className="text-muted mb-4">คุณยังไม่มีประวัติการจองคลาสเรียน</p>
          <Link to="/" className="btn btn-primary px-4" style={{ borderRadius: '10px' }}>เรียกดูคลาสเรียน</Link>
        </div>
      ) : (
        <div className="row g-3">
          {bookings.map((b) => (
            <div className="col-12" key={b.id}>
              <div className="card border-0 shadow h-100" style={{ backgroundColor: 'var(--form-bg)', borderRadius: '12px' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-white fw-bold mb-1">{b.class_name}</h6>
                      <small className="text-muted">
                        ผู้สอน: {b.instructor} | เวลา: {b.schedule} | ระยะเวลา: {b.duration} นาที
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="badge bg-success mb-1">{b.status}</div>
                      <div className="text-white fw-bold">฿{b.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    วันที่จอง: {new Date(b.booking_date + 'Z').toLocaleString('th-TH')}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
