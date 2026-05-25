import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { classes as classesApi, bookings as bookingsApi } from "./api";

const Index = ({ filters, addToCart }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set());
  const [bookedIds, setBookedIds] = useState(new Set());
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.priceRange < 5000) params.max_price = String(filters.priceRange);

    classesApi.getAll(params)
      .then((data) => {
        setCourses(data.classes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    if (!user) { setBookedIds(new Set()); return; }
    bookingsApi.getAll()
      .then((data) => setBookedIds(new Set(data.bookings.map(b => b.class_id))))
      .catch(() => {});
  }, [user]);

  const handleAddToCart = useCallback((course) => {
    addItem(course);
    setAddedIds(prev => new Set(prev).add(course.id));
    setTimeout(() => {
      setAddedIds(prev => { const next = new Set(prev); next.delete(course.id); return next; });
    }, 1500);
  }, [addItem]);

    const actionButton = e.target.closest("[data-action='add-to-cart']");
    if (actionButton) {
      if (course.maxSeats - course.enrolled > 0) {
        addToCart(course);
      }
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  if (loading) return <Loading message="กำลังค้นหาคอร์สเรียนที่เหมาะสำหรับคุณ..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <div className="mb-4">
        <h4 className="text-white fw-bold">คลาสเรียนที่ตรงตามเงื่อนไข ({courses.length})</h4>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {courses.map((course) => {
          const contents = (() => {
            try { return typeof course.contents === 'string' ? JSON.parse(course.contents) : (course.contents || []); }
            catch { return []; }
          })();
          const available = Number(course.available_seats);
          const isFull = available <= 0;
          const isBooked = bookedIds.has(course.id);

          return (
            <div className="col" key={course.id}>
              <div className="card h-100 border-0 shadow-lg overflow-hidden" style={{ backgroundColor: "var(--form-bg)", borderRadius: "15px" }}>
                <div className="position-relative" style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
                  <img
                    src={course.image_url || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'}
                    alt={course.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded small fw-bold">
                    {course.category}
                  </div>
                  <div className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded fw-bold" style={{ opacity: "0.9" }}>
                    {course.price === 0 ? "FREE" : `฿${course.price.toLocaleString()}`}
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  <h6 className="text-white fw-bold mb-2 text-truncate-2" style={{ minHeight: "2.8rem" }}>{course.name}</h6>
                  <div className="d-flex justify-content-between mb-2 small" style={{ color: "#BEBEBE" }}>
                    <span><i className="bi bi-person-badge me-1"></i>{course.instructor}</span>
                    <span><i className="bi bi-calendar-event me-1"></i>{course.schedule}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small" style={{ color: "#BEBEBE" }}>
                    <span><i className="bi bi-clock me-1"></i>{course.duration} นาที</span>
                    <span>
                      {isFull ? <span className="text-danger fw-bold">เต็ม</span> : `${available}/${course.max_capacity} ที่นั่ง`}
                      {isBooked && <span className="badge bg-success ms-2">จองแล้ว</span>}
                    </span>
                  </div>
                  <ul className="ps-3 mb-3 flex-grow-1 small" style={{ color: "#BEBEBE" }}>
                    {contents.slice(0, 3).map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                  <button
                    className={`btn w-100 fw-bold mt-auto ${isBooked ? 'btn-secondary' : isFull ? 'btn-secondary' : addedIds.has(course.id) ? 'btn-success' : 'btn-primary'}`}
                    style={{ borderRadius: "10px" }}
                    onClick={() => handleAddToCart(course)}
                    disabled={isBooked || isFull || addedIds.has(course.id)}
                  >
                    {isBooked ? 'จองแล้ว' : isFull ? 'เต็ม' : addedIds.has(course.id) ? <><i className="bi bi-check-lg me-1"></i>เพิ่มแล้ว</> : 'จองที่นั่ง'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-5 text-muted">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
      )}
    </div>
  );
};

export default Index;
