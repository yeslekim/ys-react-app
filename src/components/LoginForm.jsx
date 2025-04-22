import { useState, useEffect } from "react";
import { login as loginAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login, resetToken } = useAuth(); // 여기서 login 함수 가져옴
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    resetToken();
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const tokens = await loginAPI(form);
      login(tokens, form.username); // AuthContext에 저장
      console.log("로그인 성공, AuthContext에 저장 완료!");
      navigate("/home");
    } catch (err) {
      alert("로그인 실패. 아이디 또는 비밀번호를 확인하세요.")
      console.error(err);
    }
  };

  return (
    <>
        <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg space-y-4"
        >
        <h2 className="text-2xl font-bold text-center">로그인</h2>

        <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border rounded"
        />

        <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
            로그인
        </button>
        </form>

        <div className="text-center">
            <p>
            계정이 없으신가요?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              회원가입
            </Link>
            </p>
        </div>
    </>
  );
};

export default LoginForm;
