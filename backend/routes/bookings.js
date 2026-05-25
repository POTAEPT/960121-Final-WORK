const express = require('express');
const { getDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { class_id } = req.body;
  const user_id = req.user.id;

  if (!class_id) {
    return res.status(400).json({ error: 'กรุณาระบุคลาสเรียนที่ต้องการจอง' });
  }

  const db = getDb();

  const classItem = db.prepare('SELECT * FROM classes WHERE id = ?').get(class_id);
  if (!classItem) {
    return res.status(404).json({ error: 'ไม่พบคลาสเรียนที่ต้องการ' });
  }

  const existingBooking = db.prepare(
    'SELECT id FROM bookings WHERE user_id = ? AND class_id = ? AND status = ?'
  ).get(user_id, class_id, 'confirmed');

  if (existingBooking) {
    return res.status(409).json({ error: 'คุณได้จองคลาสเรียนนี้แล้ว' });
  }

  const currentBookingCount = db.prepare(
    'SELECT COUNT(*) as count FROM bookings WHERE class_id = ? AND status = ?'
  ).get(class_id, 'confirmed');

  if (currentBookingCount.count >= classItem.max_capacity) {
    return res.status(409).json({
      error: 'คลาสเรียนนี้เต็มแล้ว ไม่สามารถจองได้',
      class_id: classItem.id,
      class_name: classItem.name,
      max_capacity: classItem.max_capacity,
    });
  }

  const result = db.prepare(
    'INSERT INTO bookings (user_id, class_id, status) VALUES (?, ?, ?)'
  ).run(user_id, class_id, 'confirmed');

  const booking = db.prepare(
    'SELECT b.*, c.name as class_name, c.schedule FROM bookings b JOIN classes c ON b.class_id = c.id WHERE b.id = ?'
  ).get(result.lastInsertRowid);

  res.status(201).json({
    message: 'จองคลาสเรียนสำเร็จ',
    booking,
  });
});

router.get('/', authenticateToken, (req, res) => {
  const db = getDb();
  const bookings = db.prepare(
    `SELECT b.*, c.name as class_name, c.schedule, c.instructor, c.duration, c.price
     FROM bookings b
     JOIN classes c ON b.class_id = c.id
     WHERE b.user_id = ?
     ORDER BY b.booking_date DESC`
  ).all(req.user.id);

  res.json({ bookings });
});

module.exports = router;
