import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { classes as classesApi } from "./api";

const Index = ({ filters }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const listRef = useRef(null);

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
    const el = listRef.current;
    if (!el) return;

    const handleClick = (e) => {
      const btn = e.target.closest('[data-add-cart]');
      if (!btn) return;
      const classId = Number(btn.dataset.classId);
      const course = courses.find(c => c.id === classId);
      if (course) addItem(course);
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [courses, addItem]);

  if (loading) return <div className="text-center mt-5 text-white"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <div className="mb-4">
        <h4 className="text-white fw-bold">คลาสเรียนที่ตรงตามเงื่อนไข ({courses.length})</h4>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4" ref={listRef}>
        {courses.map((course) => {
          const contents = (() => {
            try { return typeof course.contents === 'string' ? JSON.parse(course.contents) : (course.contents || []); }
            catch { return []; }
          })();
          const available = course.available_seats ?? course.max_capacity;

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
                    <span>👨‍🏫 {course.instructor}</span>
                    <span>📅 {course.schedule}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small" style={{ color: "#BEBEBE" }}>
                    <span>⏱ {course.duration} นาที</span>
                    <span>{available}/{course.max_capacity} ที่นั่ง</span>
                  </div>
                  <ul className="ps-3 mb-3 flex-grow-1 small" style={{ color: "#BEBEBE" }}>
                    {contents.slice(0, 3).map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                  <button
                    className="btn btn-primary w-100 fw-bold mt-auto"
                    style={{ borderRadius: "10px" }}
                    data-add-cart="true"
                    data-class-id={course.id}
                  >
                    จองที่นั่ง
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
