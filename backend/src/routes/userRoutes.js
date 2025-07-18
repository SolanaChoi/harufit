const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/users - 로그인 또는 회원가입
router.post('/', userController.createUser);

// PUT /api/users/mode - 사용자 모드 변경
router.put('/mode', authMiddleware, userController.updateUserMode);

module.exports = router;