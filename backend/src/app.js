// backend/src/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');
const dietRoutes = require('./routes/dietRoutes');
const statusRoutes = require('./routes/statusRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes');
const calendarGoalRoutes = require('./routes/calendarGoalRoutes'); // ✅ 새로 추가: calendarGoalRoutes 불러오기

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// === API 라우트들을 여기에 추가합니다 ===
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/chatHistory', chatHistoryRoutes);
app.use('/api/calendar', calendarGoalRoutes); // ✅ 경로를 '/api/calendar'로 사용

// 기본 라우트 (서버 작동 확인용)
app.get('/', (req, res) => {
  res.send('HaruFit Backend API is running!');
});

// === 에러 핸들링 미들웨어를 여기에 추가할 예정입니다 ===

module.exports = app;