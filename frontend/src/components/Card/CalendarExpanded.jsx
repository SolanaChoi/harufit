import React, { useState, useEffect, useRef } from 'react';
import './CalendarExpanded.css';

// 주간 요약 계산을 위한 상세 데이터
const mockDetailedData = {
    // 7월 2주차 (6일 ~ 12일) 데이터
    '7/6': { 
        diet: [ { meal: '점심', menu: '가족 식사', calories: 1800 } ], 
        workout: [], 
        weight: 75.0 
    },
    '7/7': { 
        diet: [
            { meal: '아침', menu: '오트밀과 과일', calories: 400 },
            { meal: '점심', menu: '회사 일반식', calories: 850 },
            { meal: '저녁', menu: '단백질 쉐이크', calories: 250 },
        ], 
        workout: [
            { exercise: '달리기', duration: 30, intensity: '중' },
            { exercise: '복근 운동', duration: 15, intensity: '상' },
        ], 
        weight: 74.9 
    },
    '7/8': { 
        diet: [
            { meal: '점심', menu: '서브웨이 클럽 샌드위치', calories: 480 },
            { meal: '저녁', menu: '두부 김치', calories: 400 },
        ], 
        workout: [
            { exercise: '사이클', duration: 45, intensity: '중' },
        ] 
    },
    '7/9': { 
        diet: [
            { meal: '저녁', menu: '치킨과 맥주', calories: 2100 }
        ], 
        workout: [], 
        weight: 75.2 
    },
    '7/10': {
        diet: [ 
            { meal: '아침', menu: '프로틴 쉐이크', calories: 150 }, 
            { meal: '점심', menu: '일반식', calories: 750 }, 
            { meal: '저녁', menu: '샐러드', calories: 300 }, 
        ],
        workout: [ 
            { exercise: '데드리프트', weight: 120, sets: 5, reps: 5 },
            { exercise: '풀업', weight: 0, sets: 5, reps: 8 },
        ],
        weight: 74.8
    },
    '7/11': { 
        diet: [
            { meal: '아침', menu: '건너뜀', calories: 0 },
            { meal: '점심', menu: '김치찌개', calories: 600 },
        ],
        workout: [
            { exercise: '어깨 운동 루틴', duration: 50, intensity: '상' },
        ], 
        weight: 74.7 
    },
    '7/12': { 
        diet: [], 
        workout: [], 
        weight: 74.6 
    },
};

