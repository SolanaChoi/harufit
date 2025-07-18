import React, { useState, useEffect, useRef } from 'react';
import LineChart from '../common/LineChart.jsx';
import { statusHistory } from '../../mocks/mockStatusHistory.js';
import './StatusExpanded.css';

// 어제 대비 변화량을 렌더링하는 헬퍼 함수
const renderChange = (change, unit) => {
    if (change === 0 || isNaN(change)) {
        return <span className="stat-change no-change">-</span>;
    }
    const isPositive = change > 0;
    // 체중은 증가가 나쁨, 근력량은 증가가 좋음으로 가정. 추후 로직 고도화 가능
    const changeClass = isPositive ? 'increase' : 'decrease'; 
    const arrow = isPositive ? '▲' : '▼';

    return (
        <span className={`stat-change ${changeClass}`}>
            {arrow} {Math.abs(change).toFixed(1)}{unit}
        </span>
    );
};


const StatusExpanded = ({ onClose, onLogStatusToManager }) => {
    const wrapperRef = useRef(null);
    const [hoveredData, setHoveredData] = useState(null);

    // 차트 데이터 구성은 기존 로직 유지
     const chartData = {
        labels: statusHistory.map(data => data.date),
        datasets: [
            {
                label: '체중 (kg)',
                data: statusHistory.map(data => data.weight),
                borderColor: '#8e44ad',
                backgroundColor: 'rgba(142, 68, 173, 0.1)',
                yAxisID: 'y_weight',
                fill: true,
                tension: 0.3,
            },
            {
                label: '체지방률 (%)',
                data: statusHistory.map(data => data.bodyFat),
                borderColor: '#2980b9',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                yAxisID: 'y_percent',
                hidden: true,
            },
            {
                label: '골격근량 (kg)',
                data: statusHistory.map(data => data.muscle),
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                yAxisID: 'y_weight',
                hidden: true,
            }
        ]
    };
    
    // 차트 옵션 구성은 기존 로직 유지
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: '최근 7일간 신체 변화', font: { size: 16, weight: 'bold' }, padding: { bottom: 20 } }
        },
        scales: {
            y_weight: { type: 'linear', display: true, position: 'left', title: { display: true, text: '체중(kg)' } },
            y_percent: { type: 'linear', display: true, position: 'right', title: { display: true, text: '체지방률(%)' }, grid: { drawOnChartArea: false } },
        },
        onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
                const dataIndex = chartElement[0].index;
                setHoveredData(statusHistory[dataIndex]);
            } else {
                setHoveredData(null);
            }
        },
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (wrapperRef.current) wrapperRef.current.classList.add('active');
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    // 어제 대비 변화량 계산
    const currentStatus = statusHistory.length > 0 ? statusHistory[statusHistory.length - 1] : {};
    const previousStatus = statusHistory.length > 1 ? statusHistory[statusHistory.length - 2] : currentStatus;
    
    const weightChange = currentStatus.weight - previousStatus.weight;
    const bodyFatChange = currentStatus.bodyFat - previousStatus.bodyFat;
    const muscleChange = currentStatus.muscle - previousStatus.muscle;

    // 목표 달성률 계산
    const goalWeight = 62.0;
    const initialWeight = statusHistory.length > 0 ? statusHistory[0].weight : currentStatus.weight;
    const progressPercent = Math.max(0, 100 - (((currentStatus.weight - goalWeight) / (initialWeight - goalWeight)) * 100));

    return (
        <div ref={wrapperRef} className="status-expanded-wrapper" onClick={onClose}>
            <div className="status-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="status-header">
                    <h2 className="status-title">나의 몸 상태</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="ai-briefing">
                    <p>
                        <strong>하루핏 매니저:</strong> 
                        최근 체중 변화가 꾸준히 나타나고 있네요! 그래프에 마우스를 올려 상세 수치를 확인해보세요.
                    </p>
                </div>

                {/* 차트와 목표 진행률 바를 함께 배치 */}
                <div className="chart-section">
                    <div className="chart-container">
                        <LineChart chartData={chartData} chartOptions={chartOptions} /> 
                        {/* 필요시 LineChat에 props로 이것들 추가hoveredData={hoveredData} setHoveredData={setHoveredData} */}
                    </div>
                     <div className="goal-status">
                        <div className="goal-text">
                            <span>목표: {goalWeight.toFixed(1)}kg</span>
                            <span>현재: {currentStatus.weight ? currentStatus.weight.toFixed(1) : '-'}kg</span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar-filled" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 핵심 지표를 보여주는 3개의 카드 */}
                <div className="stats-card-container">
                    <div className="stat-card">
                        <span className="stat-card-label">현재 체중</span>
                        <span className="stat-card-value">{currentStatus.weight ? currentStatus.weight.toFixed(1) : '-'} kg</span>
                        <span className="stat-card-change">{renderChange(weightChange, 'kg')}</span>
                    </div>
                     <div className="stat-card">
                        <span className="stat-card-label">체지방률</span>
                        <span className="stat-card-value">{currentStatus.bodyFat ? currentStatus.bodyFat.toFixed(1) : '-'} %</span>
                        <span className="stat-card-change">{renderChange(bodyFatChange, '%')}</span>
                    </div>
                     <div className="stat-card">
                        <span className="stat-card-label">골격근량</span>
                        <span className="stat-card-value">{currentStatus.muscle ? currentStatus.muscle.toFixed(1) : '-'} kg</span>
                        <span className="stat-card-change">{renderChange(muscleChange, 'kg')}</span>
                    </div>
                </div>
                
                {/* 다른 페이지와 통일된 버튼 */}
                 <div className="record-btn-container">
                    <button className="record-btn" onClick={onLogStatusToManager}>매니저에게 상태 기록하기</button>
                </div>
            </div>
        </div>
    );
};

export default StatusExpanded;