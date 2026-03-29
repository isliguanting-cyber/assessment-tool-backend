const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const assessmentRoutes = require('./routes/assessment');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

// 路由
app.use('/api', assessmentRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Assessment API is running' });
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
