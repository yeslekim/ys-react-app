// ChatFloating.jsx
import { useState, useEffect } from "react";
import ChatRoomModal from "./ChatRoomModal";
import { fetchChatRooms } from "../../api/chat";
import { useAuth } from "../../context/AuthContext";
import { useChatSocket } from "../../context/ChatSocketContext";

const ChatFloating = () => {
  const { username, isAuthenticated } = useAuth();
  const [openList, setOpenList] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  const {
    unreadMap,
    setUnreadMap,
    setActiveRoomId,
  } = useChatSocket();

  useEffect(() => {
    if (isAuthenticated) {
      fetchChatRooms({ username }).then((rooms) => {
        setChatRooms(rooms);
        // ✅ 초기 unreadMap 상태를 room에서 채워줌
        const initialUnread = {};
        rooms.forEach((room) => {
          if (room.unreadMessageCount && room.unreadMessageCount > 0) {
            initialUnread[room.id] = room.unreadMessageCount;
          }
        });
        setUnreadMap(initialUnread);
      });
    }
  }, [username, setUnreadMap]);

  const getRoomDisplayName = (room) => {
    if (room.group) return room.name;
    return room.participants.find((p) => p !== username);
  };

  if (!isAuthenticated) return null;

  // 전체 안읽은 메세지 수 계산산
  const unreadCount = Object.values(unreadMap).reduce(
    (acc, count) => acc + count,
    0
  );

  const openRoom = async (room) => {
    setActiveRoom(room);
    setActiveRoomId(room.id);
    setUnreadMap((prev) => {
      const copy = { ...prev };
      delete copy[room.id];
      return copy;
    });
  };

  const handleCloseRoom = async () => {
    setActiveRoom(null);
    setActiveRoomId(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 전체 안읽은 메시지 수 뱃지 */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}

      {/* 채팅 모달 */}
      {activeRoom && (
        <div className="absolute bottom-20 right-0">
          <ChatRoomModal
            roomId={activeRoom.id}
            roomName={getRoomDisplayName(activeRoom)}
            username={username}
            onClose={handleCloseRoom}
          />
        </div>
      )}

      {/* 채팅방 리스트 */}
      {openList && (
        <div className="absolute bottom-20 right-0 bg-white shadow-lg rounded-lg p-3 w-64">
          <p className="text-sm font-semibold text-gray-700 mb-2">💬 채팅방</p>
          <ul className="space-y-1">
            {chatRooms.map((room) => {
              const unread = unreadMap[room.id] || 0;
              return (
                <li key={room.id} className="relative">
                  <button
                    onClick={() => openRoom(room)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm text-gray-800 flex justify-between items-center"
                  >
                    <span>{getRoomDisplayName(room)}</span>
                    {unread > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 채팅 버튼 */}
      <button
        onClick={() => setOpenList((prev) => !prev)}
        className="bg-blue-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
      >
        💬
      </button>
    </div>
  );
};

export default ChatFloating;
