import React from 'react';
import './DietCard.css';
import waterBottleIcon from '../../assets/images/물통절반요.png';


export default function DietCard({ onExpand, mode, data }) {
  // 새로운 데이터 구조에 맞춰 안전하게 데이터 추출
  const eatenMeals = data?.eatenMeals || [];
  const waterIntake = data?.waterIntake || { current: 0, goal: 2 };
  const recommendedMeal = data?.recommendedMeal || { menu: '추천 식단 없음', };
  const lunch = eatenMeals.find(m => m.type === '점심') || { menu: '기록 없음', kcal: 0 };
  const dinner = eatenMeals.find(m => m.type === '저녁') || { menu: '기록 없음', kcal: 0 };

  return (
    <div className="diet-card card-base">
      <div className={`card-header ${mode}-theme`}>
        <span>식단</span>
        <button className="expand-btn" onClick={onExpand}>▶</button>
      </div>

      {/* 🔥 핵심 수정: 3분할 레이아웃을 위한 새로운 JSX 구조 */}
      <div className="diet-content-grid">
        {/* 1. 섭취한 식단 (상단 좌측) */}
        <div className="eaten-meals-section">
          <div className="diet-item">
            <p>점심: {lunch.menu} <br /> <span className="diet-kcal">{lunch.kcal} kcal</span></p>
          </div>
          <div className="diet-item">
            <p>저녁: {dinner.menu} <br /> <span className="diet-kcal">{dinner.kcal} kcal</span></p>
          </div>
        </div>

        {/* 2. 추천 식단 (상단 우측) */}
        <div className="recommend-section">
          <div className="recommendation-header">오늘의 추천 식단 </div>
          <p className="rec-menu">{recommendedMeal.menu}</p>
        </div>

        {/* 3. 물 섭취량 (하단 전체) */}
        <div className="water-section-grid">
          <div className="water-intake">
            <img src={waterBottleIcon} alt="물병 아이콘" className="water-icon" />
            <span className="eaten-water"> {waterIntake.current}L / {waterIntake.goal}L</span>
            <div className="water-progress-bar-container">
              <div
                className="water-progress-bar"
                style={{ width: `${(waterIntake.current / waterIntake.goal) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}