import React from 'react';
import './DietExpanded.css';

// 임시 데이터
const mockDietData = {
  totalCalories: 1500,
  totalCarbs: 180,
  totalProtein: 100,
  totalFat: 50,
  waterIntake: 1.2,
  waterTarget: 2.0,
  recordedMeals: {
    breakfast: { name: '기록 없음', calories: 0 },
    lunch: { name: '닭가슴살 샐러드', calories: 550 },
    dinner: { name: '기록 없음', calories: 0 },
    snacks: { name: '바나나 1개', calories: 100 },
  },
  calorieTarget: 1800,
  aiCoachTip: '사용자님, 오늘 탄수화물 섭취가 조금 부족해 보여요. 통곡물이나 채소를 더 추가해 보는 건 어떨까요?',
  recommendedMeals: {
    breakfast: { name: '오트밀, 과일', calories: 300 },
    lunch: { name: '고단백 샌드위치', calories: 520 },
    dinner: { name: '채소 볶음밥', calories: 450 },
  },
  weeklyAchievement: [
    { day: '월', achieved: 95 },
    { day: '화', achieved: 105 },
    { day: '수', achieved: 80 },
    { day: '목', achieved: 110 },
    { day: '금', achieved: 90 },
    { day: '토', achieved: 75 },
    { day: '오늘', achieved: 83 },
  ]
};

// 아이콘 컴포넌트
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export default function DietExpanded({ onClose, onLogDietToManager }) {
  const {
    totalCalories, totalCarbs, totalProtein, totalFat,
    waterIntake, waterTarget, recordedMeals, calorieTarget,
    aiCoachTip, recommendedMeals, weeklyAchievement
  } = mockDietData;

  const calorieProgress = Math.min((totalCalories / calorieTarget) * 100, 100);

  // 원형 프로그레스 바를 위한 계산
  const waterProgress = Math.min(waterIntake / waterTarget, 1);
  const circumference = 2 * Math.PI * 36; // 반지름 36
  const strokeDashoffset = circumference * (1 - waterProgress);


  return (
    <div className="diet-expanded-container">
      <header className="diet-expanded-header">
        <h2>오늘의 식단</h2>
        <button onClick={onClose} className="close-button">
          <CloseIcon />
        </button>
      </header>

      <section className="ai-coach-tip">
        <p><span className="font-semibold">하루핏 매니저:</span> {aiCoachTip}</p>
      </section>

      <section className="nutrient-summary">
        <div className="nutrient-item"><span>{totalCalories}</span> Kcal</div>
        <div className="nutrient-item"><span>{totalCarbs}g</span> 탄수화물</div>
        <div className="nutrient-item"><span>{totalProtein}g</span> 단백질</div>
        <div className="nutrient-item"><span>{totalFat}g</span> 지방</div>
      </section>

      <main className="diet-expanded-main">
        {/* 수분 섭취 섹션: 원형 프로그레스 바로 변경 */}
        <div className="water-intake-box">
          <label>오늘의 수분 섭취</label>
          <div className="water-progress-container">
            <svg className="water-progress-svg" viewBox="0 0 80 80">
              <circle className="water-progress-bg" cx="40" cy="40" r="36"></circle>
              <circle
                className="water-progress-bar"
                cx="40"
                cy="40"
                r="36"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset
                }}
              ></circle>
            </svg>
            <div className="water-progress-text">
              <span className="current">{waterIntake}L</span>
              <span className="target">/ {waterTarget}L</span>
            </div>
          </div>
        </div>
        <div className="recorded-meals-box">
          <label>오늘 기록한 식단</label>
          <ul className="meal-list">
            <li><span>아침: {recordedMeals.breakfast.name}</span> <span>{recordedMeals.breakfast.calories} Kcal</span></li>
            <li><span>점심: {recordedMeals.lunch.name}</span> <span>{recordedMeals.lunch.calories} Kcal</span></li>
            <li><span>저녁: {recordedMeals.dinner.name}</span> <span>{recordedMeals.dinner.calories} Kcal</span></li>
            <li><span>간식: {recordedMeals.snacks.name}</span> <span>{recordedMeals.snacks.calories} Kcal</span></li>
          </ul>
        </div>
        <div className="diet-goal-box">
          <label>식단 목표</label>
          <p>오늘 목표 칼로리 달성률</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${calorieProgress}%` }}></div>
          </div>
          <p className="progress-percent">{Math.round(calorieProgress)}%</p>
          <div className="goal-details">
            <span>목표: {calorieTarget} Kcal (남음: {Math.max(0, calorieTarget - totalCalories)} Kcal)</span>
            <button className="edit-goal-btn">목표 수정</button>
          </div>
        </div>
      </main>

      <section className="weekly-achievement-section">
        <label>주간 칼로리 달성률</label>
        <div className="weekly-chart">
          {weeklyAchievement.map((item, index) => (
            <div key={index} className="day-achievement">
              <div className="bar-wrapper">
                <div
                  className={`bar ${item.achieved > 100 ? 'over' : 'good'}`}
                  style={{ height: `${Math.min(item.achieved, 100)}%` }}
                >
                  <span className="bar-tooltip">{item.achieved}%</span>
                </div>
              </div>
              <span className={`day-label ${item.day === '오늘' ? 'today' : ''}`}>{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="diet-expanded-footer">
        <div className="recommendation-section">
          <h4>추천 식단</h4>
          <ul className="recommend-list">
            <li><span>아침: {recommendedMeals.breakfast.name}</span> <span>{recommendedMeals.breakfast.calories} Kcal</span></li>
            <li><span>점심: {recordedMeals.lunch.name}</span> <span>{recordedMeals.lunch.calories} Kcal</span></li>
            <li><span>저녁: {recordedMeals.dinner.name}</span> <span>{recordedMeals.dinner.calories} Kcal</span></li>
          </ul>
        </div>
        <div className="log-action-section">
          <button className="log-diet-btn" onClick={onLogDietToManager}>매니저에게 식단 기록하기</button>
        </div>
      </footer>
    </div>
  );
}
