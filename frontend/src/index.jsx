import React, { useState, useEffect } from "react";
import "./CSS/form.css";

const Index = ({ filters }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/src/data/courses.json")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันกรองข้อมูล
  const filteredCourses = courses.filter(course => {
    const matchSearch = course.courseName.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory = filters.category === "All" || course.category === filters.category;
    const matchPrice = course.price <= filters.priceRange;
    return matchSearch && matchCategory && matchPrice;
  });

  if (loading) return <div className="text-center mt-5 text-white"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <div className="mb-4">
        <h4 className="text-white fw-bold">คอร์สเรียนที่ตรงตามเงื่อนไข ({filteredCourses.length})</h4>
      </div>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {filteredCourses.map((course) => (
          <div className="col" key={course.id}>
            <div className="card h-100 border-0 shadow-lg overflow-hidden" style={{ backgroundColor: "var(--form-bg)", borderRadius: "15px" }}>
              <div className="position-relative" style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
                <img src={course.image} alt={course.courseName} className="w-100 h-100 object-fit-cover" />
                <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded small fw-bold">
                  {course.category}
                </div>
                <div className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded fw-bold" style={{ opacity: "0.9" }}>
                  {course.price === 0 ? "FREE" : `฿${course.price.toLocaleString()}`}
                </div>
              </div>
              
              <div className="card-body d-flex flex-column">
                <h6 className="text-white fw-bold mb-2 text-truncate-2" style={{ minHeight: "2.8rem" }}>{course.courseName}</h6>
                <div className="d-flex justify-content-between mb-2 small" style={{ color: "#BEBEBE" }}>
                  <span>👨‍🎓 {course.students} คน</span>
                  <span>📅 {course.classDate}</span>
                </div>
                <ul className="ps-3 mb-3 flex-grow-1 small" style={{ color: "#BEBEBE" }}>
                  {course.contents.slice(0, 3).map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <button className="btn btn-primary w-100 fw-bold mt-auto" style={{ borderRadius: "10px" }}>
                  ลงทะเบียนเรียน
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredCourses.length === 0 && (
        <div className="text-center py-5 text-muted">ไม่พบข้อมูลที่ตรงกับการค้นหา</div>
      )}
    </div>
  );
};

export default Index;
