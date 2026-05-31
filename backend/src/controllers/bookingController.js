const bookingService = require('../services/bookingService');

const createBooking = async (req, res, next) => {
    try {
        const { classId } = req.body;
        const parsedClassId = Number(classId);

        if (!Number.isInteger(parsedClassId) || parsedClassId <= 0) {
            const error = new Error('Invalid class id');
            error.statusCode = 400;
            error.publicMessage = 'Invalid class id';
            throw error;
        }

        if (!req.user || !req.user.sub) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.publicMessage = 'Unauthorized';
            throw error;
        }

        const booking = await bookingService.createBooking({
            classId: parsedClassId,
            userId: req.user.sub
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

const getBookings = async (req, res, next) => {
    try {
        if (!req.user || !req.user.sub) {
            const error = new Error('Unauthorized');
            error.statusCode = 401;
            error.publicMessage = 'Unauthorized';
            throw error;
        }

        const bookings = await bookingService.getBookingsByUserId(req.user.sub);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getBookings };
