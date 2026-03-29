const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/assessments.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

function initializeTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 测评表
      db.run(`CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        questions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // 答题记录表
      db.run(`CREATE TABLE IF NOT EXISTS responses (
        id TEXT PRIMARY KEY,
        assessment_id TEXT NOT NULL,
        answers TEXT NOT NULL,
        result TEXT NOT NULL,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id)
      )`);

      console.log('Database tables initialized');
      resolve();
    });
  });
}

module.exports = { db, initializeTables };
