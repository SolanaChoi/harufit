// backend/src/models/ChatHistory.js
const mongoose = require('mongoose');

const ChatMessageSchema = mongoose.Schema(
    {
        role: { // 메시지를 보낸 주체 (user, assistant/ai)
            type: String,
            enum: ['user', 'assistant'],
            required: true,
        },
        content: { // 메시지 내용
            type: String,
            required: true,
        },
        timestamp: { // 메시지 전송 시간
            type: Date,
            default: Date.now,
        },
        // AI가 특정 정보를 추출했을 경우 저장 (선택적)
        extractedData: {
            type: mongoose.Schema.Types.Mixed, // JSON 객체 등 다양한 형태의 데이터 저장
            default: null,
        }
    }
);

const ChatHistorySchema = mongoose.Schema(
    {
        user: { // 어떤 사용자의 대화 기록인지 연결
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // 한 사용자당 하나의 대화 히스토리 문서만 가짐
        },
        messages: [ChatMessageSchema], // 대화 메시지 배열
    },
    {
        timestamps: true,
    }
);

const ChatHistory = mongoose.model('ChatHistory', ChatHistorySchema);

module.exports = ChatHistory;

