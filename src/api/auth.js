import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token"); // 여기서 토큰 가져옴
    if (accessToken && accessToken !== "undefined") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;


export const login = async ({ username, password }) => {
  const response = await API.post("/login", { username, password });
  return response.data; // => { access_token, refresh_token }
};

export const register = async ({ username, password }) => {
const response = await API.post("/register", { username, password });
return response.data; // => { access_token, refresh_token }
};
