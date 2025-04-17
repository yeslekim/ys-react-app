import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async ({ username, password }) => {
  const response = await API.post("/login", { username, password });
  return response.data; // => { access_token, refresh_token }
};

export const register = async ({ username, password }) => {
const response = await API.post("/register", { username, password });
return response.data; // => { access_token, refresh_token }
};
