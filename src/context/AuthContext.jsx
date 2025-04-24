import { createContext, useContext, useState, useEffect } from "react";

// 로그인 시 토큰과 사용자 정보 저장
// 앱 전역에서 로그인 상태 공유
// 로그아웃도 함께 처리

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [username, setUserName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 localStorage에서 토큰 로드
  useEffect(() => {
    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");
    const username = localStorage.getItem("user_name");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setUserName(username);
      setIsAuthenticated(true);
    }

    setIsLoading(false);  // 로딩 끝
  }, []);

  const login = ({ accessToken, refreshToken }, username) => {
    
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_name", username);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUserName(username);
    setIsAuthenticated(true);
  };

  const logout = () => {
    resetToken();
  };

  const resetToken = () => {
    console.log("reset Token.")
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_name");
    setAccessToken(null);
    setRefreshToken(null);
    setUserName(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        username,
        isAuthenticated,
        isLoading,
        login,
        logout,
        resetToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 사용하게 export
export const useAuth = () => useContext(AuthContext);
