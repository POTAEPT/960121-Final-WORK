const Database = require('better-sqlite3');
const path = require('path');
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

  const contentsData = {
    yoga: JSON.stringify(['ท่า Mountain Pose', 'ท่า Downward Dog', 'การหายใจแบบโยคะ', 'ท่า Warrior I & II', 'ท่า Child\'s Pose']),
    pilates: JSON.stringify(['Core Engagement', 'The Hundred', 'Roll Up', 'Leg Circles', 'Plank Variations']),
    weights: JSON.stringify(['Squat Form', 'Deadlift Technique', 'Bench Press', 'Overhead Press', 'Rows']),
    cardio: JSON.stringify(['Jumping Jacks', 'High Knees', 'Burpees', 'Mountain Climbers', 'Box Jumps']),
    bodypump: JSON.stringify(['Warm-up', 'Squat Track', 'Chest Track', 'Back Track', 'Cool Down']),
    zumba: JSON.stringify(['Merengue Basic', 'Salsa Steps', 'Reggaeton', 'Cumbia', 'Cool Down']),
    hotyoga: JSON.stringify(['Breathing Exercises', 'Sun Salutation', 'Balance Poses', 'Stretching Sequence', 'Savasana']),
    reformer: JSON.stringify(['Footwork', 'Hundred on Reformer', 'Short Spine', 'Long Stretch', 'Stomach Massage']),
    hiit: JSON.stringify(['Warm-up', 'Sprint Intervals', 'Strength Circuit', 'Plyometrics', 'Cool Down & Stretch']),
    strength: JSON.stringify(['Compound Lifts', 'Accessory Work', 'Core Training', 'Mobility', 'Conditioning']),
  };

  const classImages = [
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
    'https://images.unsplash.com/photo-1524594152303-9fd91143a2d6?w=800',
    'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800',
    'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800',
  ];

  const classes = [
    { name: 'โยคะพื้นฐาน (Beginner Yoga)', description: 'เรียนรู้ท่าโยคะพื้นฐานเพื่อความยืดหยุ่นและผ่อนคลาย', category: 'โยคะ', price: 500, max_capacity: 20, instructor: 'ครูสมหญิง', schedule: 'จันทร์-พุธ 08:00-09:00', duration: 60, image_url: classImages[0], contents: contentsData.yoga },
    { name: 'พิลาทิสเพื่อสุขภาพ (Pilates for Health)', description: 'เสริมสร้างแกนกลางลำตัวด้วยพิลาทิส', category: 'พิลาทิส', price: 600, max_capacity: 15, instructor: 'ครูณัฐ', schedule: 'อังคาร-พฤหัส 09:00-10:00', duration: 60, image_url: classImages[1], contents: contentsData.pilates },
    { name: 'เวทเทรนนิ่งขั้นต้น (Beginner Weights)', description: 'เริ่มต้นการเล่นเวทอย่างถูกวิธี', category: 'เวทเทรนนิ่ง', price: 800, max_capacity: 12, instructor: 'โค้ชโต', schedule: 'จันทร์-ศุกร์ 17:00-18:00', duration: 90, image_url: classImages[2], contents: contentsData.weights },
    { name: 'คาร์ดิโอแดนซ์ (Cardio Dance)', description: 'เต้นสนุก เผาผลาญแคลอรี่สูง', category: 'คาร์ดิโอ', price: 400, max_capacity: 25, instructor: 'ครูแพร', schedule: 'พุธ-ศุกร์ 18:00-19:00', duration: 45, image_url: classImages[3], contents: contentsData.cardio },
    { name: 'Body Pump', description: 'เวทเทรนนิ่งกลุ่มใหญ่พร้อมดนตรี', category: 'เวทเทรนนิ่ง', price: 700, max_capacity: 30, instructor: 'โค้ชหนึ่ง', schedule: 'จันทร์-พุธ-ศุกร์ 06:00-07:00', duration: 60, image_url: classImages[4], contents: contentsData.bodypump },
    { name: 'Zumba', description: 'เต้นออกกำลังกายสไตล์ละติน', category: 'คาร์ดิโอ', price: 350, max_capacity: 35, instructor: 'ครูแพร', schedule: 'อังคาร-พฤหัส 18:00-19:00', duration: 60, image_url: classImages[5], contents: contentsData.zumba },
    { name: 'Hot Yoga', description: 'โยคะในห้องอุณหภูมิสูง เพื่อการขับเหงื่อ', category: 'โยคะ', price: 650, max_capacity: 18, instructor: 'ครูสมหญิง', schedule: 'จันทร์-พุธ-ศุกร์ 10:00-11:00', duration: 75, image_url: classImages[6], contents: contentsData.hotyoga },
    { name: 'Pilates Reformer', description: 'พิลาทิสด้วยเครื่อง Reformer', category: 'พิลาทิส', price: 1000, max_capacity: 8, instructor: 'ครูณัฐ', schedule: 'อังคาร-พฤหัส 10:00-11:00', duration: 60, image_url: classImages[7], contents: contentsData.reformer },
    { name: 'HIIT Training', description: 'การฝึกแบบความเข้มข้นสูงสลับช่วงพัก', category: 'คาร์ดิโอ', price: 550, max_capacity: 20, instructor: 'โค้ชโต', schedule: 'จันทร์-พุธ-ศุกร์ 07:00-07:45', duration: 45, image_url: classImages[8], contents: contentsData.hiit },
    { name: 'Strength & Conditioning', description: 'เสริมสร้างความแข็งแรงและความทนทาน', category: 'เวทเทรนนิ่ง', price: 750, max_capacity: 15, instructor: 'โค้ชหนึ่ง', schedule: 'อังคาร-พฤหัส 17:00-18:30', duration: 90, image_url: classImages[9], contents: contentsData.strength },
  ];

  const insert = db.prepare(
    'INSERT INTO classes (name, description, category, price, max_capacity, instructor, schedule, duration, image_url, contents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const insertMany = db.transaction((items) => {
    for (const c of items) {
      insert.run(c.name, c.description, c.category, c.price, c.max_capacity, c.instructor, c.schedule, c.duration, c.image_url, c.contents);
    }
  });

  insertMany(classes);
  console.log('Database seeded with classes and demo user');
}

if (require.main === module) {
  require('dotenv').config();
  initDb();
  seedDb();
  console.log('Database initialized and seeded successfully');
}

module.exports = { getDb, initDb, seedDb };
