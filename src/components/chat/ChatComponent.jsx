import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchChatMessages, getLastReadMessageId } from "../../api/chat";
import { useChatSocket } from "../../context/ChatSocketContext";

const socketUrl = import.meta.env.VITE_API_CHAT_URL + "/ws/chat";

const ChatComponent = ({ roomId, username, onCleanup }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showUnreadMarker, setShowUnreadMarker] = useState(false);
  const [unreadMarkerEvaluated, setUnreadMarkerEvaluated] = useState(false);  // 진입시에만 읽은 위치 표기하기 위한 변수
  const latestMessageIdRef = useRef(null);
  const { setLastReadMap, lastReadMap } = useChatSocket();
  const containerRef = useRef(null);
  const stompClientRef = useRef(null);
  const bottomRef = useRef(null);
  const firstUnreadRef = useRef(null);

  const lastReadMessageId = lastReadMap?.[roomId] ?? null;

  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    setShowUnreadMarker(false);
    setUnreadMarkerEvaluated(false);

    const init = async () => {
      const data = await fetchChatMessages({ roomId, page: 0 });
      const reversed = data.content.reverse();
      setMessages(reversed);
      setHasMore(!data.last);

      if (reversed.length > 0) {
        latestMessageIdRef.current = reversed[reversed.length - 1].id;
      }
    };

    init();

    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("✅ Connected");
        stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
          const payload = JSON.parse(message.body);
          setMessages((prev) => {
            latestMessageIdRef.current = payload.id;
            return [...prev, payload];
          });
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      const latestId = latestMessageIdRef.current;
      if (latestId && onCleanup) {
        onCleanup(latestId); // 상위로 콜백
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (unreadMarkerEvaluated  || lastReadMessageId === null || messages.length === 0) return;
    const unreadStartIndex = messages.findIndex((msg) => msg.id > lastReadMessageId);
    const unreadMessageCount = unreadStartIndex >= 0 ? messages.length - unreadStartIndex : 0;
    setShowUnreadMarker(unreadMessageCount >= 5);

    setUnreadMarkerEvaluated(true); // 최초 1회 판단
  }, [messages, lastReadMessageId, unreadMarkerEvaluated]);

  const sendMessage = () => {
    if (!input.trim()) return;
    stompClientRef.current?.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        chatRoom: roomId,
        sender: username,
        message: input,
      }),
    });
    setInput("");

    // 내가 보냈으면 아래로 스크롤
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleScroll = async () => {
    const container = containerRef.current;
    if (container.scrollTop === 0 && hasMore) {
      const nextPage = page + 1;
      const data = await fetchChatMessages({ roomId, page: nextPage });
      const reversed = data.content.reverse();
      setMessages((prev) => [...reversed, ...prev]);
      setPage(nextPage);
      setHasMore(!data.last);
    }
  };

  useEffect(() => {
    if (firstUnreadRef.current) {
      firstUnreadRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      firstUnreadRef.current = null;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    const fetchLastRead = async () => {
      try {
        const messageId = await getLastReadMessageId({ roomId, username });
        setLastReadMap((prev) => ({
          ...prev,
          [roomId]: messageId,
        }));
      } catch (err) {
        console.error("❌ 마지막 읽은 메시지 ID 불러오기 실패", err);
      }
    };
    fetchLastRead();
  }, [roomId, username]);

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-64 overflow-y-auto bg-gray-100 p-3 rounded text-sm space-y-1"
      >
        {messages.map((msg, idx) => {
          const isUnread = lastReadMessageId !== null && msg.id > lastReadMessageId;
          const isFirstUnread = isUnread && (!messages[idx - 1] || messages[idx - 1].id <= lastReadMessageId);

          return (
            <div key={msg.id || idx}>
              {isFirstUnread && showUnreadMarker && (
                <div
                  ref={firstUnreadRef}
                  className="text-center text-xs text-gray-500 my-2"
                >
                  ── 여기가 마지막으로 읽은 지점입니다 ──
                </div>
              )}
              <div className={`flex ${msg.sender === username ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs break-words whitespace-pre-wrap ${msg.sender === username
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                    }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex space-x-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="메시지를 입력하세요"
          rows={1}
          className="flex-1 border rounded px-3 py-2 text-sm resize-none min-h-[38px] max-h-40 overflow-auto"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm whitespace-nowrap"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;