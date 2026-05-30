const fs = require('fs');
const path = require('path');
const { run, get } = require('./db');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const seedClasses = async () => {
    const countRow = await get('SELECT COUNT(1) AS count FROM Classes', []);
    if (countRow && countRow.count > 0) {
        return;
    }

    const classes = [
        {
            title: 'Intro to AI',
            description: 'Foundations of AI concepts and real-world use cases.',
            price: 1500,
            max_capacity: 30,
            current_bookings: 10
        },
        {
            title: 'Sourdough Bread Making',
            description: 'Hands-on techniques for artisan sourdough.',
            price: 800,
            max_capacity: 15,
            current_bookings: 15
        },
        {
            title: 'Watercolor Basics',
            description: 'Learn washes, gradients, and layering.',
            price: 900,
            max_capacity: 20,
            current_bookings: 4
        }
    ];

    for (const item of classes) {
        await run(
            'INSERT INTO Classes (title, description, price, max_capacity, current_bookings) VALUES (?, ?, ?, ?, ?)',
            [item.title, item.description, item.price, item.max_capacity, item.current_bookings]
        );
    }
};

const init = async () => {
    try {
        await run('BEGIN TRANSACTION', []);

        await run(
            'CREATE TABLE IF NOT EXISTS Users (\
                id INTEGER PRIMARY KEY AUTOINCREMENT,\
                name TEXT NOT NULL,\
                email TEXT NOT NULL UNIQUE,\
                password_hash TEXT NOT NULL,\
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP\
            )',
            []
        );

        await run(
            'CREATE TABLE IF NOT EXISTS Classes (\
                id INTEGER PRIMARY KEY AUTOINCREMENT,\
                title TEXT NOT NULL,\
                description TEXT NOT NULL,\
                price INTEGER NOT NULL,\
                max_capacity INTEGER NOT NULL,\
                current_bookings INTEGER NOT NULL DEFAULT 0\
            )',
            []
        );

        await run(
            'CREATE TABLE IF NOT EXISTS Bookings (\
                id INTEGER PRIMARY KEY AUTOINCREMENT,\
                user_id INTEGER NOT NULL,\
                class_id INTEGER NOT NULL,\
                booked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,\
                FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,\
                FOREIGN KEY (class_id) REFERENCES Classes (id) ON DELETE CASCADE\
            )',
            []
        );

        await seedClasses();

        await run('COMMIT', []);
        console.log('Database initialized successfully.');
    } catch (error) {
        await run('ROLLBACK', []);
        console.error('Database initialization failed:', error);
        process.exitCode = 1;
    }
};

init();
