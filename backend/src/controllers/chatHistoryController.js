// backend/src/controllers/chatHistoryController.js
const ChatHistory = require('../models/ChatHistory'); // ChatHistory 모델 불러오기
const User = require('../models/User'); // User 모델 불러오기

// 특정 사용자의 대화 기록 조회
exports.getChatHistory = async (req, res) => {
    const { nickname, pin } = req.params;

    if (!nickname || !pin) {
        return res.status(400).json({ message: '닉네임과 PIN 번호가 필요합니다.' });
    }

    try {
        const user = await User.findOne({ nickname, pin });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없거나 PIN이 일치하지 않습니다.' });
        }

        // 해당 사용자의 대화 기록 문서 조회 (unique: true 이므로 하나만 존재)
        const chatHistory = await ChatHistory.findOne({ user: user._id }).sort({ 'messages.timestamp': 1 }); // 오래된 순

        if (!chatHistory) {
            return res.status(200).json({ message: '아직 대화 기록이 없습니다.', history: { messages: [] } });
        }

        res.status(200).json({ message: '대화 기록을 성공적으로 가져왔습니다.', history: chatHistory });

    } catch (error) {
        console.error('대화 기록 조회 중 오류:', error);
        res.status(500).json({ message: '대화 기록 조회에 실패했습니다.', error: error.message });
    }
};

// 대화 기록에 새 메시지 추가 또는 초기 대화 기록 생성
exports.addMessageToHistory = async (req, res) => {
    const { nickname, pin } = req.params;
    const { role, content, extractedData } = req.body; // 메시지 내용

    if (!nickname || !pin || !role || !content) {
        return res.status(400).json({ message: '닉네임, PIN, 역할, 메시지 내용은 필수입니다.' });
    }

    try {
        const user = await User.findOne({ nickname, pin });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없거나 PIN이 일치하지 않습니다.' });
        }

        // 해당 사용자의 대화 기록 문서 찾기 또는 새로 생성
        let chatHistory = await ChatHistory.findOne({ user: user._id });

        if (!chatHistory) {
            chatHistory = new ChatHistory({ user: user._id, messages: [] });
        }

        // 새 메시지를 기록에 추가
        chatHistory.messages.push({ role, content, extractedData });

        await chatHistory.save();
        res.status(200).json({ message: '메시지가 대화 기록에 추가되었습니다.', history: chatHistory });

    } catch (error) {
        console.error('대화 기록에 메시지 추가 중 오류:', error);
        res.status(500).json({ message: '대화 기록 업데이트에 실패했습니다.', error: error.message });
    }
};

// 특정 사용자의 전체 대화 기록 삭제
exports.deleteChatHistory = async (req, res) => {
    const { nickname, pin } = req.params;

    if (!nickname || !pin) {
        return res.status(400).json({ message: '닉네임과 PIN 번호가 필요합니다.' });
    }

    try {
        const user = await User.findOne({ nickname, pin });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없거나 PIN이 일치하지 않습니다.' });
        }

        const deletedHistory = await ChatHistory.findOneAndDelete({ user: user._id });

        if (!deletedHistory) {
            return res.status(404).json({ message: '대화 기록을 찾을 수 없거나 접근 권한이 없습니다.' });
        }

        res.status(200).json({ message: '대화 기록이 성공적으로 삭제되었습니다.' });

    } catch (error) {
        console.error('대화 기록 삭제 중 오류:', error);
        res.status(500).json({ message: '대화 기록 삭제에 실패했습니다.', error: error.message });
    }
};