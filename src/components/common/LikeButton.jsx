import { useState } from "react";

const LikeButton = ({ initialLiked = false, onToggle }) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleClick = async () => {
    try {
      const next = !liked;
      await onToggle(next); // 외부에 알림
      setLiked(next);
    } catch (err) {
      console.error("좋아요 실패", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-sm px-4 py-2 rounded text-white ${
        liked ? "bg-pink-600" : "bg-gray-400"
      }`}
    >
      {liked ? "❤️ 좋아요" : "🤍 좋아요"}
    </button>
  );
};

export default LikeButton;
