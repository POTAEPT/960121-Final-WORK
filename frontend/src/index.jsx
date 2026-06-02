import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import CourseCard from "./components/CourseCard";
import heroImage from "./assets/hero.png";
import "./CSS/form.css";

const Index = ({ filters, addToCart }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/src/data/courses.json")
      .then((res) => {
        if (!res.ok) throw new Error("ระบบไม่สามารถเชื่อมต่อฐานข้อมูลคอร์สเรียนได้ในขณะนี้");    
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchSearch = course.courseName?.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === "All" || course.category === filters.category;  
      const matchPrice = (course.price || 0) <= filters.priceRange;
      return matchSearch && matchCategory && matchPrice;
    });
  }, [courses, filters]);

  const createFlyingAnimation = (startElement, courseImage) => {
    const cartIcon = document.querySelector(".cart-icon-wrapper");
    if (!cartIcon) return;

    const startRect = startElement.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    const flyingImg = document.createElement("img");
    flyingImg.src = courseImage;
    flyingImg.style.position = "fixed";
    flyingImg.style.zIndex = "10000";
    flyingImg.style.width = `${startRect.width}px`;
    flyingImg.style.height = `${startRect.height}px`;
    flyingImg.style.left = `${startRect.left}px`;
    flyingImg.style.top = `${startRect.top}px`;
    flyingImg.style.borderRadius = "15px";
    flyingImg.style.objectFit = "cover";
    flyingImg.style.transition = "all 0.8s cubic-bezier(0.42, 0, 0.58, 1)";
    flyingImg.style.pointerEvents = "none";
    flyingImg.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
    flyingImg.style.border = "2px solid var(--primary-color)";
    
    document.body.appendChild(flyingImg);

    setTimeout(() => {
      flyingImg.style.left = `${endRect.left + (endRect.width / 2) - 20}px`;
      flyingImg.style.top = `${endRect.top + (endRect.height / 2) - 15}px`;
      flyingImg.style.width = "40px";
      flyingImg.style.height = "25px";
      flyingImg.style.opacity = "0.3";
      flyingImg.style.transform = "scale(0.5)"; 
    }, 10);

    setTimeout(() => {
      if (document.body.contains(flyingImg)) {
        document.body.removeChild(flyingImg);
      }
      const badge = cartIcon.querySelector(".cart-badge");
      if (badge) {
        badge.classList.remove("bounce");
        void badge.offsetWidth; 
        badge.classList.add("bounce");
      }
    }, 810);
  };

  const handleListClick = (e) => {
    const cardElement = e.target.closest("[data-course-id]");
    if (!cardElement) return;

    const courseId = parseInt(cardElement.getAttribute("data-course-id"));
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const actionButton = e.target.closest("[data-action='add-to-cart']");
    if (actionButton) {
      if (course.maxSeats - course.enrolled > 0) {
        const imgElement = cardElement.querySelector("img");
        if (imgElement) {
          createFlyingAnimation(imgElement, course.image);
        }

        const originalText = actionButton.innerText;
        actionButton.innerText = "เพิ่มแล้ว! ✓";
        actionButton.classList.add("btn-added-success");
        actionButton.disabled = true;

        addToCart(course);

        setTimeout(() => {
          actionButton.innerText = originalText;
          actionButton.classList.remove("btn-added-success");
          actionButton.disabled = false;
        }, 1500);
      }
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  if (isLoading) return <Loading message="กำลังค้นหาคอร์สเรียนที่เหมาะสำหรับคุณ..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container-fluid mt-4 px-4 pb-5 animate-fade-in">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="text-white fw-bold m-0">คอร์สเรียนแนะนำสำหรับคุณ</h4>
        <span className="badge bg-dark border border-secondary text-white px-3 py-2">
          พบ {filteredCourses.length} รายการ
        </span>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4" onClick={handleListClick}>
        {filteredCourses.map((course) => (
          <div className="col" key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-5 mt-5">
           <div className="opacity-25 mb-4 text-white">
             <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
             </svg>
           </div>
           <h4 className="text-white fw-bold">ไม่พบคอร์สเรียนที่ตรงกับเงื่อนไขของคุณ</h4>
           <p className="text-light opacity-75">ลองปรับตัวกรองหรือใช้คำค้นหาอื่นดูนะครับ</p>
        </div>
      )}
    </div>
  );
};

export default Index;
