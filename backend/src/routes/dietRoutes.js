// backend/src/routes/dietRoutes.js
const express = require('express');
const router = express.Router();
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

// '오늘의 식단 요약' API 라우트
router.get('/today', authMiddleware, dietController.getTodayDietSummary);

// 다른 모든 라우트
router.get('/', authMiddleware, dietController.getDietEntries);
router.post('/', authMiddleware, dietController.addDietEntry);
router.put('/:entryId', authMiddleware, dietController.updateDietEntry);
router.delete('/:entryId', authMiddleware, dietController.deleteDietEntry);

module.exports = router;