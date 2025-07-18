import React from 'react';
import './StatusCard.css';
import personIcon from '../../assets/images/pp.png';

export default function StatusCard({ onExpand, mode }) {
  return (
    <div className="status-card card-base">
      <div className={`card-header ${mode}-theme`}>
        <span>상태</span>
        <button className="expand-btn" onClick={onExpand}>▶</button>
      </div>
      <div className="status-content">
        <div className="status-item">
          <div className="status-icon">
            <img src={personIcon} alt="아이콘"  />
            </div>
            <div className="status-details">
            <p>체중: <span className="status-value">70.5 kg</span></p>
            <p>체지방: <span className="status-value">25.1 %</span></p>
              <p className="status-message">AI코치: 목표 체중에 가까워지고 있어요! 꾸준함이 중요해요!</p>
            </div>
          </div>
        </div>
      </div>
      );
}