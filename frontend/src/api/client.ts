import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Sanctum SPA 인증용
});

// 요청 인터셉터 - CSRF 토큰
apiClient.interceptors.request.use(async (config) => {
  if (config.method !== 'get' && config.method !== 'head') {
    await axios.get('/sanctum/csrf-cookie');
  }
  return config;
});

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
