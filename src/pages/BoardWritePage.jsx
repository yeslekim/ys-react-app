import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createBoard, fetchBoardDetail, updateBoard } from "../api/board";
import { useNavigate, useParams } from "react-router-dom";

const BoardWritePage = ({ isEdit = false }) => {
    const [form, setForm] = useState({ title: "", content: "" });
    const navigate = useNavigate();
    const { username } = useAuth();
    const { id } = useParams(); // 게시글 ID

    useEffect(() => {
        if (isEdit && id) {
            fetchBoardDetail(id).then((data) =>
                setForm({ title: data.title, content: data.content })
            );
        }
    }, [isEdit, id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            let result = false;
            if (isEdit) {
                result = await updateBoard({ id, ...form, username });
                console.log(result);
            } else {
                result = await createBoard({ ...form, username });
            }

            if (result === true) {
                if (isEdit) {
                    alert("수정 완료!");
                    navigate(`/board/${id}`);
                } else {
                    alert("게시글이 작성되었습니다.");
                    navigate("/board"); // 목록 페이지로 이동
                }
            } else {
                alert("게시글 작성에 실패했습니다.");
            }
        } catch (err) {
            console.error("작성 실패", err);
            alert("게시글 작성에 실패했습니다.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                {isEdit ? "✏️ 게시글 수정" : "📝 새 게시글 작성"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 제목 */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                    </label>
                    <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="제목을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* 내용 */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        내용
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="내용을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm min-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-full text-gray-500 hover:bg-gray-100"
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow transition"
                    >
                        {isEdit ? "수정 완료" : "작성 완료"}
                    </button>
                </div>
            </form>
        </div>

    );
};

export default BoardWritePage;
