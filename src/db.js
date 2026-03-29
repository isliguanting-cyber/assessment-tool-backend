const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/assessments.db');

// 设置数据库为 WAL 模式（并发写入）
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// 初始化表
db.exec(`
  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    questions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS responses (
    id TEXT PRIMARY KEY,
    assessment_id TEXT NOT NULL,
    answers TEXT NOT NULL,
    result TEXT NOT NULL,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id)
  );
`);

console.log('✅ Database tables initialized');

module.exports = db;
