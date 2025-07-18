const Status = require('../models/Status');

// 오늘의 상태 정보를 가져오는 함수
exports.getTodayStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayStatus = await Status.findOne({
            user: userId,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        }).sort({ createdAt: -1 });

        if (todayStatus) {
            return res.status(200).json(todayStatus);
        }

        // 오늘 기록이 없으면, 가장 마지막 기록이라도 보내줌
        const lastStatus = await Status.findOne({ user: userId }).sort({ createdAt: -1 });
        if (lastStatus) {
            return res.status(200).json(lastStatus);
        }

        // ✅ 만약 어떤 기록도 없다면, 에러 대신 기본값을 반환
        return res.status(200).json({
            weight: 0,
            bodyFatPercentage: 0,
            skeletalMuscleMass: 0,
            notes: '첫 상태 기록을 시작해보세요!',
        });

    } catch (error) {
        console.error('오늘의 상태 정보 조회 중 오류:', error);
        res.status(500).json({ message: '상태 정보 조회 중 서버 오류가 발생했습니다.' });
    }
};

// 여기에 나중에 addStatus, updateStatus 등 다른 함수들을 추가할 수 있습니다.