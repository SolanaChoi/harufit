import React from 'react';
import './WorkoutCard.css';
import runningIcon from '../../assets/images/run-icon.png';
import bikeIcon from '../../assets/images/bike-icon.png';

export default function WorkoutCard({ mode, onExpand }) {
  return (
    <div className="workout-card card-base">
      <div className={`card-header ${mode}-theme`}>
        <span>운동</span>
        <button className="expand-btn" onClick={onExpand}>▶</button>
      </div>
      <div className="workout-content">
        {/* 최신 운동 */}
        <div className="current-workout">
          <span className="recommend-label">최신 운동</span>
          <ul className="exercise-list">
            <li><span>벤치 프레스</span><span>60kg, 12회, 3세트</span></li>
            <li><span>스쿼트</span><span>80kg, 10회, 5세트</span></li>
            <li><span>러닝</span><span>20분</span></li>
            <li><span>스트레칭</span><span>10분</span></li>
          </ul>
        </div>
        <div className="recommended-workout">
          <span className="recommend-label">추천 운동</span>
          <img src={bikeIcon} alt="Bike Icon" className="workout-icon" />
          <div className="workout-details">
            <p>자전거 타기</p>
            <span>(200 kcal)</span>
          </div>
        </div>
      </div>
    </div>
  );
}