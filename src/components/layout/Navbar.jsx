import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Home } from "lucide-react";

const Navbar = () => {
    const { username, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (
        <header className="border-b shadow-sm bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* 로고/홈 */}
                <Link
                    to="/home"
                    className="text-xl font-bold flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition"
                >
                    <Home size={20} />
                    <span className="text-lg tracking-tight">MyBoard</span>
                </Link>

                {/* 사용자 정보 + 로그아웃 */}
                {isAuthenticated && (
                    <div className="flex items-center space-x-4 text-sm text-gray-700">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium shadow-sm">
                            {username}님
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                        >
                            <LogOut size={18} />
                            <span>로그아웃</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
