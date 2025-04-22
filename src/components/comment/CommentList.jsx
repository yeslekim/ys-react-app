import CommentItem from "./CommentItem";

const CommentList = ({ comments, onReplySubmit, username, loadComments, boardId }) => {
  if (!comments.length) {
    return <p className="text-center text-gray-500 py-4">댓글이 없습니다.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow divide-y">
       {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          onReplySubmit={onReplySubmit}
          username={username}
          onDeleted={loadComments}
          boardId={boardId}
        />
      ))}
    </div>
  );
};

export default CommentList;