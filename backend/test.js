require('dotenv').config();
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { initDb, seedDb, getDb } = require('./db');
const app = require('./server');

let server;
let baseUrl;
let authToken;

before(() => {
  initDb();
  seedDb();
  server = app.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
  });
});

after(() => {
  server.close();
});

describe('GET /api/health', () => {
  it('should return ok status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'ok');
  });
});

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123', name: 'Test User' }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, 'test@test.com');
  });

  it('should reject duplicate email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123', name: 'Test User' }),
    });
    assert.strictEqual(res.status, 409);
  });

  it('should reject missing fields', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    assert.strictEqual(res.status, 400);
  });
});

describe('POST /api/auth/login', () => {
  it('should login successfully', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.token);
    authToken = data.token;
  });

  it('should reject wrong password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrongpass' }),
    });
    assert.strictEqual(res.status, 401);
  });
});

describe('GET /api/classes', () => {
  it('should return all classes', async () => {
    const res = await fetch(`${baseUrl}/api/classes`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.classes.length >= 10);
  });

  it('should filter by category', async () => {
    const res = await fetch(`${baseUrl}/api/classes?category=โยคะ`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    data.classes.forEach(c => assert.strictEqual(c.category, 'โยคะ'));
  });

  it('should filter by search', async () => {
    const res = await fetch(`${baseUrl}/api/classes?search=โยคะ`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.classes.length > 0);
  });

  it('should filter by price range', async () => {
    const res = await fetch(`${baseUrl}/api/classes?min_price=500&max_price=800`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    data.classes.forEach(c => {
      assert.ok(c.price >= 500);
      assert.ok(c.price <= 800);
    });
  });

  it('should sort by price ascending', async () => {
    const res = await fetch(`${baseUrl}/api/classes?sort=price&order=asc`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    for (let i = 1; i < data.classes.length; i++) {
      assert.ok(data.classes[i].price >= data.classes[i - 1].price);
    }
  });

  it('should sort by price descending', async () => {
    const res = await fetch(`${baseUrl}/api/classes?sort=price&order=desc`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    for (let i = 1; i < data.classes.length; i++) {
      assert.ok(data.classes[i].price <= data.classes[i - 1].price);
    }
  });
});

describe('GET /api/classes/:id', () => {
  it('should return a specific class', async () => {
    const res = await fetch(`${baseUrl}/api/classes/1`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.class.id, 1);
  });

  it('should return 404 for non-existent class', async () => {
    const res = await fetch(`${baseUrl}/api/classes/9999`);
    assert.strictEqual(res.status, 404);
  });
});

describe('POST /api/bookings', () => {
  it('should reject without auth token', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: 1 }),
    });
    assert.strictEqual(res.status, 401);
  });

  it('should create a booking', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ class_id: 1 }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.booking);
  });

  it('should reject duplicate booking', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ class_id: 1 }),
    });
    assert.strictEqual(res.status, 409);
  });

  it('should reject booking for non-existent class', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ class_id: 9999 }),
    });
    assert.strictEqual(res.status, 404);
  });
});

describe('GET /api/bookings', () => {
  it('should return user bookings', async () => {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.ok(data.bookings.length >= 1);
  });
});

describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent`);
    assert.strictEqual(res.status, 404);
  });
});

describe('Capacity check (Gatekeeper)', () => {
  it('should return 409 when class is full', async () => {
    const db = getDb();
    const smallClass = db.prepare('SELECT * FROM classes ORDER BY max_capacity ASC LIMIT 1').get();

    const allUsers = db.prepare('SELECT id FROM users').all();
    for (let i = 0; i < smallClass.max_capacity; i++) {
      const user = allUsers[i % allUsers.length];
      const token = require('jsonwebtoken').sign(
        { id: user.id, email: 'test@test.com', name: 'Test' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ class_id: smallClass.id }),
      });
      if (res.status === 409) {
        const data = await res.json();
        assert.ok(data.error.includes('เต็ม') || data.error.includes('แล้ว'));
        return;
      }
    }
    assert.fail('Should have returned 409 for full class');
  });
});
