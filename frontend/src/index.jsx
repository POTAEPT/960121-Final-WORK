import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/form.css";

const Index = ({ filters, addToCart }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/src/data/courses.json")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchSearch = course.courseName.toLowerCase().includes(filters.search.toLowerCase());
    const matchCategory = filters.category === "All" || course.category === filters.category;
    const matchPrice = course.price <= filters.priceRange;
    return matchSearch && matchCategory && matchPrice;
  });

  // ฟังก์ชัน Event Delegation สำหรับจัดการการคลิกที่ Parent Container
  const handleListClick = (e) => {
    // หา Element ที่ใกล้ที่สุดที่มี data-course-id
    const cardElement = e.target.closest("[data-course-id]");
    if (!cardElement) return;

    const courseId = parseInt(cardElement.getAttribute("data-course-id"));
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // ตรวจสอบว่าเป็นการกดปุ่ม "ใส่ตะกร้า" หรือเป็นการกดดูรายละเอียด
    const actionButton = e.target.closest("[data-action='add-to-cart']");
    
    if (actionButton) {
      // ถ้ากดที่ปุ่มใส่ตะกร้า
      addToCart(course);
    } else {
      // ถ้ากดที่ส่วนอื่นๆ ของ Card ให้ไปที่หน้ารายละเอียด
      navigate(`/course/${courseId}`);
    }
  };

  if (loading) return <div className="text-center mt-5 text-white"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container-fluid mt-4 px-4 pb-5">
      <div className="mb-4">
        <h4 className="text-white fw-bold">คอร์สเรียนแนะนำ ({filteredCourses.length})</h4>
      </div>
      
      {/* ติดตั้ง Listener เพียงที่เดียวที่ Parent Container (Event Delegation) */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4" onClick={handleListClick}>
        {filteredCourses.map((course) => {
          const seatsLeft = course.maxSeats - course.enrolled;
          const percentFull = (course.enrolled / course.maxSeats) * 100;

          return (
            <div className="col" key={course.id}>
              {/* ระบุ ID ของคอร์สไว้ที่นี่เพื่อให้ Parent ตรวจสอบได้ */}
              <div 
                className="card h-100 border-0 shadow-lg overflow-hidden cursor-pointer" 
                style={{ backgroundColor: "var(--form-bg)", borderRadius: "15px" }}
                data-course-id={course.id}
              >
                <div className="position-relative" style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
                  <img src={course.image} alt={course.courseName} className="w-100 h-100 object-fit-cover" />
                  <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded small fw-bold">
                    {course.category}
                  </div>
                  {seatsLeft <= 10 && seatsLeft > 0 && (
                    <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded small fw-bold shadow">
                      ใกล้เต็ม!
                    </div>
                  )}
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h6 className="text-white fw-bold mb-2 text-truncate-2" style={{ minHeight: "2.8rem" }}>{course.courseName}</h6>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1 small" style={{ color: "#E0E0E0" }}>
                      <span>ที่นั่งว่าง: <strong className="text-success">{seatsLeft}</strong> / {course.maxSeats}</span>
                      <span>{Math.round(percentFull)}% Full</span>
                    </div>
                    <div className="progress" style={{ height: "6px", backgroundColor: "#333", borderRadius: "10px" }}>
                      <div 
                        className={`progress-bar ${percentFull > 85 ? "bg-danger" : "bg-success"}`} 
                        role="progressbar" 
                        style={{ width: `${percentFull}%`, borderRadius: "10px" }}
                      ></div>
                    </div>
                  </div>

                  <div className="fw-bold mb-3 fs-5" style={{ color: "#ffc107" }}>
                     {course.price === 0 ? "FREE" : `฿${course.price.toLocaleString()}`}
                  </div>
                  
                  {/* ระบุ Action ไว้ที่ปุ่มเพื่อให้ Parent แยกแยะคำสั่งได้ */}
                  <button 
                    className="btn btn-primary w-100 fw-bold mt-auto" 
                    style={{ borderRadius: "10px" }}
                    data-action="add-to-cart"
                  >
                    ใส่ตะกร้า
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
