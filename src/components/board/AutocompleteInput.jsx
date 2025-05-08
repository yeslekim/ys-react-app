import { useState, useEffect, useRef } from "react";
import { fetchKeywordSuggestions } from "../../api/keyword";
import debounce from "lodash.debounce";

const AutocompleteInput = ({ value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // 현재 하이라이트된 인덱스
  const ref = useRef(null);

  // ✅ 자동완성 API 호출 (debounced)
  const loadSuggestions = debounce(async (val) => {
    if (typeof val !== "string" || !val.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const result = await fetchKeywordSuggestions(val);
      setSuggestions(result);
      setShow(true);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error("추천어 불러오기 실패:", err);
    }
  }, 300);

  useEffect(() => {
    loadSuggestions(String(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!show || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === -1 ? suggestions.length - 1 : (prev - 1 + suggestions.length) % suggestions.length
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = highlightedIndex >= 0 ? suggestions[highlightedIndex].keyword : value;
      setShow(false);
      onSelect(selected);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setShow(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative w-60" ref={ref}>
      <input
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="검색어 입력"
        className="border px-3 py-2 rounded-lg w-full"
      />

      {show && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 shadow max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={s.id}
              ref={(el) => {
                if (idx === highlightedIndex && el) {
                  el.scrollIntoView({ block: "nearest" });  // 화살표 진행시 스크롤 따라오기기
                }
              }}
              className={`px-3 py-2 cursor-pointer ${
                idx === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onMouseEnter={() => setHighlightedIndex(idx)}
              onClick={() => {
                setShow(false);
                onSelect(s.keyword);
              }}
            >
              {s.keyword}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
