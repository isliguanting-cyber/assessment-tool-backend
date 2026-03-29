const Database = require('better-sqlite3').default;
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/assessments.db');

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory:', dataDir);
}

const db = new Database(dbPath);

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
