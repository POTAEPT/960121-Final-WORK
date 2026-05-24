import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./CSS/courseDetail.css";

const CourseDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetch("/src/data/courseDetails.json")
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id === parseInt(id));
        setCourse(found);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;
  if (!course) return <div className="text-center mt-5 text-white"><h3>ไม่พบข้อมูล</h3></div>;

  const filteredCurriculum = course.curriculum.filter(chap => 
    chap.chapter.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    chap.lessons.some(l => l.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const seatsLeft = course.maxSeats - course.enrolled;

  const handleEnroll = () => {
    addToCart({
      id: course.id,
      courseName: course.courseName,
      image: course.image, // ใช้รูปเดียวกับหน้าปก
      price: course.price   // ใช้ราคาจริงจาก JSON
    });
    navigate("/checkout");
  };

  return (
    <div className="container mt-5 pb-5 course-detail-container text-white">
      <div className="row g-5">
        <div className="col-lg-8">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-danger text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active text-white">{course.courseName}</li>
            </ol>
          </nav>

          <h1 className="course-detail-title mb-3 display-5">{course.courseName}</h1>
          <p className="lead mb-4 course-detail-desc">{course.fullDescription}</p>

          <div className="card curriculum-card p-4 mb-5 shadow-sm">
            <h4 className="fw-bold mb-4 text-white">สิ่งที่คุณจะได้เรียนรู้</h4>
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {course.benefits.map((b, i) => (
                <div className="col d-flex align-items-start benefit-item" key={i}>
                  <span className="text-danger me-2">✔</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0 text-white">เนื้อหาบทเรียน</h4>
            <input 
              type="text" 
              className="form-control bg-black text-white border-secondary w-25 shadow-none" 
              placeholder="ค้นหาบทเรียน..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "20px" }}
            />
          </div>

          {filteredCurriculum.map((chap, i) => (
            <div className="card curriculum-card mb-3 overflow-hidden" key={i}>
              <div className="card-header curriculum-header py-3 fw-bold bg-dark">
                <span className="text-danger">บทที่ {i+1}</span> {chap.chapter}
              </div>
              <ul className="list-group list-group-flush">
                {chap.lessons.map((lesson, li) => (
                  <li className="list-group-item bg-transparent lesson-item py-3" key={li}>
                    ▶ {lesson}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-lg enroll-card overflow-hidden sticky-top" style={{ top: "100px" }}>
            {/* แสดงรูปหน้าปกแบบเดียวกับหน้าแรก */}
            <img src={course.image} className="w-100" style={{ aspectRatio: "16/9", objectFit: "cover" }} alt="Preview" />
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <img src={course.instructorImage} className="rounded-circle me-3 border border-secondary" style={{ width: "60px", height: "60px", objectFit: "cover" }} alt="Instructor" />
                <div>
                  <div className="small" style={{ color: "var(--text-muted)" }}>สอนโดย</div>
                  <div className="instructor-name fw-bold fs-5">{course.instructorName}</div>
                </div>
              </div>

              <div className="p-3 mb-4 rounded" style={{ backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--border-color)" }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">สถานะที่นั่ง</span>
                  <span className={`fw-bold small ${seatsLeft <= 5 ? "text-danger" : "text-success"}`}>
                    {seatsLeft > 0 ? `ว่าง ${seatsLeft} ที่สุดท้าย` : "เต็มแล้ว"}
                  </span>
                </div>
                <div className="progress mb-2" style={{ height: "8px", backgroundColor: "#111" }}>
                  <div className={`progress-bar ${(course.enrolled/course.maxSeats)*100 > 90 ? "bg-danger" : "bg-primary"}`} style={{ width: `${(course.enrolled/course.maxSeats)*100}%` }}></div>
                </div>
                <div className="text-center text-muted" style={{ fontSize: "0.75rem" }}>
                  สมัครแล้ว {course.enrolled} / รับทั้งหมด {course.maxSeats} คน
                </div>
              </div>

              <h3 className="course-price fw-bold mb-4">
                {course.price === 0 ? "FREE" : `฿${course.price.toLocaleString()}`}
              </h3>
              <button 
                className={`btn ${seatsLeft > 0 ? "btn-danger" : "btn-secondary disabled"} btn-lg w-100 fw-bold mb-3 shadow`} 
                onClick={handleEnroll}
              >
                {seatsLeft > 0 ? "จองที่นั่งตอนนี้" : "ที่นั่งเต็มแล้ว"}
              </button>
              <div className="text-center small" style={{ color: "var(--text-muted)" }}>เข้าเรียนได้ตลอดชีพ • รับใบประกาศนียบัตร</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
