import React from 'react';
import './WorkoutExpanded.css';

// 임시 데이터
const mockWorkoutData = {
  managerTip: '오늘은 근력 운동의 비중이 높았네요! 내일은 가벼운 유산소로 몸을 풀어주는 건 어떨까요?',
  totalCaloriesBurned: 350,
  workoutDistribution: {
    cardio: 30,
    strength: 55,
    flexibility: 15,
  },
  weeklyGoalAchievement: [
    { day: '월', achieved: 100 },
    { day: '화', achieved: 80 },
    { day: '수', achieved: 0 },
    { day: '목', achieved: 110 },
    { day: '금', achieved: 90 },
    { day: '토', achieved: 120 },
    { day: '오늘', achieved: 80 },
  ],
  workoutLog: [
    { name: '벤치 프레스', details: '60kg, 12회, 3세트' },
    { name: '스쿼트', details: '80kg, 10회, 5세트' },
    { name: '러닝', details: '20분' },
    { name: '마무리 스트레칭', details: '10분' },
  ],
  todaysRecommendedWorkout: [
    { name: '가벼운 조깅', details: '20분' },
    { name: '폼롤러 스트레칭', details: '10분' },
  ],
  tomorrowsRecommendedWorkout: [
    { name: '하체 근력 운동', details: '40분' },
    { name: '요가', details: '20분' },
  ]
};

// 아이콘 컴포넌트
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

// 도넛 차트 컴포넌트
const DonutChart = ({ data }) => {
  const { cardio, strength, flexibility } = data;
  const total = cardio + strength + flexibility;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  // ✅ 각 세그먼트의 길이를 계산합니다.
  const cardioLength = (cardio / total) * circumference;
  const strengthLength = (strength / total) * circumference;
  const flexibilityLength = (flexibility / total) * circumference;

  // ✅ 각 세그먼트의 시작점을 계산합니다. (stroke-dashoffset)
  const strengthOffset = -cardioLength;
  const flexibilityOffset = -(cardioLength + strengthLength);

  return (
    <div className="donut-chart-container">
      <svg width="120" height="120" viewBox="0 0 120 120" className="donut-chart-svg">
        <defs>
          <linearGradient id="gradCardio" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradStrength" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradFlexibility" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#facc15', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="dropshadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="donut-chart-bg" cx="60" cy="60" r={radius} />
        <g style={{ filter: "url(#dropshadow)" }}>
          {/* ✅ 각 세그먼트를 올바른 계산법으로 다시 그립니다. */}
          <circle
            className="donut-chart-segment segment-cardio"
            cx="60" cy="60" r={radius}
            strokeDasharray={`${cardioLength} ${circumference}`}
          />
          <circle
            className="donut-chart-segment segment-strength"
            cx="60" cy="60" r={radius}
            strokeDasharray={`${strengthLength} ${circumference}`}
            strokeDashoffset={strengthOffset}
          />
          <circle
            className="donut-chart-segment segment-flexibility"
            cx="60" cy="60" r={radius}
            strokeDasharray={`${flexibilityLength} ${circumference}`}
            strokeDashoffset={flexibilityOffset}
          />
        </g>
      </svg>
      <div className="donut-chart-text">
        <span className="total-calories">{mockWorkoutData.totalCaloriesBurned}</span>
        <span className="calories-unit">Kcal</span>
      </div>
    </div>
  );
};


export default function WorkoutExpanded({ onClose, onLogWorkoutToManager }) {
  const {
    managerTip, workoutDistribution, weeklyGoalAchievement, workoutLog, todaysRecommendedWorkout, tomorrowsRecommendedWorkout
  } = mockWorkoutData;

  return (
    <div className="workout-expanded-container">
      <header className="workout-expanded-header">
        <h2>오늘의 운동</h2>
        <button onClick={onClose} className="close-button">
          <CloseIcon />
        </button>
      </header>

      <section className="manager-tip-section">
        <p><span className="font-semibold">하루핏 매니저:</span> {managerTip}</p>
      </section>

      <main className="workout-expanded-main">
        <div className="main-visual-section">
          <DonutChart data={workoutDistribution} />
          <div className="chart-legend">
            <div className="legend-item segment-cardio">유산소 {workoutDistribution.cardio}%</div>
            <div className="legend-item segment-strength">근력 {workoutDistribution.strength}%</div>
            <div className="legend-item segment-flexibility">유연성 {workoutDistribution.flexibility}%</div>
          </div>
        </div>

        <div className="workout-log-section">
          <label>오늘 기록한 운동</label>
          <ul className="workout-log-list">
            {workoutLog.map((item, index) => (
              <li key={index}>
                <span className="workout-name">{item.name}</span>
                <span className="workout-details">{item.details}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <section className="weekly-goal-section">
        <label>주간 운동 목표 달성률</label>
        <div className="weekly-chart">
          {weeklyGoalAchievement.map((item, index) => (
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

      <footer className="workout-expanded-footer">
        <div className="recommendations-container">
          <div className="recommendation-section">
            <h4>오늘 추천 운동</h4>
            <ul className="recommend-list">
              {todaysRecommendedWorkout.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span>
                  <span>{item.details}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="recommendation-section">
            <h4>내일 추천 운동</h4>
            <ul className="recommend-list">
              {tomorrowsRecommendedWorkout.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span>
                  <span>{item.details}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="log-action-section">
          <button className="log-workout-btn" onClick={onLogWorkoutToManager}>매니저에게 운동 기록하기</button>
        </div>
      </footer>
    </div>
  );
}
