import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/cart.css";

const Cart = ({ cartItems, removeFromCart, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleItemClick = (id) => {
    onClose();
    navigate(`/course/${id}`);
  };

  return (
    <div className="cart-dropdown shadow-lg" onClick={(e) => e.stopPropagation()}>
      <div className="cart-header">
        <span>คอร์สที่กำลังจอง ({cartItems.length})</span>
        <button 
          className="btn-close btn-close-white small" 
          style={{ fontSize: "0.8rem" }} 
          onClick={onClose}
        ></button>
      </div>
      
      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <div className="empty-cart-msg">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-cart-x mb-3 opacity-25" viewBox="0 0 16 16">
              <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            <p>ยังไม่มีคอร์สในตะกร้า</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id} style={{ cursor: "pointer" }} onClick={() => handleItemClick(item.id)}>
              <img src={item.image} className="cart-item-img" alt={item.courseName} />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.courseName}</div>
                <div className="cart-item-price">฿{item.price?.toLocaleString()}</div>
              </div>
              <div className="remove-cart-item" onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                </svg>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="d-flex justify-content-between text-white mb-3 fw-bold">
            <span>รวมทั้งหมด:</span>
            <span className="text-warning">฿{cartItems.reduce((acc, item) => acc + (item.price || 0), 0).toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-danger w-100 fw-bold py-2 shadow-sm" 
            style={{ borderRadius: "10px" }}
            onClick={handleCheckout}
          >
            ยืนยันการจองคอร์ส
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
