// backend/src/controllers/calendarGoalController.js
const User = require('../models/User');
const DietEntry = require('../models/DietEntry');
const WorkoutEntry = require('../models/WorkoutEntry');

// ✅ HomePage 캘린더 요약 정보를 위한 새로운 함수
exports.getCalendarSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const diets = await DietEntry.find({ user: userId, createdAt: { $gte: twoMonthsAgo } }, 'createdAt');
        const workouts = await WorkoutEntry.find({ user: userId, createdAt: { $gte: twoMonthsAgo } }, 'createdAt');

        const summary = {};

        const processEntries = (entries, type) => {
            entries.forEach(entry => {
                const dateKey = entry.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
                if (!summary[dateKey]) {
                    summary[dateKey] = {};
                }
                summary[dateKey][type] = true;
            });
        };

        processEntries(diets, 'hasDiet');
        processEntries(workouts, 'hasWorkout');
        
        const summaryArray = Object.keys(summary).map(date => ({
            date,
            ...summary[date]
        }));

        res.status(200).json(summaryArray);
    } catch (error) {
        console.error('캘린더 요약 조회 중 오류:', error);
        res.status(500).json({ message: '캘린더 요약 데이터를 가져오는 데 실패했습니다.' });
    }
};

// 특정 날짜의 요약 데이터 조회
exports.getDailySummary = async (req, res) => {
    const { date } = req.query;
    const userId = req.user._id;

    if (!date) {
        return res.status(400).json({ message: '조회 날짜는 필수입니다.' });
    }

    try {
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const dietEntries = await DietEntry.find({ user: userId, date: { $gte: startOfDay, $lte: endOfDay } });
        const workoutEntries = await WorkoutEntry.find({ user: userId, date: { $gte: startOfDay, $lte: endOfDay } });

        res.status(200).json({
            message: `${date}의 일일 요약 데이터입니다.`,
            dietEntries,
            workoutEntries
        });
    } catch (error) {
        res.status(500).json({ message: '일일 요약 데이터를 가져오는 데 실패했습니다.' });
    }
};

// 사용자 목표 설정
exports.setGoal = async (req, res) => {
    try {
        const { targetWeight, targetCalories } = req.body;
        const user = req.user;

        user.targetWeight = targetWeight !== undefined ? targetWeight : user.targetWeight;
        user.targetCalories = targetCalories !== undefined ? targetCalories : user.targetCalories;

        const updatedUser = await user.save();
        res.status(200).json({ message: '목표가 성공적으로 설정/업데이트되었습니다.', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: '목표 설정에 실패했습니다.' });
    }
};

// 사용자 목표 조회
exports.getGoals = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: '목표를 성공적으로 가져왔습니다.',
            goals: {
                targetWeight: user.targetWeight,
                targetCalories: user.targetCalories
            }
        });
    } catch (error) {
        res.status(500).json({ message: '목표 조회에 실패했습니다.' });
    }
};

// 이하 update, delete 함수는 현재 사용하지 않으므로 그대로 두거나 정리할 수 있습니다.
exports.updateGoal = async (req, res) => {
    // setGoal과 동일한 로직으로 구현 가능
    exports.setGoal(req, res);
};

exports.deleteGoal = async (req, res) => {
    try {
        const user = req.user;
        user.targetWeight = null;
        user.targetCalories = null;
        await user.save();
        res.status(200).json({ message: '목표가 성공적으로 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '목표 삭제에 실패했습니다.' });
    }
};