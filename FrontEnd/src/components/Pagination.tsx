import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 border-t border-[#e2e8f0] bg-[#f8fafc]/50 text-xs text-[#64748b]">
      <div className="flex items-center gap-4">
        <span>
          Showing <strong className="text-[#0f172a] font-bold">{startItem}</strong> to{' '}
          <strong className="text-[#0f172a] font-bold">{endItem}</strong> of{' '}
          <strong className="text-[#0f172a] font-bold">{total}</strong> records
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="limitSelect" className="text-[11px] text-[#64748b]">Rows per page:</label>
          <select
            id="limitSelect"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-white text-[#0f172a] border border-[#cbd5e1] rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#0256c4] cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-[#cbd5e1] bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                p === page
                  ? 'bg-[#0256c4] text-white shadow-xs'
                  : 'bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] border border-[#cbd5e1]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 rounded-lg border border-[#cbd5e1] bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
