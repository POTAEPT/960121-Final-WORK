const express = require('express');
const router = express.Router();
const classController = require('../controllers/classControllers');

// เมื่อมีคำสั่ง GET /api/classes เข้ามา ให้ส่งไปหา Controller
router.get('/', classController.getClasses);
router.get('/:id', classController.getClassById);

module.exports = router;