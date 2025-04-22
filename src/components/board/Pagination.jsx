const Pagination = ({ current, total, onPageChange }) => {
  return (
    <div className="flex justify-center gap-2 flex-wrap mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 rounded-lg border transition font-medium text-sm
            ${i === current ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;