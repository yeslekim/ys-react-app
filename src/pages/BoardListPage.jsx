import { useEffect, useState } from "react";
import { fetchBoardList } from "../api/board";
import BoardItem from "../components/board/BoardItem";
import BoardSearchForm from "../components/board/BoardSearchForm";
import Pagination from "../components/board/Pagination"
import { Link } from "react-router-dom";

const BoardListPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchType, setSearchType] = useState("TITLE");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("LATEST");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  const load = async () => {
    try {
      const data = await fetchBoardList({ searchType, keyword, sort, page, size });
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    load();
  }, [page, sort]);

  const handleSearch = (type, word) => {
    setSearchType(type);
    setKeyword(word);
    setPage(0);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-800">📋 게시판</h1>
        <Link
          to="/board/write"
          className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          ✍ 글쓰기
        </Link>
      </div>

      <BoardSearchForm
        searchType={searchType}
        keyword={keyword}
        sort={sort}
        onSearch={handleSearch}
        onSortChange={(s) => {
          setSort(s);
          setPage(0);
        }}
      />

      <div className="bg-white rounded-xl shadow divide-y">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">게시글이 없습니다.</p>
        ) : (
          posts.map((post) => <BoardItem key={post.boardId} post={post} />)
        )}
      </div>

      <Pagination current={page} total={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default BoardListPage;
