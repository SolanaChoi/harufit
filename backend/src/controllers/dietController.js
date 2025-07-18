// backend/src/controllers/dietController.js
const DietEntry = require('../models/DietEntry');
const User = require('../models/User');

// 오늘의 식단 요약 정보를 가져오는 함수
const getTodayDietSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayDiets = await DietEntry.find({
            user: userId,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        let totalCalories = 0;
        todayDiets.forEach(diet => {
            totalCalories += diet.totalCalories || 0;
        });
        
        const summary = {
            totalCalories,
            targetCalories: req.user.targetCalories || 2000,
        };

        res.status(200).json(summary);
    } catch (error) {
        console.error('오늘의 식단 요약 조회 중 오류:', error);
        res.status(500).json({ message: '오늘의 식단 요약 조회 중 서버 오류가 발생했습니다.' });
    }
};

// 식단 기록 추가
const addDietEntry = async (req, res) => {
    try {
        const { date, mealType, foodItems, waterIntakeMl, notes } = req.body;
        const userId = req.user._id;

        let totalCalories = 0;
        if (foodItems && foodItems.length > 0) {
            foodItems.forEach(item => {
                totalCalories += item.calories || 0;
            });
        }

        const newEntry = new DietEntry({
            user: userId,
            date: date || new Date(),
            mealType,
            foodItems,
            waterIntakeMl,
            totalCalories,
            notes
        });

        await newEntry.save();
        res.status(201).json({ message: '식단이 성공적으로 기록되었습니다.', entry: newEntry });
    } catch (error) {
        console.error('식단 기록 추가 중 오류:', error);
        res.status(500).json({ message: '서버 오류로 식단 기록에 실패했습니다.' });
    }
};

// 사용자의 모든 식단 기록 조회
const getDietEntries = async (req, res) => {
    try {
        const dietEntries = await DietEntry.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({ message: '식단 기록을 성공적으로 가져왔습니다.', entries: dietEntries });
    } catch (error) {
        console.error('식단 기록 조회 중 오류:', error);
        res.status(500).json({ message: '식단 기록 조회에 실패했습니다.' });
    }
};

// 식단 기록 업데이트
const updateDietEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const updatedEntry = await DietEntry.findOneAndUpdate(
            { _id: entryId, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedEntry) return res.status(404).json({ message: '해당 식단 기록을 찾을 수 없거나 수정 권한이 없습니다.' });
        res.status(200).json({ message: '식단 기록이 성공적으로 업데이트되었습니다.', entry: updatedEntry });
    } catch (error) {
        console.error('식단 기록 업데이트 중 오류:', error);
        res.status(500).json({ message: '식단 기록 업데이트에 실패했습니다.' });
    }
};

// 식단 기록 삭제
const deleteDietEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const deletedEntry = await DietEntry.findOneAndDelete({ _id: entryId, user: req.user._id });
        if (!deletedEntry) return res.status(404).json({ message: '해당 식단 기록을 찾을 수 없거나 삭제 권한이 없습니다.' });
        res.status(200).json({ message: '식단 기록이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('식단 기록 삭제 중 오류:', error);
        res.status(500).json({ message: '식단 기록 삭제에 실패했습니다.' });
    }
};

// ✅ 모든 함수를 여기서 한번에 내보냅니다.
module.exports = {
    getTodayDietSummary,
    addDietEntry,
    getDietEntries,
    updateDietEntry,
    deleteDietEntry,
};