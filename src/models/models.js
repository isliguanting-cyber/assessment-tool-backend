const { v4: uuidv4 } = require('uuid');
const { db, initializeTables } = require('../db');

// 确保表已初始化
let tablesReady = false;

const readyPromise = initializeTables().then(() => {
  tablesReady = true;
  console.log('✅ Database is ready for operations');
}).catch(err => {
  console.error('❌ Failed to initialize tables:', err);
});

// 等待数据库准备好
function ensureReady() {
  return readyPromise;
}

class Assessment {
  // 创建测评
  static async create(title, description, questions) {
    await ensureReady();
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO assessments (id, title, description, questions)
        VALUES (?, ?, ?, ?)
      `;
      db.run(query, [id, title, description, JSON.stringify(questions)], function(err) {
        if (err) reject(err);
        else resolve({ id, title, description, questions });
      });
    });
  }

  // 获取所有测评
  static async getAll() {
    await ensureReady();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM assessments ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else {
          const assessments = rows.map(row => ({
            ...row,
            questions: JSON.parse(row.questions)
          }));
          resolve(assessments);
        }
      });
    });
  }

  // 获取单个测评
  static async getById(id) {
    await ensureReady();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM assessments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve({
            ...row,
            questions: JSON.parse(row.questions)
          });
        }
      });
    });
  }
}

class Response {
  // 保存答题记录
  static async create(assessmentId, answers, result, ipAddress) {
    await ensureReady();
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO responses (id, assessment_id, answers, result, ip_address)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(query, [
        id,
        assessmentId,
        JSON.stringify(answers),
        JSON.stringify(result),
        ipAddress
      ], function(err) {
        if (err) reject(err);
        else resolve({ id, assessment_id: assessmentId, result });
      });
    });
  }

  // 获取答题记录
  static async getById(id) {
    await ensureReady();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM responses WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else if (!row) resolve(null);
        else {
          resolve({
            ...row,
            answers: JSON.parse(row.answers),
            result: JSON.parse(row.result)
          });
        }
      });
    });
  }
}

module.exports = { Assessment, Response };
