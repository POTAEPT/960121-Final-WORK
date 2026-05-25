import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'booking_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (classItem) => {
    setItems(prev => {
      if (prev.find(i => i.id === classItem.id)) return prev;
      return [...prev, classItem];
    });
  };

  const removeItem = (classId) => {
    setItems(prev => prev.filter(i => i.id !== classId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, count: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
