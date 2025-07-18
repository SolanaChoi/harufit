// ⬅️사용자 인증(로그인, 로그아웃) 관련 상태를 관리하는 '인증 담당관' 훅.
// login함수가 백엔드 API를 호출하고, 성공 여부를 반환하여 컴포넌트에서 로그인 성공 시 홈페이지로 이동하는 등의 로직 처리

import { useState, useEffect, useCallback  } from 'react';
import apiClient from '../api/apiClient'

export default function useAuth() {
  const [nickname, setNickname] = useState(() => localStorage.getItem('userNickname') || '');
  const [pin, setPin] = useState(() => localStorage.getItem('userPin') || '');
  const [mode, setMode] = useState(() => localStorage.getItem('userMode') || 'normal');

  // 사용자가 인증되었는지(로그인 상태인지) 여부를 나타내는 상태
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userNickname'));

  // 로그인 함수: 백엔드 API를 호출하여 실제 로그인을 시도합니다.
  const login = useCallback(async (inputNickname, inputPin, inputMode = 'normal') => {
    try {
      // apiClient를 사용하여 백엔드의 '/users' 엔드포인트로 POST 요청을 보냅니다.
      // 이 요청은 사용자 생성 또는 로그인을 처리합니다.
      const response = await apiClient.post('/users', {
        nickname: inputNickname,
        pin: inputPin,
        mode: inputMode
      });

      // 요청 성공 시, 백엔드로부터 받은 사용자 정보를 로컬 스토리지에 저장합니다.
      // (예상 응답: { nickname, mode, ... })
      const { nickname: resNickname, mode: resMode } = response.data;
      localStorage.setItem('userNickname', resNickname);
      localStorage.setItem('userPin', inputPin); // PIN은 보안상 서버에서 직접 반환하지 않는 경우가 많으므로 입력값 사용
      localStorage.setItem('userMode', resMode);

      // 리액트 상태도 업데이트하여 컴포넌트들이 변경된 정보 바로 알 수 있게 함.
      setNickname(resNickname);
      setPin(inputPin);
      setMode(resMode);
      setIsAuthenticated(true); // 로그인 성공했으므로 인증상태 true로 변경

      return { success: true, message: '로그인 성공!' };
    } catch (error) {
      // API 호출 중 에러 발생 시 처리
      console.error('로그인/회원가입 실패:', error);
      setIsAuthenticated(false); // 로그인 실패했으므로 인증 상태를 false로 유지

      // 백엔드에서 보낸 에러 메시지가 있다면 그걸 사용하고, 없으면 기본 메시지 반환
      return {
        success: false,
        message: error.response?.data?.message || '로그인 또는 회원가입에 실패했습니다.'
      };
    }
  }, []); // useCallback의 의존성 배열이 비어있어, 이 함수는 컴포넌트 마운트시 한번만 생성.

  // 로그아웃 함수: 로컬스토리지에서 사용자 정보를 제거하고 UI상태를 초기화.
  const logout = useCallback(() => {
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userPin');
    localStorage.removeItem('userMode');

    setNickname('');
    setPin('');
    setMode('normal');
    setIsAuthenticated(false); // 로그아웃했으므로 인증 상태를 false로 
  }, []);

  // 이 훅을 사용하는 컴포넌트에서 접근할 수 있는 값과 함수들을 반환.
  return {
    nickname,
    pin,
    mode,
    login, // 이제 백엔드와 통신하는 로그인 함수
    logout,
    isAuthenticated, // 사용자가 로그인했는지 여부
    setMode // HomePage에서 모드 변경 시 사용
  };
}
