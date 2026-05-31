const { get, run, all } = require('../config/db');

const createBooking = async ({ classId, userId }) => {
    await run('BEGIN TRANSACTION', []);

    try {
        const classRow = await get(
            'SELECT id, max_capacity, current_bookings FROM Classes WHERE id = ?',
            [classId]
        );

        if (!classRow) {
            const error = new Error('Class not found');
            error.statusCode = 404;
            error.publicMessage = 'Class not found';
            throw error;
        }

        if (classRow.current_bookings >= classRow.max_capacity) {
            const error = new Error('Class is fully booked');
            error.statusCode = 409;
            error.publicMessage = 'Class is fully booked';
            throw error;
        }

        const bookingResult = await run(
            'INSERT INTO Bookings (user_id, class_id) VALUES (?, ?)',
            [userId, classId]
        );

        await run(
            'UPDATE Classes SET current_bookings = current_bookings + 1 WHERE id = ?',
            [classId]
        );

        await run('COMMIT', []);

        return { id: bookingResult.lastID, classId, userId };
    } catch (error) {
        await run('ROLLBACK', []);
        throw error;
    }
};

const getBookingsByUserId = async (userId) => {
    const sql = `
        SELECT
            b.id AS booking_id,
            b.booked_at AS booked_at,
            c.title AS class_title,
            c.description AS class_description,
            c.price AS class_price
        FROM Bookings b
        INNER JOIN Classes c ON c.id = b.class_id
        WHERE b.user_id = ?
        ORDER BY b.booked_at DESC
    `;

    return all(sql, [userId]);
};

module.exports = { createBooking, getBookingsByUserId };
