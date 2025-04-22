import { Link } from "react-router-dom";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const BoardItem = ({ post }) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition">
      <Link to={`/board/${post.boardId}`} className="block">
        <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
        <div className="text-sm text-gray-500 space-y-1 mt-1">
          <p>작성자: {post.username}</p>
          <p>작성일: {formatDate(post.createAt)}</p>
          <p>조회수: {post.views} | 좋아요: {post.likeCount}</p>
        </div>
      </Link>
    </div>
  );
};

export default BoardItem;
