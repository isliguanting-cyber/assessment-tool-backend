const crypto = require('crypto');

const demoAssessment = {
  title: '职业性格倾向测试',
  description: '通过一系列问题，发现你的职业性格倾向和适合的工作方向',
  questions: [
    {
      id: 'q1',
      question: '周末你更倾向于做什么？',
      type: 'single',
      options: [
        { id: 'A', text: '和朋友聚会聊天' },
        { id: 'B', text: '独自阅读或学习' },
        { id: 'C', text: '户外运动或旅行' }
      ]
    },
    {
      id: 'q2',
      question: '遇到问题时，你习惯怎么做？',
      type: 'single',
      options: [
        { id: 'A', text: '立即寻求他人帮助' },
        { id: 'B', text: '自己研究解决方案' },
        { id: 'C', text: '先尝试自己解决，不行再求助' }
      ]
    },
    {
      id: 'q3',
      question: '团队合作中，你通常扮演什么角色？',
      type: 'single',
      options: [
        { id: 'A', text: '组织和协调者' },
        { id: 'B', text: '技术专家和顾问' },
        { id: 'C', text: '执行者和实干家' }
      ]
    },
    {
      id: 'q4',
      question: '面对新事物，你的态度是？',
      type: 'single',
      options: [
        { id: 'A', text: '非常兴奋，迫不及待想尝试' },
        { id: 'B', text: '谨慎观察，了解清楚再决定' },
        { id: 'C', text: '等别人先试，再做决定' }
      ]
    },
    {
      id: 'q5',
      question: '你认为什么最重要？',
      type: 'single',
      options: [
        { id: 'A', text: '人际关系和谐' },
        { id: 'B', text: '个人成长和成就' },
        { id: 'C', text: '实际成果和效率' }
      ]
    }
  ]
};

function init() {
  try {
    console.log('Creating demo assessment...');
    const id = crypto.randomUUID();
    const { Assessment } = require('./models/models');
    const assessment = Assessment.create(
      demoAssessment.title,
      demoAssessment.description,
      demoAssessment.questions
    );
    console.log('✅ Demo assessment created:', assessment.id);
    console.log('📝 You can now access it at:', `http://localhost:5173/assessment/${assessment.id}`);
  } catch (error) {
    console.error('❌ Error creating demo assessment:', error);
  }
}

init();
