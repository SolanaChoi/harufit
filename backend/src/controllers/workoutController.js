const WorkoutEntry = require('../models/WorkoutEntry');
const User = require('../models/User');

// 오늘의 운동 요약 정보를 가져오는 함수
exports.getTodayWorkoutSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayWorkouts = await WorkoutEntry.find({
            user: userId,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        });

        let totalDurationMinutes = 0;
        let totalCaloriesBurned = 0;
        todayWorkouts.forEach(entry => {
            totalDurationMinutes += entry.totalDurationMinutes || 0;
            totalCaloriesBurned += entry.totalCaloriesBurned || 0;
        });

        const summary = { totalDurationMinutes, totalCaloriesBurned };
        res.status(200).json(summary);
    } catch (error) {
        console.error('오늘의 운동 요약 조회 중 오류:', error);
        res.status(500).json({ message: '오늘의 운동 요약 조회 중 오류가 발생했습니다.' });
    }
};

// 운동 기록 추가
exports.addWorkoutEntry = async (req, res) => {
    try {
        const { date, workoutType, exercises, notes } = req.body;
        const userId = req.user._id;
        
        let totalDurationMinutes = 0;
        let totalCaloriesBurned = 0;
        exercises.forEach(exercise => {
            totalDurationMinutes += (exercise.durationMinutes || 0);
            totalCaloriesBurned += (exercise.caloriesBurned || 0);
        });

        const newEntry = new WorkoutEntry({
            user: userId,
            date,
            workoutType,
            exercises,
            totalDurationMinutes,
            totalCaloriesBurned,
            notes
        });
        await newEntry.save();
        res.status(201).json({ message: '운동 기록이 성공적으로 추가되었습니다.', entry: newEntry });
    } catch (error) {
        console.error('운동 기록 추가 중 오류:', error);
        res.status(500).json({ message: '운동 기록 추가에 실패했습니다.' });
    }
};

// 사용자의 모든 운동 기록 조회
exports.getWorkoutEntries = async (req, res) => {
    try {
        const workoutEntries = await WorkoutEntry.find({ user: req.user._id }).sort({ date: -1 });
        res.status(200).json({ message: '운동 기록을 성공적으로 가져왔습니다.', entries: workoutEntries });
    } catch (error) {
        console.error('운동 기록 조회 중 오류:', error);
        res.status(500).json({ message: '운동 기록 조회에 실패했습니다.' });
    }
};

// 운동 기록 업데이트
exports.updateWorkoutEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const updatedEntry = await WorkoutEntry.findOneAndUpdate(
            { _id: entryId, user: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: '해당 운동 기록을 찾을 수 없거나 수정 권한이 없습니다.' });
        }
        res.status(200).json({ message: '운동 기록이 성공적으로 업데이트되었습니다.', entry: updatedEntry });
    } catch (error) {
        console.error('운동 기록 업데이트 중 오류:', error);
        res.status(500).json({ message: '운동 기록 업데이트에 실패했습니다.' });
    }
};

// 운동 기록 삭제
exports.deleteWorkoutEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const userId = req.user._id;

        const deletedEntry = await WorkoutEntry.findOneAndDelete({ _id: entryId, user: userId });

        if (!deletedEntry) {
            return res.status(404).json({ message: '해당 운동 기록을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }
        res.status(200).json({ message: '운동 기록이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error('운동 기록 삭제 중 오류:', error);
        res.status(500).json({ message: '운동 기록 삭제에 실패했습니다.' });
    }
};