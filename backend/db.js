const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DATABASE_PATH || './database.sqlite';

let db;

function getDb() {
  if (!db) {
    db = new Database(path.resolve(__dirname, DB_PATH));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      max_capacity INTEGER NOT NULL,
      instructor TEXT NOT NULL,
      schedule TEXT NOT NULL,
      duration INTEGER NOT NULL,
      image_url TEXT,
      contents TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      booking_date TEXT DEFAULT (datetime('now')),
      status TEXT DEFAULT 'confirmed',
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (class_id) REFERENCES classes(id)
    )
  `);
}

function seedDb() {
  const db = getDb();

  const classCount = db.prepare('SELECT COUNT(*) as count FROM classes').get();
  if (classCount.count > 0) return;

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('password123', 10);
    db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run('demo@example.com', hashedPassword, 'Demo User');
  }

  const coursesPath = path.resolve(__dirname, '..', 'frontend', 'src', 'data', 'courses.json');
  let rawCourses;
  try {
    rawCourses = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));
  } catch {
    console.error('Could not read courses.json. Using fallback seed.');
    rawCourses = [];
  }

  const instructors = ['สมชาย', 'สมหญิง', 'ณัฐ', 'แพร', 'โต', 'หนึ่ง', 'มารี', 'เคน', 'จูน', 'บอล'];
  const descriptions = [
    'เรียนรู้พื้นฐานที่จำเป็นสำหรับการพัฒนาเว็บและแอปพลิเคชันสมัยใหม่',
    'เจาะลึกแนวคิดและเทคนิคขั้นสูงสำหรับนักพัฒนาสายอาชีพ',
    'ปูพื้นฐานตั้งแต่เริ่มต้นจนสามารถนำไปใช้งานได้จริง',
    'เรียนรู้จากผู้มีประสบการณ์ตรง พร้อม Workshop ปฏิบัติจริง',
    'คอร์สที่ออกแบบมาเพื่อให้คุณพร้อมทำงานจริงในอุตสาหกรรม',
  ];

  const classes = rawCourses.map((c, i) => ({
    name: c.courseName,
    description: descriptions[i % descriptions.length],
    category: c.category,
    price: c.price,
    max_capacity: 30,
    instructor: instructors[i % instructors.length],
    schedule: c.classDate,
    duration: 60,
    image_url: c.image,
    contents: JSON.stringify(c.contents),
  }));

  const insert = db.prepare(
    'INSERT INTO classes (name, description, category, price, max_capacity, instructor, schedule, duration, image_url, contents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const insertMany = db.transaction((items) => {
    for (const c of items) {
      insert.run(c.name, c.description, c.category, c.price, c.max_capacity, c.instructor, c.schedule, c.duration, c.image_url, c.contents);
    }
  });

  insertMany(classes);
  console.log(`Database seeded with ${classes.length} classes from courses.json`);
}

if (require.main === module) {
  require('dotenv').config();
  initDb();
  seedDb();
  console.log('Database initialized and seeded successfully');
}

module.exports = { getDb, initDb, seedDb };

module.exports = { getDb, initDb, seedDb };
