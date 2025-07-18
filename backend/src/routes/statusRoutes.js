const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');
const authMiddleware = require('../middleware/authMiddleware');

// '오늘의 상태 정보' API 라우트
// GET /api/status/today
router.get('/today', authMiddleware, statusController.getTodayStatus);

module.exports = router;