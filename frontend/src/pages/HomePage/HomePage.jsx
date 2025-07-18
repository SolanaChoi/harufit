"use client"

import { useState } from "react"
import { useLocation } from "react-router-dom"
import "./HomePage.css"
import StatusCard from "../../components/Card/StatusCard.jsx"
import DietCard from "../../components/Card/DietCard.jsx"
import WorkoutCard from "../../components/Card/WorkoutCard.jsx"
import Calendar from "../../components/Card/Calendar.jsx"
import ManagerChat from "../../components/Card/ManagerChat.jsx"
import CalendarExpanded from "../../components/Card/CalendarExpanded.jsx";
import StatusExpanded from "../../components/Card/StatusExpanded.jsx"
import WorkoutExpanded from "../../components/Card/WorkoutExpanded.jsx"
import DietExpanded from "../../components/Card/DietExpanded.jsx"
import AboutUsExpanded from "../../components/Card/AboutUsExpanded.jsx"

import useAuth from '../../hooks/useAuth';
// ✅ 실제 API 호출 관련 코드는 주석 처리합니다.
import useApi from '../../hooks/useApi';
import { API_ENDPOINTS } from '../../utils/constants';

export default function HomePage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialMode = queryParams.get("mode") || "normal"
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const { nickname } = useAuth(); // mode는 selectedMode로 대체 사용

  const [isCalendarExpanded, setCalendarExpanded] = useState(false);
  const [isStatusExpanded, setStatusExpanded] = useState(false);
  const [isWorkoutExpanded, setWorkoutExpanded] = useState(false);
  const [isDietExpanded, setDietExpanded] = useState(false);
  const [isAboutExpanded, setAboutExpanded] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("AboutUs")


  // ManagerChat에 포커스 여부 제어하는 상태, 숫자 변경하여 useEffect 트리거로 ManagerChat 반응
  const [triggerChatFocus, setTriggerChatFocus] = useState(0);
  // 어떤 모달에서 ManagerChat을 트리거했는지 (초기 메시지 설정을 위함)
  const [chatTriggerSource, setChatTriggerSource] = useState(null); // 'diet', 'workout', 'status'

  const { data: statusData, loading: statusLoading, error: statusError } = useApi(API_ENDPOINTS.STATUS_TODAY);
  const { data: dietData, loading: dietLoading, error: dietError } = useApi(API_ENDPOINTS.DIET_TODAY);
  const { data: workoutData, loading: workoutLoading, error: workoutError } = useApi(API_ENDPOINTS.WORKOUT_TODAY);
  const { data: calendarData, loading: calendarLoading, error: calendarError } = useApi(API_ENDPOINTS.CALENDAR_SUMMARY);

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem)
    console.log(`Selected menu: ${menuItem}`)
  }

  // 식단 기록 매니저에게 보내는 함수
  const handleLogDietToManager = () => {
    setDietExpanded(false); // 모달 닫기
    setChatTriggerSource('diet'); // 식단 기록임을 알림
    setTriggerChatFocus(prev => prev + 1); // ManagerChat에 포커스 요청 트리거
  };

  // 운동 기록 매니저에게 보내는 함수
  const handleLogWorkoutToManager = () => {
    setWorkoutExpanded(false);
    setChatTriggerSource('workout');
    setTriggerChatFocus(prev => prev + 1);
    console.log('HomePage: handleLogWorkoutToManager 호출됨. chatTriggerSource:', 'workout', 'triggerChatFocus (다음 값):', triggerChatFocus + 1);
  };

  // 상태 기록 매니저에게 보내는 함수
  const handleLogStatusToManager = () => {
    setStatusExpanded(false);
    setChatTriggerSource('status');
    setTriggerChatFocus(prev => prev + 1);
    console.log('HomePage: handleLogStatusToManager 호출됨. chatTriggerSource:', 'status', 'triggerChatFocus (다음 값):', triggerChatFocus + 1);
  };

  // ✅ [수정] 가짜 데이터(mockData) 객체를 삭제했습니다.

  // ✅ [수정] API 로딩 및 에러 상태를 처리합니다.
  const isLoading = statusLoading || dietLoading || workoutLoading || calendarLoading;
  const hasError = statusError || dietError || workoutError || calendarError;

  if (isLoading) {
    // 실제 앱에서는 이곳에 로딩 스피너 컴포넌트를 넣으면 좋습니다.
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  if (hasError) {
    // 실제 앱에서는 더 친절한 에러 안내 페이지를 보여줄 수 있습니다.
    return <div>데이터를 불러오는 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.</div>;
  }



  return (
    <div className={`homepage-container ${selectedMode}-theme`}>
      <div className="background-image"></div>
      {/* <h1 className="logo">하루핏로고 추후 추가</h1> */}
      <div className="user-info">
        <p>환영합니다, {nickname}님!</p>
        <p>모드: {selectedMode}</p>
      </div>
      <div className="mode-buttons">
        <button className={`mode-btn ${selectedMode === "easy" ? "mode-easy" : "mode-inactive"}`} onClick={() => setSelectedMode("easy")}> EASY</button>
        <button className={`mode-btn ${selectedMode === "normal" ? "mode-normal" : "mode-inactive"}`} onClick={() => setSelectedMode("normal")}> NORMAL</button>
        <button className={`mode-btn ${selectedMode === "hard" ? "mode-hard" : "mode-inactive"}`} onClick={() => setSelectedMode("hard")}>HARD</button>
      </div>
      <nav className="sidebar-menu">
        <ul className="menu-list">

          <li className={activeMenuItem === "AboutUs" ? "active" : ""}
            onClick={() => {
              handleMenuClick("AboutUs")
              setAboutExpanded(true);
            }}>
            About Us
          </li>
          <li className={activeMenuItem === "calendar" ? "active" : ""}
            onClick={() => {
              handleMenuClick("calendar");
              setCalendarExpanded(true);
            }}>
            달력
          </li>
          <li className={activeMenuItem === "status" ? "active" : ""} onClick={() => { handleMenuClick("status"); setStatusExpanded(true); }}>
            상태
          </li>
          <li className={activeMenuItem === "diet" ? "active" : ""} onClick={() => { handleMenuClick("diet"); setDietExpanded(true); }}>
            식단
          </li>
          <li className={activeMenuItem === "workout" ? "active" : ""} onClick={() => { handleMenuClick("workout"); setWorkoutExpanded(true); }}>
            운동
          </li>
        </ul>
      </nav>
      <div className="main-cards-area">
        {/* ✅ [수정] 각 카드에 mockData 대신 실제 API 데이터를 props로 전달합니다. */}
        <div className="card-wrapper top-left">
          <Calendar mode={selectedMode} data={calendarData} onExpand={() => setCalendarExpanded(true)} />
        </div>
        <div className="card-wrapper top-right">
          <StatusCard mode={selectedMode} data={statusData} onExpand={() => setStatusExpanded(true)} />
        </div>
        <div className="card-wrapper bottom-left">
          <DietCard mode={selectedMode} data={dietData} onExpand={() => setDietExpanded(true)} />
        </div>
        <div className="card-wrapper bottom-right">
          <WorkoutCard mode={selectedMode} data={workoutData} onExpand={() => setWorkoutExpanded(true)} />
        </div>
      </div>

      {isAboutExpanded && (
        <div className="modal-backdrop" onClick={() => setAboutExpanded(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AboutUsExpanded onClose={() => setAboutExpanded(false)} />
          </div>
        </div>
      )}

      {isCalendarExpanded && (
        <div className="modal-backdrop" onClick={() => setCalendarExpanded(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CalendarExpanded onClose={() => setCalendarExpanded(false)} />
          </div>
        </div>
      )}
      {isStatusExpanded && (
        <div className="modal-backdrop" onClick={() => setStatusExpanded(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <StatusExpanded onClose={() => setStatusExpanded(false)} onLogStatusToManager={handleLogStatusToManager} />
          </div>
        </div>
      )}
      {isDietExpanded && (
        <div className="modal-backdrop" onClick={() => setDietExpanded(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DietExpanded onClose={() => setDietExpanded(false)} onLogDietToManager={handleLogDietToManager} />
          </div>
        </div>
      )}
      {isWorkoutExpanded && (
        <div className="modal-backdrop" onClick={() => setWorkoutExpanded(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <WorkoutExpanded onClose={() => setWorkoutExpanded(false)} onLogWorkoutToManager={handleLogWorkoutToManager} />
          </div>
        </div>
      )}

      <div className="chat-area">
        <ManagerChat mode={selectedMode} shouldFocusInput={triggerChatFocus} triggerSource={chatTriggerSource} />
      </div>
    </div>
  )
}
