// ⬅️ 특정 API 요청 함수들을 모아둔 'API 요청 함수 모음집'
// 이 파일은 이제 `useApi` 훅으로 처리하기 어려운 복합적인 API 로직이나
// 특정 컴포넌트 외부에서 호출해야 하는 유틸리티 함수들을 담는 곳으로 사용될 수 있습니다.

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from './constants'; 

// 1. 사용자 관리 API
// 사용자생성 (회원/닉네임설정) - useAuth에서 직접호출하므로여기서는유지하되사용지양
export const createOrLoginUser = async ({ nickname, pin, mode }) => {
  const response = await apiClient.post(API_ENDPOINTS.USERS, { nickname, pin, mode });
  return response.data;
};

// 사용자 정보 조회 (nickname, pin 기준)
export const getUserByNicknameAndPin = async (nickname, pin) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER_BY_NICKNAME_PIN(nickname, pin));
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 사용자 정보 업데이트
export const updateUserProfile = async (nickname, pin, profileData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.USER_BY_NICKNAME_PIN(nickname, pin), profileData);
    console.log('사용자 프로필 업데이트 성공:', response.data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 사용자 삭제
export const deleteUser = async (nickname, pin) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.USER_BY_NICKNAME_PIN(nickname, pin));
    return response.data;
  } catch (err) {
    throw err;
  }
};


// 2. 상태 관리 API
// 오늘 상태 정보 가져오기
export const fetchTodayStatus = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STATUS_TODAY);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 특정 날짜 상태 정보 조회
export const fetchStatusByDate = async (date) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STATUS_BY_DATE(date));
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 상태 기록 추가
export const addStatusEntry = async (statusData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.STATUS, statusData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 상태 기록 업데이트
export const updateStatusEntry = async (id, statusData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.STATUS_BY_ID(id), statusData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 상태 기록 삭제
export const deleteStatusEntry = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.STATUS_BY_ID(id));
    return response.data;
  } catch (err) {
    throw err;
  }
};


// 3. 운동 관리 API
// 오늘 운동 요약 가져오기
export const fetchTodayWorkout = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.WORKOUT_TODAY);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 특정 날짜 운동 기록 조회
export const fetchWorkoutByDate = async (date) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.WORKOUT_BY_DATE(date));
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 운동 기록 추가
export const addWorkoutEntry = async (workoutData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.WORKOUT, workoutData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 운동 기록 업데이트
export const updateWorkoutEntry = async (id, workoutData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.WORKOUT_BY_ID(id), workoutData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 운동 기록 삭제
export const deleteWorkoutEntry = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.WORKOUT_BY_ID(id));
    return response.data;
  } catch (err) {
    throw err;
  }
};


// 4. 식단 관리 API
// 오늘 식단 요약 가져오기
export const fetchTodayDiet = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DIET_TODAY);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 특정 날짜 식단 기록 조회
export const fetchDietByDate = async (date) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.DIET_BY_DATE(date));
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 식단 기록 추가
export const addDietEntry = async (dietData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.DIET, dietData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 식단 기록 업데이트
export const updateDietEntry = async (id, dietData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.DIET_BY_ID(id), dietData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 식단 기록 삭제
export const deleteDietEntry = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.DIET_BY_ID(id));
    return response.data;
  } catch (err) {
    throw err;
  }
};


// 5. 캘린더 관리 API
// 캘린더 전체 통계 불러오기
export const fetchCalendarStats = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CALENDAR_SUMMARY);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 특정 월 캘린더 데이터 조회
export const fetchCalendarByMonth = async (year, month) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CALENDAR_BY_MONTH(year, month));
    return response.data;
  } catch (err) {
    throw err;
  }
};


// 6. 목표 관리 API
// 목표 설정
export const setGoals = async (goalData) => { 
  // goalData에 nickname, pin, targetWeight, targetCalories 포함
  try {
    const response = await apiClient.post(API_ENDPOINTS.CALENDAR_GOAL, goalData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 목표 조회
export const fetchGoals = async (nickname, pin) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CALENDAR_GOAL_BY_NICKNAME_PIN(nickname, pin));
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 목표 업데이트
export const updateGoals = async (nickname, pin, updatedGoalData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.CALENDAR_GOAL_BY_NICKNAME_PIN(nickname, pin), updatedGoalData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 7. 매니저 채팅 API
// 채팅 메시지 전송
export const sendMessage = async (chatData) => {
  //chatData에 message, nickname, pin 포함
  try {
    // ✅ API_ENDPOINTS 사용
    const response = await apiClient.post(API_ENDPOINTS.CHAT, chatData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// 채팅 기록 조회
export const fetchChatHistory = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CHAT);
    return response.data;
  } catch (err) {
    throw err;
  }
};