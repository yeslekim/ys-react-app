import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerAPI } from "../api/auth";

const RegisterForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAPI(form);
      alert("회원가입 성공! 로그인 해주세요.");
      navigate("/"); // 로그인 페이지로 이동
    } catch (err) {
      alert("회원가입 실패. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">회원가입</h2>
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
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        회원가입
      </button>
    </form>
  );
};

export default RegisterForm;
