const { all, get, run } = require('../config/db');

const COLUMNS = `id, title, description, price, max_capacity, current_bookings,
    course_name, image, category, instructor_name, instructor_image,
    full_description, contents, curriculum, benefits, requirements,
    class_date, students, video_preview_url`;

const parseRow = (row) => {
    if (!row) return null;
    return {
        ...row,
        contents: JSON.parse(row.contents),
        curriculum: JSON.parse(row.curriculum),
        benefits: JSON.parse(row.benefits),
        requirements: JSON.parse(row.requirements)
    };
};

const getAllClasses = async (filters = {}) => {
    const { search, category, maxPrice } = filters;
    const conditions = [];
    const params = [];

    if (search) {
        conditions.push('course_name LIKE ?');
        params.push(`%${search}%`);
    }
    if (category) {
        conditions.push('category = ?');
        params.push(category);
    }
    if (maxPrice) {
        conditions.push('price <= ?');
        params.push(Number(maxPrice));
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const rows = await all(`SELECT ${COLUMNS} FROM Classes ${where}`, params);
    return rows.map(parseRow);
};

const getClassById = async (classId) => {
    const row = await get(`SELECT ${COLUMNS} FROM Classes WHERE id = ?`, [classId]);

    if (!row) {
        const error = new Error('Class not found');
        error.statusCode = 404;
        error.publicMessage = 'Class not found';
        throw error;
    }

    return parseRow(row);
};

const createClass = async (courseData) => {
    const sql = `
        INSERT INTO Classes (
            title, description, price, max_capacity, current_bookings, 
            course_name, image, category, instructor_name, instructor_image, 
            full_description, contents, curriculum, benefits, requirements, 
            class_date, students, video_preview_url
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        courseData.title, 
        courseData.description, 
        courseData.price, 
        courseData.max_capacity, 
        0, // current_bookings
        courseData.course_name || courseData.title,
        courseData.image || "", 
        courseData.category || "General", 
        courseData.instructor_name || "", 
        courseData.instructor_image || "", 
        courseData.full_description || courseData.description,
        courseData.contents ? JSON.stringify(courseData.contents) : "[]",
        courseData.curriculum ? JSON.stringify(courseData.curriculum) : "[]",
        courseData.benefits ? JSON.stringify(courseData.benefits) : "[]",
        courseData.requirements ? JSON.stringify(courseData.requirements) : "[]",
        courseData.class_date || "", 
        0, // students
        courseData.video_preview_url || ""
    ];

    const result = await run(sql, params);
    return result.lastID; // ส่ง ID ที่เพิ่งสร้างกลับไป
};

module.exports = { getAllClasses, getClassById, createClass };
