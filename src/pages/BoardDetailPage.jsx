import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    fetchBoardDetail,
    increaseViewCount,
    toggleLike,
    fetchComments,
    createComment,
    deleteBoard,
} from "../api/board";
import LikeButton from "../components/common/LikeButton";

import CommentList from "../components/comment/CommentList";
import CommentForm from "../components/comment/CommentForm";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const BoardDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const { username } = useAuth();

    // ✅ 게시글 정보 불러오기
    const load = async () => {
        try {
            console.log("현재 로그인 사용자: ", username)
            const data = await fetchBoardDetail(id);
            setPost(data);
        } catch (err) {
            console.error("게시글 조회 실패:", err);
        }
    };

    const loadComments = async () => {
        try {
            const data = await fetchComments({ boardId: id, depth: 0 });
            setComments(data.content);
        } catch (err) {
            console.error("댓글 로딩 실패", err);
        }
    };

    // ✅ 조회수 증가 + 데이터 로드
    useEffect(() => {
        const increaseAndLoad = async () => {
            try {
                await increaseViewCount(id);
                await load();
                loadComments();    // 댓글 로딩
            } catch (err) {
                console.error("조회수 증가 실패:", err);
            }
        };

        increaseAndLoad();
    }, [id]);

    if (!post) {
        return <p className="text-center mt-20 text-gray-500">게시글을 불러오는 중입니다...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6">

            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div>
                        <p className="font-semibold text-gray-900">{post.username}</p>
                        <p className="text-xs text-gray-500">{formatDate(post.createAt)}</p>
                    </div>
                </div>

                {/* 작성자만 수정/삭제 */}
                {username === post.username && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate(`/board/edit/${id}`)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                            ✏️ 수정
                        </button>
                        <button
                            onClick={async () => {
                                if (window.confirm("게시글을 삭제하시겠습니까?")) {
                                    await deleteBoard(id);
                                    alert("삭제 완료");
                                    navigate("/board");
                                }
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-full hover:bg-red-50 hover:text-red-600 transition"
                        >
                            🗑 삭제
                        </button>
                    </div>
                )}

            </div>

            {/* 본문 */}
            <div className="space-y-4">
                <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </p>
            </div>

            {/* 하단 정보 */}
            <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                <span>👁 {post.views} · ❤️ {post.likeCount}</span>

                <LikeButton
                    onToggle={async (like) => {
                        await toggleLike(Number(id), like);
                        await load();
                    }}
                />
            </div>

            {/* 목록으로 */}
            <div className="text-right">
                <button
                    onClick={() => navigate("/board")}
                    className="text-sm text-gray-400 hover:text-black"
                >
                    ← 목록으로
                </button>
            </div>

            {/* 댓글 */}
            <div className="border-t pt-6 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800">댓글 작성</h2>
                    <CommentForm
                        username={username}
                        onSubmit={async ({ content, username, parentId, depth }) => {
                            await createComment({
                                boardId: id,
                                username,
                                content,
                                parentId,
                                depth,
                            });
                            await loadComments();
                        }}
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">댓글</h2>
                    <CommentList
                        comments={comments}
                        onReplySubmit={async ({ content, username, parentId, depth }) => {
                            await createComment({ boardId: id, content, username, parentId, depth });
                            await loadComments();
                        }}
                        username={username}
                        loadComments={loadComments}
                        boardId={id}
                    />
                </div>
            </div>
        </div>


    );
};

export default BoardDetailPage;
