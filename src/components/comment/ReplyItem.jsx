import { useState } from "react";
import { deleteComment, updateComment } from "../../api/board";

const ReplyItem = ({ reply, currentUser, onReload, boardId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

    const handleUpdate = async () => {
        try {
            await updateComment({
                id: reply.id,
                boardId: boardId,
                username: reply.username,
                content: editContent,
                parentId: reply.parentId,
                depth: reply.depth,
            });
            setIsEditing(false);
            onReload?.();
        } catch (err) {
            alert("수정 실패");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("삭제하시겠습니까?")) {
            await deleteComment(reply.id);
            onReload?.();
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm text-sm border relative">
            <div className="flex justify-between gap-2 items-start">
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">{reply.username}</p>

                    {isEditing ? (
                        <>
                            <textarea
                                className="w-full border mt-1 rounded p-2 text-sm"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className="text-right mt-2 space-x-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-100"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="text-xs px-3 py-1 border border-blue-300 rounded-full text-blue-600 hover:bg-blue-50"
                                >
                                    저장
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-700 mt-1">{reply.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                {formatDate(reply.createAt)} · ❤️ {reply.likeCount}
                            </p>
                        </>
                    )}
                </div>

                {reply.username === currentUser && !isEditing && (
                    <div className="flex flex-col space-y-1">
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
        </div>
    );
};

export default ReplyItem;
