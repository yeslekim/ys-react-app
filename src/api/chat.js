import axiosInstance from "./axiosInstance"; // axios 인스턴스 기반

const API = import.meta.env.VITE_API_CHAT_URL;

/**
 * 해당 유저 채팅방 목록 조회
 * @param {{ userName: string }} param0 
 * @returns {Promise<Array<{
*   id: number,
*   name: string | null,
*   participants: string[],
*   group: boolean
* }>>}
*/
export const fetchChatRooms = async ({ username }) => {
  const res = await axiosInstance.get(API + "/chat/rooms?username=" + username);
  return res.data;
};


/**
 * 채팅 내역 조회
*/
export const fetchChatMessages = async ({ roomId, page = 0, size = 30 }) => {
  const res = await axiosInstance.get(`${API}/chat/message`, {
    params: {
      chatRoom: roomId,
      page,
      size,
    }
  });
  return res.data; // content, last, totalPages 등 포함
};

export const getLastReadMessageId = async ({ roomId, username }) => {
  const res = await axiosInstance.get(`${API}/chat/message/read`, {
    params: { chatRoom: roomId, username },
  });
  return res.data; // ISO 문자열
};

export const updateLastReadMessageId = async ({ roomId, username, messageId }) => {
  const res = await axiosInstance.post(`${API}/chat/message/read`, null, {
    params: { chatRoom: roomId, username, chatMessageId: messageId },
  });
  return res.data;
};