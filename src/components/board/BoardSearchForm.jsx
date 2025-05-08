import AutocompleteInput from "./AutocompleteInput";
import { saveKeyword } from "../../api/keyword";

const BoardSearchForm = ({ searchType, keyword, setKeyword, sort, onSearch, onSortChange }) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveKeyword(keyword);
          onSearch(searchType, keyword);
        }}
        className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow"
      >
        <div className="flex gap-2 items-center flex-wrap">
          <select
            value={searchType}
            onChange={(e) => onSearch(e.target.value, keyword)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="TITLE">제목</option>
            <option value="CONTENT">내용</option>
            <option value="USERNAME">작성자</option>
          </select>

          <AutocompleteInput
            value={keyword}
            onChange={setKeyword}
            onSelect={(word) => {
              setKeyword(word);
              saveKeyword(word);
              onSearch(searchType, word);
            }}
          />
  
          {/* <input
            type="text"
            value={keyword}
            onChange={(e) => onSearch(searchType, e.target.value)}
            placeholder="검색어 입력"
            className="border px-3 py-2 rounded-lg w-60"
          /> */}
  
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            검색
          </button>
        </div>
  
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="LATEST">최신순</option>
          <option value="OLDEST">오래된순</option>
          <option value="VIEWS">조회수순</option>
          <option value="LIKES">좋아요순</option>
        </select>
      </form>
    );
  };
  
  export default BoardSearchForm;