// backend/src/controllers/aiController.js
const aiService = require('../services/aiService');
// ChatHistory, User 모델은 나중에 DB 저장 시 필요하므로 일단 유지합니다.
const ChatHistory = require('../models/ChatHistory');
const User = require('../models/User');

exports.handleChat = async (req, res) => {
    const user = req.user;
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ message: '메시지를 입력해주세요.' });
    }

    try {
        const userContext = {
            nickname: user.nickname,
            targetWeight: user.targetWeight,
            targetCalories: user.targetCalories,
        };
        
        // ✅ 1. 서비스로부터 '대화용 답변'과 '추출 데이터'를 분리해서 받음
        const { conversationalReply, extractedData } = await aiService.getAiChatResponse(message, history || [], userContext);

        // (향후 이곳에 extractedData를 DB에 저장하는 로직을 추가할 수 있습니다)
        
        // ✅ 2. 프론트엔드에 '대화용 답변'과 '추출된 데이터'를 각각 전달
        res.status(200).json({
            reply: conversationalReply, // 사용자에게 보여줄 순수한 대화 내용
            extractedData: extractedData // 프론트에서 추가 처리를 위한 데이터
        });

    } catch (error) {
        res.status(500).json({ message: '하루핏 AI 매니저와의 통신에 문제가 발생했습니다.', error: error.message });
    }
};