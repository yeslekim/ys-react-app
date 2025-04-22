import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import { fetchComments, deleteComment, updateComment } from "../../api/board";
import ReplyItem from "./ReplyItem";

const CommentItem = ({ comment, onReplySubmit, username, onDeleted, boardId }) => {
    const [showReply, setShowReply] = useState(false);
    const [childComments, setChildComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

    const loadReplies = async () => {
        const res = await fetchComments({
            boardId: boardId,
            parentId: comment.id,
            depth: 1,
        });
        setChildComments(res.content);
    };

    useEffect(() => {
        if (showReply && comment.hasChild) loadReplies();
    }, [showReply]);

    const handleDelete = async () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            await deleteComment(comment.id);
            if (typeof onDeleted === "function") onDeleted();
        }
    };

    const handleReplySubmit = async (replyData) => {
        await onReplySubmit(replyData);
        await loadReplies();
    };

    const handleUpdate = async () => {
        await updateComment({
            id: comment.id,
            boardId: boardId,
            username: comment.username,
            content: editContent,
            parentId: comment.parentId,
            depth: comment.depth,
        });
        setIsEditing(false);
        onDeleted?.();
    };

    return (
        <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-sm space-y-2">
            {/* 댓글 본문 */}
            <div className="relative">
                <p className="text-sm font-semibold text-gray-800">{comment.username}</p>

                {isEditing ? (
                    <div className="mt-1">
                        <textarea
                            className="w-full border rounded p-2 text-sm"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="text-right mt-1 space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1 text-xs border rounded-full text-gray-500 hover:bg-gray-100"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-3 py-1 text-xs border rounded-full text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{comment.content}</p>
                )}

                {/* 수정/삭제 버튼 (댓글 작성자만) */}
                {comment.username === username && !isEditing && (
                    <div className="absolute top-0 right-0 space-x-1">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-2 py-1 text-xs border border-gray-300 text-gray-500 rounded-full hover:bg-blue-50 hover:text-blue-600"
                        >
                            ✏ 수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-2 py-1 text-xs border border-gray-300 text-red-500 rounded-full hover:bg-red-50"
                        >
                            🗑 삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 메타 정보 + 답글 보기/쓰기 */}
            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatDate(comment.createAt)} · ❤️ {comment.likeCount}</span>
                <button
                    onClick={() => setShowReply(!showReply)}
                    className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
                >
                    {comment.hasChild
                        ? showReply
                            ? "답글 숨기기"
                            : "답글 보기"
                        : showReply
                            ? "취소"
                            : "답글 쓰기"}
                </button>
            </div>

            {/* 답글 영역 */}
            {showReply && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                    {childComments.map((reply) => (
                        <ReplyItem
                            key={reply.id}
                            reply={reply}
                            currentUser={username}
                            onReload={loadReplies}
                            boardId={boardId}
                        />
                    ))}

                    {/* 대댓글 작성폼 */}
                    <CommentForm
                        username={username}
                        parentId={comment.id}
                        depth={1}
                        onSubmit={handleReplySubmit}
                    />
                </div>
            )}
        </div>

    );
};

export default CommentItem;
