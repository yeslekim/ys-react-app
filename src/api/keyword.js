import axios from "axios";

const API = import.meta.env.VITE_API_SEARCH_URL;

/**
 * 키워드 자동완성 API 호출
 * @param {string} keyword
 * @returns {Promise<Array<{ id: string, keyword: string }>>}
 */
export const fetchKeywordSuggestions = async (keyword) => {
  if (!keyword) return [];
  const response = await axios.get(`${API}/search/suggest?keyword=${encodeURIComponent(keyword)}`);
  return response.data.keywords || [];
};

// 검색어 저장 (POST)
export const saveKeyword = async (keyword) => {
    if (!keyword?.trim()) return;
    try {
      await axios.post(`${API}/search`, null, {
        params: { keyword }
      });
    } catch (error) {
      console.error("검색어 저장 실패:", error);
    }
  };
