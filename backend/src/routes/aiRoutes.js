const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware'); // 인증 미들웨어 불러오기

// POST /api/ai/chat 엔드포인트 수정
// authMiddleware를 추가하여 인증된 사용자만 접근 가능하도록 합니다.
router.post('/chat', authMiddleware, aiController.handleChat);

module.exports = router;