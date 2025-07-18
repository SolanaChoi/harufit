// ⬅️ 앱 전반적으로 사용될 변하지 않는 값들(API 엔드포인트 url 경로 등)을 모아둔 '상수 저장소'

// ✅ API 엔드포인트 (URL 경로)를 여기에 모아둡니다.
export const API_ENDPOINTS = {
  // 1. 사용자 관리 API
  USERS: '/users', // POST: 사용자 생성, GET: 특정 사용자 조회 (이때는 /users/:nickname/:pin 조합)
  USER_BY_NICKNAME_PIN: (nickname, pin) => `/users/${nickname}/${pin}`, // GET, PUT, DELETE 용

  // 2. 상태 관리 API
  STATUS: '/status', // POST: 상태 기록 추가
  STATUS_TODAY: '/status/today', // GET: 오늘 상태 정보
  STATUS_BY_DATE: (date) => `/status/${date}`, // GET: 특정 날짜 상태 정보
  STATUS_BY_ID: (id) => `/status/${id}`, // PUT, DELETE 용

  // 3. 운동 관리 API
  WORKOUT: '/workout', // POST: 운동 기록 추가
  WORKOUT_TODAY: '/workout/today', // GET: 오늘 운동 요약 정보
  WORKOUT_BY_DATE: (date) => `/workout/${date}`, // GET: 특정 날짜 운동 기록
  WORKOUT_BY_ID: (id) => `/workout/${id}`, // PUT, DELETE 용

  // 4. 식단 관리 API
  DIET: '/diet', // POST: 식단 기록 추가
  DIET_TODAY: '/diet/today', // GET: 오늘 식단 요약 정보
  DIET_BY_DATE: (date) => `/diet/${date}`, // GET: 특정 날짜 식단 기록
  DIET_BY_ID: (id) => `/diet/${id}`, // PUT, DELETE 용

  // 5. 캘린더 관리 API
  CALENDAR_SUMMARY: '/calendar/summary', // GET: 캘린더 전체 통계
  CALENDAR_BY_MONTH: (year, month) => `/calendar/${year}/${month}`, // GET: 특정 월 캘린더 데이터

  // 6. 목표 관리 API
  CALENDAR_GOAL: '/calendarGoal', // POST: 목표 설정
  CALENDAR_GOAL_BY_NICKNAME_PIN: (nickname, pin) => `/calendarGoal/${nickname}/${pin}/goals`, // GET, PUT 용

  // 7. 매니저 채팅 API
  CHAT: '/chat', // POST: 채팅 메시지 전송, GET: 채팅 기록 조회
};


// ✅ 다른 상수들도 여기에 추가할 수 있습니다.
export const APP_CONFIG = {
  APP_NAME: '하루핏',
  DEFAULT_MODE: 'normal',
  // ...
};

// 예시: 모드 설명 (IndexPage에서 사용)
export const MODE_DESCRIPTIONS = {
  easy: "편안한 시작",
  normal: "꾸준한 관리",
  hard: "강력한 변화",
};

// 예시: 난이도 모드 색상 (IndexPage에서 사용)
export const DIFFICULTY_MODES_COLORS = {
  easy: "#C8E6C9",
  normal: "#E1BEE7",
  hard: "#FFCDD2",
};