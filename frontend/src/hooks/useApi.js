// ⬅️ 모든 API 호출을 간단하게 처리할 수 있도록 돕는 'API 호출 도우미' 훅.
// 모든 API 호출을 추상화하여 데이터 가져오기, 로딩 상태 관리, 에러 처리를 한 번에 할 수 있도록 도와주는 강력한 도구

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient'; // 우리가 만든 apiClient를 사용합니다.

/**
 * API 호출을 위한 커스텀 React 훅
 * 데이터를 가져오는 로딩, 에러 상태를 관리하고, 데이터를 반환합니다.
 *
 * @param {string} endpoint - API 요청을 보낼 엔드포인트 URL (예: '/workout/today')
 * @param {string} method - HTTP 요청 메서드 (기본값: 'get', 'post', 'put', 'delete' 등)
 * @param {Object|Array|null} initialData - 초기 데이터 값 (로딩 전에 보여줄 값)
 * @param {boolean} fetchImmediately - 컴포넌트 마운트 시 바로 API를 호출할지 여부 (기본값: true)
 * @returns {{data: any, loading: boolean, error: any, execute: Function, setData: Function}}
 * - data: API로부터 받은 데이터
 * - loading: API 호출 중인지 여부 (true면 로딩 중)
 * - error: API 호출 중 발생한 에러 객체
 * - execute: API 호출을 수동으로 실행하는 함수
 * - setData: 외부에서 데이터를 직접 업데이트할 수 있는 함수 (캐시 업데이트 등)
 */
const useApi = (endpoint, method = 'get', initialData = null, fetchImmediately = true) => {
  const [data, setData] = useState(initialData); // API로부터 받아올 데이터
  const [loading, setLoading] = useState(false); // API 호출 로딩 상태
  const [error, setError] = useState(null);       // API 호출 에러 상태

  // API 호출을 실행하는 함수 (POST, PUT 등 데이터가 필요한 경우 body와 params를 받음)
  const execute = useCallback(async (body = null, params = {}) => {
    setLoading(true); // API 호출 시작 시 로딩 상태를 true로 설정
    setError(null);   // 이전 에러 상태 초기화
    try {
      const config = { // Axios 요청 설정을 구성
        method: method,
        url: endpoint,
      };

      if (body && (method === 'post' || method === 'put' || method === 'patch')) {
        config.data = body; // POST/PUT/PATCH 요청 시 본문(body) 데이터 추가
      }
      if (Object.keys(params).length > 0 && method === 'get') {
        config.params = params; // GET 요청 시 쿼리 파라미터 추가
      }

      const response = await apiClient(config); // apiClient를 사용하여 API 호출
      setData(response.data); // 성공 시 받은 데이터를 상태에 저장
      return response.data;   // 호출한 곳으로 데이터 반환 (필요 시)
    } catch (err) {
      console.error(`[useApi] API 호출 실패 (${endpoint}):`, err);
      setError(err); // 에러 발생 시 에러 상태 저장
      // 에러를 다시 던져서 이 훅을 사용하는 컴포넌트에서도 try/catch로 처리할 수 있게 합니다.
      throw err;
    } finally {
      setLoading(false); // API 호출 완료 (성공/실패 무관) 시 로딩 상태를 false로 설정
    }
  }, [endpoint, method]); // endpoint나 method가 변경될 때만 execute 함수를 다시 생성합니다.

  // 컴포넌트가 마운트될 때 (fetchImmediately가 true인 경우) API를 자동으로 호출합니다.
  useEffect(() => {
    if (fetchImmediately) {
      execute(); // 인자 없이 호출 (주로 GET 요청에 사용)
    }
  }, [fetchImmediately, execute]); // fetchImmediately나 execute가 변경될 때만 useEffect를 실행합니다.

  // 훅을 사용하는 컴포넌트에서 필요한 값들을 반환합니다.
  return { data, loading, error, execute, setData };
};

export default useApi;