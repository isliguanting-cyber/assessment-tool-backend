const { v4: uuidv4 } = require('uuid');
const db = require('../db');

class Assessment {
  // 创建测评
  static create(title, description, questions) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO assessments (id, title, description, questions)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, title, description, JSON.stringify(questions));
    stmt.free();
    return { id, title, description, questions };
  }

  // 获取所有测评
  static getAll() {
    const stmt = db.prepare('SELECT * FROM assessments ORDER BY created_at DESC');
    const rows = stmt.all();
    stmt.free();
    return rows.map(row => ({
      ...row,
      questions: JSON.parse(row.questions)
    }));
  }

  // 获取单个测评
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM assessments WHERE id = ?');
    const row = stmt.get(id);
    stmt.free();
    if (!row) return null;
    return {
      ...row,
      questions: JSON.parse(row.questions)
    };
  }
}

class Response {
  // 保存答题记录
  static create(assessmentId, answers, result, ipAddress) {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO responses (id, assessment_id, answers, result, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, assessmentId, JSON.stringify(answers), JSON.stringify(result), ipAddress);
    stmt.free();
    return { id, assessment_id: assessmentId, result };
  }

  // 获取答题记录
  static getById(id) {
    const stmt = db.prepare('SELECT * FROM responses WHERE id = ?');
    const row = stmt.get(id);
    stmt.free();
    if (!row) return null;
    return {
      ...row,
      answers: JSON.parse(row.answers),
      result: JSON.parse(row.result)
    };
  }
}

module.exports = { Assessment, Response };
