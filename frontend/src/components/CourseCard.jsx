import React from "react";

const CourseCard = ({ course }) => {
  // Safety Calculation
  const max = course.maxSeats || 1;
  const enrolled = course.enrolled || 0;
  const seatsLeft = Math.max(0, max - enrolled);
  const percentFull = Math.min(100, (enrolled / max) * 100);
  const isNearFull = percentFull >= 85;
  const isVeryPopular = enrolled >= 200; 

  return (
    <div
      className="card h-100 border-0 shadow-lg overflow-hidden cursor-pointer course-hover-card" 
      style={{ backgroundColor: "var(--form-bg)", borderRadius: "15px", border: "1px solid #333" }}
      data-course-id={course.id}
    >
      <div className="position-relative" style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
        <img src={course.image} alt={course.courseName} className="w-100 h-100 object-fit-cover" loading="lazy" />
        <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded small fw-bold shadow-sm">
          {course.category}
        </div>
        
        {isVeryPopular && (
          <div className="position-absolute bottom-0 start-0 bg-primary text-white px-2 py-1 m-2 rounded-pill small fw-bold shadow-lg" style={{ fontSize: "0.7rem", backgroundColor: "rgba(13, 110, 253, 0.9)" }}>
            <i className="bi bi-star-fill me-1"></i> ทางเลือกยอดนิยม
          </div>
        )}

        {percentFull >= 80 && (
          <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded small fw-bold shadow-lg hot-label">
            <i className="bi bi-fire me-1"></i> HOT
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="text-white fw-bold mb-2 text-truncate-2" style={{ minHeight: "2.8rem" }}>{course.courseName}</h6>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2 small align-items-center">
            <div className={`enrolled-badge ${isNearFull ? "near-full" : ""}`} style={{ color: "white" }}>
              <i className="bi bi-people-fill me-2"></i>
              <span className="text-white">ลงทะเบียนแล้ว {enrolled} / {max} คน</span>
            </div>
            <span className={`fw-bold ${isNearFull ? "text-danger" : "text-white"}`}>{Math.round(percentFull)}%</span>
          </div>
          <div className="progress" style={{ height: "8px", backgroundColor: "#111", borderRadius: "10px", padding: "1px" }}>
            <div
              className={`progress-bar ${isNearFull ? "bg-danger" : "bg-primary"}`}        
              style={{ width: `${percentFull}%`, borderRadius: "10px", transition: "width 0.8s ease" }}
            ></div>
          </div>
        </div>

        <div className="fw-bold mb-3 fs-5" style={{ color: "var(--accent-yellow)" }}>
           {course.price === 0 ? "FREE" : `฿${course.price.toLocaleString()}`}
        </div>

        <button
          className="btn btn-primary w-100 fw-bold mt-auto py-2"
          style={{ borderRadius: "10px" }}
          data-action="add-to-cart"
          disabled={seatsLeft === 0}
        >
          {seatsLeft === 0 ? "คอร์สเต็มแล้ว" : "เพิ่มลงตะกร้า"}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;