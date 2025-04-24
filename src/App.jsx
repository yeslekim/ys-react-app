import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Home from "./components/Home";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/layout/Navbar";

import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import BoardWritePage from './pages/BoardWritePage';

import ChatFloating from './components/chat/ChatFloating'

import { useAuth } from "./context/AuthContext";
import { ChatSocketProvider } from "./context/ChatSocketContext";

export default function App() {
  const { username, isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />

      {/* WebSocket Provider: 로그인 시점부터 글로벌 연결 */}
      <ChatSocketProvider username={isAuthenticated ? username : null}>

        <Routes>
          {/* 로그인 관련 */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* 게시판 관련 */}
          <Route
            path="/board"
            element={
              <PrivateRoute>
                <BoardListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/board/:id"
            element={
              <PrivateRoute>
                <BoardDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/board/write"
            element={
              <PrivateRoute>
                <BoardWritePage />
              </PrivateRoute>
            }
          />

          <Route path="/board/edit/:id" element={<BoardWritePage isEdit />} />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* 채팅 플로팅 */}
        <ChatFloating />
      </ChatSocketProvider>
    </BrowserRouter>
  );
}
