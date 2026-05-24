import React, { useState, useEffect } from "react";
import "./CSS/form.css";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ฟังก์ชัน fetch ดึงข้อมูลจากไฟล์ JSON (เปรียบเสมือนดึงจาก API)
    fetch("/src/data/courses.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-white mt-3">กำลังโหลดข้อมูลคอร์สเรียน...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <div className="mb-5 py-4 border-bottom border-secondary">
        <h2 className="text-white fw-bold mb-2">Welcome to <span style={{color: "var(--primary-color)"}}>Born to Do</span></h2>
        <p className="text-muted" style={{color: "#BEBEBE"}}>แหล่งรวมคอร์สเรียนออนไลน์สำหรับคนที่เกิดมาเพื่อลงมือทำ</p>
      </div>

      <h4 className="text-white fw-bold mb-4">คอร์สเรียนเปิดสอนที่กำลังจะมาถึง</h4>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {courses.map((course) => (
          <div className="col" key={course.id}>
            <div className="card h-100 border-0 shadow-lg overflow-hidden" style={{ backgroundColor: "var(--form-bg)", borderRadius: "15px" }}>
              <div className="position-relative" style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
                <img 
                  src={course.image} 
                  alt={course.courseName}
                  className="w-100 h-100 object-fit-cover"
                  style={{ transition: "transform 0.3s ease" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                <div className="position-absolute bottom-0 end-0 bg-dark text-white px-2 py-1 m-2 rounded" style={{ fontSize: "0.75rem", opacity: "0.8" }}>
                  NEW
                </div>
              </div>
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-white fw-bold mb-3" style={{ color: "var(--primary-color)", fontSize: "1.1rem" }}>
                  {course.courseName}
                </h5>
                
                <div className="d-flex justify-content-between mb-3 border-bottom border-secondary pb-2">
                  <span className="text-muted" style={{ fontSize: "0.85rem", color: "#BEBEBE" }}>
                    👨‍🎓 รับจำนวน: <strong style={{ color: "#BEBEBE" }}>{course.students} คน</strong>
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.85rem", color: "#BEBEBE" }}>
                    📅 วันที่เริ่ม: <strong style={{ color: "#BEBEBE" }}>{course.classDate}</strong>
                  </span>
                </div>
                
                <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem", color: "#BEBEBE" }}>เนื้อหาที่จะเรียน:</p>
                <ul className="ps-3 mb-4 flex-grow-1" style={{ fontSize: "0.8rem", color: "#BEBEBE" }}>
                  {course.contents.map((item, index) => (
                    <li key={index} className="mb-1">{item}</li>
                  ))}
                </ul>
                
                <button className="btn btn-primary w-100 fw-bold mt-auto" style={{ borderRadius: "10px", padding: "12px" }}>
                  ลงทะเบียนเรียนเลย
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
