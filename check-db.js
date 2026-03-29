const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data/assessments.db');
const db = new sqlite3.Database(dbPath);

console.log('📊 Checking database records...\n');

// 查看测评列表
db.all('SELECT id, title, created_at FROM assessments', [], (err, assessments) => {
  if (err) {
    console.error('Error fetching assessments:', err);
  } else {
    console.log('🧪 Assessments in database:');
    console.log('='.repeat(60));
    assessments.forEach((a, i) => {
      console.log(`${i + 1}. ${a.title}`);
      console.log(`   ID: ${a.id}`);
      console.log(`   Created: ${a.created_at}`);
      console.log('');
    });
    console.log('='.repeat(60));
    console.log(`Total: ${assessments.length} assessment(s)\n`);

    // 查看答题记录
    db.all('SELECT id, assessment_id, ip_address, created_at FROM responses ORDER BY created_at DESC', [], (err, responses) => {
      if (err) {
        console.error('Error fetching responses:', err);
      } else {
        console.log('📝 User Responses in database:');
        console.log('='.repeat(60));

        if (responses.length === 0) {
          console.log('⚠️  No responses found yet.');
        } else {
          responses.forEach((r, i) => {
            console.log(`Response ${i + 1}:`);
            console.log(`   ID: ${r.id}`);
            console.log(`   Assessment ID: ${r.assessment_id}`);
            console.log(`   IP Address: ${r.ip_address || 'N/A'}`);
            console.log(`   Created: ${r.created_at}`);
            console.log('');

            // 获取详细答案
            db.get('SELECT answers, result FROM responses WHERE id = ?', [r.id], (err, row) => {
              if (!err && row) {
                const answers = JSON.parse(row.answers);
                const result = JSON.parse(row.result);

                console.log('   Answers:');
                Object.entries(answers).forEach(([qId, answer]) => {
                  console.log(`      ${qId}: ${answer}`);
                });

                console.log('   Result:');
                console.log(`      Score: ${result.total_score}`);
                console.log(`      Category: ${result.category}`);
                console.log(`      Analysis: ${result.analysis}`);
                console.log('');
              }
            });
          });

          console.log('='.repeat(60));
          console.log(`Total: ${responses.length} response(s)\n`);
        }

        // 关闭数据库
        db.close();
      }
    });
  }
});
