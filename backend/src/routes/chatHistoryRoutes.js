// backend/src/routes/chatHistoryRoutes.js
const express = require('express');
const chatHistoryController = require('../controllers/chatHistoryController'); // 컨트롤러 불러오기

const router = express.Router();

// 사용자 대화 히스토리 조회 (GET) - 특정 사용자의 전체 대화 기록
router.get('/:nickname/:pin', chatHistoryController.getChatHistory);

// 새 메시지 추가 (PUT/PATCH) - 기존 대화 기록에 메시지 추가 (대화 발생 시 호출)
// 일반적으로는 AI 컨트롤러 내부에서 호출되지만, API 테스트를 위해 별도 라우트 정의
router.put('/:nickname/:pin', chatHistoryController.addMessageToHistory);

// 대화 기록 삭제 (DELETE) - 특정 사용자의 전체 대화 기록 삭제 (선택 사항)
router.delete('/:nickname/:pin', chatHistoryController.deleteChatHistory);

module.exports = router;