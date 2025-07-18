const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const rawNickname = req.headers['x-user-nickname'];
    const pin = req.headers['x-user-pin'];

    if (!rawNickname || !pin) {
      return res.status(401).json({ message: '인증 헤더(x-user-nickname, x-user-pin)가 필요합니다.' });
    }
    
    const nickname = decodeURIComponent(rawNickname);

    // ✅✅✅ 핵심 수정 부분 시작 ✅✅✅
    // 1. 닉네임이 'Guest'인지 확인
    if (nickname === 'Guest') {
      // 2. 게스트용 임시 사용자 객체를 생성하여 req.user에 할당
      req.user = {
        nickname: 'Guest',
        // aiController에서 사용할 수 있는 기본값 설정
        targetWeight: null,
        targetCalories: null,
      };
      // 3. 다음 미들웨어로 통과
      return next(); 
    }
    // ✅✅✅ 핵심 수정 부분 끝 ✅✅✅

    // --- 아래는 기존의 정식 사용자 인증 로직 (Guest가 아닐 때만 실행됨) ---
    const parsedPin = parseInt(pin, 10);

    if (isNaN(parsedPin)) {
        return res.status(400).json({ message: 'PIN 번호 형식이 올바르지 않습니다.' });
    }

    const user = await User.findOne({ nickname, pin: parsedPin });

    if (!user) {
      return res.status(401).json({ message: '인증에 실패했습니다.' });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(500).json({ message: '서버 인증 중 오류 발생', error: error.message });
  }
};

module.exports = authMiddleware;