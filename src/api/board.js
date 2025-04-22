// src/api/board.js
import instance from "./axiosInstance";

const API = import.meta.env.VITE_API_BOARD_URL;

/**
 * 게시글 목록 조회
 * @param {{
*   searchType?: 'TITLE' | 'CONTENT' | 'USERNAME',
*   keyword?: string,
*   sort?: 'LATEST' | 'OLDEST' | 'VIEWS' | 'LIKES',
*   page?: number,
*   size?: number
* }} params
 * @returns {Promise<{
 *   content: Array<{
*     boardId: number,
*     title: string,
*     username: string,
*     createAt: string,
*     views: number,
*     likeCount: number
*   }>,
*   totalPages: number,
*   number: number
* }>}
*/
export const fetchBoardList = async ({ searchType, keyword, sort, page, size }) => {
    const response = await instance.get(API, { params: { searchType, keyword, sort, page, size } });
    return response.data;
};

/**
 * 게시글 상세 조회
 * @param {number|string} id
 * @returns {Promise<{
*   title: string,
*   content: string,
*   username: string,
*   createAt: string,
*   updateAt: string,
*   views: number,
*   likeCount: number
* }>}
*/
export const fetchBoardDetail = async (id) => {
    const response = await instance.get(`${API}/${id}`);
    return response.data;
};

/**
 * 게시글 작성
 * @param {{
*  title: string,
*  content: string,
*  username: string
* }} data
*/
export const createBoard = async (data) => {
    return (await instance.post(`${API}`, data)).data;
};

/**
 * 게시글 수정
 * @param {{
*  id: number, 
*  title: string,
*  content: string,
*  username: string
* }} data
*/
export const updateBoard = async (data) => {
    return (await instance.put(`${API}`, data)).data;
};

/**
 * 게시글 삭제
* @param {*} id 
*/
export const deleteBoard = async (id) => {
    return (await instance.delete(`${API}/${id}`)).data;
};

/**
 * 조회수 증가
 * @param {*} id 
 * @returns 
 */
export const increaseViewCount = async (id) => {
    return instance.put(`${API}/views/${id}`);
};

/**
 * 좋아요
 * @param {number} id 
 * @param {boolean} like
 * @returns 
 */
export const toggleLike = async (id, like) => {
    return instance.put(`${API}/like`, { id, like });
};


/**
 * 댓글 목록 조회
 * @param {Object} params
 * @param {number|string} params.boardId
 * @param {number} [params.parentId]
 * @param {number} [params.depth=0]
 * @param {number} [params.page=0]
 * @param {number} [params.size=10]
 * @returns {Promise<Array<Comment>>}
 */
export const fetchComments = async ({ boardId, parentId = null, depth = 0, page = 0, size = 10 }) => {
    const response = await instance.get(`${API}/comment`, {
        params: {
            boardId,
            parentId,
            depth,
            page,
            size,
        },
    });
    return response.data;
};

/**
 * 댓글 작성
 * @param {Object} data
 * @param {number} data.boardId
 * @param {string} data.username
 * @param {string} data.content
 * @param {number|null} [data.parentId=null]
 * @param {number} [data.depth=0]
 */
export const createComment = async ({ boardId, username, content, parentId = null, depth = 0 }) => {
    return instance.post(`${API}/comment`, {
        boardId,
        username,
        content,
        parentId,
        depth,
    });
};

/**
 * 댓글 수정
 * @param {{
*   id: number,
*   boardId: number,
*   username: string,
*   content: string,
*   parentId: number,
*   depth: number
* }} data
* @returns {Promise<boolean>}
*/
export const updateComment = async (data) => {
    return instance.put(`${API}/comment`, data);
};

/**
 * 댓글 삭제
 * @param {number} commentId
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
    return instance.delete(`${API}/comment/${commentId}`);
};