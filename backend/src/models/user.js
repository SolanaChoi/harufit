// backend/src/models/User.js
const mongoose = require('mongoose');

// 사용자 스키마 정의
const UserSchema = mongoose.Schema(
    {
        nickname: {
            type: String,
            required: [true, '닉네임은 필수입니다.'],
            unique: true,
            trim: true,
        },
        mode: {
            type: String,
            enum: ['easy', 'normal', 'hard'],
            default: 'easy',
        },
        // ✅ PIN 번호 필드를 Number 타입으로 변경하고 필수로 설정
        pin: {
            type: Number, // ✨ String 대신 Number로 변경합니다.
            required: [true, 'PIN 번호는 필수입니다.'], // PIN이 필수로 입력되도록 required: true로 변경
        },
        targetWeight: { type: Number, default: null },
        targetCalories: { type: Number, default: null },
    },
    {
        timestamps: true,
    }
);

// User 모델 생성 및 내보내기
const User = mongoose.model('User', UserSchema);
module.exports = User;