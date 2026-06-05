import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import Swal from "sweetalert2";

const MyCourses = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("กรุณาเข้าสู่ระบบเพื่อดูคอร์สเรียนของคุณ");
        setLoading(false);
        return;
      }

      try {
        // 🚨 ยิง GET Request ไปหา API เพื่อดึงประวัติการจอง
        const response = await fetch("/api/bookings", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          setBookings(result.data); // นำข้อมูลลง State
        } else {
          throw new Error(result.message || "ไม่สามารถดึงข้อมูลคอร์สเรียนได้");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) return <Loading message="กำลังโหลดคอร์สเรียนของคุณ..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mt-5 pb-5 text-white animate-fade-in">
      <div className="d-flex align-items-center mb-4 border-bottom border-secondary pb-3">
        <h2 className="fw-bold mb-0">📚 คอร์สเรียนของฉัน</h2>
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-5 bg-dark border border-secondary" style={{ borderRadius: "15px" }}>
          <h4 className="text-light opacity-75 mb-3">คุณยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ เลยครับ</h4>
          <Link to="/" className="btn btn-primary px-4 py-2" style={{ borderRadius: "30px" }}>
            ไปเลือกดูคอร์สเรียนกันเลย!
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {bookings.map((booking) => (
            <div className="col" key={booking.booking_id}>
              <div className="card bg-dark border-secondary h-100 shadow-sm course-hover-card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-4 flex-column d-flex">
                  <h5 className="card-title fw-bold text-white mb-3">{booking.class_title}</h5>
                  <p className="card-text text-light opacity-75 small mb-4" style={{ display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {booking.class_description}
                  </p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-success px-2 py-1"><i className="bi bi-unlock-fill me-1"></i> เข้าเรียนได้</span>
                      <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                        จองเมื่อ: {new Date(booking.booked_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <button className="btn btn-outline-light w-100 fw-bold" style={{ borderRadius: "10px" }}>
                      <i className="bi bi-play-circle-fill text-danger me-2"></i> เข้าสู่บทเรียน
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
