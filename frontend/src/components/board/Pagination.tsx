interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  const pages: (number | '...')[] = [];

  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < lastPage - 2) pages.push('...');
    pages.push(lastPage);
  }

  return (
    <div className="flex items-center justify-center mt-7 py-5">
      <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-color rounded-2xl px-2 py-1.5 shadow-sm">
        <button
          disabled={currentPage === 1}
          className={`page-btn ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="flex items-center justify-center min-w-[38px] h-[38px] text-[#6b7280] font-semibold tracking-[2px]">...</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === currentPage ? 'active bg-accent text-white font-bold shadow-[0_2px_10px_rgba(108,92,231,0.2)]' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={currentPage === lastPage}
          className={`page-btn ${currentPage === lastPage ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
