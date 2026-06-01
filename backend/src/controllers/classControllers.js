const classService = require('../services/classServices');

const getClasses = async (req, res, next) => {
    try {
        const classes = await classService.getAllClasses(req.query);
        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        next(error);
    }
};

const getClassById = async (req, res, next) => {
    try {
        const classId = Number(req.params.id);
        if (!Number.isInteger(classId) || classId <= 0) {
            const error = new Error('Invalid class id');
            error.statusCode = 400;
            error.publicMessage = 'Invalid class id';
            throw error;
        }

        const classItem = await classService.getClassById(classId);
        res.status(200).json({ success: true, data: classItem });
    } catch (error) {
        next(error);
    }
};

const createClass = async (req, res, next) => {
    try {
        const newCourseId = await classService.createClass(req.body);
        res.status(201).json({ 
            success: true, 
            message: "สร้างคอร์สเรียนสำเร็จ!",
            data: { id: newCourseId, ...req.body } 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getClasses, getClassById, createClass };