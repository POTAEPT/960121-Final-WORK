import React from "react";

const CourseCard = ({ course }) => {
  // Safety Calculation: ป้องกันการหารด้วยศูนย์
  const max = course.maxSeats || 1;
  const enrolled = course.enrolled || 0;
  const seatsLeft = Math.max(0, max - enrolled);
  const percentFull = Math.min(100, (enrolled / max) * 100);

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
        {seatsLeft <= 5 && seatsLeft > 0 && (
          <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded small fw-bold shadow">
            ใกล้เต็ม!
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h6 className="text-white fw-bold mb-2 text-truncate-2" style={{ minHeight: "2.8rem" }}>{course.courseName}</h6>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1 small" style={{ color: "var(--text-muted)" }}>
            <span>ว่าง: <strong className={seatsLeft <= 5 ? "text-danger" : "text-success"}>{seatsLeft}</strong> / {max}</span>
            <span>{Math.round(percentFull)}%</span>
          </div>
          <div className="progress" style={{ height: "6px", backgroundColor: "#111", borderRadius: "10px" }}>
            <div 
              className={`progress-bar ${percentFull > 85 ? "bg-danger" : "bg-success"}`} 
              style={{ width: `${percentFull}%`, borderRadius: "10px", transition: "width 0.5s ease" }}
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
          {seatsLeft === 0 ? "ที่นั่งเต็มแล้ว" : "ใส่ตะกร้า"}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
