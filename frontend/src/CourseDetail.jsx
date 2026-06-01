import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import "./CSS/courseDetail.css";

const CourseDetail = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        // ✅ ดึงข้อมูลคอร์สตาม ID จาก Backend เท่านั้น
        const res = await fetch(`http://localhost:8080/api/classes/${id}`);
        if (!res.ok) throw new Error("ไม่สามารถเข้าถึงฐานข้อมูลรายละเอียดคอร์สได้");
        
        const payload = await res.json();
        const found = payload.data;
        
        if (!found) throw new Error("ขออภัย! ไม่พบคอร์สเรียนที่คุณกำลังค้นหา");
        setCourse(found);
      } catch (err) {
        setError(err.message || "ไม่พบข้อมูลคอร์สเรียนนี้ในระบบ");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Loading message="กำลังเตรียมเนื้อหาบทเรียนที่เข้มข้นสำหรับคุณ..." />;     
  if (error) return <ErrorMessage message={error} />;

  const filteredCurriculum = course.curriculum?.filter(chap =>
    chap.chapter?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    chap.lessons?.some(l => l.toLowerCase().includes(debouncedSearch.toLowerCase()))
  ) || [];

  // ✅ ดึงเฉพาะข้อมูลจาก Backend
  const max = course.max_capacity || 1;
  const enr = course.current_bookings || 0;
  const title = course.title || "Untitled Course";

  const seatsLeft = Math.max(0, max - enr);
  const percentFull = Math.min(100, (enr / max) * 100);
  const isNearFull = percentFull >= 85;

  const handleEnroll = () => {
    if (seatsLeft <= 0) return;
    addToCart({
      id: course.id,
      courseName: title,
      image: course.image,
      price: course.price || 0
    });
    navigate("/checkout");
  };

  return (
    <div className="container mt-5 pb-5 course-detail-container text-white animate-fade-in">     
      <div className="row g-5">
        <div className="col-lg-8">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/" className="text-danger text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item active text-white">{title}</li>
            </ol>
          </nav>

          <div className="d-flex align-items-center mb-3">
            <h1 className="course-detail-title mb-0 display-5 fw-bold text-white">{title}</h1>
            {enr > 200 && <span className="badge bg-primary ms-3 py-2 px-3 rounded-pill shadow-sm"><i className="bi bi-star-fill me-1"></i> คอร์สยอดนิยม</span>}
          </div>
          <p className="lead mb-4 course-detail-desc text-light opacity-75">{course.fullDescription}</p>

          <div className="card curriculum-card p-4 mb-5 shadow-sm border-0 bg-dark" style={{ borderRadius: "20px" }}>
            <h4 className="fw-bold mb-4 text-white border-start border-danger border-4 ps-3">สิ่งที่คุณจะได้เรียนรู้</h4>
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {course.benefits?.map((b, i) => (
                <div className="col d-flex align-items-start benefit-item" key={i}>
                  <i className="bi bi-check-circle-fill text-danger me-2"></i>
                  <span className="text-light opacity-75">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
            <h4 className="fw-bold mb-0 text-white">เนื้อหาบทเรียน ({filteredCurriculum.length})</h4>
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                type="text"
                className="form-control bg-black text-white border-secondary shadow-none"        
                placeholder="ค้นหาบทเรียน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: "20px 0 0 20px" }}
              />
              <span className="input-group-text bg-black border-secondary border-start-0 text-secondary" style={{ borderRadius: "0 20px 20px 0" }}><i className="bi bi-search"></i></span>
            </div>
          </div>

          {filteredCurriculum.length > 0 ? (
            filteredCurriculum.map((chap, i) => (
              <div className="card curriculum-card mb-3 overflow-hidden border-0 bg-dark" key={i} style={{ borderRadius: "15px" }}>       
                <div className="card-header curriculum-header py-3 fw-bold bg-dark border-bottom border-secondary text-white">
                  <span className="text-danger me-3">บทที่ {i+1}</span> {chap.chapter}
                </div>
                <ul className="list-group list-group-flush">
                  {chap.lessons?.map((lesson, li) => (
                    <li className="list-group-item bg-transparent lesson-item py-3 ps-4 border-secondary text-light opacity-75" key={li}>
                      <i className="bi bi-play-circle-fill text-danger me-3"></i> {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-muted border border-secondary rounded-4 bg-dark">
              <p className="mb-0">ไม่พบหัวข้อบทเรียนที่ค้นหา</p>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card shadow-lg enroll-card overflow-hidden sticky-top" style={{ top: "100px", border: "1px solid #333", backgroundColor: "var(--form-bg)", borderRadius: "20px" }}>
            <div className="position-relative">
              <img src={course.image} className="w-100" style={{ aspectRatio: "16/9", objectFit: "cover" }} alt="Preview" />
            </div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4 border-bottom border-secondary pb-3">
                <img src={course.instructorImage} className="rounded-circle me-3 border border-secondary p-1" style={{ width: "60px", height: "60px", objectFit: "cover" }} alt="Instructor" />   
                <div>
                  <div className="small text-muted">ผู้สอนโดย</div>
                  <div className="instructor-name fw-bold fs-5 text-white">{course.instructorName}</div>
                </div>
              </div>

              <div className="p-3 mb-4 rounded-4 bg-black border border-secondary shadow-inner">
                <div className="d-flex justify-content-between mb-2 align-items-center">
                  <span className="text-muted small">ยอดผู้ลงทะเบียน</span>
                  <div className={`enrolled-badge ${isNearFull ? "near-full" : ""}`} style={{ fontSize: "0.8rem", color: "white" }}>
                    <span className="text-white">ลงทะเบียนแล้ว {enr} / {max} คน</span>
                  </div>
                </div>
                <div className="progress mb-2 shadow-sm" style={{ height: "10px", backgroundColor: "#111", borderRadius: "10px" }}>
                  <div
                    className={`progress-bar ${isNearFull ? "bg-danger" : "bg-primary"}`}
                    style={{ width: `${percentFull}%`, transition: "width 1s ease", borderRadius: "10px" }}
                  ></div>
                </div>
                <div className="text-center text-muted mt-2 fw-bold" style={{ fontSize: "0.8rem" }}>    
                  {seatsLeft > 0 ? <><i className="bi bi-fire text-danger me-1"></i> เหลืออีกเพียง {seatsLeft} ที่นั่ง!</> : "คอร์สนี้เต็มแล้ว!"}
                </div>
              </div>

              <h3 className="course-price fw-bold mb-4 fs-1 text-center" style={{ color: "var(--accent-yellow)" }}>
                {course.price === 0 ? "FREE" : `฿${course.price.toLocaleString()}`}
              </h3>

              <button
                className={`btn ${seatsLeft > 0 ? "btn-danger" : "btn-secondary disabled"} btn-lg w-100 fw-bold mb-3 shadow-lg py-3`}
                onClick={handleEnroll}
                style={{ borderRadius: "14px" }}
              >
                {seatsLeft > 0 ? "ลงทะเบียนจองที่นั่ง" : "คอร์สนี้เต็มแล้ว"}
              </button>

              <div className="text-center small text-muted">
                <div className="mb-1 text-light opacity-75"><i className="bi bi-check-lg text-success me-1"></i> เข้าเรียนได้ตลอดชีพ</div>
                <div className="text-light opacity-75"><i className="bi bi-check-lg text-success me-1"></i> รับใบประกาศนียบัตร</div>       
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
