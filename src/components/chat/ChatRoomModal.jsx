import { useEffect, useRef } from "react";
import { updateLastReadMessageId } from "../../api/chat";
import ChatComponent from "./ChatComponent";

const ChatRoomModal = ({ roomId, roomName, username, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="fixed bottom-20 right-4 w-80 bg-white shadow-xl rounded-xl p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <p className="font-semibold text-gray-800">{roomName}</p>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-red-500">
          ✖
        </button>
      </div>

      <ChatComponent
        roomId={roomId}
        username={username}
        onCleanup={(latestId) => {
          updateLastReadMessageId({ roomId, username, messageId: latestId });
        }} />
    </div>
  );
};

export default ChatRoomModal;
