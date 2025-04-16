import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-4">
      <h1 className="text-3xl font-bold">홈페이지</h1>
      <p>로그인된 사용자만 볼 수 있는 페이지입니다.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        로그아웃
      </button>
    </div>
  );
};

export default Home;
