const { all, get } = require('../config/db');

const getAllClasses = async () => {
    const sql = 'SELECT id, title, description, price, max_capacity, current_bookings FROM Classes';
    return all(sql, []);
};

const getClassById = async (classId) => {
    const sql = 'SELECT id, title, description, price, max_capacity, current_bookings FROM Classes WHERE id = ?';
    const row = await get(sql, [classId]);

    if (!row) {
        const error = new Error('Class not found');
        error.statusCode = 404;
        error.publicMessage = 'Class not found';
        throw error;
    }

    return row;
};

module.exports = { getAllClasses, getClassById };