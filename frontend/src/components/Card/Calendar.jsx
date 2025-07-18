import React from 'react';
import './Calendar.css';


export default function Calendar({  mode , onExpand  }) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 ~ 11
  const currentDate = today.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 이번 달 1일의 요일
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate(); // 마지막 날짜

  const dates = Array.from({ length: lastDateOfMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-card card-base">
      <div className={`card-header ${mode}-theme`}>
        <span>달력</span>
        <button className="expand-btn" onClick={onExpand}>▶</button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day-of-week">{day}</div>
        ))}

        {/* 이번 달 1일 전까지 빈칸 */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="empty-day"></div>
        ))}

        {/* 날짜 표시 */}
        {dates.map((date) => (
          <div
            key={date}
            className={`calendar-day ${date === currentDate ? 'selected today' : ''}`}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
}