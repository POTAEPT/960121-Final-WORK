import React from "react";

const Filter = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-dark border-bottom border-secondary py-4 shadow-lg">
      <div className="container">
        <div className="row g-4 align-items-end justify-content-center">
          {/* หมวดหมู่ - จัดให้ดูสมดุลด้วย Card เล็กๆ */}
          <div className="col-md-4 col-lg-3">
            <div className="filter-item">
              <label className="text-secondary mb-2 small fw-bold text-uppercase tracking-wider">หมวดหมู่</label>
              <select 
                className="form-select bg-black text-white border-secondary" 
                name="category" 
                value={filters.category} 
                onChange={onFilterChange}
                style={{ 
                  borderRadius: "12px", 
                  height: "45px", 
                  fontSize: "0.95rem",
                  border: "1px solid #444"
                }}
              >
                <option value="All">ทุกหมวดหมู่</option>
                <option value="โยคะ">โยคะ</option>
                <option value="พิลาทิส">พิลาทิส</option>
                <option value="เวทเทรนนิ่ง">เวทเทรนนิ่ง</option>
                <option value="คาร์ดิโอ">คาร์ดิโอ</option>
              </select>
            </div>
          </div>

          {/* ช่วงราคา - ปรับ Layout ให้ดูสมมาตรกับ Dropdown */}
          <div className="col-md-4 col-lg-4">
            <div className="filter-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="text-secondary small fw-bold text-uppercase tracking-wider">ราคา (ไม่เกิน)</label>
                <span className="badge bg-danger rounded-pill px-3 py-2">
                  ฿{filters.priceRange.toLocaleString()}
                </span>
              </div>
              <div className="px-1" style={{ height: "45px", display: "flex", alignItems: "center" }}>
                <input 
                  type="range" 
                  className="form-range custom-range w-100" 
                  name="priceRange" 
                  min="0" max="5000" step="100" 
                  value={filters.priceRange} 
                  onChange={onFilterChange}
                />
              </div>
            </div>
          </div>

          {/* ปุ่มรีเซ็ต - ปรับขนาดให้เท่ากับ Input อื่นๆ เพื่อความสมมาตร */}
          <div className="col-md-4 col-lg-3">
            <button 
              className="btn btn-outline-danger w-100 fw-bold d-flex align-items-center justify-content-center transition-all" 
              onClick={onReset}
              style={{ 
                borderRadius: "12px", 
                height: "45px", 
                borderWidth: "2px",
                fontSize: "0.95rem"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-counterclockwise me-2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192z"/>
              </svg>
              RESET FILTERS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
