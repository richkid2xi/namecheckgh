interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalResults);

  // Build page numbers with ellipsis logic
  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      {/* Count label */}
      <p className="text-sm text-text-muted">
        Showing <span className="text-text-primary font-medium">{start}–{end}</span> of{' '}
        <span className="text-text-primary font-medium">{totalResults}</span> results
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        <button
          id="pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-ghost px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <span className="material-icons text-[18px]">chevron_left</span>
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e-${i}`} className="w-9 text-center text-text-muted text-sm">…</span>
          ) : (
            <button
              key={p}
              id={`pagination-page-${p}`}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                p === currentPage
                  ? 'bg-accent text-[#0d0d0d] font-semibold'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          id="pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn-ghost px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <span className="material-icons text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
