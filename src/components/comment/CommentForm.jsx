import { useState } from "react";

const CommentForm = ({ onSubmit, username, parentId = null, depth = 0 }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await onSubmit({ content, username, parentId, depth });
    setContent("");
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="w-full p-2 border rounded"
        rows={3}
      />
      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentForm;