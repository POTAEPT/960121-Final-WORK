const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();

  let sql = 'SELECT c.*, (c.max_capacity - COUNT(b.id)) as available_seats FROM classes c LEFT JOIN bookings b ON c.id = b.class_id AND b.status = ?';
  const params = ['confirmed'];

  const conditions = [];
  const whereClauses = [];

  if (req.query.category) {
    whereClauses.push('c.category = ?');
    params.push(req.query.category);
  }

  if (req.query.search) {
    whereClauses.push('(c.name LIKE ? OR c.description LIKE ? OR c.instructor LIKE ?)');
    const searchTerm = `%${req.query.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (req.query.min_price) {
    whereClauses.push('c.price >= ?');
    params.push(Number(req.query.min_price));
  }

  if (req.query.max_price) {
    whereClauses.push('c.price <= ?');
    params.push(Number(req.query.max_price));
  }

  if (whereClauses.length > 0) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }

  sql += ' GROUP BY c.id';

  if (req.query.sort) {
    const allowedSortFields = ['price', 'name', 'duration', 'max_capacity'];
    const sortField = req.query.sort.replace(/[^a-zA-Z_]/g, '');
    if (allowedSortFields.includes(sortField)) {
      const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY c.${sortField} ${order}`;
    }
  } else {
    sql += ' ORDER BY c.name ASC';
  }

  const classes = db.prepare(sql).all(...params);

  res.json({ classes });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const classItem = db.prepare(
    `SELECT c.*, (c.max_capacity - COUNT(b.id)) as available_seats 
     FROM classes c 
     LEFT JOIN bookings b ON c.id = b.class_id AND b.status = ?
     WHERE c.id = ?
     GROUP BY c.id`
  ).get('confirmed', req.params.id);

  if (!classItem) {
    return res.status(404).json({ error: 'ไม่พบคลาสเรียนที่ต้องการ' });
  }

  res.json({ class: classItem });
});

module.exports = router;
