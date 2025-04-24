// src/context/ChatSocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { fetchChatRooms } from "../api/chat"; // 유저 채팅방 정보 조회

const ChatSocketContext = createContext();

export const ChatSocketProvider = ({ username, children }) => {
    const stompClientRef = useRef(null);
    const [messagesByRoom, setMessagesByRoom] = useState({});
    const [connected, setConnected] = useState(false);
    const [unreadMap, setUnreadMap] = useState({});
    const [activeRoomId, setActiveRoomId] = useState(null);
    const [lastReadMap, setLastReadMap] = useState({}); // { roomId: number }


    useEffect(() => {
        if (!username) return;

        const connectSocket = async () => {
            const chatRooms = await fetchChatRooms({ username });
            const socket = new SockJS(import.meta.env.VITE_API_CHAT_URL + "/ws/chat");
            const stompClient = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    console.log("✅ Connected to WebSocket");

                    // 모든 채팅방에 대해 구독 시작
                    chatRooms.forEach((room) => {
                        stompClient.subscribe(`/topic/room/${room.id}`, (message) => {
                            const payload = JSON.parse(message.body);

                            if (payload.sender !== username) {
                                setMessagesByRoom((prev) => ({
                                    ...prev,
                                    [room.id]: [...(prev[room.id] || []), payload],
                                }));

                                // 읽고있는 방이면 unread 처리 안함
                                if (room.id !== activeRoomId) {
                                    // 새로운 메시지를 받은 방의 unread 증가
                                    setUnreadMap((prev) => ({
                                        ...prev,
                                        [room.id]: (prev[room.id] || 0) + 1,
                                    }));
                                }

                            }
                        });
                    });

                    setConnected(true);
                },
            });

            stompClient.activate();
            stompClientRef.current = stompClient;

            return () => stompClient.deactivate();
        };

        connectSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [username, activeRoomId]);

    return (
        <ChatSocketContext.Provider value={{
            messagesByRoom,
            connected,
            unreadMap,
            setUnreadMap,
            activeRoomId,
            setActiveRoomId,
            setLastReadMap,
            lastReadMap,
        }}>
            {children}
        </ChatSocketContext.Provider>
    );
};

export const useChatSocket = () => useContext(ChatSocketContext);
