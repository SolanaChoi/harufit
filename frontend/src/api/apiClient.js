import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const userNickname = localStorage.getItem('userNickname');
    const userPin = localStorage.getItem('userPin');

    if (userNickname && userPin) {
      // ✅ 한글 닉네임을 헤더에 넣기 전에 인코딩합니다.
      config.headers['x-user-nickname'] = encodeURIComponent(userNickname);
      config.headers['x-user-pin'] = userPin;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.request || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;