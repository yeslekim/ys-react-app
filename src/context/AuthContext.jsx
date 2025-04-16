import { createContext, useContext, useState, useEffect } from "react";

// 로그인 시 토큰과 사용자 정보 저장
// 앱 전역에서 로그인 상태 공유
// 로그아웃도 함께 처리

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 시작 시 localStorage에서 토큰 로드
  useEffect(() => {
    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setIsAuthenticated(true);
    }
  }, []);

  const login = ({ access_token, refresh_token }) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 사용하게 export
export const useAuth = () => useContext(AuthContext);