const CalendarExpanded = ({ onClose }) => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-07-01'));
    const [selectedDate, setSelectedDate] = useState(10);
    const [dayDetails, setDayDetails] = useState(mockDetailedData['7/10']);
    const [summaryData, setSummaryData] = useState({ workoutTime: 0, avgCalories: 0, weightChange: 0 });

    const wrapperRef = useRef(null);

    useEffect(() => {
        const getWeek = (date) => {
            const dayOfWeek = date.getDay();
            const sunday = new Date(date);
            sunday.setDate(date.getDate() - dayOfWeek);
            const week = [];
            for (let i = 0; i < 7; i++) {
                const day = new Date(sunday);
                day.setDate(sunday.getDate() + i);
                week.push(day);
            }
            return week;
        };

        const calculateSummary = () => {
            const targetDate = selectedDate ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate) : currentDate;
            const week = getWeek(targetDate);
            
            let totalMinutes = 0;
            let totalCalories = 0;
            let dietDays = 0;
            let startWeight = null;
            let endWeight = null;

            for (const day of week) {
                const key = `${day.getMonth() + 1}/${day.getDate()}`;
                if (mockDetailedData[key]?.weight) {
                    if (startWeight === null) startWeight = mockDetailedData[key].weight;
                    endWeight = mockDetailedData[key].weight;
                }
            }
            
            week.forEach(day => {
                const key = `${day.getMonth() + 1}/${day.getDate()}`;
                const data = mockDetailedData[key];
                if (data) {
                    if (data.workout) data.workout.forEach(w => totalMinutes += (w.duration || 0));
                    if (data.diet && data.diet.length > 0) {
                        let dayCal = 0;
                        data.diet.forEach(d => dayCal += (d.calories || 0));
                        if (dayCal > 0) {
                            totalCalories += dayCal;
                            dietDays++;
                        }
                    }
                }
            });

            setSummaryData({
                workoutTime: totalMinutes,
                avgCalories: dietDays > 0 ? Math.round(totalCalories / dietDays) : 0,
                weightChange: (startWeight && endWeight && startWeight !== endWeight) ? (endWeight - startWeight).toFixed(1) : 0,
            });
        };

        calculateSummary();
    }, [selectedDate, currentDate]);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (wrapperRef.current) wrapperRef.current.classList.add('active');
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const days = ['일', '월', '화', '수', '목', '금', '토'];

    const handleMonthChange = (offset) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
        setSelectedDate(null);
        setDayDetails(null);
    };

    const handleDateClick = (date) => {
        if (!date) return;
        setSelectedDate(date);
        const key = `${currentDate.getMonth() + 1}/${date}`;
        setDayDetails(mockDetailedData[key] || null);
    };
    
    const generateCalendarWeeks = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const daysArray = [];
        for (let i = 0; i < firstDay; i++) daysArray.push(null);
        for (let i = 1; i <= lastDate; i++) daysArray.push(i);
        while (daysArray.length < 42) daysArray.push(null);
        const weeks = [];
        for (let i = 0; i < daysArray.length; i += 7) {
            weeks.push(daysArray.slice(i, i + 7));
        }
        return weeks;
    };

    const weeks = generateCalendarWeeks();

    const getDayCell = (date) => {
        if (!date) return <div className="calendar-cell empty"></div>;
        const key = `${currentDate.getMonth() + 1}/${date}`;
        const hasData = mockDetailedData[key];
        return (
            <div
                className={`calendar-cell ${selectedDate === date ? 'selected' : ''}`}
                key={date}
                onClick={() => handleDateClick(date)}
            >
                <div className="date-number">{date}</div>
                <div className="icon-container">
                    {hasData?.workout?.length > 0 && <div className="icon purple" />}
                    {hasData?.diet?.length > 0 && <div className="icon green" />}
                </div>
            </div>
        );
    };

    return (
        <div ref={wrapperRef} className="calendar-expanded-wrapper">
            <div className="main-content">
                <div className="calendar-expanded">
                    <div className="calendar-header">
                        <span className="nav-icon" onClick={() => handleMonthChange(-1)}>◀</span>
                        <span className="month-title">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</span>
                        <span className="nav-icon" onClick={() => handleMonthChange(1)}>▶</span>
                    </div>
                    <div className="calendar-grid">
                        {days.map((day) => <div className="day-header" key={day}>{day}</div>)}
                        {weeks.map((week, i) => week.map((date, j) => <React.Fragment key={`${i}-${j}`}>{getDayCell(date)}</React.Fragment>))}
                    </div>
                    
                    <div className="calendar-summary">
                        <div className="box workout">
                            <span className="label">총 운동 시간 (주간)</span>
                            <strong className='strong'>{Math.floor(summaryData.workoutTime / 60)}시간 {summaryData.workoutTime % 60}분</strong>
                            <span className="stat workout">-70분</span>
                        </div>
                        <div className="box calorie">
                            <span className="label">평균 칼로리 (일간)</span>
                            <strong className='strong'>{summaryData.avgCalories} Kcal</strong>
                            <span className="stat calorie">-187 Kcal</span>
                        </div>
                        <div className="box weight">
                            <span className="label">체중 변화 (주간)</span>
                            <strong className='strong'>{summaryData.weightChange} kg</strong>
                            <span className="stat weight">감량 중!</span>
                        </div>
                    </div>
                </div>
                <div className="details-pane">
                    {selectedDate ? (
                        <>
                            <h3 className="details-header">{currentDate.getMonth() + 1}월 {selectedDate}일 기록</h3>
                            {dayDetails ? (
                                <div className="details-content">
                                    <div className="detail-section">
                                        <h4>식단</h4>
                                        {dayDetails.diet.length > 0 ? (<ul>{dayDetails.diet.map((item, i) => <li key={i}>{item.meal ? `${item.meal}: ` : ''}{item.menu || ''} ({item.calories || 0} Kcal)</li>)}</ul>) : <p>기록된 식단이 없습니다.</p>}
                                    </div>
                                    <div className="detail-section">
                                        <h4>운동</h4>
                                        {dayDetails.workout.length > 0 ? (<ul>{dayDetails.workout.map((item, i) => <li key={i}>{item.exercise}{item.duration ? `: ${item.duration}분` : `: ${item.weight}kg / ${item.sets}세트 / ${item.reps}회`}</li>)}</ul>) : <p>기록된 운동이 없습니다.</p>}
                                    </div>
                                </div>
                            ) : <p className="no-data-message">이 날짜에는 기록이 없습니다.</p>}
                        </>
                    ) : <div className="no-data-message">날짜를 선택하여 상세 기록을 확인하세요.</div> }
                </div>
            </div>
        </div>
    );
};
export default CalendarExpanded;