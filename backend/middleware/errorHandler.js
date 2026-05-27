function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `ไม่พบเส้นทาง ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
