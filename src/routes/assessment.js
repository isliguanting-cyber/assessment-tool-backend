const express = require('express');
const router = express.Router();
const { Assessment, Response } = require('../models/models');

// 获取所有测评列表
router.get('/assessments', async (req, res) => {
  try {
    const assessments = await Assessment.getAll();
    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个测评（含题目）
router.get('/assessments/:id', async (req, res) => {
  try {
    const assessment = await Assessment.getById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }
    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 提交答案
router.post('/submit', async (req, res) => {
  try {
    const { assessment_id, answers } = req.body;

    // 获取测评信息
    const assessment = await Assessment.getById(assessment_id);
    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }

    // 计算结果
    const result = calculateResult(assessment.questions, answers);

    // 获取客户端 IP
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 保存记录
    const response = await Response.create(assessment_id, answers, result, ipAddress);

    res.json({
      success: true,
      data: {
        response_id: response.id,
        result
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取结果
router.get('/result/:responseId', async (req, res) => {
  try {
    const response = await Response.getById(req.params.responseId);
    if (!response) {
      return res.status(404).json({ success: false, error: 'Result not found' });
    }
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 结果计算函数（示例）
function calculateResult(questions, answers) {
  let totalScore = 0;
  const maxScore = questions.length * 100;

  // 简单的评分逻辑（可以根据测评类型调整）
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer) {
      totalScore += 100;
    }
  }

  const percentage = Math.round((totalScore / maxScore) * 100);

  let category = '';
  if (percentage >= 80) category = '优秀';
  else if (percentage >= 60) category = '良好';
  else if (percentage >= 40) category = '及格';
  else category = '需要努力';

  return {
    total_score: percentage,
    category,
    analysis: `你完成了 ${questions.length} 道题目，得分 ${percentage}，评级为 ${category}。继续加油！`,
    answered_count: Object.keys(answers).length,
    total_count: questions.length
  };
}

module.exports = router;
